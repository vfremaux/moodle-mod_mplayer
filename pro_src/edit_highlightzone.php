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
 * @package    mod_mplayer
 * @category   mod
 * @author     Valery Fremaux <valery.fremaux@gmail.com>
 * @copyright  (C) 2008 onwards Valery Fremaux (http://www.mylearningfactory.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL
 */
require('../../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

list($cm, $course, $mplayer) = mplayer_get_context();
$action = optional_param('what', 'edit', PARAM_TEXT);
$zoneid = optional_param('zoneid', 0, PARAM_INT);
$clipid = optional_param('clipid', 0, PARAM_INT);

$context = context_module::instance($cm->id);
$url = new moodle_url('/mod/mplayer/pro/edit_highlightzone.php', array('id' => $cm->id));

$PAGE->set_context($context);
$PAGE->set_url($url);

// Security.
require_course_login($course->id, true, $cm);
require_capability('mod/mplayer:assessor', $context);

require_once($CFG->dirroot.'/mod/mplayer/pro/forms/HighLightZoneForm.php');

$config = get_config('mplayer');

// Form and controller.
$clips = mplayer_get_clips($mplayer, $context);
$clip = $clips[$clipid];
$mform = new HighLightZoneForm($url, ['clip' => $clip]);

if ($mform->is_cancelled()) {
    redirect(new moodle_url('/mod/mplayer/pro/highlightzones.php', ['id' => $cm->id, 'clipid' => $clipid]));
}

require_once($CFG->dirroot.'/mod/mplayer/pro/highlightzones.controller.php');
$controller = new \mod_mplayer\highlightzones_controller();
if ($action) {
    if ($data = $mform->get_data()) {
        $controller->receive($action, $data);
        $controller->process($action);
        redirect(new moodle_url('/mod/mplayer/pro/highlightzones.php', ['id' => $cm->id, 'clipid' => $clipid]));
    }
}

echo $OUTPUT->header();
echo $OUTPUT->box_start('highlightzone-edit-form');

if (!empty($zoneid)) {
    $zone = $DB->get_record('mplayer_highlighted_zones', ['id' => $zoneid]);
    $zone->startpoint = mplayer_format_time($zone->startpoint);
    $zone->endpoint = mplayer_format_time($zone->endpoint);
    $zone->zoneid = $zoneid;
    $zone->id = $cm->id;
    $mform->set_data($zone);

    echo $OUTPUT->heading(get_string('updatezone', 'mplayer'));
} else {
    $formdata = new StdClass();
    $formdata->id = $cm->id;
    $formdata->mplayerid = $mplayer->id;
    $formdata->clipid = $clipid;
    $mform->set_data($formdata);
    echo $OUTPUT->heading(get_string('newzone', 'mplayer'));
}
$mform->display();
echo $OUTPUT->box_end();

echo $OUTPUT->footer();