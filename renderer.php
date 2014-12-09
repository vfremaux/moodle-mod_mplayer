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
 * This file contains a renderer for the assignment class
 *
 * @package   mod_assign
 * @copyright 2012 NetSpot {@link http://www.netspot.com.au}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/mplayer/locallib.php');

/**
 * A custom renderer class that extends the plugin_renderer_base and is used by the assign module.
 *
 * @package mod_mplayer
 * @copyright 2012 NetSpot {@link http://www.netspot.com.au}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_mplayer_renderer extends plugin_renderer_base {

    /**
     * Construct Javascript SWFObject embed code for <body> section of view.php
     * Please note: some URLs append a '?'.time(); query to prevent browser caching
     *
     * @param $mplayer (mdl_mplayer DB record for current mplayer module instance)
     * @return string
     */
    function print_body($mplayer) {
        global $CFG;

        //a nice small tiny library for detecting mobile devices.
        require_once ($CFG->dirroot."/mod/mplayer/Mobile_Detect.php");
    
        $detect = new Mobile_Detect;
    
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);
    
        $mplayer_body = $this->get_device_based_mplayer($mplayer, $cm, $context, $detect);
    
        return $mplayer_body;
    }
    
    /**
     * prints the body of the player 
     *
     *
     */
    function get_device_based_mplayer($mplayer, $cm, $context, $detect) {
        global $CFG;
    
        $isplaylist = false;
    
        if ($CFG->mplayer_default_player == 'flowplayer') {
            $detector = new Mobile_Detect();
            if ($detector->isMobile() && $detector->isAndroid()) {
                $mplayer_body = $this->flowplayer_body($mplayer, $cm, $context, 'flash');
            } else {
                $mplayer_body = $this->flowplayer_body($mplayer, $cm, $context, 'html5');
            }
        } else {
            $mplayer_body = $this->jwplayer_body($mplayer, $cm, $context);
        }
        
        return $mplayer_body;
    }

    /**
     * prints the flowplayer effective body (html5)
     *
     */
    function flowplayer_body($mplayer, $cm, $context, $forcedtype = '') {
        global $JQUERYVERSION, $CFG, $DB;

        // Protect playlist type after a technology switch.
        if (!in_array($mplayer->playlist, array('dots', 'thumbs'))) {
            $DB->set_field('mplayer', 'playlist', 'dots', array('id' => $mplayer->id));
        }

        if (!isset($CFG->mplayer_default_native_fullscreen)) {
            set_config('mplayer_default_native_fullscreen', 'false');
        }

        // Check and get the playlist.
        if ($mplayerfile = mplayer_get_file_location($mplayer, 'playlistfile', $context)) {
            $playlist_obj = simplexml_load_file($mplayerfile);
    
            $playlist_html =' <div class="fp-playlist">';
            $i = 0;
            foreach ($playlist_obj->trackList->track as $video_info) {
                $listitemcontent = '';
                if (isset($video_info->thumb) && $mplayer->playlist == 'thumbs') {
                    $listthumburl = mplayer_get_playlist_thumb_url($video_info->thumb, $context);
                    $listitemcontent = '<img src="'.$listthumburl.'" />';
                }
                $playlist_html .=' <a href="'.$video_info->location.'" title="'.$video_info->title.'" id="item'.$i.'">'.$listitemcontent.'</a>';
                $i++;
            }
            $playlist_html .=' </div>';

            // Print titles and descriptions.

            $i = 0;
            foreach ($playlist_obj->trackList->track as $video_info) {
                $playlist_html .=' <hgroup class="info'.$i.'">
                <h1 class="fp-playlist-info">'.$video_info->title.'</h1>
                </hgroup>';
                $i++;
            }
            $isplaylist = true; 
        } else {
            $playlist_html = '';
        }
    
        // Check poster image or splash screen
        $poster = '';
        $splashbackground = '';
        if (empty($mplayer->splashmode)) {
            if ($posterurl = mplayer_get_file_url($mplayer, 'image', $context)) {
                $poster = ' poster="'.$posterurl.'" ';
            }
        } else {
            if ($posterurl = mplayer_get_file_url($mplayer, 'image', $context)) {
                $splashbackground = 'background-image:url('.$posterurl.')';
            }
        }
    
        $autoplay = '';
        if ($mplayer->autostart == 'true') {
            $autoplay = 'autoplay="autoplay"';
        }
    
        $fullscreen = '';
        if ($mplayer->fullscreen == 'true') {
            $fullscreen = 'fullscreen';
        }

        $muted = 'data-muted='.$mplayer->mute;

        $volume = 'data-volume='.sprintf("%.2f", $mplayer->volume/100);

        // Get the first video as the opening video.
        if (@$isplaylist) {
            $video_html = '<video '.$autoplay.' '.$poster.' preload="none">
                                <source type="video/mp4" src="'.$playlist_obj->trackList->track[0]->location.'">
                           </video>';
        } else {
            $mplayerfileurl = mplayer_get_file_url($mplayer, 'mplayerfile', $context);
            $video_html = ' <video '.$autoplay.' '.$poster.' preload="none">
                                  <source type="video/mp4" src="'.$mplayerfileurl.'">
                            </video>';
        }

        if ($mplayer->playlist == 'thumbs') {
            $playlistsheet = 'thumbs_playlist';
        } else {
            $playlistsheet = 'dots_playlist';
        }

        $engine = ($forcedtype == 'flash') ? ' data-engine="flash" ' : '';

        $mplayer_body = '
            <!-- script type="text/javascript" src="flowplayer/flowplayer.min.js"></script -->
            <link rel="stylesheet" type="text/css" href="flowplayer/skin/functional.css">
            <link rel="stylesheet" type="text/css" href="flowplayer/'.$playlistsheet.'.css">
            <div class="mplayer-cont">
                <div id="'.$mplayer->playlist.'" class="flowplayer '.$fullscreen.' is-mouseout '.$mplayer->splashmode.'" '.$engine.' data-fullscreen="true" data-native_fullscreen="'.$CFG->mplayer_default_native_fullscreen.'" '.$volume.' '.$muted.' style="background-size:cover;'.$splashbackground.'">
                       <a class="fp-prev"></a>
                       <a class="fp-next"></a>
                           '.$video_html.'
                           '.$playlist_html.'
                </div>
            </div>
          ';

          return $mplayer_body;
    }


    function jwplayer_js_body($mplayer) {

        $autostart = ($mplayer->autostart) ? 'jwplayer().start();' : '';

        $playlist = '';
        $playlistdata = '';

        if ($mplayer->playlist) {

            $playlist = 'jwplayer.load('.$playlistdata.");\n";
        }

        $cm = get_course_module_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $jw_body = '<div id="jw-player">Loading the player ...</div>
        <script type="text/javascript">
          jwplayer(\'mplayer-player\').setup({
            file: \''.mplayer_get_file_url($mplayer, 'mediafile', $context).'\',
            height: '.$mplayer->height.',
            image: \''.mplayer_get_file_url($mplayer, 'image', $context).'\',
            width: '.$mplayer->width.'
          });

        '.$playlist.'

        jwplayer().setVolume('.($mplayer->volume * 100).');
        '.$autostart.'

        </script>';

        return $jw_body;
    }
}