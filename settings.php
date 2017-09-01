<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<?php  //$Id: settings.php,v 1.1.2.3 2008/01/24 20:29:36 skodak Exp $
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
>>>>>>> MOODLE_32_STABLE

require_once($CFG->dirroot.'/mod/mplayer/lib.php');

/*
 ----------------------------------- Set default parameters for new instances of Media Player Module ----------------------------------- 
*/

<<<<<<< HEAD
//player technology
$playeroptions = array('jw' => 'JW Player', 'flowplayer' => 'Flowplayer');
$settings->add(new admin_setting_configselect('mplayer_default_player', get_string('player', 'mplayer'), '', 'flowplayer', $playeroptions));

// ------------------------------------------------- Appearance -------------------------------------------------
//width
$settings->add(new admin_setting_configtext('mplayer_default_width', get_string('width', 'mplayer'), '', '100%', PARAM_TEXT));
//height
$settings->add(new admin_setting_configtext('mplayer_default_height', get_string('height', 'mplayer'), '', '570', PARAM_TEXT));
// skin
$settings->add(new admin_setting_configselect('mplayer_default_skin', get_string('configskin', 'mplayer'), '', '', mplayer_list_skins()));
// show icons
$settings->add(new admin_setting_configselect('mplayer_default_icons', get_string('icons', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// control bar
$settings->add(new admin_setting_configselect('mplayer_default_controlbar', get_string('controlbar', 'mplayer'), '', 'bottom', mplayer_list_controlbar()));
// front color
$settings->add(new admin_setting_configtext('mplayer_default_frontcolor', get_string('frontcolor', 'mplayer'), '', '', PARAM_TEXT));
// back color
$settings->add(new admin_setting_configtext('mplayer_default_backcolor', get_string('backcolor', 'mplayer'), '', '', PARAM_TEXT));
// light color
$settings->add(new admin_setting_configtext('mplayer_default_lightcolor', get_string('lightcolor', 'mplayer'), '', '', PARAM_TEXT));
// screen color
$settings->add(new admin_setting_configtext('mplayer_default_screencolor', get_string('screencolor', 'mplayer'), '', '', PARAM_TEXT));

// ------------------------------------------------- Behaviour -------------------------------------------------
// auto start
$settings->add(new admin_setting_configselect('mplayer_default_autostart', get_string('autostart', 'mplayer'), '', 'false', mplayer_list_truefalse()));
// full screen
$settings->add(new admin_setting_configselect('mplayer_default_fullscreen', get_string('fullscreen', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// stretching
$settings->add(new admin_setting_configselect('mplayer_default_stretching', get_string('configstretching', 'mplayer'), '', 'uniform', mplayer_list_stretching()));
// volume
$settings->add(new admin_setting_configselect('mplayer_default_volume', get_string('volume', 'mplayer'), '', '100', mplayer_list_volume()));
//
//$settings->add(new admin_setting_configselect('mplayer_default_devicefont', get_string('devicefont', 'mplayer'), '', 'true', mplayer_list_truefalse()));
// native controls (Flowplayer)
$settings->add(new admin_setting_configselect('mplayer_default_native_fullscreen', get_string('nativefullscreen', 'mplayer'), '', 'false', mplayer_list_truefalse()));
=======
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
>>>>>>> MOODLE_32_STABLE
=======
=======
>>>>>>> MOODLE_33_STABLE
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
 * Library of functions and constants for module mplayer
 * For more information on the parameters used by JW FLV Player see documentation:
 * http://developer.longtailvideo.com/trac/wiki/FlashVars
 *
 * @package  mod_mplayer
 * @category mod
 * @author   Matt Bury - matbury@gmail.com
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @licence  http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/lib.php');

// Player technology.

$playeroptions = array('jw' => 'JW Player', 'flowplayer' => 'Flowplayer');
$key = 'mplayer/default_player';
$label = get_string('player', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'flowplayer', $playeroptions));

$key = 'mplayer/showdebugcode';
$label = get_string('showdebugcode', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configcheckbox($key, $label, $desc, 0));

$yesnooptions = array('0' => get_string('no'), '1' => get_string('yes'));
$key = 'mplayer/allowchoice';
$label = get_string('allowtechnologychoice', 'mplayer');
$desc = get_string('allowtechnologychoicedesc', 'mplayer');
$settings->add(new admin_setting_configselect($key, $label, $desc, 0, $yesnooptions));

// APPEARANCE.
// Width.
$key = 'mplayer/default_width';
$label = get_string('width', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '100%', PARAM_TEXT));

// Height.
$key = 'mplayer/default_height';
$label = get_string('height', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '570', PARAM_TEXT));

// Skin.
$key = 'mplayer/default_skin';
$label = get_string('configskin', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, '', mplayer_list_skins()));

// Show icons.
$key = 'mplayer/default_icons';
$label = get_string('icons', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'true', mplayer_list_truefalse()));

// Control bar.
$key = 'mplayer/default_controlbar';
$label = get_string('controlbar', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'bottom', mplayer_list_controlbar()));

// Front color.
$key = 'mplayer/default_frontcolor';
$label = get_string('frontcolor', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '', PARAM_TEXT));

// Back color.
$key = 'mplayer/default_backcolor';
$label = get_string('backcolor', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '', PARAM_TEXT));

// Light color.
$key = 'mplayer/default_lightcolor';
$label = get_string('lightcolor', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '', PARAM_TEXT));

// Screen color.
$key = 'mplayer/default_screencolor';
$label = get_string('screencolor', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configtext($key, $label, $desc, '', PARAM_TEXT));

// BEHAVIOUR.
// Auto start.
$key = 'mplayer/default_autostart';
$label = get_string('autostart', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'false', mplayer_list_truefalse()));

// Full screen.
$key = 'mplayer/default_fullscreen';
$label = get_string('fullscreen', 'mplayer');
$desc = $desc;
$settings->add(new admin_setting_configselect($key, $label, $desc, 'true', mplayer_list_truefalse()));

// Stretching.
$key = 'mplayer/default_stretching';
$label = get_string('configstretching', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'uniform', mplayer_list_stretching()));

// Volume.
$key = 'mplayer/default_volume';
$label = get_string('volume', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, '100', mplayer_list_volume()));

// Native controls (Flowplayer)
$key = 'mplayer/default_native_fullscreen';
$label = get_string('nativefullscreen', 'mplayer');
$desc = '';
$settings->add(new admin_setting_configselect($key, $label, $desc, 'false', mplayer_list_truefalse()));

$storages = glob($CFG->dirroot.'/mod/mplayer/storage/*_storage.class.php');
foreach ($storages as $st) {
    include_once($st);
    $classfile = basename($st);
    $classname = str_replace('.class.php', '', $classfile);
    $instance = new $classname();
    $instance->get_settings($settings);
<<<<<<< HEAD
}
>>>>>>> MOODLE_32_STABLE
=======
}
>>>>>>> MOODLE_33_STABLE
