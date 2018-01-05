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
 * @package   mod_mplayer
 * @category  mod
 * @author    Matt Bury - matbury@gmail.com
 * @author    Valery Fremaux <valery.fremaux@gmail.com>
 * @copyright (C) 2009  Matt Bury
 * @licence   http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

require('../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

list($cm, $course, $mplayer) = mplayer_get_context();

// Check and init storage if empty.
mplayer_init_storage($cm, 0);
mplayer_require_js($mplayer, 'require');

$url = new moodle_url('/mod/mplayer/view.php', array('id' => $cm->id));
$PAGE->set_url($url);

// Security.
require_login($course->id);

if (!isset($CFG->mplayer_default_player)) {
    set_config('mplayer_default_player', 'flowplayer');
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
echo $OUTPUT->header();

$mplayer->instance = $cm->instance;

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
