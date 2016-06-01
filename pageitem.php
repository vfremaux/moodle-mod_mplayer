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

require_once($CFG->dirroot.'/mod/mplayer/locallib.php');
/**
 * implements an alternative representzaiton of this activity for the "page"
 * format.
 */
function mplayer_set_instance(&$block) {
    global $DB, $PAGE, $CFG, $COURSE;

    $str = '';

    $context = context_module::instance($block->cm->id);

    $mplayer = $DB->get_record('mplayer', array('id' => $block->cm->instance));

    // Transfer content from title to content.
    // $block->content->text = $block->title;
    $block->title = format_string($mplayer->name);

    $renderer = $PAGE->get_renderer('mplayer');
    $str .= $renderer->print_body($mplayer);

    if ($CFG->branch <= 26) {
        add_to_log($mplayer->course, 'mplayer', 'view', "view.php?id=".$block->cm->id, "$mplayer->name", $block->cm->id); // Add view to Moodle log
    } else {
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
    }

    $course = $DB->get_record('course', array('id' => $mplayer->course));
    $completion = new completion_info($course);
    $completion->set_module_viewed($block->cm);

    $block->content->text = $str;
    return true;
}
