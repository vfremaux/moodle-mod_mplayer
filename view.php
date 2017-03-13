<<<<<<< HEAD
<<<<<<< HEAD
<?php  // $Id: view.php,v 0.2 2010/01/15 matbury Exp $
=======
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
 * @package   mod_mplayer
 * @category  mod
 * @author    Matt Bury - matbury@gmail.com
 * @author    Valery Fremaux <valery.fremaux@gmail.com>
 * @copyright (C) 2009  Matt Bury
 * @licence   http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

>>>>>>> MOODLE_32_STABLE
/**
 * This page prints a particular instance of mplayer
 *
 * @author Matt Bury - matbury@gmail.com
 * @version $Id: view.php,v 1.1 2010/01/15 matbury Exp $
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 * @package mplayer
 */

<<<<<<< HEAD
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
=======
require('../../config.php');
>>>>>>> MOODLE_32_STABLE
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

<<<<<<< HEAD
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
=======
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
 * This page prints a particular instance of mplayer
 *
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com  < 2.x
 * @author      Valery Fremaux <valery.fremaux@gmail.com> > 2.x
 * @copyright   (C) 2009  Matt Bury
 * @copyright   (C) 2015  Valery Fremaux (http://www.mylearningfactory.com)
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

require('../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

list($cm, $mplayer, $course) = get_mplayer_context();

$url = new moodle_url('/mod/mplayer/view.php', array('id' => $cm->id));
$PAGE->set_url($url);

// Security.
require_login($course->id);

if (!isset($CFG->mplayer_default_player)) {
    set_config('mplayer_default_player', 'flowplayer');
}

$PAGE->requires->jquery();
if ($mplayer->technology == 'jw') {
    $PAGE->requires->js('/mod/mplayer/jw/6.11/jwplayer.html5.js');
} else {
    $PAGE->requires->js('/mod/mplayer/flowplayer6/flowplayer.js');
}

// Trigger module viewed event.
$context = context_module::instance($cm->id);
require_capability('mod/mplayer:view', $context);

$event = \mod_mplayer\event\mplayer_viewed::create(array(
    'objectid' => $cm->id,
    'context' => $context,
    'other' => array(
        'objectname' => $mplayer->name
    )
));
$event->add_record_snapshot('course_modules', $cm);
$event->add_record_snapshot('course', $course);
$event->add_record_snapshot('mplayer', $mplayer);
$event->trigger();

$completion = new completion_info($course);
$completion->set_module_viewed($cm);

// Print the page header.
$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');
$PAGE->set_title(format_string($mplayer->name));
$PAGE->set_heading('');
>>>>>>> MOODLE_32_STABLE
$PAGE->navbar->add(get_string('mplayer', 'mplayer').': '.$mplayer->name);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);
$PAGE->set_button(update_module_button($cm->id, $course->id, $strmplayer));
<<<<<<< HEAD
=======
// Security. 
require_login($course->id);

if (!isset($CFG->mplayer_default_player)) {
    set_config('mplayer_default_player', 'flowplayer');
}

$PAGE->requires->jquery();
if ($mplayer->technology == 'jw') {
    $PAGE->requires->js('/mod/mplayer/jw/6.11/jwplayer.html5.js');
} else {
    // $PAGE->requires->js('/mod/mplayer/flowplayer/flowplayer.js');
    $PAGE->requires->js('/mod/mplayer/flowplayer6/flowplayer.js');
}

// Trigger module viewed event.
$context = context_module::instance($cm->id);
require_capability('mod/mplayer:view', $context);

$event = \mod_mplayer\event\mplayer_viewed::create(array(
    'objectid' => $cm->id,
    'context' => $context,
    'other' => array(
        'objectname' => $mplayer->name
    )
));
$event->add_record_snapshot('course_modules', $cm);
$event->add_record_snapshot('course', $course);
$event->add_record_snapshot('mplayer', $mplayer);
$event->trigger();

$completion = new completion_info($course);
$completion->set_module_viewed($cm);

// Print the page header.
$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');
$PAGE->set_title(format_string($mplayer->name));
$PAGE->set_heading('');
$PAGE->navbar->add(get_string('mplayer', 'mplayer').': '.$mplayer->name);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);
$PAGE->set_button(update_module_button($cm->id, $course->id, $strmplayer));
>>>>>>> MOODLE_32_STABLE
echo $OUTPUT->header();

$mplayer->instance = $id;

<<<<<<< HEAD
$renderer = $PAGE->get_renderer('mplayer');

echo $renderer->print_body($mplayer); // mod/mplayer/lib.php

if ($COURSE->format != 'singleactivity') {
    echo '<center>';
=======
$renderer = $PAGE->get_renderer('mod_mplayer');

echo $renderer->print_body($mplayer); // mod/mplayer/lib.php

echo $renderer->intro($mplayer);

if ($COURSE->format != 'singleactivity' && !($COURSE->format == 'page' && optional_param('aspage', false, PARAM_INT))) {
    echo '<center>';
    require_once($CFG->dirroot.'/course/format/page/xlib.php');
    page_print_page_format_navigation($cm, false);
>>>>>>> MOODLE_32_STABLE
    echo $OUTPUT->single_button(new moodle_url('/course/view.php', array('id' => $course->id)), get_string('backtocourse', 'mplayer'));
    echo '</center>';
}

/// Finish the page
echo $OUTPUT->footer($course);
// End of mod/mplayer/view.php
=======
echo $OUTPUT->header();

$mplayer->instance = $id;

$renderer = $PAGE->get_renderer('mod_mplayer');

echo $renderer->print_body($mplayer); // See mod/mplayer/lib.php.

echo $renderer->intro($mplayer);

if ($COURSE->format != 'singleactivity' && !($COURSE->format == 'page' && optional_param('aspage', false, PARAM_INT))) {
    echo '<center>';
    require_once($CFG->dirroot.'/course/format/page/xlib.php');
    page_print_page_format_navigation($cm, false);
    $params = array('id' => $course->id);
    $label = get_string('backtocourse', 'mplayer');
    echo $OUTPUT->single_button(new moodle_url('/course/view.php', $params), $label);
    echo '</center>';
}

// Finish the page.
echo $OUTPUT->footer($course);
// End of mod/mplayer/view.php.
>>>>>>> MOODLE_32_STABLE
