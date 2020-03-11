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
 * @package     mod_mplayer
 * @category    mod
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('AJAX_SCRIPT', 1);

require('../../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');
require_once($CFG->dirroot.'/mod/mplayer/classes/passpoint.class.php');

$mpid = required_param('mpid', PARAM_INT); // Player instance id.
$clipid = required_param('clipid', PARAM_INT); // Player clip id in playlist.
$action = required_param('what', PARAM_TEXT);

if (!$mplayer = $DB->get_record('mplayer', array('id' => $mpid))) {
    die("Bad Mplayer id");
}

mplayer_unpack_attributes($mplayer);
if (!$cm = get_coursemodule_from_instance('mplayer', $mpid)) {
    die("Bad course module");
}
if (!$course = $DB->get_record('course', array('id' => $cm->course))) {
    die("Bad course");
}

$context = context_module::instance($cm->id);

$params = array('mpid' => $mpid, 'clipid' => $clipid, 'what' => $action);
$url = new moodle_url('/mod/mplayer/ajax/markmediacompletion.php', $params);
$PAGE->set_url($url);
require_login($course, true, $cm);

$renderer = $PAGE->get_renderer('mplayer');
$renderer->set_mplayer($mplayer);

if (!in_array($action, array('progress', 'finished'))) {
    die('Invalid action');
}

$passpoints = new \mod_mplayer\tracking\Passpoint($mplayer, $cm);
$passpoints->load_track($USER->id, $clipid);
$highlights = mplayer_get_highlighted_zones($mplayer, $clipid, $seeall = false);

if ($action == 'progress') {

    $progress = required_param('progress', PARAM_INT);

    // Record the passed points (control points).
    $updatedtrack = $passpoints->update($USER->id, $clipid, $progress);
    $maxprogress = $passpoints->get_maxprogress($USER->id, $clipid);

    $output = $renderer->progressbar($mplayer, $maxprogress, $progress, $updatedtrack, $highlights, $clipid);

    // Add view to Moodle log.
    $event = \mod_mplayer\event\mplayer_viewing::create(array(
        'objectid' => $cm->id,
        'context' => $context,
        'other' => array(
            'objectname' => $mplayer->name
        )
    ));
    $event->trigger();

    if ($passpoints->is_passed($USER->id, $clipid)) {
        /*
         * Bounce to finish if progress has reached the sufficiant level, and the passpoint rules are completed.
         */
        $action = 'finished';
    }
    $passpoints->commit_track($USER->id, $clipid);
}

$cliptrack = $passpoints->get_cliptrack($USER->id, $clipid);

if ($action == 'finished') {

    if ($passpoints->is_passed($USER->id, $clipid)) {
        $passpoints->finish($USER->id, $clipid);
        $passpoints->commit_track($USER->id, $clipid);
    }
    $maxprogress = $passpoints->get_maxprogress($USER->id, $clipid);

    // mark completed on mediaviewed criteria.
    $completion = new completion_info($course);
    if ($completion->is_enabled($cm) && $mplayer->completionmediaviewed) {
        $completion->update_state($cm, COMPLETION_COMPLETE);
    }
    if (empty($progress)) {
        $progress = 100;
    }

    if (is_string($cliptrack->passpoints)) {
        $cliptrack->passpoints = json_decode($cliptrack->passpoints);
    }

    $output = $renderer->progressbar($mplayer, 100, $progress, $cliptrack, $highlights, $clipid);

    $event = \mod_mplayer\event\mplayer_viewedall::create(array(
        'objectid' => $cm->id,
        'context' => $context,
        'other' => array(
            'objectname' => $mplayer->name
        )
    ));
    $event->trigger();
}

echo $output;
