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
 * This page prints a particular instance of mplayer without any standard Moodle navigation
 * It's useful for embedding video in Moodle web pages
 *
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
require('../../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

$mpid = required_param('mpid', PARAM_INT); // Player instance id.
$clipid = required_param('clipid', PARAM_INT); // Player instance id.
$action = required_param('what', PARAM_TEXT);

if (!$mplayer = $DB->get_record('mplayer', array('id' => $mpid))) {
    die;
}
if (!$cm = get_coursemodule_from_instance('mplayer', $mpid)) {
    die;
}
if (!$course = $DB->get_record('course', array('id' => $cm->course))) {
    die;
}

$context = context_module::instance($cm->id);

$url = new moodle_url('/mod/mplayer/ajax/markmediacompletion.php');
$PAGE->set_url($url);
require_login($course, true, $cm);

$renderer = $PAGE->get_renderer('mplayer');

// Make a record for user anyhow.
$params = array('userid' => $USER->id, 'mplayerid' => $mpid, 'clipid' => $clipid);
if (!$mpuserdata = $DB->get_record('mplayer_userdata', $params)) {
    $mpuserdata = new StdClass();
    $mpuserdata->userid = $USER->id;
    $mpuserdata->mplayerid = $mpid;
    $mpuserdata->clipid = $clipid;
    $mpuserdata->maxprogress = 0;
    $mpuserdata->finished = 0;
    $mpuserdata->id = $DB->insert_record('mplayer_userdata', $mpuserdata);
}

if ($action == 'finished') {

    $mpuserdata->maxprogress = 100;
    $mpuserdata->finished = true;

    $DB->update_record('mplayer_userdata', $mpuserdata);
    // Mark completed on mediaviewed criteria.
    $completion = new completion_info($course);
    if ($completion->is_enabled($cm) && $mplayer->completionmediaviewed) {
        $completion->update_state($cm, COMPLETION_COMPLETE);
    }
    return $renderer->progressbar($mpuserdata->maxprogress);
} else if ($action == 'progress') {

    $progress = required_param('progress', PARAM_INT);
    if ($mpuserdata->maxprogress < $progress) {
        $mpuserdata->maxprogress = $progress;
        $DB->update_record('mplayer_userdata', $mpuserdata);
    }
    echo $renderer->progressbar($mpuserdata->maxprogress, $progress);
} else {
    die('Invalid action');
}
