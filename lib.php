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

// Can be used event if not installed. this is just an alias definition.
use format_page\course_page;

/**
 * This function is not implemented in this plugin, but is needed to mark
 * the vf documentation custom volume availability.
 */
function mplayer_supports_feature($feature = null, $getsupported = false) {
    global $CFG;
    static $supports;

    if (!during_initial_install()) {
        $config = get_config('mplayer');
    }

    if (!isset($supports)) {
        $supports = array(
            'pro' => array(
                'assessables' => array('highlightzones'),
            ),
            'community' => array(
            ),
        );
    }

    if (!empty($getsupported)) {
        return $supports;
    }

    // Check existance of the 'pro' dir in plugin.
    if (is_dir(__DIR__.'/pro')) {
        if ($feature == 'emulate/community') {
            return 'pro';
        }
        if (empty($config->emulatecommunity)) {
            $versionkey = 'pro';
        } else {
            $versionkey = 'community';
        }
    } else {
        $versionkey = 'community';
    }

    if (empty($feature)) {
        // Just return version.
        return $versionkey;
    }

    list($feat, $subfeat) = explode('/', $feature);

    if (!array_key_exists($feat, $supports[$versionkey])) {
        return false;
    }

    if (!in_array($subfeat, $supports[$versionkey][$feat])) {
        return false;
    }

    return $versionkey;
}

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
        case FEATURE_MOD_PURPOSE:{
            return MOD_PURPOSE_CONTENT;
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

    /*
    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm);
    */

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

    // May never occur if RTMP not enabled.
    if (!empty($mplayer->streamer)) {
        // Get the uploaded video mediafiles and move them to wooza storage.
        mplayer_convert_storage_for_streamer($mplayer);
    }

    if (empty($mplayer->technology)) {
        $mplayer->technology = $config->default_player;
    }

    if (isset($mplayer->notes_editor)) {
        $notes = $mplayer->notes_editor;
        $mplayer->notes = $notes['text'];
        $mplayer->notesformat = $notes['format'];
        unset($mplayer->notes_editor);
    }


    mplayer_pack_attributes($mplayer);

    // mplayer_get_clips($mplayer, $context);

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
    $oldrecord = $DB->get_record('mplayer', ['id' => $mplayer->id]);

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

    if (empty($mplayer->completionmediaviewed)) {
        $mplayer->completionmediaviewed = 0;
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

    // Clean up consequences of changes.
    if ($oldrecord->numpasspoints != $mplayer->numpasspoints) {
        // Delete all unfinished tracks to update clip tracks to new contraints.
        $DB->delete_records('mplayer_userdata', ['mplayerid' => $mplayer->id, 'finished' => 0]);
    }

    mplayer_pack_attributes($mplayer);
    $context = context_module::instance($mplayer->coursemodule);
    mplayer_get_clips($mplayer, $context);

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
    global $CFG;

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

    if ($course->format == 'page') {
        /*
         * In page format, some pages may not require login. Just check the customlabel
         * is accessible to the user (no mater pages are or not).
         */
        require_once($CFG->dirroot.'/course/format/page/lib.php');

        if (!course_page::check_page_public_accessibility($course)) {
            require_course_login($course, true, $cm);
        }
    } else {
        if (!$guests) {
            require_course_login($course, true, $cm);
        }
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
 * Course reset form defaults.
 * @return array
 */
function mplayer_reset_course_form_defaults($course) {
    return array('reset_mplayer_all' => 1);
}

/**
 * Called by course/reset.php
 *
 * @param $mform form passed by reference
 */
function mplayer_reset_course_form_definition(&$mform) {
    $mform->addElement('header', 'mplayerheader', get_string('modulenameplural', 'mplayer'));
    $mform->addElement('checkbox', 'reset_mplayer_all', get_string('resetmplayerstates', 'mplayer'));
}

/**
 * This function is used by the reset_course_userdata function in moodlelib.
 * This function will remove all posts from the specified forum
 * and clean up any related data.
 *
 * @global object
 * @global object
 * @param $data the data submitted from the reset course.
 * @return array status array
 */
function mplayer_reset_userdata($data) {
    global $DB;

    $componentstr = get_string('modulenameplural', 'mplayer');
    $status = array();

    $allmplayersql = "
        SELECT
            mp.id
        FROM
            {mplayer} mp
        WHERE
            mp.course = ?
    ";

    // Remove all states even for users still enrolled in course.
    if (!empty($data->reset_mplayer_all)) {
        $params = array($data->courseid);
        $DB->delete_records_select('mplayer_userdata', " mplayerid IN ($allmplayersql) ", $params);
        $status[] = array('component' => $componentstr,
                          'item' => get_string('resetmplayerstates', 'mplayer'),
                          'error' => false);
    }

    return $status;
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

    $context = context_module::instance($cm->id);

    if (!empty($mplayerinstance->completionmediaviewed) || !empty($mplayerinstance->completionallmediaviewed)) {

        if (strpos($mplayerinstance->technology, 'flowplayer') === 0) {
            $clips = mplayer_get_clips($mplayerinstance, $context);
        } else {
            $clips = jwplayer_get_clips($mplayerinstance, $context);
        }

        $params = array('userid' => $userid, 'mplayerid' => $cm->instance);
        $cliprecords = $DB->get_records('mplayer_userdata', $params, 'clipid', 'clipid, finished');
    }

    // If completion option is enabled, evaluate it and return true/false.
    $finished = false;

    if (!empty($mplayerinstance->completionmediaviewed)) {
        $finished = false;
        foreach ($cliprecords as $rec) {
            if ($rec->finished) {
                $finished = true;
                break;
            }
        }
        $result = $finished;
    }

    if (!empty($mplayerinstance->completionallmediaviewed)) {
        $finished = true;
        foreach (array_keys($clips) as $clipid) {
            if (!array_key_exists($clipid, $cliprecords) || !$cliprecords[$clipid]->finished) {
                $finished = false;
                break;
            }
        }
        $result = $finished;
    }

    return $result;
}

function mplayer_view($mplayer, $course, $cm, $context) {

    // Completion.
    $completion = new completion_info($course);
    $completion->set_module_viewed($cm);

    // Trigger course_module_viewed event.

    $params = array(
        'context' => $context,
        'objectid' => $mplayer->id
    );

    $event = \mod_mplayer\event\course_module_viewed::create($params);
    $event->add_record_snapshot('course_modules', $cm);
    $event->add_record_snapshot('course', $course);
    $event->add_record_snapshot('mplayer', $mplayer);
    $event->trigger();
}

/**
 * M4 secondary navigation
 */
function mplayer_extend_settings_navigation(settings_navigation $settingsnav, navigation_node $mplayernode) {
    if (has_capability("mod/mplayer:assessor", $settingsnav->get_page()->context)) {
        $params = ['id' => $settingsnav->get_page()->cm->id];
        $reportlink = new moodle_url("/mod/mplayer/report.php", $params);
        $mplayernode->add(get_string('reports'), $reportlink, navigation_node::TYPE_CONTAINER);
    }
}