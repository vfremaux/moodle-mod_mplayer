<?php  //$Id: settings.php,v 1.1.2.3 2008/01/24 20:29:36 skodak Exp $

require_once($CFG->dirroot.'/mod/mplayer/lib.php');

/*
 ----------------------------------- Set default parameters for new instances of Media Player Module ----------------------------------- 
*/

//player technology
$playeroptions = array('jw' => 'JW Player', 'flowplayer' => 'Flowplayer');
$settings->add(new admin_setting_configselect('mplayer/default_player', get_string('player', 'mplayer'), '', 'flowplayer', $playeroptions));

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
