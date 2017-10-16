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

defined('MOODLE_INTERNAL') || die();

/**
 * Library of functions and constants for module mplayer
 * For more information on the parameters used by JW FLV Player see documentation: http://developer.longtailvideo.com/trac/wiki/FlashVars
 * 
 * @package  mod_mplayer
 * @category mod
 * @author   Matt Bury - matbury@gmail.com
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @licence  http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

require_once($CFG->dirroot.'/mod/mplayer/lib.php');

/*
 ----------------------------------- Set default parameters for new instances of Media Player Module ----------------------------------- 
*/

// Player technology.

$playeroptions = array('jw' => 'JW Player', 'flowplayer' => 'Flowplayer');
$settings->add(new admin_setting_configselect('mplayer/default_player', get_string('player', 'mplayer'), '', 'flowplayer', $playeroptions));

$settings->add(new admin_setting_configcheckbox('mplayer/showdebugcode', get_string('showdebugcode', 'mplayer'), '', 0));

$yesnooptions = array('0' => get_string('no'), '1' => get_string('yes'));
$settings->add(new admin_setting_configselect('mplayer/allowchoice', get_string('allowtechnologychoice', 'mplayer'), get_string('allowtechnologychoicedesc', 'mplayer'), 0, $yesnooptions));

// ------------------------------------------------- Appearance -------------------------------------------------
//width
$settings->add(new admin_setting_configtext('mplayer/default_width', get_string('width', 'mplayer'), '', '100%', PARAM_TEXT));
//height
$settings->add(new admin_setting_configtext('mplayer/default_height', get_string('height', 'mplayer'), '', '570', PARAM_TEXT));
// skin
$settings->add(new admin_setting_configselect('mplayer/default_skin', get_string('configskin', 'mplayer'), '', '', mplayer_list_skins()));
// show icons
$settings->add(new admin_setting_configselect('mplayer/default_icons', get_string('icons', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// control bar
$settings->add(new admin_setting_configselect('mplayer/default_controlbar', get_string('controlbar', 'mplayer'), '', 'bottom', mplayer_list_controlbar()));
// front color
$settings->add(new admin_setting_configtext('mplayer/default_frontcolor', get_string('frontcolor', 'mplayer'), '', '', PARAM_TEXT));
// back color
$settings->add(new admin_setting_configtext('mplayer/default_backcolor', get_string('backcolor', 'mplayer'), '', '', PARAM_TEXT));
// light color
$settings->add(new admin_setting_configtext('mplayer/default_lightcolor', get_string('lightcolor', 'mplayer'), '', '', PARAM_TEXT));
// screen color
$settings->add(new admin_setting_configtext('mplayer/default_screencolor', get_string('screencolor', 'mplayer'), '', '', PARAM_TEXT));

// ------------------------------------------------- Behaviour -------------------------------------------------
// auto start
$settings->add(new admin_setting_configselect('mplayer/default_autostart', get_string('autostart', 'mplayer'), '', 'false', mplayer_list_truefalse()));
// full screen
$settings->add(new admin_setting_configselect('mplayer/default_fullscreen', get_string('fullscreen', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// stretching
$settings->add(new admin_setting_configselect('mplayer/default_stretching', get_string('configstretching', 'mplayer'), '', 'uniform', mplayer_list_stretching()));
// volume
$settings->add(new admin_setting_configselect('mplayer/default_volume', get_string('volume', 'mplayer'), '', '100', mplayer_list_volume()));
//
//$settings->add(new admin_setting_configselect('mplayer/default_devicefont', get_string('devicefont', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// native controls (Flowplayer)
$settings->add(new admin_setting_configselect('mplayer/default_native_fullscreen', get_string('nativefullscreen', 'mplayer'), '', 'false', mplayer_list_truefalse()));

$storages = glob($CFG->dirroot.'/mod/mplayer/storage/*_storage.class.php');
foreach($storages as $st) {
    include_once($st);
    $classfile = basename($st);
    $classname = str_replace('.class.php', '', $classfile);
    $instance = new $classname();
    $instance->get_settings($settings);
}