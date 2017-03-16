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

/**
 *
 */
function get_mplayer_context() {
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
    return array($cm, $mplayer, $course);
}

/**
 * Saves all draft files received from instance setup
 * @param objectref &$mplayer
 * @param string $filearea name of a filearea to process for saving
 */
function mplayer_save_draft_file(&$mplayer, $filearea) {
    global $USER;
    static $fs;

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

                    if (preg_match('/\.stm$/', $filename)) {
                        // This is a stream manifest. Get url from it.
                        $contenthash = $storedfile->get_contenthash();
                        $l1 = $contenthash[0].$contenthash[1];
                        $l2 = $contenthash[2].$contenthash[3];
                        $manifestlocation = $CFG->dataroot.'/filedir/'.$l1.'/'.$l2.'/'.$contenthash;
                        $streamedobj = simplexml_load_file($manifestlocation);

                        if (!$streamedobj) {
                            // Manifest not readable. Continue.
                            continue;
                        }

                        if (!empty($streamedobj->clip)) {
                            $ix = $streamedobj->clip;
                        }
                        $url = ''.$streamedobj->stream;
                    } else {
                        // Normal local case.
                        $url = moodle_url::make_pluginfile_url($context->id, 'mod_mplayer', 'mplayerfiles', 0, $filepath, $filename);
                    }

                    $clip = new Stdclass();
                    $clip->sources[] = $url;
                    $clip->title = '';

                    $clips[$ix] = $clip;
                }
            }
        }

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

function mplayer_require_js() {
    global $CFG, $PAGE;

    if ($CFG->mplayer_default_player == 'jw') {
        $PAGE->requires->js('/mod/mplayer/jw/6.9/jwplayer.js');
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

    // Build Javascript code for view.php print_header() function.

    $js = '<script type="text/javascript" src="swfobject/swfobject.js"></script>';
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
    return array('true' => 'true',
                 'false' => 'false');
}

/**
 * true/false options
 * @return array
 */
function mplayer_list_quality() {
    return array('best' => 'best',
                 'high' => 'high',
                 'medium' => 'medium',
                 'autohigh' => 'autohigh',
                 'autolow' => 'autolow',
                 'low' => 'low');
}

/**
 * Define target of link when user clicks on 'link' button
 * @return array
 */
function mplayer_list_linktarget() {
    return array('_blank' => 'new window',
                 '_self' => 'same page',
                 'none' => 'none');
}

/**
 * Define type of media to serve
 * @return array
 */
function mplayer_list_type($player) {

    if ($player->technology == 'jw') {
        return array('video' => get_string('video', 'mplayer'),
                     'youtube' => 'YouTube',
                     'url' => get_string('fullurl', 'mplayer'),
                     'xml' => 'XML Playlist',
                     'sound' => 'Sound',
                     'image' => 'Image',
                     'http' => 'HTTP (pseudo) Streaming',
                     'lighttpd' => 'Lighttpd Streaming',
                     'rtmp' => 'RTMP Streaming');
    } else {
        return array('video' => get_string('video', 'mplayer'),
                     'url' => get_string('fullurl', 'mplayer'),
                     'xml' => get_string('xmlplaylist', 'mplayer'),
                     'httpxml' => get_string('httpxmlplaylist', 'mplayer'),
                     'xmlrtmp' => 'RTMP XML Playlist',
                     'xmlhttprtmp' => 'RTMP HTTP XML Playlist',
                     'rtmp' => 'RTMP Streaming');
    }
}

/**
 * Define available technologies
 * @return array
 */
function mplayer_list_technologies() {

    return array('flowplayer' => 'Flowplayer',
                 'jw' => 'JW Player'
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
        3 => get_string('langteacherchoice', 'mplayer'));
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

    return array('' => 'none',
                 'http' => 'Remote HTTP',
                 'wowza' => 'Wowza');
}

/**
 * List array of available search scripts
 * None are provided as yet.
 * @return array
 */
function mplayer_list_searchbarscript() {

    return array('' => 'none',
                 'http://gdata.youtube.com/feeds/api/videos?vq=QUERY&format=5' => 'YouTube.com Search');
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
    return array('bottom' => 'bottom',
                 'over' => 'over',
                 'none' => 'none');
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
    return array('none' => 'none',
                 'bottom' => 'bottom',
                 'over' => 'over',
                 'top' => 'top');
}

/**
 * Define logobox align
 * @return array
 */
function mplayer_list_logoboxalign() {
    return array('left' => 'left',
                 'right' => 'right');
}

/**
 * Define position of metaviewer (JW Player only)
 * @return array
 */
function mplayer_list_metaviewerposition() {
    return array('' => 'none',
                 'over' => 'over',
                 'left' => 'left',
                 'right' => 'right',
                 'top' => 'top',
                 'bottom' => 'bottom');
}

/**
 * Define position of searchbar (JW Player)
 * @return array
 */
function mplayer_list_searchbarposition() {
    return array('none' => 'none',
                 'top' => 'top',
                 'bottom' => 'bottom');
}

/**
 * Define position of searchbar
 * @return array
 */
function mplayer_list_logoposition() {
    return array('bottom-left' => 'bottom-left',
                 'bottom-right' => 'bottom-right',
                 'top-left' => 'top-left',
                 'top-right' => 'top-right');
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
    return array('play' => 'play',
                 'link' => 'link',
                 'fullscreen' => 'fullscreen',
                 'none' => 'none',
                 'mute' => 'mute',
                 'next' => 'next');
}

/**
 * Define playlist repeat behaviour
 * @return array
 */
function mplayer_list_repeat() {
    return array('none' => 'none',
                 'list' => 'list',
                 'always' => 'always',
                 'single' => 'single');
}

/**
 * Define scaling properties of video stream (JW Player)
 * i.e. the way the video adjusts its dimensions to fit the FLV player window
 * @return array
 */
function mplayer_list_stretching() {
    return array('none' => 'none',
                 'uniform' => 'uniform',
                 'exactfit' => 'exactfit',
                 'fill' => 'fill');
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
                    mtrace("Deleting old one ");
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