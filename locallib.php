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
 * For more information on the parameters used by JW FLV Player see documentation: http://developer.longtailvideo.com/trac/wiki/FlashVars
 *
 * @package  mod_mplayer
 * @category mod
 * @author   Matt Bury - matbury@gmail.com
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @licence  http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

define('MPLAYER_NO_ASSESS', 0);
define('MPLAYER_ASSESS_FIND_ZONES', 1);
define('MPLAYER_ASSESS_MATCH_ZONES', 2);

/**
 *
 */
function mplayer_get_context() {
    global $DB;

    $id = optional_param('id', 0, PARAM_INT); // Course Module ID, or.
    $a  = optional_param('a', 0, PARAM_INT); // Mplayer ID.

    if ($id) {
        if (! $cm = $DB->get_record('course_modules', array('id' => $id))) {
            print_error('invalidcoursemodule');
        }
        if (! $course = $DB->get_record('course', array('id' => $cm->course))) {
            print_error('coursemisconf');
        }
        if (! $mplayer = $DB->get_record('mplayer', array('id' => $cm->instance))) {
            print_error('invalidmplayerid', 'mplayer');
        }
    } else {
        if (! $mplayer = $DB->get_record('mplayer', array('id' => $a))) {
            print_error('invalidmplayerid', 'mplayer');
        }
        if (! $course = $DB->get_record('course', array('id' => $mplayer->course))) {
            print_error('coursemisconf');
        }
        if (! $cm = get_coursemodule_from_instance('mplayer', $mplayer->id, $course->id)) {
            print_error('invalidcoursemodule');
        }
    }

    mplayer_unpack_attributes($mplayer);

    return array($cm, $course, $mplayer);
}

/**
 * Saves all draft files received from instance setup
 * @param objectref &$mplayer
 * @param string $filearea name of a filearea to process for saving
 */
function mplayer_save_draft_file(&$mplayer, $filearea) {
    global $USER;
    static $fs;

    if (empty($mplayer->coursemodule)) {
        return;
    }

    $usercontext = context_user::instance($USER->id);
    $context = context_module::instance($mplayer->coursemodule);

    if (!isset($mplayer->$filearea)) {
        return;
    }

    $filepickeritemid = $mplayer->$filearea;

    if (!$filepickeritemid) {
        return;
    }

    if (empty($fs)) {
        $fs = get_file_storage();
    }

    $mplayer->$filearea = 0;
    $subdirs = ($filearea == 'mplayerfiles') ? true : false;
    if (!$fs->is_area_empty($usercontext->id, 'user', 'draft', $filepickeritemid, false)) {
        $options = array('subdirs' => $subdirs);
        file_save_draft_area_files($filepickeritemid, $context->id, 'mod_mplayer', $filearea, 0, $options);
        if ($savedfiles = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, 0)) {
            $savedfile = array_pop($savedfiles);
            $mplayer->$filearea = $savedfile->get_id();
        }
    }
}

/**
 * Gives the physical file location of a complementary file
 * stored into mplayer fileareas.
 * @param objectref &$mplayer
 * @param string $filearea name of a filearea to process for saving
 * @param object $context give the module context if already available on call. It will be reprocessed if not given.
 */
function mplayer_get_file_location(&$mplayer, $filearea, $context = null) {
    global $CFG;

    $url = false;

    // If not provided.
    if (is_null($context)) {
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);
    }

    $fs = get_file_storage();

    if (!$fs->is_area_empty($context->id, 'mod_mplayer', $filearea, 0, true)) {
        if ($areafiles = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, 0)) {
            $storedfile = array_pop($areafiles);
            $contenthash = $storedfile->get_contenthash();
            $l1 = $contenthash[0].$contenthash[1];
            $l2 = $contenthash[2].$contenthash[3];
            return $CFG->dataroot.'/filedir/'.$l1.'/'.$l2.'/'.$contenthash;
        }
    }
    return false;
}

/**
 * Get dynamically a remote file and store it. If the play list changes at remote endpoint,
 * changes will be immediately reported.
 * @return a local temp location of the file.
 */

function mplayer_load_remote_file($mplayer, $url, $context) {

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Moodle Media Player');
    curl_setopt($ch, CURLOPT_POSTFIELDS, '');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/xml charset=UTF-8"));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $raw = curl_exec($ch);

    // Check for curl errors.
    $curlerrno = curl_errno($ch);
    if ($curlerrno != 0) {
        debugging("Request for $uri failed with curl error $curlerrno");
        return;
    }

    // Check HTTP error code.
    $info = curl_getinfo($ch);
    if (!empty($info['http_code']) and ($info['http_code'] != 200)) {
        debugging("Request for $uri failed with HTTP code ".$info['http_code']);
        return;
    } else {
        $fs = get_file_storage();
        $filerec = new StdClass();
        $filerec->contextid = $context->id;
        $filerec->component = 'mod_mplayer';
        $filerec->filearea = 'remoteplaylist';
        $filerec->itemid = 0;
        $filerec->filepath = '/';
        $filerec->filename = 'playlist.xml';
        $fs->create_file_from_string($filerec, $raw);
    }
}

/**
 * Gives the file url of a complementary file
 * stored into mplayer fileareas.
 * @param objectref &$mplayer the mplayer instance
 * @param string $filearea where to look in
 * @param object $context if available the related context object.
 * @param boolean $array if true, gives the URL table of all files found in this area, if false, gives the first available file.
 * @return mixed, array or single URL as string
 */
function mplayer_get_file_url(&$mplayer, $filearea, $context = null, $path = '/', $array = false) {
    global $CFG;

    $url = false;

    // If not provided.
    if (is_null($context)) {
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);
    }

    $fs = get_file_storage();

    if (!$fs->is_area_empty($context->id, 'mod_mplayer', $filearea, 0, true)) {
        $order = 'itemid, filepath, filename';
        if ($areafiles = $fs->get_directory_files($context->id, 'mod_mplayer', $filearea, 0, $path, true, false, $order)) {
            if ($array) {
                $url = array();
                foreach ($areafiles as $storedfile) {
                    $linkurl = $CFG->wwwroot.'/pluginfile.php/'.$context->id.'/mod_mplayer/'.$filearea.'/0';
                    $linkurl .= $storedfile->get_filepath().$storedfile->get_filename();
                    $url[] = $linkurl;
                }
            } else {
                $storedfile = array_pop($areafiles);
                $url = $CFG->wwwroot.'/pluginfile.php/'.$context->id.'/mod_mplayer/'.$filearea.'/0';
                $url .= $storedfile->get_filepath().$storedfile->get_filename();
            }
        }
    }
    return $url;
}

/**
 * Get clip information from any possible source
 *
 * @param objectref &$mplayer
 * @param object $context
 * @return an array of arrays as source definitions per clip
 */
function mplayer_get_clips(&$mplayer, $context) {

    if (empty($mplayer->clipscache)) {

        // These are alternate playlist resolutions in case we are NOT using an XML formal playlist.
        $clips = array();

        if (debugging() && !empty($config->displaydebugcode)) {
            echo "making $mplayer->type playlist";
        }
        switch ($mplayer->type) {
            case 'xml':
            case 'xmlrtmp': {
                // The playlist file has been uploaded.
                $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
                $context = context_module::instance($cm->id);
                if (($playlistfile = mplayer_get_file_location($mplayer, 'playlistfiles', $context, '/playlist/'))) {
                    $clips = mplayer_xml_playlist($mplayer, $playlistfile);
                }
                break;
            }

            case 'httpxml':
            case 'httpxmlrtmp': {
                /* The playlist file is obtained from an external URL and stored into a special filearea.
                 * this filearea is NOT backuped and reloaded each time the media is accessed.
                 * TODO : Possibly add a hold time of the playlist.
                 *
                 * In RTMP case, the play list should contain stream references
                 */
                mplayer_load_remote_file($mplayer->external);
                $playlistfile = mplayer_get_file_location($mplayer, 'remoteplaylist', $context);
                $clips = mplayer_xml_playlist($mplayer, $playlistfile);
                break;
            }

            case 'rtmp':
            case 'video': {
                /* Video stores files into moodle filestore directly, with eventual thumbs
                 * In RTMP case sources can be :
                 * - local rtmp proxies stored into the local storage (.stm files)
                 */
                $clips = mplayer_get_clips_from_files($mplayer);
                break;
            }

            case 'url':
            case 'youtube': {
                // In that case, one clip per URL. No alternate sources possible.
                if (!empty($mplayer->external)) {
                    $sources = explode(';', $mplayer->external);
                    $ix = 0;
                    foreach ($sources as $source) {
                        $clip = new StdClass();
                        $clip->sources[] = $source;
                        $clips[$ix] = $clip;
                        $ix++;
                    }
                }
                break;
            }

            default:
                $mplayer->clipscache = null;
        }

        $mplayer->clipscache = json_encode($clips);
    }

    return json_decode($mplayer->clipscache);
}

/**
 * Get clips from loaded files depending on their organisation
 * Following rules are checked :
 * if a filename starts with <n>_ then the file url is assigned to clip <n> as a source.
 * if a file is in a subpath named <n> then the file is assigned to clip <n>.
 * if not matching any of above, goes to clip 0
 * @param objectref &$mplayer the mplayer instance
 * @param string $filearea where to look in
 * @param object $context if available the related context object.
 * @param boolean $array if true, gives the URL table of all files found in this area, if false, gives the first available file.
 * @return mixed, array or single URL as string
 */
function mplayer_get_clips_from_files(&$mplayer) {
    global $CFG;

    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm->id);

    $clips = array();
    $fs = get_file_storage();

    if (!$fs->is_area_empty($context->id, 'mod_mplayer', 'mplayerfiles', 0, true)) {
        // Get sources and fill clip array with.
        $order = 'filepath, filename';
        if ($areafiles = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/medias/', true, false, $order)) {
            if (count($areafiles) > 0) {
                // If we do have some media files.
                foreach ($areafiles as $storedfile) {

                    /*
                     * Process each entry. an entry can be at root level and thus is a clip 0 source, or
                     * may be in a numbered subdir and will be registered for the corresponding clip.
                     */
                    $filepath = $storedfile->get_filepath();
                    $filename = $storedfile->get_filename();
                    if ($filepath == '/medias/') {
                        $ix = 0;
                    } else if (preg_match('#^/medias/(\d+)#', $filepath, $matches)) {
                        $ix = $matches[1];
                    } else {
                        // Ignore
                        continue;
                    }

                    $contenthash = $storedfile->get_contenthash();
                    $l1 = $contenthash[0].$contenthash[1];
                    $l2 = $contenthash[2].$contenthash[3];
                    $physicallocation = $CFG->dataroot.'/filedir/'.$l1.'/'.$l2.'/'.$contenthash;

                    if (preg_match('/\.stm$/', $filename)) {
                        // This is a stream manifest. Get url from it.
                        $streamedobj = simplexml_load_file($physicallocation);

                        if (!$streamedobj) {
                            // Manifest not readable. Continue.
                            continue;
                        }

                        if (!empty($streamedobj->clip)) {
                            $ix = $streamedobj->clip;
                        }
                        $url = ''.$streamedobj->stream;
                        $duration = -1; // unkown;
                    } else {
                        // Normal local case.
                        $url = moodle_url::make_pluginfile_url($context->id, 'mod_mplayer', 'mplayerfiles', 0, $filepath, $filename);
                        $videoinfo = mplayer_ffmpeg_info($physicallocation);
                        $duration = $videoinfo['durationSecond'];
                    }

                    /*
                     * At the moment, just one source effectively supported.
                     */
                    $clip = new Stdclass();
                    $clip->sources[] = $url->out();
                    $clip->locations[] = $physicallocation;
                    $clip->duration = $duration;
                    $clip->title = '';

                    $clips[$ix] = $clip;
                }
            }
        }

        if (!empty($mplayer->playlist)) {

            if ($mplayer->playlist == 'thumbs') {
                // Get thumbs and fill clip array with.
                if ($thumbfiles = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/thumbs/', true, false,
                                                           'filepath, filename')) {
                    if (count($areafiles) > 0) {
                        // If we do have some media files.
                        foreach ($thumbfiles as $storedfile) {

                            /*
                             * Process each entry. an entry can be at root level and thus is a clip 0 source, or
                             * may be in a numbered subdir and will be registered for the corresponding clip.
                             */
                            $filepath = $storedfile->get_filepath();
                            $filename = $storedfile->get_filename();
                            if ($filepath == '/thumbs/') {
                                $ix = 0;
                            } else if (preg_match('#^/thumbs/(\d+)#', $filepath, $matches)) {
                                $ix = $matches[1];
                            } else if (preg_match('#^(\d+)#', $filename, $matches)) {
                                $ix = $matches[1];
                            } else {
                                // Ignore.
                                continue;
                            }
                            if (array_key_exists($ix, $clips)) {
                                $clips[$ix]->thumb = moodle_url::make_pluginfile_url($context->id, 'mod_mplayer', 'mplayerfiles', 0,
                                                                                     $storedfile->get_filepath(),
                                                                                     $storedfile->get_filename());
                            }
                        }
                    }
                }
            }
        }
    }

    // Open captions file and get clip titles from caption. there should be only one file.
    if ($captionfiles = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/captions/', true, false,
                                                 'filepath, filename')) {
        $captionfile = array_pop($captionfiles);
        $captions = $captionfile->get_content();
        $titlearray = explode("\n", $captions);
        $ix = 0;
        foreach ($titlearray as $t) {
            if (is_object($clips[$ix])) {
                $clips[$ix]->title .= $t;
            }
            $ix++;
        }
    }

    return $clips;
}

/**
 * Get the internal "clips" model for jwplayer.
 */
function jwplayer_get_clips(&$mplayer, $context) {
    switch ($mplayer->type) {

        case 'video':
        case 'sound': {
            $urlarray = mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/medias/0/', true);
            break;
        }

        case 'url': {
            // $urlarray = explode(';', ' ;' . $mplayer->external);
            $urlarray = explode(';', $mplayer->external);
            break;
        }

        case 'youtube': {
            $urlarray = explode(';', $mplayer->external);
            break;
        }

        default:
            $urlarray = array();
    }

    $playlistthumb = mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/thumbs/', true);
    $playlist = array();

    if (is_array($urlarray)) {
        foreach ($urlarray as $index => $url) {
            if ($index !== '' && $url) {
                $playlistitem = new StdClass;
                $playlistitem->file = $url;
                $playlistitem->image = isset($playlistthumb[$index]) ? $playlistthumb[$index] : '';
                $playlistitem->title = 'test';
                $playlist[] = $playlistitem;
            }
        }
    }

    return $playlist;
}

/**
 * As an alternative from using internal files, you may parse an xml playlist file and
 * get all clips information from it
 * @param objectref &$mplayer the mplayer instance
 * @param string $playlistfile the path of a file inthe file system from where to read XML
 */
function mplayer_xml_playlist(&$mplayer, $playlistfile) {

    $playlistobj = simplexml_load_file($playlistfile);

    $clips = array();

    if (!$playlistobj) {
        // Not readable XML file.
        return false;
    }

    $ix = 0;
    foreach ($playlistobj->trackList->track as $videoinfo) {
        // TODO : process multiple locations in a track as alternative sources.
        $clip = new StdClass();
        $clip->sources[] = $videoinfo->location;
        if (isset($videoinfo->duration)) {
            $clip->duration = $videoinfo->duration;
        } else {
            $clip->duration = -1; // Unknown.
        }
        $listitemcontent = '';
        if ($mplayer->playlist == 'thumbs') {
            if (isset($videoinfo->thumb)) {
                $clip->thumb = ''.$videoinfo->thumb;
            }
        } else if ($mplayer->playlist == 'dots') {
            // Let have thumbs, but let the CSS to the trick.
            $clip->thumb = '';
        } else {
            assert(1);
            // No thumbs at all.
        }

        // Accepts two alternate caption attributes.
        if (isset($videoinfo->caption)) {
            $clip->title = $videoinfo->caption;
        } else if (isset($videoinfo->title)) {
            $clip->title = $videoinfo->title;
        }

        $clips[$ix] = $clip;
        $ix++;
    }

    return($clips);
}

/**
 * Clears a full area in a mplayer
 * @param objectref &$mplayer the mplayer instance
 * @param string $filearea the filearea name.
 */
function mplayer_clear_area(&$mplayer, $filearea, $context = null) {

    if ($context->contextlevel != CONTEXT_MODULE || $context->instance != $mplayer->id) {
        throw new CodingException('Context does not match given mplayer instance.');
    }

    if (!$cm = get_coursemodule_from_instance('mplayer', $mplayer->id)) {
        return false;
    }

    if (!$context) {
        $context = context_module::instance($cm->id);
    }

    $fs = get_file_storage();
    $fs->delete_area_files($context->id, 'mod_mplayer', $filearea);
}

/**
 * Get suitable javascript.
 * @param string $mode 'require' or 'script'.
 * @return void if require, script tag
 */
function mplayer_require_js($mplayer, $mode) {
    global $PAGE, $CFG;
    static $jsloaded = false;

    if ($mplayer->technology == 'jw') {
        if (debugging()) {
            $jsplayerfile = '/mod/mplayer/extralib/players/jw/8.0/bin-debug/jwplayer.js';
        } else {
            $jsplayerfile = '/mod/mplayer/extralib/players/jw/8.0/bin-release/jwplayer.js';
        }
        $completionfile = '/mod/mplayer/js/completion_jw.js';
    } else if ($mplayer->technology == 'jw712') {
        if (debugging()) {
            $jsplayerfile = '/mod/mplayer/extralib/players/jw/7.12/bin-debug/jwplayer.js';
        } else {
            // Release has a bug in calculating the map unique id.
            // $jsplayerfile = '/mod/mplayer/jw/7.12/bin-release/jwplayer.js';
            $jsplayerfile = '/mod/mplayer/extralib/players/jw/7.12/bin-debug/jwplayer.js';
        }
        $completionfile = '/mod/mplayer/js/completion_jw.js';
    } else if ($mplayer->technology == 'jw611') {
        $jsplayerfile = '/mod/mplayer/extralib/players/jw/6.11/jwplayer.js';
        $completionfile = '/mod/mplayer/js/completion_jw.js';
    } else if ($mplayer->technology == 'flowplayer8') {
        //cdn.flowplayer.com/releases/native/stable/flowplayer.min.js
        $flowplayercuejscode = '/mod/mplayer/js/cuepoints.js';
        $flowplayerjswrapper = '/mod/mplayer/js/flowplayer.js';
        $flowplayercss = '/mod/mplayer/extralib/players/flowplayer7/skin/skin.css';
    } else {
        $flowplayercuejscode = '/mod/mplayer/js/cuepoints.js';
        $flowplayerjswrapper = '/mod/mplayer/js/flowplayer.js';
        $flowplayercss = '/mod/mplayer/extralib/players/flowplayer6/skin/functional.css';
        if (debugging()) {
            $jsplayerfile = '/mod/mplayer/extralib/players/flowplayer6/flowplayer.js';
        } else {
            $jsplayerfile = '/mod/mplayer/extralib/players/flowplayer6/flowplayer.min.js';
        }
        $completionfile = '/mod/mplayer/js/completion.js';
    }

    if ($mode == 'require') {
        $PAGE->requires->js($jsplayerfile, true);
        $PAGE->requires->js($completionfile, true);
        $jsloaded[$mplayer->technology] = true;
    } else {
        if (empty($jsloaded[$mplayer->technology])) {
            if ($mplayer->technology == 'flowplayer8') {
                $jsfragment = '<script src="//cdn.flowplayer.com/releases/native/stable/flowplayer.min.js" type="text/javascript"></script>';
                $jsfragment .= '<script src="//cdn.flowplayer.com/releases/native/stable/plugins/playlist.min.js" type="text/javascript"></script>';
                $jsfragment .= '<script src="//cdn.flowplayer.com/releases/native/stable/plugins/cuepoints.min.js" type="text/javascript"></script>';
                $jsfragment .= '<script src="'.$CFG->wwwroot.$flowplayercuejscode.'" type="text/javascript"></script>';
                $jsfragment .= '<script src="'.$CFG->wwwroot.$flowplayerjswrapper.'" type="text/javascript"></script>';
                $cssfragment = '<link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.$flowplayercss.'">';
                return $jsfragment.$cssfragment;
            }
            $jsloaded[$mplayer->technology] = true;
            $jsfragment = '<script src="'.$CFG->wwwroot.$jsplayerfile.'" type="text/javascript"></script>';
            $jsfragment .= '<script src="'.$CFG->wwwroot.$completionfile.'" type="text/javascript"></script>';
            $cssfragment = '';
            if ($mplayer->technology == 'flowplayer') {
                if (isset($jsplayerplaylistfile)) {
                    $jsfragment .= '<script src="'.$CFG->wwwroot.$jsplayerplaylistfile.'" type="text/javascript"></script>';
                }
                $jsfragment .= '<script src="'.$CFG->wwwroot.$flowplayercuejscode.'" type="text/javascript"></script>';
                $jsfragment .= '<script src="'.$CFG->wwwroot.$flowplayerjswrapper.'" type="text/javascript"></script>';
                $cssfragment .= '<link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.$flowplayercss.'">';
            }
            return $jsfragment.$cssfragment;
        }
    }
}

/**
 * Get all file areas used in module
 */
function mplayer_get_fileareas() {
    return array('mplayerfiles', 'configxml', 'audiodescriptionfile', 'captionsfile', 'hdfile', 'livestreamfile',
                 'livestreamimagefile', 'logoboxfile', 'logofile');
}

/**
 * Construct Javascript mplayerObject embed code for <head> section of view.php
 * Please note: some URLs append a '?'.time(); query to prevent browser caching
 *
 * @param $mplayer (mdl_mplayer DB record for current mplayer module instance)
 * @return string
 */
function mplayer_print_header_js($mplayer) {
    global $CFG;

    // Build Javascript code for view.php print_header() function.

    $js = '<script type="text/javascript" src="'.$CFG->wwwroot.'/mod/mplayer/extralib/players/swfobject/swfobject.js"></script>';
    $js .= '    <script type="text/javascript">';
    $js .= '        swfobject.registerObject("jwPlayer", "'.$mplayer->fpversion.'");';
    $js .= '    </script>';
    $js .= '// Don\'t show default dotted outline around Flash Player window in Firefox 3.';
    $js .= '<style type="text/css" media="screen">';
    $js .= '    object { outline:none; }';
    $js .= '</style>';

    return $js;
}

/* functions for Form */

/**
 * true/false options
 * @return array
 */
function mplayer_list_truefalse() {
    return array('true' => get_string('yes'),
                 'false' => get_string('no'));
}

/**
 * true/false options
 * @return array
 */
function mplayer_list_quality() {
    return array('best' => get_string('best', 'mplayer'),
                 'high' => get_string('high', 'mplayer'),
                 'medium' => get_string('medium', 'mplayer'),
                 'autohigh' => get_string('autohigh', 'mplayer'),
                 'autolow' => get_string('autolow', 'mplayer'),
                 'low' => get_string('low', 'mplayer'));
}


function mplayer_list_showpasspoints() {
    $showoptions = array(
        '0' => get_string('hidetracking', 'mplayer'),
        '1' => get_string('showall', 'mplayer'),
        '2' => get_string('hidepasspoints', 'mplayer'),
        '3' => get_string('showclipstates', 'mplayer'),
    );
    return $showoptions;
}

/**
 * Define target of link when user clicks on 'link' button
 * @return array
 */
function mplayer_list_linktarget() {
    return array('_blank' => get_string('newwindow', 'mplayer'),
                 '_self' => get_string('samepage', 'mplayer'),
                 'none' => get_string('none', 'mplayer'));
}

/**
 * Define type of media to serve
 * @return array
 */
function mplayer_list_type($technology) {

    if (in_array($technology, array('jw712', 'jw611'))) {
        return array('video' => get_string('video', 'mplayer'),
                     'youtube' => get_string('youtube', 'mplayer'),
                     'url' => get_string('fullurl', 'mplayer'),
                     'xml' => get_string('xmlplaylist', 'mplayer'),
                     'sound' => get_string('sound', 'mplayer'),
                     'image' => get_string('stillimage', 'mplayer'),
                     'http' => get_string('httppseudostreaming', 'mplayer'),
                     'lighttpd' => get_string('lighthttpdstreaming', 'mplayer'),
                     'rtmp' => get_string('rtmpstreaming', 'mplayer'));
    } else if ($technology == 'jw') {
        // No more support for youtube nor RTMP.
        return array('video' => get_string('video', 'mplayer'),
                     'url' => get_string('fullurl', 'mplayer'),
                     'xml' => get_string('xmlplaylist', 'mplayer'),
                     'sound' => get_string('sound', 'mplayer'),
                     'image' => get_string('stillimage', 'mplayer'),
                     'http' => get_string('httppseudostreaming', 'mplayer'),
                     'lighttpd' => get_string('lighthttpdstreaming', 'mplayer'));
    } else {
        return array('video' => get_string('video', 'mplayer'),
                     'url' => get_string('fullurl', 'mplayer'),
                     'xml' => get_string('xmlplaylist', 'mplayer'),
                     'httpxml' => get_string('httpxmlplaylist', 'mplayer'),
                     'xmlrtmp' => get_string('rtmpxmlplaylist', 'mplayer'),
                     'xmlhttprtmp' => get_string('rtmphttpxmlplaylist', 'mplayer'),
                     'rtmp' => get_string('rtmpstreaming', 'mplayer'));
    }
}

/**
 * Define available technologies. We keep 6.11 for reference.
 * @return array
 */
function mplayer_list_technologies() {

    return array(
        'flowplayer' => 'Flowplayer 7',
        'flowplayer8' => 'Flowplayer 8 (Using flowplayer CDN - Non free - Experimental)',
        'jw' => 'JW Player 8.0',
        'jw712' => 'JW Player 7.12 (Youtube compatible)',
                 /* 'jw611' => 'JW Player 6.11 (Youtube compatible)' */
    );
}

/**
 * Define available possibilities for subtitle behaviour
 * @return array
 */
function mplayer_list_langchoiceoptions() {

    return array(0 => get_string('langcourse', 'mplayer'),
        1 => get_string('languser', 'mplayer'),
        2 => get_string('langfreechoice', 'mplayer'),
        3 => get_string('langteacherchoice', 'mplayer'),
    );
}

/**
 * Define available possibilities for subtitle behaviour
 * @return array
 */
function mplayer_list_availablelangoptions() {

    /*
     * This is a first approach that takes only activated languages in Moodle. Other languages
     * Will be ignored.
     * TODO : Extend language choice to wider list.
     */
    return get_string_manager()->get_list_of_translations();
}

/**
 * HTTP streaming (Xmoov-php) not yet working!
 *
 * For Lighttpd streaming or RTMP (Flash Media Server or Red5),
 * enter the path to the gateway in the corresponding empty quotes
 * and uncomment the appropriate lines
 * e.g. 'path/to/your/gateway.jsp' => 'RTMP');
 *
 * For RTMP streaming, uncomment and edit this line: //, 'rtmp://yourstreamingserver.com/yourmediadirectory' => 'RTMP'
 * to reflect your streaming server's details. It's probably a good idea to change the 'RTMP' bit to the name
 * of your streaming service,
 * i.e. 'My Media Server' or 'Acme Media Server'.
 * Remember not to include the ".mplayer" file extensions in video file names when using RTMP.
 * @return array
 */
function mplayer_list_streamer() {

    $config = get_config('mplayer');

    return array('' => get_string('none', 'mplayer'),
                 'http' => get_string('apacheh264', 'mplayer'),
                 'wowza' => get_string('wowza', 'mplayer'));
}

/**
 * List array of available search scripts
 * None are provided as yet.
 * @return array
 */
function mplayer_list_searchbarscript() {

    return array('' => get_string('none', 'mplayer'),
                 'http://gdata.youtube.com/feeds/api/videos?vq=QUERY&format=5' => get_string('youtubesearch', 'mplayer'));
}

/**
 * List array of available search scripts
 * None are provided as yet.
 * @return array
 */
function mplayer_list_snapshotscript() {
    global $CFG;

    return array('none' => 'none',
                 $CFG->wwwroot.'/mod/mplayer/scripts/snapshot.php' => 'Demo Snapshot Script'
    );
}

/**
 * Define position of player control bar
 * @return array
 */
function mplayer_list_controlbar() {
    return array('bottom' => get_string('bottom', 'mplayer'),
                 'over' => get_string('over', 'mplayer'),
                 'none' => get_string('none', 'mplayer'));
}

/**
 * Define position of playlist (JWPlayer only)
 * @return array
 */
function mplayer_list_playlistposition() {
    return array('bottom' => get_string('bottom', 'mplayer'),
                 'right' => get_string('right', 'mplayer'),
                 'over' => get_string('over', 'mplayer'),
                 'none' => get_string('none', 'mplayer'));
}

/**
 * Define position of playlist (Flowplayer only)
 * @return array
 */
function mplayer_list_playliststyles() {
    return array('' => get_string('none', 'mplayer'),
                 'dots' => get_string('dots', 'mplayer'),
                 'thumbs' => get_string('thumbs', 'mplayer'));
}

/**
 * Define position of infobox
 * @return array
 */
function mplayer_list_infoboxposition() {
    return array('none' => get_string('none', 'mplayer'),
                 'bottom' => get_string('bottom', 'mplayer'),
                 'over' => get_string('over', 'mplayer'),
                 'top' => get_string('top', 'mplayer'));
}

/**
 * Define logobox align
 * @return array
 */
function mplayer_list_logoboxalign() {
    return array('left' => get_string('left', 'mplayer'),
                 'right' => get_string('right', 'mplayer'));
}

/**
 * Define position of metaviewer (JW Player only)
 * @return array
 */
function mplayer_list_metaviewerposition() {
    return array('' => get_string('none', 'mplayer'),
                 'over' => get_string('over', 'mplayer'),
                 'left' => get_string('left', 'mplayer'),
                 'right' => get_string('right', 'mplayer'),
                 'top' => get_string('top', 'mplayer'),
                 'bottom' => get_string('bottom', 'mplayer'));
}

/**
 * Define position of searchbar (JW Player)
 * @return array
 */
function mplayer_list_searchbarposition() {
    return array('none' => get_string('none', 'mplayer'),
                 'top' => get_string('top', 'mplayer'),
                 'bottom' => get_string('bottom', 'mplayer'));
}

/**
 * Define position of searchbar
 * @return array
 */
function mplayer_list_logoposition() {
    return array('bottom-left' => get_string('bottomleft', 'mplayer'),
                 'bottom-right' => get_string('bottomright', 'mplayer'),
                 'top-left' => get_string('topleft', 'mplayer'),
                 'top-right' => get_string('topright', 'mplayer'));
}

/**
 * Skins define the general appearance of the JW FLV Player
 * Skins can be downloaded from: http://www.longtailvideo.com/addons/skins
 * Skins (the .swf file only) are kept in /mod/mplayer/skins/
 * New skins must be added to the array below manually for them to show up on the mod_form.php list.
 * Copy and paste the following line into the array below then edit it to match the name and filename
 * of your new skin:
 *                'filename.swf' => 'Name',
 * I find alphabetical order works best ;)
 * @return array
 */
function mplayer_list_skins() {
    return array('' => '',
                 'beelden/beelden.xml' => 'Beelden XML Skin',
                 '3dpixelstyle.swf' => '3D Pixel Style',
                 'atomicred.swf' => 'Atomic Red',
                 'bekle.swf' => 'Bekle',
                 'bluemetal.swf' => 'Blue Metal',
                 'comet.swf' => 'Comet',
                 'controlpanel.swf' => 'Control Panel',
                 'dangdang.swf' => 'Dangdang',
                 'fashion.swf' => 'Fashion',
                 'festival.swf' => 'Festival',
                 'grungetape.swf' => 'Grunge Tape',
                 'icecreamsneaka.swf' => 'Ice Cream Sneaka',
                 'kleur.swf' => 'Kleur',
                 'magma.swf' => 'Magama',
                 'metarby10.swf' => 'Metarby 10',
                 'modieus.swf' => 'Modieus',
                 'nacht.swf' => 'Nacht',
                 'neon.swf' => 'Neon',
                 'pearlized.swf' => 'Pearlized',
                 'pixelize.swf' => 'Pixelize',
                 'playcasso.swf' => 'Playcasso',
                 'silverywhite.swf' => 'Silvery White',
                 'simple.swf' => 'Simple',
                 'snel.swf' => 'Snel',
                 'stijl.swf' => 'Stijl',
                 'stylish_slim.swf' => 'Stylish Slim',
                 'traganja.swf' => 'Traganja');
}

/**
 * Define number of seconds of video stream to buffer before playing
 * Longer buffer lengths can be given if a lot of users have particularly slow Internet connections
 * @return array
 */
function mplayer_list_bufferlength() {
    return array('0' => '0',
                 '1' => '1',
                 '2' => '2',
                 '3' => '3',
                 '4' => '4',
                 '5' => '5',
                 '6' => '6',
                 '7' => '7',
                 '8' => '8',
                 '9' => '9',
                 '10' => '10',
                 '11' => '11',
                 '12' => '12',
                 '13' => '13',
                 '14' => '14',
                 '15' => '15',
                 '16' => '16',
                 '17' => '17',
                 '18' => '18',
                 '19' => '19',
                 '20' => '20',
                 '21' => '21',
                 '22' => '22',
                 '23' => '23',
                 '24' => '24',
                 '25' => '25',
                 '26' => '26',
                 '27' => '27',
                 '28' => '28',
                 '29' => '29',
                 '30' => '30');
}

/**
 * Define action when user clicks on video
 * @return array
 */
function mplayer_list_displayclick() {
    return array('play' => get_string('play', 'mplayer'),
                 'link' => get_string('link', 'maplyer'),
                 'fullscreen' => get_string('fullscreen', 'mplayer'),
                 'none' => get_string('none', 'mplayer'),
                 'mute' => get_strign('mute', 'mplayer'),
                 'next' => get_string('next', 'mplayer'));
}

/**
 * Define playlist repeat behaviour
 * @return array
 */
function mplayer_list_repeat($technology = 'flowplayer') {

    if ($technology == 'flowplayer') {
        return array('no' => get_string('norepeat', 'mplayer'),
                     'list' => get_string('list', 'mplayer'),
                     'always' => get_string('always', 'mplayer'),
                     'single' => get_string('single', 'mplayer'));
    } else {
        return array('false' => get_string('norepeat', 'mplayer'),
                     'true' => get_string('list', 'mplayer'));
    }
}

/**
 * Define scaling properties of video stream (JW Player)
 * i.e. the way the video adjusts its dimensions to fit the FLV player window
 * @return array
 */
function mplayer_list_stretching() {
    return array('none' => get_string('none', 'mplayer'),
                 'uniform' => get_string('uniform', 'mplayer'),
                 'exactfit' => get_string('exactfit', 'mplayer'),
                 'fill' => get_string('fill', 'mplayer'));
}

/**
 * Define default playback volume
 * @return array
 */
function mplayer_list_volume() {
    return array('0' => '0',
                 '5' => '5',
                 '10' => '10',
                 '15' => '15',
                 '20' => '20',
                 '25' => '25',
                 '30' => '30',
                 '35' => '35',
                 '40' => '40',
                 '45' => '45',
                 '50' => '50',
                 '55' => '55',
                 '60' => '60',
                 '65' => '65',
                 '70' => '70',
                 '75' => '75',
                 '80' => '80',
                 '85' => '85',
                 '90' => '90',
                 '95' => '95',
                 '100' => '100');
}

/**
 * converts the local storage into a local proxy and remote storage.
 * this function will process the whole filearea keeping no video files inside.
 * video files are removed from Moodle storage after having been copied to the remote streming storage.
 * A proxy descriptor is stored using similar filename with .stm extension which is added to the
 * original file's fullname to keep full track of multiple endoding versions of a same resource.
 * The filepath of the original video location in local storage is preserved.
 * @param object $mplayer
 */
function mplayer_convert_storage_for_streamer($mplayer) {

    $config = get_config('mod_mplayer');

    $fs = get_file_storage();
    $context = context_module::instance($mplayer->coursemodule);

    if ($fs->is_area_empty($context->id, 'mod_mplayer', 'mplayerfiles', 0)) {
        return;
    }

    $storage = mplayer_get_media_storage($mplayer->streamer);

    $files = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/medias/', true, false);

    if ($files) {
        foreach ($files as $storedfile) {
            $originalname = $storedfile->get_filename();
            if (!preg_match('/\.stm/', $originalname)) {
                // Process anything that is NOT a proxy.

                // Prepare proxy record.
                $rec = new StdClass();
                $rec->contextid = $context->id;
                $rec->component = 'mod_mplayer';
                $rec->filearea = 'mplayerfiles';
                $rec->itemid = 0;
                $rec->filepath = $storedfile->get_filepath();
                $rec->filename = $originalname.'.stm';

                $type = mplayer_flowplayer_get_type($mplayer, $originalname);
                $stmcontent = $storage->get_manifest($storedfile, $type);

                // Remove old file in the way if any.
                if ($oldfile = $fs->get_file($context->id, 'mod_mplayer', 'mplayerfiles', 0, $rec->filepath, $rec->filename)) {
                    // mtrace("Deleting old one ");
                    $oldfile->delete();
                }

                // Create proxy file.
                $fs->create_file_from_string($rec, $stmcontent);

                $storage->store_media($storedfile);

                // Finally remove moodle side file.
                $storedfile->delete();
            }
        }
    }
}

/**
 * add js for a source
 * @param string $url the media storage url
 * @param objectref $mplayer the current player
 * @return string the source JS snippet
 */
function mplayer_flowplayer_get_type(&$mplayer, $url) {
    if (empty($mplayer->streamer) || $mplayer->streamer == 'http') {
        // Non streamed sources.
        if (preg_match('/\.webm$/', $url)) {
            $type = 'video/webm';
        } else {
            $type = 'video/mp4';
        }
    } else {
        if (preg_match('/\.m3u8$/', $url)) {
            // HLS Support.
            $type = 'application/x-mpegurl';
        } else if (preg_match('/\/vod\/smil\:/', $url)) {
            // HLS Support.
            $type = 'application/x-mpegurl';
        } else {
            // Other RTMP calls.
            $type = 'video/flash';
        }
    }

    return $type;
}

/**
 * Builds a storage hierarchy in mplayerfiles file area.
 * the hierarchy has top directories as :
 * - medias : several files as alternative sources for the clip
 * - thumbs : one file as thumb
 * - posters : one file as static poster (when video is staled or loading)
 * - tracks : several files with text track, one per supported language
 * - cues : one file with cue list
 *
 * Each directory can have one single file, or a set of numbers clips subdirs. All
 * files present at root will be used as clip 1 and appended to the first clip subdir
 * content. Clip subdirs follow the content restrictions of the "single clip" case.
 * That is, if the mplayer plays two clips :
 *
 * - medias
 *    - 0 : set of media files of clip 1
 *    - 1 : set of mediafiles of clip 2
 * - thumbs
 *    - 0 : thumb file for clip 1
 *    - 1 : thumb file for clip 1
 * etc.
 */
function mplayer_init_storage($cm, $draftitemid = 0) {
    global $USER;

    $fs = get_file_storage();

    if ($draftitemid) {
        $context = context_user::instance($USER->id);
        $component = 'user';
        $filearea = 'draft';
        $itemid = $draftitemid;
    } else {
        $context = context_module::instance($cm->id);
        $component = 'mod_mplayer';
        $filearea = 'mplayerfiles';
        $itemid = 0;
    }

    if ($fs->is_area_empty($context->id, $component, $filearea, $draftitemid)) {
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/medias/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/medias/0/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/thumbs/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/thumbs/0/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/tracks/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/tracks/0/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/cues/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/cues/0/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/captions/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/playlist/');
        $fs->create_directory($context->id, $component, $filearea, $itemid, '/posters/');
    }
}

/**
 * converts the old mplayer storage architecture to new storage
 * organisation. Use for upgrade passing over 2015110100 version.
 */
function mplayer_upgrade_storage($mplayer) {

    $fs = get_file_storage();

    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm->id);

    mplayer_init_storage($cm);

    // Check old 'mplayerfile' area.
    if ($oldfiles = $fs->get_area_files($context->id, 'mod_mplayer', 'mplayerfile', 0, 'itemid,filepath,filename', false)) {
        foreach ($oldfiles as $storedfile) {
            $newrec = new StdClass();
            $newrec->contextid = $context->id;
            $newrec->component = 'mod_mplayer';
            $newrec->filearea = 'mplayerfiles';
            $newrec->itemid = 0;
            $filename = $storedfile->get_filename();

            // Get clip prefix.
            if (preg_match('/^(\d+)_(.*)$/', $filename, $matches)) {
                $ix = $matches[1];
                $filename = $matches[2];
            } else {
                // Get clip prefix, other pattern possible.
                if (preg_match('/_(\\d+)_$/', $filename, $matches)) {
                    $ix = $matches[1];
                } else {
                    $ix = 0;
                }
            }

            $newrec->filepath = '/medias/'.$ix.'/';
            $newrec->filename = $filename;

            // TODO (possibly) : If filename is numerically prefixed (clipped), move it to clip folder.
            $fs->create_file_from_storedfile($newrec, $storedfile);
        }
        $fs->delete_area_files($context->id, 'mod_mplayer', 'mplayerfile');
    }

    // Move old thumbs to mplayerfiles area.
    if ($oldfiles = $fs->get_area_files($context->id, 'mod_mplayer', 'playlistthumb', 0, 'itemid,filepath,filename', false)) {
        foreach ($oldfiles as $storedfile) {
            $newrec = new StdClass();
            $newrec->contextid = $context->id;
            $newrec->component = 'mod_mplayer';
            $newrec->filearea = 'mplayerfiles';
            $newrec->itemid = 0;
            $filename = $storedfile->get_filename();

            // Get clip prefix.
            if (preg_match('/^(\d+)_(.*)$/', $filename, $matches)) {
                $ix = $matches[1];
                $filename = $matches[2];
            } else {
                $ix = 0;
            }

            $newrec->filepath = '/thumbs/'.$ix.'/';
            $newrec->filename = $filename;

            $fs->create_file_from_storedfile($newrec, $storedfile);
        }
        $fs->delete_area_files($context->id, 'mod_mplayer', 'playlistthumb');
    }

    // Move old tracks to mplayerfiles area.
    if ($oldfiles = $fs->get_area_files($context->id, 'mod_mplayer', 'trackfile', 0, 'itemid,filepath,filename', false)) {
        foreach ($oldfiles as $storedfile) {
            $newrec = new StdClass();
            $newrec->contextid = $context->id;
            $newrec->component = 'mod_mplayer';
            $newrec->filearea = 'mplayerfiles';
            $newrec->itemid = 0;
            $filename = $storedfile->get_filename();

            // Get clip prefix.
            if (preg_match('/^(\d+)_(.*)$/', $filename, $matches)) {
                $ix = $matches[1];
                $filename = $matches[2];
            } else {
                $ix = 0;
            }

            $newrec->filepath = '/tracks/'.$ix.'/';
            $newrec->filename = $filename;

            $fs->create_file_from_storedfile($newrec, $storedfile);
        }
        $fs->delete_area_files($context->id, 'mod_mplayer', 'trackfile');
    }

    // Move old posters to mplayerfiles area.
    if ($oldfiles = $fs->get_area_files($context->id, 'mod_mplayer', 'image', 0, 'itemid,filepath,filename', false)) {
        foreach ($oldfiles as $storedfile) {
            $newrec = new StdClass();
            $newrec->contextid = $context->id;
            $newrec->component = 'mod_mplayer';
            $newrec->filearea = 'mplayerfiles';
            $newrec->itemid = 0;
            $filename = $storedfile->get_filename();

            $newrec->filepath = '/posters/';
            $newrec->filename = $filename;

            $fs->create_file_from_storedfile($newrec, $storedfile);
        }
        $fs->delete_area_files($context->id, 'mod_mplayer', 'image');
    }

    // Move old playlist file to mplayerfiles area.
    if ($oldfiles = $fs->get_area_files($context->id, 'mod_mplayer', 'playlist', 0, 'itemid,filepath,filename', false)) {
        foreach ($oldfiles as $storedfile) {
            $newrec = new StdClass();
            $newrec->contextid = $context->id;
            $newrec->component = 'mod_mplayer';
            $newrec->filearea = 'mplayerfiles';
            $newrec->itemid = 0;
            $filename = $storedfile->get_filename();

            $newrec->filepath = '/playlist/';
            $newrec->filename = $filename;

            $fs->create_file_from_storedfile($newrec, $storedfile);
        }
        $fs->delete_area_files($context->id, 'mod_mplayer', 'playlist');
    }
}

function mplayer_get_media_storage($storage) {
    global $CFG;

    $storageclass = $storage.'_storage';
    require_once($CFG->dirroot.'/mod/mplayer/storage/'.$storageclass.'.class.php');
    $storageobj = new $storageclass();
    return $storageobj;
}

function mplayer_get_packed_attributes() {

    $attrs = ['configxml', 'author', 'mplayerdate',
        'infoboxcolor', 'infoboxposition', 'infoboxsize', 'duration',
        'hdbitrate', 'hdfile', 'hdfullscreen', 'hdstate', 'livestreamfile',
        'livestreamimage', 'livestreaminterval', 'livestreammessage', 'livestreamstreamer',
        'livestreamtags', 'audiodescriptionfile', 'audiodescriptionstate', 'audiodescriptionvolume',
        'videotags', 'backcolor', 'frontcolor', 'lightcolor', 'screencolor', 'controlbar',
        'smoothing', 'height', 'playlist', 'playlistsize', 'skin', 'width',
        'autostart', 'bufferlength', 'fullscreen', 'forcefullscreen', 'icons',
        'item', 'logoboxalign', 'logoboxfile', 'logoboxlink', 'logoboxmargin', 'logoboxposition',
        'logofile', 'logolink', 'logohide', 'logoposition', 'mute', 'quality',
        'mplayerrepeat', 'resizing', 'shuffle', 'state', 'stretching', 'volume',
        'plugins', 'streamer', 'tracecall', 'captionsback', 'captionsfile', 'captionsfontsize',
        'captionsstate', 'fpversion', 'metaviewerposition', 'metaviewersize', 'searchbarcolor',
        'searchbarlabel', 'searchbarposition', 'searchbarscript', 'snapshotbitmap', 'snapshotscript',
        'splashmode', 'langselection'];

    return $attrs;
}

function mplayer_pack_attributes(&$mplayer) {

    $attrs = mplayer_get_packed_attributes();

    $playerparams = new StdClass;
    foreach ($attrs as $attr) {
        if (isset($mplayer->$attr)) {
            $playerparams->$attr = $mplayer->$attr;
            unset($mplayer->$attr);
        } else {
            $playerparams->$attr = '';
        }
    }

    return $mplayer->playerparams = json_encode($playerparams);
}

function mplayer_unpack_attributes(&$mplayer) {

    $attrs = mplayer_get_packed_attributes();

    $playerparams = json_decode($mplayer->playerparams);

    foreach ($attrs as $attr) {
        if (isset($playerparams->$attr)) {
            $mplayer->$attr = $playerparams->$attr;
        } else {
            $mplayer->$attr = '';
        }

        unset($mplayer->playerparams);
    }
}

function mplayer_ffmpeg_info($filepath) {

    $config = get_config('mplayer');

    if (empty($config->ffmpegpath)) {
        throw new Exception("FFMpeg not configured in mplayer settings.");
    }

    if (!is_executable($config->ffmpegpath)) {
        throw new Exception("FFMpeg not executable. Check file permissions.");
    }

    $cmd = '"'.$config->ffmpegpath."\" -i \"$filepath\" -hide_banner 2>&1";
    $ffmpeg = shell_exec($cmd);
    $search = "/Duration: (.*?)\./";
    preg_match($search, $ffmpeg, $matches);
    $data['duration'] = $matches[1];
    $time_sec = explode(':', $data['duration']);
    $data['durationSecond'] = ($time_sec['0'] * 3600) + ($time_sec['1'] * 60) + $time_sec['2'];

    $search = "|Video:.* (\d{3,4}+x\d{3,4})|";
    preg_match($search, $ffmpeg, $matches);
    $data['video'] = $matches[1];

    return $data;
}

/**
 * Computes track percent locations from start time and end time
 * on video.
 * @param int $starttime start relative timestamp in seconds
 * @param int $endtime end relative timestamp in seconds
 */
function mplayer_compute_segment_points($starttime, $endtime, $clip) {

    if (!isset($clip->duration)) {
        throw new \coding_exception("clip should have a duration or at least -1");
    }

    if ($clip->duration == -1) {
        return [-1, -1];
    }

    $startpc = $starttime / $clip->duration * 100;
    $endpc = $endtime / $clip->duration * 100;

    $result = [$startpc, $endpc];

    return $result;
}

function mplayer_save_attributes($mplayer) {
    global $DB;

    mplayer_pack_attributes($mplayer);
    $DB->update_record('mplayer', $mplayer);
}

function mplayer_parse_time($hms) {
    $parts = explode(':', $hms);
    if (count($parts) == 1) {
        return $hms;
    } else if (count($parts) == 2) {
        return $parts[0] * 60 + $parts[1];
    } else if (count($parts) == 3) {
        return $parts[0] * 3600 + $parts[1] * 60 + $parts[2];
    }
}

function mplayer_format_time($secs) {
    $mins = floor($secs / 60);
    $secs = $secs - $mins * 60;
    $hours = floor($mins / 60);
    $mins = $mins - $hours * 60;

    $time = $secs;
    if (!empty($mins)) {
        $time = "$mins:$time";
    } else {
        $time = "0:$time";
    }
    if (!empty($hours)) {
        $time = "$hours:$time";
    }

    return $time;
}

/**
 * Get all highlight zones.
 */
function mplayer_get_highlighted_zones_counter($mplayer, $clipid) {
    global $DB, $USER;

    $sql = "
        SELECT
            COUNT(*) as allclipzones,
            SUM(CASE WHEN mur.id IS NOT NULL THEN 1 ELSE 0 END) as foundzones
        FROM
            {mplayer_highlighted_zones} mhz
        LEFT JOIN
            {mplayer_user_results} mur
        ON
           mhz.id = mur.zoneid
        WHERE
           mhz.mplayerid = ? AND
           mhz.clipid = ? AND
           mhz.userid = 0  AND
           (mur.userid = ? OR mur.userid IS NULL)
    ";

    $params = [$mplayer->id, $clipid, $USER->id];
    if ($zonecounters = $DB->get_record_sql($sql, $params)) {
        return $zonecounters->foundzones.'/'.$zonecounters->allclipzones;
    }
    return '';
}

/**
 * Get all highlight zones.
 */
function mplayer_get_highlighted_zones($mplayer, $clipix, $seeall = false) {
    global $DB, $USER;

    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = context_module::instance($cm->id);
    $isassessor = has_capability('mod/mplayer:assessor', $context);

    $params = ['mplayerid' => $mplayer->id, 'clipid' => $clipix, 'userid' => 0];
    if ($isassessor || $seeall) {
        $highlightzones = $DB->get_records('mplayer_highlighted_zones', $params);
        if ($highlightzones) {
            foreach ($highlightzones as $hlz) {
                $hlz->class = 'teacherzone';
            }
        }
    }

    if (!$isassessor) {

        if ($mplayer->assessmode == MPLAYER_ASSESS_FIND_ZONES) {
            $params = ['mplayerid' => $mplayer->id, 'clipid' => $clipix, 'userid' => $USER->id];
            // Fetch teachers zones that have been punched by student.
            $sql = "
                SELECT
                    mhz.*,
                    'studentfoundzone' as class
                FROM
                    {mplayer_highlighted_zones} mhz,
                    {mplayer_user_results} mur
                WHERE
                   mhz.id = mur.zoneid AND
                   mhz.mplayerid = ? AND
                   mhz.clipid = ? AND
                   mhz.userid = 0 AND
                   mur.userid = ?
            ";

            $highlightzones = $DB->get_records_sql($sql, $params);
        } else {
            $params = ['mplayerid' => $mplayer->id, 'clipid' => $clipix, 'userid' => $USER->id];
            // Fetch student zones.
            $sql = "
                SELECT
                    mhz.*,
                    'studentzone' as class
                FROM
                    {mplayer_highlighted_zones} mhz
                WHERE
                   mhz.mplayerid = ? AND
                   mhz.clipid = ? AND
                   mhz.userid = ?
            ";

            $params['userid'] = $USER->id;
            $highlightzones = $DB->get_records_sql($sql, $params);
        }
    }

    return $highlightzones;
}

function mplayer_apply_namefilters(&$fullusers) {
    $firstnamefilter = optional_param('filterfirstname', false, PARAM_TEXT);
    $lastnamefilter = optional_param('filterlastname', false, PARAM_TEXT);

    if (!$firstnamefilter && !$lastnamefilter) {
        return;
    }

    if ($firstnamefilter) {
        foreach ($fullusers as $userid => $user) {
            if (!preg_match('/^'.$firstnamefilter.'/i', $user->firstname)) {
                unset($fullusers[$userid]);
            }
        }
    }

    if ($lastnamefilter) {
        foreach ($fullusers as $userid => $user) {
            if (!preg_match('/^'.$lastnamefilter.'/i', $user->lastname)) {
                unset($fullusers[$userid]);
            }
        }
    }
}