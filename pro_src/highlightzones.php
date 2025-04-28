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

$context = context_course::instance($course->id);
$PAGE->set_context($context);

$action = optional_param('what', '', PARAM_TEXT);
$clipid = optional_param('clipid', 0, PARAM_INT);

$url = new moodle_url('/mod/mplayer/pro/highlightzones.php', array('id' => $cm->id));
$PAGE->set_url($url);
$PAGE->set_heading(get_string('highlightzones', 'mplayer'));

// Security.
require_login($course->id);

$renderer = $PAGE->get_renderer('mplayer');

require_once($CFG->dirroot.'/mod/mplayer/pro/highlightzones.controller.php');
$controller = new \mod_mplayer\highlightzones_controller();
if ($action) {
    require_once($CFG->dirroot.'/mod/mplayer/pro/highlightzones.controller.php');
    $controller->receive($action);
    $controller->process($action);
    redirect(new moodle_url('/mod/mplayer/pro/highlightzones.php', ['id' => $mplayer->id, 'clipid' => $clipid]));
}

$config = get_config('mplayer');

// Print page.

echo $OUTPUT->header();

echo $OUTPUT->heading(get_string('highlightzones', 'mplayer'));

echo $renderer->clipselect($mplayer, $context);

$params = ['mplayerid' => $mplayer->id, 'clipid' => $clipid];
if (!$zones = $DB->get_records('mplayer_highlighted_zones', $params, 'startpoint')) {
    $values = array();
}

// Make the value form.
$strname = get_string('zonename', 'mplayer');
$strstart = get_string('startpoint', 'mplayer');
$strend = get_string('endpoint', 'mplayer');
$strcommands = get_string('commands', 'customlabel');
$table = new html_table();
$table->head = array("", "<b>$strname</b>", "<b>$strstart</b>", "<b>$strend</b>", "<b>$strcommands</b>");
$table->width = array('10%', '50%', '20%', '20%', '10%');
$table->align = array('center', 'left', 'center', 'center', 'right');
$table->width = '98%';

echo $OUTPUT->box_start('highlightzonelist');
if (!empty($zones)) {

    foreach ($zones as $zone) {

        $selcheck = '<input type="checkbox" name="sel[]">';

        $params = array('what' => 'delete', 'id' => $mplayer->id, 'zoneid' => $zone->id);
        $deleteurl = new moodle_url('/mod/mplayer/pro/highlightzones.php', $params);
        $cmds = '<a href="'.$deleteurl.'">'.$OUTPUT->pix_icon('/t/delete', get_string('delete')).'</a>';

        $params = array('id' => $cm->id, 'clipid' => $clipid, 'what' => 'update', 'zoneid' => $zone->id);
        $editurl = new moodle_url('/mod/mplayer/pro/edit_highlightzone.php', $params);
        $cmds .= '&nbsp;<a href="'.$editurl.'">'.$OUTPUT->pix_icon('/t/edit', get_string('edit')).'</a>';

        $table->data[] = array($selcheck, $zone->name, mplayer_format_time($zone->startpoint), mplayer_format_time($zone->endpoint), $cmds);
    }
    echo html_writer::table($table);
} else {
    echo $OUTPUT->notification(get_string('emptyzones', 'mplayer'));
}
echo $OUTPUT->box_end();

echo $OUTPUT->box_start('add-zone-button');
$params = ['id' => $cm->id, 'clipid' => $clipid, 'zoneid' => 0, 'what' => 'add'];
$buttonurl = new moodle_url('/mod/mplayer/pro/edit_highlightzone.php', $params);
echo $OUTPUT->single_button($buttonurl, get_string('addzone', 'mplayer'));
echo $OUTPUT->box_end();

$params = ['id' => $course->id];
$buttonurl = new moodle_url('/course/view.php', $params);
echo $OUTPUT->single_button($buttonurl, get_string('backtocourse', 'mplayer'));

echo $OUTPUT->footer();