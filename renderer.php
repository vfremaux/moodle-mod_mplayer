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

        if ($mplayer->technology == 'flowplayer') {
            $detector = new Mobile_Detect();
            if ($detector->isMobile() && $detector->isAndroid()) {
                $mplayer_body = $this->flowplayer_body($mplayer, $cm, $context, 'flash');
            } else {
                $mplayer_body = $this->flowplayer_body($mplayer, $cm, $context, 'html5');
            }
        } else {
            $mplayer_body = $this->jwplayer_body($mplayer, $cm, $context);
        }

        if (!empty($mplayer->notes)) {
            $mplayer_body .= '<div class="mplayer-notes"><p>'.$mplayer->notes.'</p></div>';
        }

        return $mplayer_body;
    }

    /**
     * prints the flowplayer effective body (html5)
     *
     */
    function flowplayer_body($mplayer, $cm, $context, $forcedtype = '') {
        global $JQUERYVERSION, $CFG, $DB;
        static $loaded = false;

        $isplaylist = false;

        // Protect playlist type after a technology switch.
        if (!in_array($mplayer->playlist, array('dots', 'thumbs'))) {
            $DB->set_field('mplayer', 'playlist', 'dots', array('id' => $mplayer->id));
        }

        if (!isset($CFG->mplayer_default_native_fullscreen)) {
            set_config('mplayer_default_native_fullscreen', 'false');
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

        // Check and get the autoplay capability.
        $autoplay = '';
        if ($mplayer->autostart == 'true') {
            $autoplay = 'autoplay="autoplay"';
        }

        // Check and get the fullscreen capability.
        $fullscreen = '';
        if ($mplayer->fullscreen == 'true') {
            $fullscreen = 'fullscreen';
        }

        // Check and get the muted state.
        $muted = 'data-muted='.$mplayer->mute;

        // Check and get the volume.
        $volume = 'data-volume='.sprintf("%.2f", $mplayer->volume/100);

        // Check and get the playlist.
        if (($mplayerfile = mplayer_get_file_location($mplayer, 'playlistfile', $context)) && ($mplayer->type == 'xml')) {
            $playlist_obj = simplexml_load_file($mplayerfile);

            $video_html = '<video '.$autoplay.' '.$poster.' preload="none">';
            $playlist_html =' <div class="fp-playlist">';

            $i = 0;
            foreach ($playlist_obj->trackList->track as $video_info) {
                $video_html .= '<source type="video/mp4" src="'.$video_info->location.'">';
                $listitemcontent = '';
                if (isset($video_info->thumb) && $mplayer->playlist == 'thumbs') {
                    $listthumburl = mplayer_get_playlist_thumb_url($video_info->thumb, $context);
                    $listitemcontent = '<img src="'.$listthumburl.'" />';
                }
                $playlist_html .=' <a href="'.$video_info->location.'" title="'.$video_info->title.'" id="item'.$i.'">'.$listitemcontent.'</a>';
                $i++;
            }
            $video_html .= '</video>';
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
            $isplaylist = false;
        }

        // Get the first video as the opening video.
        /*if (@$isplaylist) {
            $video_html = '<video '.$autoplay.' '.$poster.' preload="none">
                                <source type="video/mp4" src="'.$playlist_obj->trackList->track[0]->location.'">
                           </video>';
        } else {
            $mplayerfileurl = mplayer_get_file_url($mplayer, 'mplayerfile', $context);
            $video_html = ' <video '.$autoplay.' '.$poster.' preload="none">
                                  <source type="video/mp4" src="'.$mplayerfileurl.'">
                            </video>';
        }*/

        if ($mplayer->playlist == 'thumbs') {
            $playlistsheet = 'thumbs_playlist';
            $playlistclass = 'thumbs';
        } else {
            $playlistsheet = 'dots_playlist';
            $playlistclass = 'dots';
        }

        $engine = ($forcedtype == 'flash') ? ' data-engine="flash" ' : ' data-engine="html5" ';

        $datacuepoints = ''; $jscuepoints = ''; $_datacuepoints = array();

        if ($mplayer->cuelists) {
            //$datacuepoints = 'data-cuepoints="[';
            $cuelistsArray = explode(';', $mplayer->cuelists);
            $jscuepoints = '_flowplayer.bind("cuepoint", function (e, api, cuepoint) {';
            foreach ($cuelistsArray as $cp => $cuelistArray) {
                $cuepointArray = explode('|', trim($cuelistArray));
                if (isset($cuepointArray[0]) && isset($cuepointArray[1]) && isset($cuepointArray[2])) {
                    //$datacuepoints .= $cp ? ',' . $cuepointArray[1] : $cuepointArray[1];
                    $_datacuepoints[$cuepointArray[0]][] = $cuepointArray[1];
                    $jscuepoints .= '
                            if (cuepoint.time == ' . $cuepointArray[1] . '){
                                    api.pause();
                                    api.seek(' . ($cuepointArray[1] + 0.2) . ');
                                    var jpop' . $cp . ' = window.open("' . $cuepointArray[2] . '",top="10",left="10");';
                    if (isset($cuepointArray[3])) {
                        if ($cuepointArray[3]) {
                            $jscuepoints .= 'setTimeout(function(){jpop' . $cp . '.close(); api.play();}, ' . ($cuepointArray[3] * 1000)  . ');';
                        } else {
                            $jscuepoints .= 'jpop' . $cp . '.onbeforeunload = function() {api.play();};';
                        }
                    }
                    $jscuepoints .= '}';
                }
            }
            //$datacuepoints .= ']"';
            $jscuepoints .= '});';
        }

        if (!$isplaylist) {
            switch($mplayer->type) {
                case 'video':
                    $urlArray = mplayer_get_file_url($mplayer, 'mplayerfile', $context, true);
                    break;
                case 'url':
                case 'http':
                    $urlArray = explode(';', ' ;' . $mplayer->external);
                    break;
                default: $urlArray = array();
                    break;
            }

            if (!empty($urlArray)) {
                // Take the first available URL
                $video_html = '<video '.$autoplay.' '.$poster.' preload="none">';

                // Even if not playlist file, we build a local playlist
                $playlist_html = '<div class="fp-playlist">';

                $playlistthumb = mplayer_get_file_url($mplayer, 'playlistthumb', $context, true);
                $_playlist = array();
                foreach ($urlArray as $index => $url) {
                    if ($url) {

                        if (preg_match('/\.webm$/', $url)) {
                            $video_html .= '<source type="video/webm" src="'.$url.'" />';
                        } else {
                            $video_html .= '<source type="video/mp4" src="'.$url.'" />';
                        }

                        $plcuepoints = '';
                        if (isset($_datacuepoints[$index])) {
                            $plcuepoints = 'data-cuepoints="[';
                                foreach ($_datacuepoints[$index] as $_cp => $_dataplcuepoints) {
                                    $plcuepoints .= $_cp ? ',' . $_dataplcuepoints : $_dataplcuepoints;
                                }
                            $plcuepoints .= ']"';
                        }

                        $playlist_html .= '<a href="'.$url.'" ' . $plcuepoints . '>';
                        if (($mplayer->playlist == 'thumbs') && ($mplayer->controlbar != 'none')) {
                            $srcimg = isset($playlistthumb[$index]) ? $playlistthumb[$index] : '';
                            $playlist_html .= '<img src="'. $srcimg . '"/>';
                        }
                        $playlist_html .= '</a>';
                    }
                }
                $playlist_html .= '</div>';

                $video_html .= $this->flowplayer_subtitles($mplayer);
                $video_html .= '</video>';
            }
        } else {
            $video_html = '<video '.$autoplay.' '.$poster.' preload="none">
                                <source type="video/mp4" src="'.$playlist_obj->trackList->track[0]->location.'">';
            $video_html .= $this->flowplayer_subtitles($mplayer);
            $video_html .= '</video>';
        }

        $style = '';
        if ($mplayer->screencolor) $style .= '.flowplayer {background-color: #'.str_replace('#', '', $mplayer->screencolor).' !important;}';
        if ($mplayer->backcolor) $style .= '.flowplayer .fp-controls {background-color: #'.str_replace('#', '', $mplayer->backcolor).' !important;}';
        if ($mplayer->frontcolor) $style .= '.flowplayer .fp-progress, .flowplayer .fp-volumelevel {background-color: #'.str_replace('#', '', $mplayer->frontcolor).' !important;}';
        if ($mplayer->lightcolor) {
            $style .= '.flowplayer .fp-buffer {background-color: #'.str_replace('#', '', $mplayer->lightcolor).' !important;}';
            $style .= '.flowplayer .fp-time .fp-elapsed, .flowplayer .fp-time .fp-duration, .flowplayer .fp-mute {color: #'.str_replace('#', '', $mplayer->lightcolor).' !important;}';
        }

        // Load those once only.
        $scriptloadfragment = '';
        if (!$loaded) {
            $flowplayercompletionjscodeurl = new moodle_url('/mod/mplayer/js/completion.js');
            $flowplayerjscodeurl = new moodle_url('/mod/mplayer/flowplayer/flowplayer.min.js');
            $flowplayercssurl = new moodle_url('/mod/mplayer/flowplayer/skin/functional.css');
            $flowplayerplaylistcssurl = new moodle_url('/mod/mplayer/flowplayer/'.$playlistsheet.'.css');
            $loaded = true;
            $scriptloadfragment = '
                <script type="text/javascript" src="'.$flowplayercompletionjscodeurl.'"></script>
                <script type="text/javascript" src="'.$flowplayerjscodeurl.'"></script>
                <link rel="stylesheet" type="text/css" href="'.$flowplayercssurl.'">
                <link rel="stylesheet" type="text/css" href="'.$flowplayerplaylistcssurl.'">
            ';
            $scriptloadfragment .= '<style>'.$style.'</style>';
        }

        $mplayer_body = $scriptloadfragment.'
            <div class="mplayer-cont">
                <div ' . $datacuepoints . '
                    id="flowplayer_'.$mplayer->id.'"
                    class="'.$playlistclass.' flowplayer '.$fullscreen.' is-mouseout '.$mplayer->splashmode.'" '.$engine.' data-fullscreen="true" data-native_fullscreen="'.$CFG->mplayer_default_native_fullscreen.'" '.$volume.' '.$muted.' 
                    style="background-size:cover;'.$splashbackground.'">
                    <a class="fp-prev"></a>
                    <a class="fp-next"></a>
                   '.$video_html.'
                   '.$playlist_html.'
                </div>
            </div>';

        $mplayer_body .= $this->flowplayer_completion($mplayer);

        if (!empty($jscuepoints)) {
            $mplayer_body .= '
                <script type="text/javascript">
                    ' . $jscuepoints .'
               </script>';
        }

        return $mplayer_body;
    }

    /**
     * Not used.
     */
    function flowplayer_playlist_icons() {
        $str = '
            $(function() {
                $("#thumbs .fp-playlist a").each(function(index) {
                if(this.href) {
                    $(this).append("<img src=\'" + this.href + "\'/>");
                    this.setAttribute("data-cuepoints","[" + index + ".5]");
                }
                });
            });
        ';
        return $str;
    }

    /**
     * Prints the completion widget
     */
    function flowplayer_completion($mplayer) {
        global $CFG;

        $str = '<div class="mplayer-completion" id="mplayer-progress-'.$mplayer->id.'"></div>

           <script type="text/javascript">
                var _flowplayer = $("#flowplayer_'.$mplayer->id.'").flowplayer({});
                var wwwroot = "'.$CFG->wwwroot.'";
                setup_player_completion("flowplayer_'.$mplayer->id.'");
           </script>';
        return $str;
    }

    /**
     * Prints the completion widget
     * @param object $mplayer the mplayer instance
     */
    function flowplayer_subtitles($mplayer) {
        global $CFG;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $fs = get_file_storage();

        $str = '';

        if ($files = $fs->get_area_files($context->id, 'mod_mplayer', 'trackfile', 0, "itemid, filepath, filename", false)) {

            $file = array_pop($files);

            $trackurl = moodle_url::make_pluginfile_url($context->id, 'mod_mplayer', 'trackfile', 0, $file->get_filepath(), $file->get_filename());
            $str = '<track src="'.$trackurl.'" />';
        }

        return $str;
    }

    /**
     * Not used.
     */
    function flowplayer_flash_body() {
        global $CFG;

        $body = '
            var _flowplayer = flowplayer("flowplayer", "'.$CFG->wwwroot.'/mod/mplayer/skins/'.$mplayer->skin.'", {
            plugins: {
            controls: {
            url: "'.$CFG->wwwroot.'/mod/mplayer/flowplayer/flowplayer.swf",

            // customize the appearance make it have a lighter look
            buttonColor: "rgba(0, 0, 0, 0.9)",
            buttonOverColor: "#000000",
            backgroundColor: "#D7D7D7",
            backgroundGradient: "medium",
            sliderColor: "#FFFFFF",

            sliderBorder: "1px solid #808080",
            volumeSliderColor: "#FFFFFF",
            volumeBorder: "1px solid #808080",

            timeColor: "#000000",
            durationColor: "#535353"
            }
            },
            clip: {
                autoPlay: true
            },
            playlist: ' . json_encode($_playlist) . '

            });
        ';
    }

    /**
     * @param $mplayer
     * @param $cm
     * @param $context
     * @return string
     */
    function jwplayer_body($mplayer, $cm, $context) {
        $listbar = $mplayer->playlist ? $mplayer->playlist : 'none';

        if (1) {
            switch ($mplayer->type) {
                case 'video':
                    $urlArray = mplayer_get_file_url($mplayer, 'mplayerfile', $context, true);
                    break;
                case 'url':
                    $urlArray = explode(';', ' ;' . $mplayer->external);
                    break;
                default: $urlArray = array();
                break;
            }
            $playlistthumb = mplayer_get_file_url($mplayer, 'playlistthumb', $context, true);
            $_playlist = array();
            if (is_array($urlArray)) {
                foreach ($urlArray as $index => $url) {
                    if ($index && $url) {
                        $_playlist[] = array(
                            'file'  => $url,
                            'image' => isset($playlistthumb[$index]) ? $playlistthumb[$index] : '',
                            'title' => 'test'
                        );
                    }
                }
            }
        }

        $jw_body = '<script type="text/javascript" src="jw/6.11/jwplayer.js"></script>
        <script type="text/javascript">jwplayer.key="pZDZgizUElLVj2BEBWMBql9bbp9Bnckbg7qQxw==";</script>
        <div id="jw-player">Loading the player ...</div>
        <script type="text/javascript">
            jwplayer("jw-player").setup({
                //file: "'.mplayer_get_file_url($mplayer, 'mplayerfile', $context).'",
                playlist: '.json_encode($_playlist).',
                height: "'.$mplayer->height.'",
                width: "'.$mplayer->width.'",
                //image: "'.mplayer_get_file_url($mplayer, 'image', $context).'",
                volume: "'.$mplayer->volume.'",
                autostart: "'.$mplayer->autostart.'",
                listbar: {
                    position: "'.$listbar.'",
                    size: "'.$mplayer->playlistsize.'"

                  }
            });
        </script>';

        return $jw_body;
    }

    /**
     * Draws a responsive progress bar 
     * outside style of progress bar is driven by mplayer stylesheet,
     * unless innerbar width.
     * @see ajax/markmediacompletion.php
     */
    function progressbar($progress, $progress2 = null) {
        $str = '';

        $str .= '<div class="mod-mplayer progressbar">';
        $str .= '<div class="mod-mplayer progressbar-outer">';
        $str .= '<div class="mod-mplayer progressbar-inner" style="width:'.$progress.'%">';
        $str .= '</div>';
        if (!is_null($progress2)) {
            $str .= '<div class="mod-mplayer progressbar-inner2" style="width:'.$progress2.'%">';
            $str .= '</div>';
        }
        $str .= '</div>';
        $str .= '</div>';

        return $str;
    }
}