<<<<<<< HEAD
<<<<<<< HEAD
<?php
<<<<<<< HEAD
=======
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
>>>>>>> MOODLE_32_STABLE

/**
 * Library of functions and constants for module mplayer
 * For more information on the parameters used by JW FLV Player see documentation: http://developer.longtailvideo.com/trac/wiki/FlashVars
 * 
<<<<<<< HEAD
 * @author Matt Bury - matbury@gmail.com - http://matbury.com/
 * @version $Id: index.php,v 0.2 2009/02/21 matbury Exp $
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 * @package mplayer
 */
=======
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

>>>>>>> MOODLE_32_STABLE
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

/**    Copyright (C) 2009  Matt Bury
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
<<<<<<< HEAD
 * Given an object containing all the necessary data, 
 * (defined by the form in mod.html) this function 
 * will create a new instance and return the id number 
=======
 * @uses FEATURE_GROUPS
 * @uses FEATURE_GROUPINGS
 * @uses FEATURE_GROUPMEMBERSONLY
 * @uses FEATURE_MOD_INTRO
 * @uses FEATURE_COMPLETION_TRACKS_VIEWS
 * @uses FEATURE_GRADE_HAS_GRADE
 * @uses FEATURE_GRADE_OUTCOMES
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, null if doesn't know
 */
function mplayer_supports($feature) {
    switch($feature) {
        case FEATURE_GROUPS: {
            return false;
        }
        case FEATURE_GROUPINGS: {
            return false;
        }
        case FEATURE_GROUPMEMBERSONLY: {
            return true;
        }
        case FEATURE_MOD_INTRO: {
            return true;
        }
        case FEATURE_COMPLETION_TRACKS_VIEWS: {
            return true;
        }
        case FEATURE_COMPLETION_HAS_RULES: {
            return true;
        }
        case FEATURE_GRADE_HAS_GRADE: {
            return false;
        }
        case FEATURE_GRADE_OUTCOMES: {
            return false;
        }
        case FEATURE_BACKUP_MOODLE2: {
            return true;
        }
        case FEATURE_SHOW_DESCRIPTION: {
            return true;
        }
        case FEATURE_MOD_ARCHETYPE: {
            return MOD_ARCHETYPE_RESOURCE;
        }

        default:
            return null;
    }
}

/**
 * Given an object containing all the necessary data,
 * (defined by the form in mod.html) this function
 * will create a new instance and return the id number
>>>>>>> MOODLE_32_STABLE
 * of the new instance.
 *
 * @param object $instance An object from the form in mod.html
 * @return int The id of the newly inserted mplayer record
<<<<<<< HEAD
 **/
function mplayer_add_instance($mplayer) {
    global $DB;

    $mplayer->timecreated = time();

    // saves draft customization image files into definitive filearea
    $instancefiles = mplayer_get_fileareas();
=======
 */
function mplayer_add_instance($mplayer) {
    global $DB;

    $config = get_config('mplayer');

    $mplayer->timecreated = time();

    // Saves draft customization image files into definitive filearea.
    $instancefiles = mplayer_get_fileareas();

    if (!empty($mplayer->configxmlgroup['clearconfigxml'])) {
        mplayer_clear_area($mplayer, 'configxml');
    } else {
        $mplayer->configxml = @$mplayer->configxmlgroup['configxml'];
    }

>>>>>>> MOODLE_32_STABLE
    foreach ($instancefiles as $if) {
        mplayer_save_draft_file($mplayer, $if);
    }

<<<<<<< HEAD
=======
    // May never arrive if RTMP not enabled.
    if (!empty($mplayer->streamer)) {
        // Get the uploaded video mediafiles and move them to wooza storage.
        mplayer_convert_storage_for_streamer($mplayer);
    }

    if (empty($mplayer->technology)) {
        $mplayer->technology = $config->default_player;
    }

>>>>>>> MOODLE_32_STABLE
    $notes = $mplayer->notes;
    $mplayer->notes = $notes['text'];
    $mplayer->notesformat = $notes['format'];

    return $DB->insert_record('mplayer', $mplayer);
}

/**
<<<<<<< HEAD
 * Given an object containing all the necessary data, 
 * (defined by the form in mod.html) this function 
=======
 * Given an object containing all the necessary data,
 * (defined by the form in mod.html) this function
>>>>>>> MOODLE_32_STABLE
 * will update an existing instance with new data.
 *
 * @param object $instance An object from the form in mod.html
 * @return boolean Success/Fail
<<<<<<< HEAD
 **/
function mplayer_update_instance($mplayer) {
    global $DB;

    $mplayer->timemodified = time();
    $mplayer->id = $mplayer->instance;

    if (!empty($mplayer->playlistgroup['clearplaylist'])) {
        mplayer_clear_area($mplayer, 'playlistfile');
    } else {
        $mplayer->playlistfile = $mplayer->playlistgroup['playlistfile'];
=======
 */
function mplayer_update_instance($mplayer) {
    global $DB;

    $config = get_config('mplayer');

    $mplayer->timemodified = time();
    $mplayer->id = $mplayer->instance;

    if (empty($config->default_player)) {
        set_config('default_player', 'flowplayer', 'mplayer');
        $config->default_player = 'flowplayer';
    }

    if (empty($mplayer->technology)) {
        $mplayer->technology = $config->default_player;
    }

    if (empty($mplayer->autostart)) {
        $mplayer->autostart = 0;
    }

    if (empty($mplayer->fullscreen)) {
        $mplayer->fullscreen = 0;
>>>>>>> MOODLE_32_STABLE
    }

    if (!empty($mplayer->configxmlgroup['clearconfigxml'])) {
        mplayer_clear_area($mplayer, 'configxml');
    } else {
<<<<<<< HEAD
        $mplayer->configxml = $mplayer->configxmlgroup['configxml'];
=======
        $mplayer->configxml = @$mplayer->configxmlgroup['configxml'];
>>>>>>> MOODLE_32_STABLE
    }

    // Saves draft customization image files into definitive filearea.
    $instancefiles = mplayer_get_fileareas();

    foreach ($instancefiles as $ci) {
        mplayer_save_draft_file($mplayer, $ci);
    }

<<<<<<< HEAD
=======
    // May never arrive if RTMP not enabled.
    if (!empty($mplayer->streamer)) {
        // Get the uploaded mediafile and convert them to remote storage. Set up the stream access URL.
        mplayer_convert_storage_for_streamer($mplayer);
    }

>>>>>>> MOODLE_32_STABLE
    $notes = $mplayer->notes;
    $mplayer->notes = $notes['text'];
    $mplayer->notesformat = $notes['format'];

    return $DB->update_record('mplayer', $mplayer);
}

/**
<<<<<<< HEAD
 * Given an ID of an instance of this module, 
 * this function will permanently delete the instance 
 * and any data that depends on it. 
=======
 * Given an ID of an instance of this module,
 * this function will permanently delete the instance
 * and any data that depends on it.
>>>>>>> MOODLE_32_STABLE
 *
 * @param int $id Id of the module instance
 * @return boolean Success/Failure
 */
function mplayer_delete_instance($id) {
    global $DB;

<<<<<<< HEAD
    if (!$mplayer = $DB->get_record('mplayer', array('id' => "$id"))) {
=======
    if (!$mplayer = $DB->get_record('mplayer', array('id' => $id))) {
>>>>>>> MOODLE_32_STABLE
        return false;
    }
    $result = true;

    if (!$cm = get_coursemodule_from_instance('mplayer', $mplayer->id)) {
        return false;
    }

<<<<<<< HEAD
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);
    
    $fs = get_file_storage();
    $fs->delete_area_files($context->id);

    if (! $DB->delete_records("mplayer", array("id" => "$mplayer->id"))) {
=======
    $context = context_module::instance($cm->id);

    $fs = get_file_storage();
    $fs->delete_area_files($context->id);

    if (! $DB->delete_records("mplayer", array('id' => $mplayer->id))) {
>>>>>>> MOODLE_32_STABLE
        $result = false;
    }
    return $result;
}

/**
<<<<<<< HEAD
 * Return a small object with summary information about what a 
=======
 * Return a small object with summary information about what a
>>>>>>> MOODLE_32_STABLE
 * user has done with a given particular instance of this module
 * Used for user activity reports.
 * $return->time = the time they did it
 * $return->info = a short text description
 *
 * @return null
 * @todo Finish documenting this function
<<<<<<< HEAD
 **/
function mplayer_user_outline($course, $user, $mod, $mplayer) {
    $return->time = time();
    $return->info = '';
    return $return;
    /*
    if($logs = $DB->get_records_select("log", "userid = '$user->id' AND module = 'mplayer' AND action = 'view' AND info = '$mplayer->id'", "time ASC")) {
        $numviews = count($logs);
        $lastlog = array_pop($logs);
        $result = new stdClass();
        $result->info = get_string("numviews", "", $numviews);
        $result->time = $lastlog->time;
        return $result;
    }
    return NULL;
    */
}

/**
 * Print a detailed representation of what a user has done with 
=======
 */
function mplayer_user_outline($course, $user, $mod, $mplayer) {

    $return->time = time();
    $return->info = '';

    return $return;
}

/**
 * Print a detailed representation of what a user has done with
>>>>>>> MOODLE_32_STABLE
 * a given particular instance of this module, for user activity reports.
 *
 * @return boolean
 * @todo Finish documenting this function
<<<<<<< HEAD
 **/
=======
 */
>>>>>>> MOODLE_32_STABLE
function mplayer_user_complete($course, $user, $mod, $mplayer) {
    return true;
}

/**
<<<<<<< HEAD
 * Given a course and a time, this module should find recent activity 
 * that has occurred in mplayer activities and print it out. 
 * Return true if there was output, or false is there was none. 
 *
 * @uses $CFG
=======
 * Given a course and a time, this module should find recent activity
 * that has occurred in mplayer activities and print it out.
 * Return true if there was output, or false is there was none.
 *
>>>>>>> MOODLE_32_STABLE
 * @return boolean
 * @todo Finish documenting this function
 */
function mplayer_print_recent_activity($course, $isteacher, $timestart) {
    global $CFG;

<<<<<<< HEAD
    return false;  //  True if anything was printed, otherwise false 
}

/**
 * 
 *
 * @uses $CFG
=======
    return false;  //  True if anything was printed, otherwise false.
}

/**
 *
 *
>>>>>>> MOODLE_32_STABLE
 * @return array
 */
function mplayer_get_view_actions() {
    return array('view');
}

/**
 *
<<<<<<< HEAD
 * @uses $CFG
=======
>>>>>>> MOODLE_32_STABLE
 * @return array
 */
function mplayer_get_post_actions() {
    return array('update');
}

/**
 * Function to be run periodically according to the moodle cron
<<<<<<< HEAD
 * This function searches for things that need to be done, such 
 * as sending out mail, toggling flags etc.
 *
 * @uses $CFG
=======
 * This function searches for things that need to be done, such
 * as sending out mail, toggling flags etc.
 *
>>>>>>> MOODLE_32_STABLE
 * @return boolean
 * @todo Finish documenting this function
 */
function mplayer_cron() {
    global $CFG;

    return true;
}

/**
 * Serves the files included in mplayer. Implements needed access control ;-)
 *
 * There are several situations in general where the files will be sent.
<<<<<<< HEAD
 * 1) filearea = '', 
=======
 * 1) filearea = '',
>>>>>>> MOODLE_32_STABLE
 *
 * @param object $course
 * @param object $cm
 * @param object $context
 * @param string $filearea
 * @param array $args
 * @param bool $forcedownload
 * @return bool false if file not found, does not return if found - justsend the file
 */
function mplayer_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload) {
    global $CFG, $DB;

<<<<<<< HEAD
    if ($filearea != 'playlistfile') {
=======
    $guests = false;
    if ($course->id > SITEID) {
        $enrols = enrol_get_instances($course->id, true);
        foreach($enrols as $e) {
            if ($e->enrol == 'guest') {
                $guests = true;
                break;
            }
        }
    }

    if (!$guests) {
>>>>>>> MOODLE_32_STABLE
        require_login($course);
    }

    if ($context->contextlevel != CONTEXT_MODULE) {
        return false;
    }

    $instancefiles = mplayer_get_fileareas();

    if (!in_array($filearea, $instancefiles)) {
        return false;
    }

    $itemid = (int)array_shift($args);

    $fs = get_file_storage();
<<<<<<< HEAD
    if ($filearea == 'mplayerfile' || $filearea == 'playlistthumb') {
        // Case for fileareas possibly holding more than one file.
        $relativepath = implode('/', $args);
        $fullpath = "/$context->id/mod_mplayer/$filearea/0/$relativepath";
        if ($file = $fs->get_file_by_hash(sha1($fullpath)) or $file->is_directory()) {
            send_stored_file($file, 0, 0, $forcedownload);
        }
    } else {
        if ($files = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, $itemid, "sortorder, itemid, filepath, filename", false)) {
            $file = array_pop($files);

            // finally send the file.
=======
    if ($filearea == 'mplayerfiles') {
        // Case for fileareas possibly holding more than one file.
        $relativepath = implode('/', $args);
        $fullpath = "/$context->id/mod_mplayer/$filearea/0/$relativepath";
        if (($file = $fs->get_file_by_hash(sha1($fullpath))) && !$file->is_directory()) {
            send_stored_file($file, 0, 0, $forcedownload);
        }
    } else {
        $sort = "sortorder, itemid, filepath, filename";
        if ($files = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, $itemid, $sort, false)) {
            $file = array_pop($files);

            // Finally send the file.
>>>>>>> MOODLE_32_STABLE
            send_stored_file($file, 0, 0, $forcedownload);
        }
    }

    return false;
}

/**
<<<<<<< HEAD
 * Must return an array of grades for a given instance of this module, 
=======
 * Must return an array of grades for a given instance of this module,
>>>>>>> MOODLE_32_STABLE
 * indexed by user.  It also returns a maximum allowed grade.
 * 
 * Example:
 *    $return->grades = array of grades;
 *    $return->maxgrade = maximum allowed grade;
 *
 *    return $return;
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed Null or object with an array of grades and with the maximum grade
 */
function mplayer_grades($mplayerid) {
<<<<<<< HEAD
   return NULL;
=======
    return null;
>>>>>>> MOODLE_32_STABLE
}

/**
 * Must return an array of user records (all data) who are participants
 * for a given instance of mplayer. Must include every user involved
 * in the instance, independient of his role (student, teacher, admin...)
 * See other modules as example.
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed boolean/array of students
 */
function mplayer_get_participants($mplayerid) {
    return false;
}

/**
 * This function returns if a scale is being used by one mplayer
 * it it has support for grading and scales. Commented code should be
 * modified if necessary. See forum, glossary or journal modules
 * as reference.
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed
 * @todo Finish documenting this function
 */
function mplayer_scale_used($mplayerid, $scaleid) {
    $return = false;
<<<<<<< HEAD
    //$rec = get_record("mplayer","id","$mplayerid","scale","-$scaleid");
    //
    //if (!empty($rec)  && !empty($scaleid)) {
    //    $return = true;
    //}
=======

>>>>>>> MOODLE_32_STABLE
    return $return;
}

/**
 * Checks if scale is being used by any instance of mplayer.
 * This function was added in 1.9
 *
 * This is used to find out if scale used anywhere
 * @param $scaleid int
 * @return boolean True if the scale is used by any mplayer
 */
function mplayer_scale_used_anywhere($scaleid) {
    global $DB;

<<<<<<< HEAD
    if ($scaleid && $DB->record_exists('mplayer', array('grade' => -$scaleid))) {
        return true;
    } else {
        return false;
    }
}

/**
 * Execute post-install custom actions for the module
 * This function was added in 1.9
 *
 * @return boolean true if success, false on error
 */
function mplayer_install() {
     return true;
}

/**
 * Execute post-uninstall custom actions for the module
 * This function was added in 1.9
 *
 * @return boolean true if success, false on error
 */
function mplayer_uninstall() {
    return true;
}

/*
-------------------------------------------------------------------- view.php --------------------------------------------------------------------
*/

/**
* Set moodledata path in $mplayer object
*
* @param $mplayer
* @return $mplayer
*/
function mplayer_set_moodledata($mplayer) {
    global $CFG, $COURSE;

    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm->id);
    $mplayer->moodledata = $CFG->wwwroot.'/pluginfile.php/'.$context->id.'/mod_mplayer/';
    return $mplayer;
}

/**
* Assign the correct path to the file parameter (media source) in $mplayer object
*
* @param obj $mplayer
* @return obj $mplayer
*/
function mplayer_set_type($mplayer) {
    switch($mplayer->type) {

        // Video, sound, image and xml (SMIL playlists) are all served from moodledata course directories.
        case 'video':
        $mplayer->prefix = $mplayer->moodledata;
        //$mplayer->test_variable = 'case video';
        break;
        case 'sound':
        $mplayer->prefix = $mplayer->moodledata;
        //$mplayer->test_variable = 'case sound';
        break;
        case 'image':
        $mplayer->prefix = $mplayer->moodledata;
        //$mplayer->test_variable = 'case image';
        break;
        case 'xml':
        $mplayer->type = ''; // JW FLV Player doesn't recognise 'xml' as a valid parameter
        $mplayer->prefix = $mplayer->moodledata;
        //$mplayer->test_variable = 'case playlist';
        break;
        case 'youtube':
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'case youtube';
        break;
        case 'url':
        $mplayer->type = ''; // JW FLV Player doesn't recognise 'url' as a valid parameter
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'case url';
        break;
        case 'http':
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'case http';
        break;
        case 'lighttpd':
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'case lighttpd';
        break;
        case 'rtmp':
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'case rtmp';
        break;
        default;
        $mplayer->type = ''; // Prevent failures due to errant parameters getting passed in
        $mplayer->prefix = '';
        //$mplayer->test_variable = 'default';
    }
    return $mplayer;
}

/**
 * Assign the correct path to the file parameter (media source) in $mplayer object
 *
 * @param $mplayer
 * @return $mplayer
 */
function mplayer_set_paths(&$mplayer) {
    global $CFG;

    $fs = get_file_storage();
    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm->id);

    // Check if there is a playlist.
    if ($playlisturl = mplayer_get_file_url($mplayer, 'playlistfile', $context)) {
        $mplayer->mplayerfile = '&file='.$playlisturl;
    } else {
        $mplayer->mplayerfile = '&file='.mplayer_get_file_url($mplayer, 'mplayerfile', $context);
    }

    // Set wwwroot.
    $mplayer->wwwroot = $CFG->wwwroot;

    // Only need to call time() function once
    $mplayer_time = time();

    // Check for type.
    if ($mplayer->type != '') {
        $mplayer->type = '&provider='.$mplayer->type; // parameter name has changed to provider
    }

    // Check for streamer.
    if ($mplayer->streamer != '') {
        $mplayer->streamer = '&streamer='.$mplayer->streamer;
    }

    // Check for playlist.
    if ($mplayer->playlist == 'none') {
        $mplayer->playlist = '';
        $mplayer->playlistsize = '';
        $mplayer->item = '';
        $mplayer->mplayerrepeat = '';
        $mplayer->shuffle = '';
    } else {
        $mplayer->playlist = '&playlist='.$mplayer->playlist;

        // Repeat.
        if($mplayer->mplayerrepeat != 'none') {
            $mplayer->mplayerrepeat = '&repeat='.$mplayer->mplayerrepeat;
        } else {
            $mplayer->mplayerrepeat = '';
        }

        // Shuffle.
        if ($mplayer->shuffle == 'true') {
            $mplayer->shuffle = '&shuffle='.$mplayer->shuffle;
        } else {
            $mplayer->shuffle = '';
        }

        // Playlistsize.
        if ($mplayer->playlistsize != '180')
        {
            $mplayer->playlistsize = '&playlistsize='.$mplayer->playlistsize;
        } else {
            $mplayer->playlistsize = '';
        }

        // Item.
        if ($mplayer->item != '0') {
            $mplayer->item = '&item='.$mplayer->item;
        } else {
            $mplayer->item = '';
        }
    }

    // Check for configuration XML file URL.
    if ($url = mplayer_get_file_url($mplayer, 'configxml', $context)) {
        $mplayer->configxml = '$config='.$url.'?'.$mplayer_time;
    }

    // Check for skin.
    if ($mplayer->skin != '') {
        $mplayer->skin = '&skin='.$mplayer->wwwroot.'/mod/mplayer/skins/'.$mplayer->skin;
    }

    // Check for image.
    $mplayer->image = '';
    if ($url = mplayer_get_file_url($mplayer, 'image', $context)) {
        $mplayer->image = '&image='.$url;
    }

    // Check for icons.
    if ($mplayer->icons == 'false') {
        $mplayer->icons = '&icons='.$mplayer->icons;
    } else {
        $mplayer->icons = '';
    }

    // Check for controlbar.
    if ($mplayer->controlbar != 'bottom') {
        $mplayer->controlbar = '&controlbar='.$mplayer->controlbar;
    } else {
        $mplayer->controlbar = '';
    }

    // Check for backcolor.
    if ($mplayer->backcolor != '') {
        $mplayer->backcolor = '&backcolor='.$mplayer->backcolor;
    }

    // Check for frontcolor.
    if ($mplayer->frontcolor != '') {
        $mplayer->frontcolor = '&frontcolor='.$mplayer->frontcolor;
    }

    // Check for lightcolor.
    if ($mplayer->lightcolor != '') {
        $mplayer->lightcolor = '&lightcolor='.$mplayer->lightcolor;
    }

    // Check for screencolor.
    if ($mplayer->screencolor != '') {
        $mplayer->screencolor = '&screencolor='.$mplayer->screencolor;
    }

    // Check for smoothing.
    if ($mplayer->smoothing == 'false') {
        $mplayer->smoothing = '&smoothing='.$mplayer->smoothing;
    } else {
        $mplayer->smoothing = '';
    }

    // Check for quality.
    if ($mplayer->quality != 'best') {
        $mplayer->quality = '&quality='.$mplayer->quality;
    } else {
        $mplayer->quality = '';
    }

    // Check for resizing.
    if ($mplayer->resizing != '') {
        $mplayer->resizing = '&resizing='.$mplayer->resizing;
    }
    // deprecated
    $mplayer->resizing = '';

//// --------------------------------------------------------- BEHAVIOUR ---------------------------------------------------------
    // Check for autostart.
    if ($mplayer->autostart == 'true') {
        $mplayer->autostart = '&autostart='.$mplayer->autostart;
    } else {
        $mplayer->autostart = '';
    }

    // Check for stretching.
    if ($mplayer->stretching != 'uniform') {
        $mplayer->stretching = '&stretching='.$mplayer->stretching;
    } else {
        $mplayer->stretching = '';
    }

    // Check for volume.
    if ($mplayer->volume != '90') {
        $mplayer->volume = '&volume='.$mplayer->volume;
    } else {
        $mplayer->volume = '';
    }

    // Check for mute.
    if ($mplayer->mute == 'true') {
        $mplayer->mute = '&mute='.$mplayer->mute;
    } else {
        $mplayer->mute = '';
    }

    // Check for mplayerstart.
    if ($mplayer->mplayerstart != '0') {
        $mplayer->mplayerstart = '&start='.$mplayer->mplayerstart;
    } else {
        $mplayer->mplayerstart = '';
    }

    // Check for bufferlength.
    if ($mplayer->bufferlength != '1') {
        $mplayer->bufferlength = '&bufferlength='.$mplayer->bufferlength;
    } else {
        $mplayer->bufferlength = '';
    }

    // Check for plugins.
    if ($mplayer->plugins != '') {
        $mplayer->plugins = '&plugins='.$mplayer->plugins;
    } else {
        $mplayer->plugins = '';
    }

    // Check for author - author is always present in FlashVars embed code and should start without the & symbol.
    if ($mplayer->author != '') {
        $mplayer->author = 'author='.$mplayer->author;
    }

    // Check for mplayerdate.
    if ($mplayer->mplayerdate != '') {
        $mplayer->mplayerdate = '&date='.$mplayer->mplayerdate;
    }

    // Check for title.
    if ($mplayer->title != '') {
        $mplayer->title = '&title='.$mplayer->title;
    }

    // Check for description.
    if ($mplayer->description != '') {
        $mplayer->description = '&description='.$mplayer->description;
    }

    // Check for tags.
    if ($mplayer->tags != '') {
        $mplayer->tags = '&tags='.$mplayer->tags;
    }

//// --------------------------------------------------------- AUDIO DESCRIPTION ---------------------------------------------------------

    // Check for audiodescriptionfile.
    if ($url = mplayer_get_file_url($mplayer, 'audiodescriptionfile', $context)) {
        $mplayer->audiodescriptionfile = '&audiodescription.file='.$url;
        $mplayer->audiodescriptionstate = '&audiodescription.state='.$mplayer->audiodescriptionstate;
        $mplayer->audiodescriptionvolume = '&audiodescription.volume='.$mplayer->audiodescriptionvolume;

        // Add the audiodescription plugin.
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',audiodescription';
        } else {
            $mplayer->plugins = '&plugins=audiodescription';
        }
    } else {
        $mplayer->audiodescriptionfile = '';
        $mplayer->audiodescriptionstate = '';
        $mplayer->audiodescriptionvolume = '';
    }

    // Check for captions.
    if ($url = mplayer_get_file_url($mplayer, 'captionsfile', $context)) {
        // There's a bug in the captions.back parameter so we'll compensate for that.
        if ($mplayer->captionsback == 'true') {
            $mplayer->captionsback = '&captions.back='.$mplayer->captionsback;
        } else {
            $mplayer->captionsback = '';
        }
        $mplayer->captionsfile = '&captions.file='.$url;
        $mplayer->captionsfontsize = '&captions.fontsize='.$mplayer->captionsfontsize;
        $mplayer->captionsstate = '&captions.state='.$mplayer->captionsstate; // this doesn't work

        // Add captions plugin parameter.
        if ($mplayer->plugins != '') {
            $mplayer->plugins = '&plugins='.$mplayer->plugins.',captions';
        } else {
            $mplayer->plugins = '&plugins=captions';
        }
    } else {
        $mplayer->captionsback = '';
        $mplayer->captionsfile = '';
        $mplayer->captionsfontsize = '';
        $mplayer->captionsstate = '';
    }

    // As of 21/01/2010, there's a bug in the HD plugin that prevents switching 
    // between HD and normal when either of the files has downloaded completely
    // Check for hdfile
    if ($url = mplayer_get_file_url($mplayer, 'hdfile', $context)) {
        $mplayer->hdbitrate = '&hd.bitrate='.$mplayer->hdbitrate;
        $mplayer->hdfile = '&hd.file='.$url.'?'.$mplayer_time;
        $mplayer->hdfullscreen = '&hd.fullscreen='.$mplayer->hdfullscreen;
        $mplayer->hdstate = '&hd.state='.$mplayer->hdstate;

        // Add hd plugin parameter.
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',hd';
        } else {
            $mplayer->plugins = '&plugins=hd';
        }
    } else {
        $mplayer->hdbitrate = '';
        $mplayer->hdfile = '';
        $mplayer->hdfullscreen = '';
        $mplayer->hdstate = '';
    }

    // Check for tracecall.
    if ($mplayer->tracecall != '') {
        $mplayer->tracecall = '&tracecall='.$mplayer->tracecall;
    }

    // Check for infobox.
    if ($mplayer->infoboxposition != 'none') {
        $mplayer->infoboxcolor = '&infobox.color='.$mplayer->infoboxcolor;
        $mplayer->infoboxposition = '&infobox.position='.$mplayer->infoboxposition;
        $mplayer->infoboxsize = '&infobox.size='.$mplayer->infoboxsize;
        // Add infobox plugin parameter.
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',infobox';
        } else {
            $mplayer->plugins = '&plugins=infobox';
        }
    } else {
        $mplayer->infoboxcolor = '';
        $mplayer->infoboxposition = '';
        $mplayer->infoboxsize = '';
    }

    // Check for livestream.
    if ($url = mplayer_get_file_url($mplayer, 'livestreamfile', $context)) {
        $mplayer->livestreamfile = '&livestream.file='.$url;
        $imageurl = mplayer_get_file_url($mplayer, 'livestreamimage', $context);
        $mplayer->livestreamimage = '&livestream.image='.$imageurl;
        $mplayer->livestreaminterval = '&livestream.interval='.$mplayer->livestreaminterval;
        $mplayer->livestreammessage = '&livestream.message='.$mplayer->livestreammessage;
        $mplayer->livestreamstreamer = '&livestream.streamer='.$mplayer->livestreamstreamer;
        $mplayer->livestreamtags = '&livestream.tags='.$mplayer->livestreamtags;
        // Add livestream plugin parameter.
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',livestream';
        } else {
            $mplayer->plugins = '&plugins=livestream';
        }
    } else {
        $mplayer->livestreamfile = '';
        $mplayer->livestreamimage = '';
        $mplayer->livestreaminterval = '';
        $mplayer->livestreammessage = '';
        $mplayer->livestreamstreamer = '';
        $mplayer->livestreamtags = '';
    }

    // Check for logobox.
    if ($url = mplayer_get_file_url($mplayer, 'logoboxfile', $context)) {
        $mplayer->logoboxalign = '&logobox.align='.$mplayer->logoboxalign;
        $mplayer->logoboxfile = '&logobox.file='.$url;
        $mplayer->logoboxlink = '&logobox.link='.$mplayer->logoboxlink;
        $mplayer->logoboxmargin = '&logobox.margin='.$mplayer->logoboxmargin;
        $mplayer->logoboxposition = '&logobox.position='.$mplayer->logoboxposition;
        // add logobox plugin parameter
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',logobox';
        } else {
            $mplayer->plugins = '&plugins=logobox';
        }
    } else {
        $mplayer->logoboxalign = '';
        $mplayer->logoboxfile = '';
        $mplayer->logoboxlink = '';
        $mplayer->logoboxmargin = '';
        $mplayer->logoboxposition = '';
    }

    // Check for logo
    if ($url = mplayer_get_file_url($mplayer, 'logofile', $context)) {
        $mplayer->logofile = '&logo.file='.$url;
        $mplayer->logolink = '&logo.link='.$mplayer->logolink;
        $mplayer->logohide = '&logo.hide='.$mplayer->logohide;
        $mplayer->logoposition = '&logo.position='.$mplayer->logoposition;
    } else {
        $mplayer->logofile = '';
        $mplayer->logolink = '';
        $mplayer->logohide = '';
        $mplayer->logoposition = '';
    }

    // Check for metaviewer
    if ($mplayer->metaviewerposition != '') {
        $mplayer->metaviewerposition = '&metaviewer.position='.$mplayer->metaviewerposition;
        $mplayer->metaviewersize = '&metaviewer.size='.$mplayer->metaviewersize;
        // add metaviewer plugin parameter
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',metaviewer';
        } else {
            $mplayer->plugins = '&plugins=metaviewer';
        }
    } else {
        $mplayer->metaviewerposition = '';
        $mplayer->metaviewersize = '';
    }

    // Check for searchbar
    if ($mplayer->searchbarposition != 'none') {
        $mplayer->searchbarlabel = '&searchbar.label='.$mplayer->searchbarlabel;
        $mplayer->searchbarposition = '&searchbar.position='.$mplayer->searchbarposition;
        $mplayer->searchbarscript = '&searchbar.script='.$mplayer->searchbarscript;
        if ($mplayer->searchbarcolor != '') {
            $mplayer->searchbarcolor = '&searchbar.color='.$mplayer->searchbarcolor;
        } else {
            $mplayer->searchbarcolor = '';
        }
        // if playlist isn't set up, set up a default
        if ($mplayer->playlist == '') {
            $mplayer->playlist = '&playlist=right';
            $mplayer->playlistsize = '&playlistsize=300';
            $mplayer->item = '&item=0';
        }
        // add searchbar plugin parameter
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',searchbar';
        } else {
            $mplayer->plugins = '&plugins=searchbar';
        }
    } else {
        $mplayer->searchbarcolor = '';
        $mplayer->searchbarlabel = '';
        $mplayer->searchbarposition = '';
        $mplayer->searchbarscript = '';
    }

    // Check for snapshotscript
    if ($mplayer->snapshotscript != 'none') {
        $mplayer->snapshotbitmap = '&snapshot.bitmap='.$mplayer->snapshotbitmap;
        $mplayer->snapshotscript = '&snapshot.script='.$mplayer->snapshotscript.'?id='.$mplayer->instance.'';
        // add snapshot plugin parameter
        if ($mplayer->plugins != '') {
            $mplayer->plugins = $mplayer->plugins.',snapshot';
        } else {
            $mplayer->plugins = '&plugins=snapshot';
        }
    } else {
        $mplayer->snapshotbitmap = '';
        $mplayer->snapshotscript = '';
    }
    return $mplayer;
}
=======
    return false;
}

/**
 *-------------------------------------------------------------------- view.php --------------------------------------------------------------------
 */

/**
 * Obtains the automatic completion state for this module based on any conditions
 * in mplayer settings.
 *
 * @param object $course Course
 * @param object $cm Course-module
 * @param int $userid User ID
 * @param bool $type Type of comparison (or/and; can be used as return value if no conditions)
 * @return bool True if completed, false if not, $type if conditions not set.
 */
function mplayer_get_completion_state($course, $cm, $userid, $type) {
    global $CFG, $DB;

    $mplayerinstance = $DB->get_record('mplayer', array('id' => $cm->instance));

    $result = $type; // Default return value.

    // If completion option is enabled, evaluate it and return true/false.
    if (@$mplayerinstance->completionmediaviewed) {
        $params = array('userid' => $userid, 'mplayerid' => $cm->instance, 'finished' => 1);
        $finished = $DB->count_records('mplayer_userdata', $params);
        if ($type == COMPLETION_AND) {
            $result = $result && $finished;
        } else {
            $result = $result || $finished;
        }
    } else {
        // Completion option is not enabled so just return $type.
        return $type;
    }

    return $result;
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
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

/*    Copyright (C) 2009  Matt Bury
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @uses FEATURE_GROUPS
 * @uses FEATURE_GROUPINGS
 * @uses FEATURE_GROUPMEMBERSONLY
 * @uses FEATURE_MOD_INTRO
 * @uses FEATURE_COMPLETION_TRACKS_VIEWS
 * @uses FEATURE_GRADE_HAS_GRADE
 * @uses FEATURE_GRADE_OUTCOMES
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, null if doesn't know
 */
function mplayer_supports($feature) {
    switch($feature) {
        case FEATURE_GROUPS: {
            return false;
        }
        case FEATURE_GROUPINGS: {
            return false;
        }
        case FEATURE_GROUPMEMBERSONLY: {
            return true;
        }
        case FEATURE_MOD_INTRO: {
            return true;
        }
        case FEATURE_COMPLETION_TRACKS_VIEWS: {
            return true;
        }
        case FEATURE_COMPLETION_HAS_RULES: {
            return true;
        }
        case FEATURE_GRADE_HAS_GRADE: {
            return false;
        }
        case FEATURE_GRADE_OUTCOMES: {
            return false;
        }
        case FEATURE_BACKUP_MOODLE2: {
            return true;
        }
        case FEATURE_SHOW_DESCRIPTION: {
            return true;
        }
        case FEATURE_MOD_ARCHETYPE: {
            return MOD_ARCHETYPE_RESOURCE;
        }

        default:
            return null;
    }
}

/**
 * Given an object containing all the necessary data,
 * (defined by the form in mod.html) this function
 * will create a new instance and return the id number
 * of the new instance.
 *
 * @param object $instance An object from the form in mod.html
 * @return int The id of the newly inserted mplayer record
 */
function mplayer_add_instance($mplayer) {
    global $DB;

    $config = get_config('mplayer');

    $mplayer->timecreated = time();

    // Saves draft customization image files into definitive filearea.
    $instancefiles = mplayer_get_fileareas();

    if (!empty($mplayer->configxmlgroup['clearconfigxml'])) {
        mplayer_clear_area($mplayer, 'configxml');
    } else {
        $mplayer->configxml = @$mplayer->configxmlgroup['configxml'];
    }

    foreach ($instancefiles as $if) {
        mplayer_save_draft_file($mplayer, $if);
    }

    // May never arrive if RTMP not enabled.
    if (!empty($mplayer->streamer)) {
        // Get the uploaded video mediafiles and move them to wooza storage.
        mplayer_convert_storage_for_streamer($mplayer);
    }

    if (empty($mplayer->technology)) {
        $mplayer->technology = $config->default_player;
    }

<<<<<<< HEAD
    $notes = $mplayer->notes;
=======
    $notes = @$mplayer->notes_editor;
>>>>>>> MOODLE_33_STABLE
    $mplayer->notes = $notes['text'];
    $mplayer->notesformat = $notes['format'];

    return $DB->insert_record('mplayer', $mplayer);
}

/**
 * Given an object containing all the necessary data,
 * (defined by the form in mod.html) this function
 * will update an existing instance with new data.
 *
 * @param object $instance An object from the form in mod.html
 * @return boolean Success/Fail
 */
function mplayer_update_instance($mplayer) {
    global $DB;

    $config = get_config('mplayer');

    $mplayer->timemodified = time();
    $mplayer->id = $mplayer->instance;

    if (empty($config->default_player)) {
        set_config('default_player', 'flowplayer', 'mplayer');
        $config->default_player = 'flowplayer';
    }

    if (empty($mplayer->technology)) {
        $mplayer->technology = $config->default_player;
    }

    if (empty($mplayer->autostart)) {
        $mplayer->autostart = 0;
    }

    if (empty($mplayer->fullscreen)) {
        $mplayer->fullscreen = 0;
    }

    if (!empty($mplayer->configxmlgroup['clearconfigxml'])) {
        mplayer_clear_area($mplayer, 'configxml');
    } else {
        $mplayer->configxml = @$mplayer->configxmlgroup['configxml'];
    }

    // Saves draft customization image files into definitive filearea.
    $instancefiles = mplayer_get_fileareas();

    foreach ($instancefiles as $ci) {
        mplayer_save_draft_file($mplayer, $ci);
    }

    // May never arrive if RTMP not enabled.
    if (!empty($mplayer->streamer)) {
        // Get the uploaded mediafile and convert them to remote storage. Set up the stream access URL.
        mplayer_convert_storage_for_streamer($mplayer);
    }

    $notes = $mplayer->notes_editor;
    $mplayer->notes = $notes['text'];
    $mplayer->notesformat = $notes['format'];

    return $DB->update_record('mplayer', $mplayer);
}

/**
 * Given an ID of an instance of this module,
 * this function will permanently delete the instance
 * and any data that depends on it.
 *
 * @param int $id Id of the module instance
 * @return boolean Success/Failure
 */
function mplayer_delete_instance($id) {
    global $DB;

    if (!$mplayer = $DB->get_record('mplayer', array('id' => $id))) {
        return false;
    }
    $result = true;

    if (!$cm = get_coursemodule_from_instance('mplayer', $mplayer->id)) {
        return false;
    }

    $context = context_module::instance($cm->id);

    $fs = get_file_storage();
    $fs->delete_area_files($context->id);

    if (! $DB->delete_records("mplayer", array('id' => $mplayer->id))) {
        $result = false;
    }
    return $result;
}

/**
 * Return a small object with summary information about what a
 * user has done with a given particular instance of this module
 * Used for user activity reports.
 * $return->time = the time they did it
 * $return->info = a short text description
 *
 * @return null
 * @todo Finish documenting this function
 */
function mplayer_user_outline($course, $user, $mod, $mplayer) {

    $return->time = time();
    $return->info = '';

    return $return;
}

/**
 * Print a detailed representation of what a user has done with
 * a given particular instance of this module, for user activity reports.
 *
 * @return boolean
 * @todo Finish documenting this function
 */
function mplayer_user_complete($course, $user, $mod, $mplayer) {
    return true;
}

/**
 * Given a course and a time, this module should find recent activity
 * that has occurred in mplayer activities and print it out.
 * Return true if there was output, or false is there was none.
 *
 * @return boolean
 * @todo Finish documenting this function
 */
function mplayer_print_recent_activity($course, $isteacher, $timestart) {
    // True if anything was printed, otherwise false.
    return false;
}

/**
 *
 *
 * @return array
 */
function mplayer_get_view_actions() {
    return array('view');
}

/**
 *
 * @return array
 */
function mplayer_get_post_actions() {
    return array('update');
}

/**
 * Function to be run periodically according to the moodle cron
 * This function searches for things that need to be done, such
 * as sending out mail, toggling flags etc.
 *
 * @return boolean
 */
function mplayer_cron() {
    return true;
}

/**
 * Serves the files included in mplayer. Implements needed access control ;-)
 *
 * There are several situations in general where the files will be sent.
 * 1) filearea = '',
 *
 * @param object $course
 * @param object $cm
 * @param object $context
 * @param string $filearea
 * @param array $args
 * @param bool $forcedownload
 * @return bool false if file not found, does not return if found - justsend the file
 */
function mplayer_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload) {

    $guests = false;
    if ($course->id > SITEID) {
        $enrols = enrol_get_instances($course->id, true);
        foreach ($enrols as $e) {
            if ($e->enrol == 'guest') {
                $guests = true;
                break;
            }
        }
    }

    if (!$guests) {
        require_login($course);
    }

    if ($context->contextlevel != CONTEXT_MODULE) {
        return false;
    }

    $instancefiles = mplayer_get_fileareas();

    if (!in_array($filearea, $instancefiles)) {
        return false;
    }

    $itemid = (int)array_shift($args);

    $fs = get_file_storage();
    if ($filearea == 'mplayerfiles') {
        // Case for fileareas possibly holding more than one file.
        $relativepath = implode('/', $args);
        $fullpath = "/$context->id/mod_mplayer/$filearea/0/$relativepath";
        if (($file = $fs->get_file_by_hash(sha1($fullpath))) && !$file->is_directory()) {
            send_stored_file($file, 0, 0, $forcedownload);
        }
    } else {
        $sort = 'sortorder, itemid, filepath, filename';
        if ($files = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, $itemid, $sort, false)) {
            $file = array_pop($files);

            // Finally send the file.
            send_stored_file($file, 0, 0, $forcedownload);
        }
    }

    return false;
}

/**
 * Must return an array of grades for a given instance of this module,
 * indexed by user.  It also returns a maximum allowed grade.
 *
 * Example:
 *    $return->grades = array of grades;
 *    $return->maxgrade = maximum allowed grade;
 *
 *    return $return;
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed Null or object with an array of grades and with the maximum grade
 */
function mplayer_grades($mplayerid) {
    return null;
}

/**
 * Must return an array of user records (all data) who are participants
 * for a given instance of mplayer. Must include every user involved
 * in the instance, independient of his role (student, teacher, admin...)
 * See other modules as example.
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed boolean/array of students
 */
function mplayer_get_participants($mplayerid) {
    return false;
}

/**
 * This function returns if a scale is being used by one mplayer
 * it it has support for grading and scales. Commented code should be
 * modified if necessary. See forum, glossary or journal modules
 * as reference.
 *
 * @param int $mplayerid ID of an instance of this module
 * @return mixed
 * @todo Finish documenting this function
 */
function mplayer_scale_used($mplayerid, $scaleid) {
    $return = false;

    return $return;
}

/**
 * Checks if scale is being used by any instance of mplayer.
 * This function was added in 1.9
 *
 * This is used to find out if scale used anywhere
 * @param $scaleid int
 * @return boolean True if the scale is used by any mplayer
 */
function mplayer_scale_used_anywhere($scaleid) {
    return false;
}

/**
 * Obtains the automatic completion state for this module based on any conditions
 * in mplayer settings.
 *
 * @param object $course Course
 * @param object $cm Course-module
 * @param int $userid User ID
 * @param bool $type Type of comparison (or/and; can be used as return value if no conditions)
 * @return bool True if completed, false if not, $type if conditions not set.
 */
function mplayer_get_completion_state($course, $cm, $userid, $type) {
    global $DB;

    $mplayerinstance = $DB->get_record('mplayer', array('id' => $cm->instance));

    $result = $type; // Default return value.

    // If completion option is enabled, evaluate it and return true/false.
    if (@$mplayerinstance->completionmediaviewed) {
        $params = array('userid' => $userid, 'mplayerid' => $cm->instance, 'finished' => 1);
        $finished = $DB->count_records('mplayer_userdata', $params);
        if ($type == COMPLETION_AND) {
            $result = $result && $finished;
        } else {
            $result = $result || $finished;
        }
    } else {
        // Completion option is not enabled so just return $type.
        return $type;
    }

    return $result;
}
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
>>>>>>> MOODLE_33_STABLE
