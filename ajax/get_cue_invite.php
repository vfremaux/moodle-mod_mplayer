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
require('../../../config.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

$mpid = required_param('mpid', PARAM_INT); // Player instance id.
$cueurl = required_param('cueurl', PARAM_URL); // Cue target url.
$type = required_param('type', PARAM_TEXT); // Target object type.
$cueout = required_param('cueout', PARAM_TEXT); // How to get out.
$mandatory = required_param('mandatory', PARAM_TEXT); // Target object type.

if (!$mplayer = $DB->get_record('mplayer', array('id' => $mpid))) {
    die;
}
if (!$cm = get_coursemodule_from_instance('mplayer', $mpid)) {
    die;
}
if (!$course = $DB->get_record('course', array('id' => $cm->course))) {
    die;
}

$context = context_module::instance($cm->id);

$url = new moodle_url('/mod/mplayer/ajax/get_cue_invite.php');
$PAGE->set_url($url);
require_login($course, true, $cm);

$e = new StdClass();

$e->url = new moodle_url($cueurl);
$e->playerid = $mpid;
if (!empty($type)) {
    $e->type = get_string('pluginname', $type);
}

$button = '<input type="button" value="'.get_string('cuelaunch', 'mplayer', $e->type).'">';
$winname = 'cuepoint_mplayer'.$course->id.'_'.$mpid;
$winoptions = 'width=680,height=800,toolbar=0,scrollbars=1';
$jshandler = 'cuewin = window.open(\''.$e->url.'\', \''.$winname.'\', \''.$winoptions.'\');
              cuewin.onbeforeunload = function() {cuepoint_resume(api, \''.$cueout.'\')}';
$e->link = '<a href="#"
               onclick="'.$jshandler.'">'.$button.'</a>';

if ($mandatory == 'optional') {
    echo get_string('cueininviteoptional', 'mplayer', $e);
} else {
    echo get_string('cueininvite', 'mplayer', $e);
}
