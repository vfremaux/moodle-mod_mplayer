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

$url = new moodle_url('/mod/mplayer/view.php', array('id' => $cm->id));
$PAGE->set_url($url);

// Security.
require_login($course->id);

if (!isset($CFG->mplayer_default_player)) {
    set_config('mplayer_default_player', 'flowplayer');
}

$context = context_module::instance($cm->id);
require_capability('mod/mplayer:view', $context);

// Trigger module viewed event.
mplayer_view($mplayer, $course, $cm, $context);

// Print the page header.
$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');
$PAGE->set_title(format_string($mplayer->name));
$PAGE->set_heading('');
$PAGE->navbar->add(get_string('mplayer', 'mplayer').': '.$mplayer->name);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);

if (mplayer_supports_feature('assessables/highlightzones') && $mplayer->assessmode > 0) {
    $PAGE->requires->js_call_amd('mod_mplayer/mplayer_assessables', 'init');
}

echo $OUTPUT->header();

echo mplayer_require_js($mplayer, 'script');

$mplayer->instance = $cm->instance;

$renderer = $PAGE->get_renderer('mod_mplayer');

echo $renderer->print_body($mplayer); // See mod/mplayer/lib.php.

echo $renderer->intro($mplayer);

echo $renderer->report_button($cm);

echo $renderer->return_button($cm, 'course');

// Finish the page.
echo $OUTPUT->footer($course);
// End of mod/mplayer/view.php.
