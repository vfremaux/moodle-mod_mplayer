<?php // $Id: view.php,v 0.2 2010/01/15 matbury Exp $
/**
 * This page prints a list of instances of mplayer in current course
 *
 * @author Matt Bury - matbury@gmail.com
 * @version $Id: view.php,v 1.1 2010/01/15 matbury Exp $
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 * @package mplayer
 **/
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
require_once('lib.php');

$id = required_param('id', PARAM_INT);   // course
if (! $course = $DB->get_record('course', array('id' => $id))) {
    error('Course ID is incorrect');
}

require_login($course->id);

if ($CFG->branch <= 26) {
    // Add view to Moodle log
    add_to_log($course->id, 'mplayer', 'view all', 'index.php?id='.$course->id, '');
} else {
    require_once($CFG->libdir.'/completionlib.php');
    $context = context_module::instance($cm->id);
    require_capability('mod/mplayer:viewall', $context);

    // Trigger module viewed event.
    $event = \mod_mplayer\event\mplayer_viewedall::create(array(
        'objectid' => $course->id,
        'context' => $context,
        'other' => array(
            'objectname' => $mplayer->name
        )
    ));
    $event->add_record_snapshot('course_modules', $cm);
    $event->add_record_snapshot('course', $course);
    $event->trigger();
}

// Get all required stringsmplayer.

$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');

// Print the header.

$PAGE->set_title("$strmplayers");
$PAGE->set_heading('');
$PAGE->navbar->add($strmplayers);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);
$PAGE->set_button('');
$PAGE->set_headingmenu(navmenu($course));
echo $OUTPUT->header();

// Get all the appropriate data.

if (! $mplayers = get_all_instances_in_course('mplayer', $course)) {
    echo $OUTPUT->notification(get_string('nomplayers', 'mplayer'), new moodle_url('/course/view.php', array('id' => $course->id)));
    echo $OUTPUT->footer();
    die;
}

// Print the list of instances (your module will probably extend this).

$timenow = time();
$strname  = get_string('name');
$strweek  = get_string('week');
$strtopic  = get_string('topic');

if ($course->format == 'weeks') {
    $table->head  = array ($strweek, $strname);
    $table->align = array ('center', 'left');
} elseif ($course->format == 'topics') {
    $table->head  = array ($strtopic, $strname);
    $table->align = array ('center', 'left', 'left', 'left');
} else {
    $table->head  = array ($strname);
    $table->align = array ('left', 'left', 'left');
}

foreach ($mplayers as $mplayer) {
    $url = new moodle_url('mod/mplayer/view.php', array('id' => $mplayer->coursemodule));
    if (!$mplayer->visible) {
        // Show dimmed if the mod is hidden.
        $link = '<a class="dimmed" href="'.$url.'">'.$mplayer->name.'</a>';
    } else {
        // Show normal if the mod is visible.
        $link = '<a href="'.$url.'">'.$mplayer->name.'</a>';
    }
    if ($course->format == 'weeks' or $course->format == 'topics') {
        $table->data[] = array ($mplayer->section, $link);
    } else {
        $table->data[] = array ($link);
    }
}
echo '<br />';
echo html_writer::table($table);

// Finish the page
echo $OUTPUT->footer($course);

