<?php
// This file is part of the mplayer plugin for Moodle - http://moodle.org/
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
 * Defines a page embeddable widget for mplayer in page course format.
 *
 * @package  mod_mplayer
 * @category mod
 * @author   Matt Bury - matbury@gmail.com
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @licence  http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

/**
 * implements an alternative representation of this activity for the "page"
 * format.
 */
function mplayer_set_instance(&$block) {
    global $DB, $PAGE;

    $str = '';

    $context = context_module::instance($block->cm->id);

    $mplayer = $DB->get_record('mplayer', array('id' => $block->cm->instance));

    // Transfer content from title to content.
    $block->title = format_string($mplayer->name);

    $renderer = $PAGE->get_renderer('mplayer');
    $str .= $renderer->print_body($mplayer);

    if (!empty($block->cm->showdescription)) {
        $str .= $renderer->intro($mplayer);
    }

    // Trigger module viewed event.
    $context = context_module::instance($block->cm->id);
    require_capability('mod/mplayer:view', $context);

    $event = \mod_mplayer\event\mplayer_viewed::create(array(
        'objectid' => $block->cm->id,
        'context' => $context,
        'other' => array(
            'objectname' => $mplayer->name
        )
    ));
    $event->add_record_snapshot('course_modules', $block->cm);
    $event->add_record_snapshot('mplayer', $mplayer);
    $event->trigger();

    $course = $DB->get_record('course', array('id' => $mplayer->course));
    $completion = new completion_info($course);
    $completion->set_module_viewed($block->cm);

    $block->content->text = $str;
    return true;
}
