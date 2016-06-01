<?php

require('../../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

$mpid = required_param('mpid', PARAM_INT); // Player instance id
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
if (!$mpuserdata = $DB->get_record('mplayer_userdata', array('userid' => $USER->id, 'mplayerid' => $mpid))) {
    $mpuserdata = new StdClass();
    $mpuserdata->userid = $USER->id;
    $mpuserdata->mplayerid = $mpid;
    $mpuserdata->maxprogress = 0;
    $mpuserdata->finished = 0;
    $mpuserdata->id = $DB->insert_record('mplayer_userdata', $mpuserdata);
}

if ($action == 'finished') {

    $mpuserdata->maxprogress = 100;
    $mpuserdata->finished = true;

    $DB->update_record('mplayer_userdata', $mpuserdata);
    // mark completed on mediaviewed criteria.
    $completion = new completion_info($course);
    if ($completion->is_enabled($cm) && $mplayer->completionmediaviewed) {
        $completion->update_state($cm, COMPLETION_COMPLETE);
    }
    return $renderer->progressbar($mpuserdata->maxprogress);
} elseif ($action == 'progress') {

    $progress = required_param('progress', PARAM_INT);
    if ($mpuserdata->maxprogress < $progress) {
        $mpuserdata->maxprogress = $progress;
        $DB->update_record('mplayer_userdata', $mpuserdata);
    }
    echo $renderer->progressbar($mpuserdata->maxprogress, $progress);
} else {
    die('Invalid action');
}
