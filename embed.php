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
 * @package  mod_mplayer
 * @category mod
 * @author   Matt Bury - matbury@gmail.com
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @licence  http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
require('../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

$id = optional_param('id', 0, PARAM_INT); // Course Module ID, or.
$a  = optional_param('a', 0, PARAM_INT); // Mplayer ID.

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

// Security.

require_login($course->id);

$context = context_module::instance($cm->id);
require_capability('mod/mplayer:view', $context);
$event = \mod_mplayer\event\mplayer_viewed::create(array(
    'objectid' => $cm->id,
    'context' => $context,
    'other' => array(
        'objectname' => $mplayer->name
    )
));
$event->add_record_snapshot('mplayer', $mplayer);
$event->trigger();

// Add instance ID to mplayer object.

$mplayer->instance = $id;

/*
 * Don't print a Moodle header since this page will be included in another Moodle page as an iframe
 * Print the Media Player Flash embed code
 */

echo mplayer_print_body($mplayer);

// Don't print any footers here.
