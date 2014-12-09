<?php  // $Id: view.php,v 0.2 2010/01/15 matbury Exp $
/**
 * This page prints a particular instance of mplayer
 *
 * @author Matt Bury - matbury@gmail.com
 * @version $Id: view.php,v 1.1 2010/01/15 matbury Exp $
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 * @package mplayer
 */

/**    Copyright (C) 2009  Matt Bury
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
require_once('../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

$id = optional_param('id', 0, PARAM_INT); // Course Module ID, or
$a  = optional_param('a', 0, PARAM_INT);  // mplayer ID

if ($id) {
    if (! $cm = $DB->get_record('course_modules', array('id' => $id))) {
        print_error('invalidcoursemodule');
    }
    if (! $course = $DB->get_record('course', array('id' => $cm->course))) {
        print_error('coursemisconf');
    }
    if (! $mplayer = $DB->get_record('mplayer', array('id' => $cm->instance))) {
        print_error('invalidmplayerid', 'mplayer');
    }
} else {
    if (! $mplayer = $DB->get_record('mplayer', array('id' => $a))) {
        print_error('invalidmplayerid', 'mplayer');
    }
    if (! $course = $DB->get_record('course', array('id' => $mplayer->course))) {
        print_error('coursemisconf');
    }
    if (! $cm = get_coursemodule_from_instance('mplayer', $mplayer->id, $course->id)) {
        print_error('invalidcoursemodule');
    }
}
$url = new moodle_url('/mod/mplayer/view.php', array('id' => $cm->id));
$PAGE->set_url($url);

mplayer_check_jquery();
if ($CFG->mplayer_default_player == 'jw') {
    $PAGE->requires->js('/mod/mplayer/jw/6.9/jwplayer.html5.js');
} else {
    $PAGE->requires->js('/mod/mplayer/flowplayer/flowplayer.js');
}

require_login($course->id);

add_to_log($course->id, 'mplayer', 'view', "view.php?id=$cm->id", "$mplayer->name", $cm->id); // Add view to Moodle log
// Print the page header.
$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');
$PAGE->set_title(format_string($mplayer->name));
$PAGE->set_heading('');
$PAGE->navbar->add(get_string('mplayer', 'mplayer').': '.$mplayer->name);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);
$PAGE->set_button(update_module_button($cm->id, $course->id, $strmplayer));
echo $OUTPUT->header();

$mplayer->instance = $id;

$renderer = $PAGE->get_renderer('mplayer');

echo $renderer->print_body($mplayer); // mod/mplayer/lib.php

if ($COURSE->format != 'singleactivity') {
    echo '<center>';
    echo $OUTPUT->single_button(new moodle_url('/course/view.php', array('id' => $course->id)), get_string('backtocourse', 'mplayer'));
    echo '</center>';
}

/// Finish the page
echo $OUTPUT->footer($course);
// End of mod/mplayer/view.php
