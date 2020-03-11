<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Passpoint is a general mplayer utility class that encapsulates all the logic of
 * tracking passpoints. there can be one instance per player instance.
 *
 */
namespace mod_mplayer\tracking;

defined('MOODLE_INTERNAL') || die();

use \StdClass;

class Passpoint {

    protected $mplayer;

    protected $cm;

    protected $cliptracks;

    protected $dirty;

    public function __construct($mplayer, $cm) {
        $this->mplayer = $mplayer;

        // Ensure we have passpoint width set.
        if (empty($mplayer->passpointwidth)) {
            $mplayer->passpointwidth = 10;
        }

        $this->cm = $cm;
        $this->cliptracks = array();
    }

    /**
     * Ensures there is a track initialized and gets the last state of the track in
     * database.
     */
    public function load_track($userid, $clipid) {
        global $DB;

        if (!in_array($userid, $this->cliptracks)) {
            $this->cliptracks[$userid] = array();
            $this->dirty[$userid] = array();
        }

        if (!in_array($clipid, $this->cliptracks[$userid])) {
            // Make a record for user anyhow.
            $params = array('userid' => $userid,
                            'mplayerid' => $this->mplayer->id,
                            'clipid' => $clipid);
            if (!$track = $DB->get_record('mplayer_userdata', $params)) {
                $track = new StdClass();
                $track->userid = $userid;
                $track->mplayerid = $this->mplayer->id;
                $track->clipid = $clipid;
                $track->maxprogress = 0;
                $track->finished = 0;

                // Init with all points to be passed. Passpoints are integer percent of the whole media track.
                $passpoints = array();
                $step = floor(100 / $this->mplayer->numpasspoints);
                for ($i = 1; $i < $this->mplayer->numpasspoints; $i++) {
                    $passpoints[$step * $i] = 0;
                }

                $track->passpoints = json_encode($passpoints);

                $track->id = $DB->insert_record('mplayer_userdata', $track);
            }

            // Just expand passpoints from DB.
            $track->passpoints = (array) json_decode($track->passpoints);
            if (empty($track->passpoints)) {
                $track->passpoints = array();
            }
            $this->cliptracks[$userid][$clipid] = $track;
            $this->dirty[$userid][$clipid] = false; // Data are synced with DB.
        }
    }

    /**
     * Commits all clips to DB for user.
     * @param int $userid
     */
    public function commit($userid) {
        global $DB;

        if (!empty($this->cliptracks[$userid])) {
            foreach ($this->cliptracks[$userid] as $clipid => $track) {
                if ($this->dirty[$userid][$clipid]) {
                    // We do actually need to save.

                    // Compress passpoints for DB.
                    if (is_array($track->passpoints)) {
                        // If not yet serialized.
                        $track->passpoints = json_encode($track->passpoints);
                    }
                    $DB->update_record('mplayer_userdata', $track);
                }
            }
        }
    }

    /**
     * Commits a single clip track to DB.
     * @param int $userid
     * @param int $clipid
     */
    public function commit_track($userid, $clipid) {
        global $DB;

        if (array_key_exists($userid, $this->cliptracks)) {
            if (array_key_exists($clipid, $this->cliptracks[$userid])) {
                if ($this->dirty[$userid][$clipid]) {
                    // We do actually need to save.
                    $track = $this->cliptracks[$userid][$clipid];

                    // Compress passpoints for DB.
                    if (is_array($track->passpoints)) {
                        $track->passpoints = json_encode($track->passpoints);
                    }
                    if (is_object($track->passpoints)) {
                        $track->passpoints =  json_encode((array)$track->passpoints);
                    }
                    $DB->update_record('mplayer_userdata', $track);
                }
            }
        }
    }

    /**
     * We have a new progress submitted. Lets update passpoints and max progress.
     *
     */
    public function update($userid, $clipid, $progress) {

        $this->check_initialized($userid, $clipid);

        $track = $this->cliptracks[$userid][$clipid];

        // Find the nearest passpoint below the progress value and unmark it.
        // Pass points might be unmarked in disorder...
        $locations = array_keys($track->passpoints);
        $nearest = 0;
        for ($i = 0; $i < count($locations); $i++) {
            if ($locations[$i] <= $progress) {
                $nearest = $locations[$i];
            } else {
                // No need go further.
                break;
            }
        }
        if ($nearest) {
            $track->passpoints[$nearest] = 1;
            $this->dirty[$userid][$clipid] = true;
        }

        // debug_trace("Checked progress $progress at marker $nearest at {$locations[$i]} %");

        // Record the max reached point.
        if ($track->maxprogress < $progress) {
            $track->maxprogress = $progress;
            $this->dirty[$userid][$clipid] = true;
        }

        // debug_trace("Output dirty state {$this->dirty[$userid][$clipid]}");

        return $track;
    }

    /**
     * Mark the global max progress value to max.
     */
    public function finish($userid, $clipid) {

        $this->check_initialized($userid, $clipid);

        $track = $this->cliptracks[$userid][$clipid];
        $track->maxprogress = 100;
        $track->finished = true;
        $this->dirty[$userid][$clipid] = true;
    }

    /**
     * Accessor to the max reached progress value. This may NOT denote
     * all passpoints have been seen.
     */
    public function get_maxprogress($userid, $clipid) {

        $this->check_initialized($userid, $clipid);

        return $this->cliptracks[$userid][$clipid]->maxprogress;
    }

   /**
     * Accessor to the max reached progress value that has been validated by passed points.
     * this will ignore some isolated passpoints further in the media.
     */
    public function get_passed_maxprogress($userid, $clipid) {

        $this->check_initialized($userid, $clipid);

        $passpoints = (array)$this->cliptracks[$userid][$clipid]->passpoints;
        ksort($passpoints);

        $validatedloc = 0;
        foreach ($passpoints as $loc => $state) {
            if ($state == 1) {
                $validatedloc = $loc;
            }
            if ($state == 0) {
                return $validatedloc;
            }
        }

        // All passed.
        return 100;
    }

    public function get_passed_rate($userid, $clipid) {

        $this->check_initialized($userid, $clipid);

        $passpoints = $this->cliptracks[$userid][$clipid]->passpoints;

        if (empty($passpoints)) {
            return 0;
        }

        if (is_string($passpoints)) {
            $passpoints = json_decode($passpoints);
        }

        if (is_object($passpoints)) {
            // Fix some weird json conversion cases.
            $passpoints = (array) $passpoints;
        }

        $validatedloc = 0;
        $passed = 0;
        foreach ($passpoints as $loc => $state) {
            if ($state == 1) {
                $validatedloc = $loc;
            }
            if ($state == 0) {
                break;
            }
            $passed++; // Count them.
        }

        return round($passed / count($passpoints) * 100);
    }

    public function get_cliptrack($userid, $clipid) {
        $cliptrack = $this->cliptracks[$userid][$clipid];
        if (is_string($cliptrack->passpoints)) {
            $cliptrack->passpoints = json_decode($cliptrack->passpoints);
        }
        return $cliptrack;
    }

    /**
     * Is this clip entirely passed against required rules ?
     * Possible rules :
     * - n% of the media has been viewed, whatever the place
     * - n% of the media has been viewed from the start
     */
    public function is_passed($userid, $clipid) {

        // echo "Pass rule ".$this->mplayer->passrule;
        if ($this->mplayer->passrule == 'none') {
            return true;
        }

        $this->check_initialized($userid, $clipid);

        if ($this->mplayer->passrule == 'fromstart') {
            $expected = $this->get_passed_maxprogress($userid, $clipid);
            // echo "Expected $expected Passed ".$this->mplayer->passpercent;
            return $expected >= $this->mplayer->passpercent;
        } else if ($this->mplayer->passrule == 'freeloc') {
            $passedrate = $this->get_passed_rate($userid, $clipid);
            // echo "passedrate $expected Passed ".$this->mplayer->passpercent;
            return $passedrate >= $this->mplayer->passpercent;
        }
    }

    protected function check_initialized($userid, $clipid) {
        if (!array_key_exists($userid, $this->cliptracks)) {
            throw new \Exception("Track is not initialized for user. Call load_track() before.");
        }

        if (!array_key_exists($clipid, $this->cliptracks[$userid])) {
            throw new \Exception("Track is not initialized for the clip. Call load_track() before.");
        }
    }
}


