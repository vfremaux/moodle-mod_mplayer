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

$pagesize = 20;
$page = optional_param('page', 0, PARAM_INT);
$firstnamefilter = optional_param('filterfirstname', false, PARAM_TEXT);
$lastnamefilter = optional_param('filterlastname', false, PARAM_TEXT);
$return = optional_param('return', 'mod', PARAM_TEXT);

$params = ['id' => $cm->id, 'firstnamefilter' => $firstnamefilter, 'lastnamefilter' => $lastnamefilter, 'return' => $return];
$url = new moodle_url('/mod/mplayer/report.php', $params);
$PAGE->set_url($url);

// Security.
$context = context_module::instance($cm->id);
require_login($course->id);
require_capability('mod/mplayer:assessor', $context);

$event = \mod_mplayer\event\mplayer_report_viewed::create(array(
    'objectid' => $cm->id,
    'context' => $context,
    'other' => array(
        'objectname' => $mplayer->name
    )
));
$event->trigger();

// Print the page header.
$strmplayers = get_string('modulenameplural', 'mplayer');
$strmplayer  = get_string('modulename', 'mplayer');
$PAGE->set_title(format_string($mplayer->name));
$PAGE->set_heading('');
$PAGE->navbar->add(get_string('report', 'mplayer').': '.$mplayer->name);
$PAGE->set_focuscontrol('');
$PAGE->set_cacheable(true);

$renderer = $PAGE->get_renderer('mod_mplayer');
$renderer->set_mplayer($mplayer);

$groupid = groups_get_activity_group($cm, true);

$fields = 'u.id,'.get_all_user_name_fields(true, 'u').',u.picture, u.imagealt, u.email, u.emailstop';
$allusers = get_users_by_capability($context, 'mod/mplayer:assessed', $fields, 'lastname, firstname', 0, 0, $groupid);
$totalusers = count($allusers);
$users = get_users_by_capability($context, 'mod/mplayer:assessed', $fields, 'lastname, firstname', $page * $pagesize, $pagesize, $groupid);
mplayer_apply_namefilters($users);

echo $OUTPUT->header();

echo $OUTPUT->heading(get_string('report', 'mplayer'));

echo groups_print_activity_menu($cm, $url, true);

echo $renderer->namefilter($url);

echo $OUTPUT->paging_bar($totalusers, $page, $pagesize, $url);

echo $renderer->report_table($mplayer, $users, $context);

echo $OUTPUT->paging_bar($totalusers, $page, $pagesize, $url);

echo $renderer->return_button($cm, $return);

echo $OUTPUT->footer();