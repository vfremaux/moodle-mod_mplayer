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
 * @package   mod_mplayer
 * @category  mod
 * @copyright Mat Bury (1.9)
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

/**
 * A custom renderer class that extends the plugin_renderer_base and is used by the assign module.
 *
 * @package mod_mplayer
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_mplayer_renderer extends plugin_renderer_base {

    /**
     * @param objectref &$mplayer
     */
    public function intro(&$mplayer) {
        $str = '';

        if (!empty($mplayer->intro)) {
            $str .= '<div class="mplayer intro">';
            $str .= format_text($mplayer->intro, $mplayer->introformat);
            $str .= '</div>';
        }

        return $str;
    }

    /**
     * Construct Javascript SWFObject embed code for <body> section of view.php
     * Please note: some URLs append a '?'.time(); query to prevent browser caching
     *
     * @param objectref &$mplayer (mdl_mplayer DB record for current mplayer module instance)
     * @return string
     */
    public function print_body(&$mplayer) {
        global $CFG;

        // A nice small tiny library for detecting mobile devices.
        require_once($CFG->dirroot.'/mod/mplayer/extralib/Mobile_Detect.php');

        $detect = new Mobile_Detect;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $mplayerbody = $this->get_device_based_mplayer($mplayer, $cm, $context, $detect);

        return $mplayerbody;
    }

    /**
     * prints the body of the player
     * @param objectref &$mplayer the MPlayer instance
     * @param objectref &$cm the associated course module
     * @param objectref &$context the associated context
     * @return a complete HTML string with all flow player code.
     */
    public function get_device_based_mplayer(&$mplayer, &$cm, &$context) {
        global $CFG;

        $isplaylist = false;

        if ($mplayer->technology == 'flowplayer') {
            $detector = new Mobile_Detect();
            if ($detector->isMobile() && $detector->isAndroid()) {
                $mplayerbody = $this->flowplayer_body($mplayer, $cm, $context, 'flash');
            } else {
                $mplayerbody = $this->flowplayer_body($mplayer, $cm, $context, 'html5');
            }
        } else {
            $mplayerbody = $this->jwplayer_body($mplayer, $cm, $context);
        }

        if (!empty($mplayer->notes)) {
            $mplayerbody .= '<div class="mplayer-notes"><p>'.$mplayer->notes.'</p></div>';
        }

        return $mplayerbody;
    }

    /**
     * prints the flowplayer effective body (html5)
     *
     * @param objectref &$mplayer the MPlayer instance
     * @param objectref &$cm the associated course module object
     * @param objectref &$context the context object for this module
     * @param string $forcedtype when equals to 'flash' will force the flash engine to be used
     * whatever the technical detection.
     * return html string
     */
    public function flowplayer_body(&$mplayer, &$cm, &$context, $forcedtype = '') {
        global $CFG, $DB;
        static $loaded = false;

        $config = get_config('mplayer');

        $isplaylist = false;
        $playlisthtml = '';
        $canloadsmil = false;
        $js = '';
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        // Protect playlist type after a technology switch.
        if (!in_array($mplayer->playlist, array('dots', 'thumbs'))) {
            $DB->set_field('mplayer', 'playlist', 'dots', array('id' => $mplayer->id));
        }

        if (!isset($config->default_native_fullscreen)) {
            set_config('default_native_fullscreen', 'false', 'mplayer');
        }

        /*
         * Check poster image or splash screen
         * change get poster image in poster directory
         */
        if (empty($mplayer->splashmode)) {
            if ($posterurl = mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/posters/')) {
                $js .= 'flp'.$mplayer->id.".set('poster', '$posterurl');\n";
            }
        } else {
            if ($posterurl = mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/posters/')) {
                $js .= 'flp'.$mplayer->id.".set('splash', '$posterurl');\n";
            }
        }

        // Check and get the autoplay capability.
        if ($mplayer->autostart == 'true') {
            $js .= 'flp'.$mplayer->id.".set('autoplay', true);\n";
        }

        // Check and get the fullscreen capability.
        if ($mplayer->fullscreen == 'true') {
            $js .= 'flp'.$mplayer->id.".set('fullscreen', true);\n";
        }

        // Check and get the muted state.
        // $muted = 'data-muted='.$mplayer->mute;

        // Check and get the volume.
        $js .= 'flp'.$mplayer->id.".set('volume', '".sprintf("%.2f", $mplayer->volume / 100)."');\n";

        if ($mplayer->playlist == 'thumbs') {
            $playlistsheet = 'thumbs_playlist';
            $playlistclass = 'thumbs';
        } else {
            $playlistsheet = 'dots_playlist';
            $playlistclass = 'dots';
        }

        $engine = ($forcedtype == 'flash') ? ' data-engine="flash" ' : ' data-engine="html5" ';

        // Check and get the playlist.
        $clips = $this->flowplayer_get_clips($mplayer, $context);

        if (!empty($clips)) {
            $js .= $this->flowplayer_build_playlist($mplayer, $clips);
        }

        $js .= $this->flowplayer_subtitles($mplayer);
        $js .= $this->flowplayer_cuepoints($mplayer, $context);
        $style = $this->flowplayer_build_style($mplayer);

        // Load those once only.
        $scriptloadfragment = $this->flowplayer_init_scripts($playlistsheet);

        // Streaming related tag.
        $rtmpdata = '';
        if ($mplayer->type == 'rtmp' && $mplayer->streamer == 'wowza') {
            /*
            // Not resolved yet.
            $canloadsmil = true;
            $rtmpdata = 'data-rtmp="'.@$config->wowzaserver.@$config->wowzaapplication.'" ';
            */
            $js .= 'flp'.$mplayer->id.".set('rtmp', '".@$config->wowzaserver.@$config->wowzaapplication."');\n";
        }

        // Master player DIV.
        if (is_numeric($mplayer->height)) {
            $mplayer->height .= 'px';
        }
        if (is_numeric($mplayer->width)) {
            $mplayer->width .= 'px';
        }
        $mplayerbody = $scriptloadfragment."\n";
        $mplayerbody .= '<div class="mplayer-cont embed-responsive '.$mplayer->playlist.'"
                              style="width:'.$mplayer->width.';height:'.$mplayer->height.'"
                              id="flp'.$mplayer->id.'">';
        $mplayerbody .= $this->flowplayer_cue_panels($mplayer);
        if ($mplayer->playlist) {
            $mplayerbody .= $this->flowplayer_playlist_html($mplayer, $clips);
        }
        $mplayerbody .= '</div>'; // Master container.
        $mplayerbody .= $this->flowplayer_completion($mplayer, $clips); // Completion container.
        $mplayerbody .= '<script type="text/javascript">'."\n";
        $mplayerbody .= 'flp'.$mplayer->id." = new FlowplayerConfig();\n";
        $mplayerbody .= $js;
        $mplayerbody .= 'flp'.$mplayer->id.'.render('.$mplayer->id.");\n";
        $mplayerbody .= "</script>\n";
        $mplayerbody .= '<style>'.$style."</style>\n";

        if (debugging() && !empty($config->displaydebugcode)) {
            $mplayerbody .= '<pre>'.htmlentities($mplayerbody).'</pre>';
        }

        // If can load smile.
        if ($canloadsmil) {
            // Untested.
            $mplayerbody .= $this->flowplayer_load_smil($mplayer);
        }

        return $mplayerbody;
    }

    /**
     * Get clip information from any possible source
     *
     * @param objectref &$mplayer
     * @param object $context
     * @return an array of arrays as source definitions per clip
     */
    public function flowplayer_get_clips(&$mplayer, $context) {
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

            case 'url': {
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
                return null;
        }

        return $clips;
    }

    /**
     * Builds the js sequence for making clips and playlist from a $clips array.
     * @param objectref &$mplayer
     * @param array $clips
     */
    public function flowplayer_build_playlist(&$mplayer, $clips) {
        $js = '';

        // One single clip. No playlist.
        if (empty($clips)) {
            return $js;
        }

        if (count($clips) == 1) {
            foreach ($clips[0]->sources as $source) {
                $type = mplayer_flowplayer_get_type($mplayer, $source);
                $js .= 'source = new Source(\''.$type.'\', \''.$source.'\');'."\n";
                $js .= 'flp'.$mplayer->id.'.setSource(source);'."\n";
            }
        } else {
            // If multiple clips, we need make a playlist.
            foreach ($clips as $clipix => $clip) {
                $js .= 'clip = new Clip();'."\n";
                foreach ($clip->sources as $source) {
                    $type = mplayer_flowplayer_get_type($mplayer, $source);
                    $js .= 'source = new Source(\''.$type.'\', \''.$source.'\');'."\n";
                    $js .= 'clip.addSource(source);'."\n";
                }
                $js .= 'flp'.$mplayer->id.'.addClip(clip);'."\n";
            }
        }

        return $js;
    }

    /**
     * Experimental
     * @param objectref &$mplayer
     */
    protected function flowplayer_load_smil(&$mplayer) {
        global $CFG;

        $str = '';
        $str .= '<script type="text/javascript">'."\n";
        $str .= 'var mplayerinstance = flowplayer(\'flowplayer_'.$mplayer->id.'\')'."\n";
        $smilurl = $CFG->wwwroot.'/mod/mplayer/flowplayer6/flowplayer.smil-3.2.9.swf';
        $str .= 'mplayerinstance.loadPlugin(\'smil\', \''.$smilurl.'\');'."\n";
        $str .= '</script>'."\n\n";

        return $str;
    }

    /**
     * Builds all HTML output for playlist visible parts
     * @param objectref &$mplayer
     * @param array $clips
     */
    public function flowplayer_playlist_html(&$mplayer, $clips) {

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $str = '';

        if (empty($clips)) {
            return $str;
        }

        $hgroups = '';
        $str .= '<div class="fp-playlist">';

        $i = 0;
        foreach ($clips as $clip) {

            $listitemcontent = '';
            if (!empty($clip->thumb)) {
                $listitemcontent = '<img src="'.$clip->thumb.'" />';
            }
            $cliplink = '<a href="'.$clip->sources[0].'"
                            alt="'.@$clip->title.'"
                            title="'.@$clip->title.'"
                            id="item'.$i.'">'.$listitemcontent.'</a>';
            $str .= $cliplink;

            $hgtitle = '<h1 class="fp-playlist-info">'.@$clip->title.'</h1>';
            $hgroups .= ' <hgroup class="info'.$i.'">'.$hgtitle.'</hgroup>';
            $i++;
        }

        $str .= '</div>';
        $str .= '<div>';
        $str .= $hgroups;
        $str .= '</div>';

        return $str;
    }

    /**
     * Prints the completion widget
     * @param object $mplayer the MPlayer instance
     * @return string the completion HTML sequence and HTML representation.
     */
    public function flowplayer_completion($mplayer, $clips) {
        global $CFG;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        if (!isloggedin() || is_guest($context)) {
            return;
        }

        $str = '<div class="mplayer-completion-container container-fluid">';
        $str .= '<div class="row-fluid">';
        if ($clipsnum = count($clips)) {
            $width = 100 / $clipsnum - 1;
            foreach (array_keys($clips) as $clipix) {
                $str .= ' <div class="mplayer-completion"
                               id="mplayer-progress-'.$mplayer->id.'_'.$clipix.'"
                               title="'.@$clips[$clipix]->title.'"
                               style="width:'.$width.'%"></div>';
            }
        }
        $str .= '</div>';
        $str .= '</div>';

        return $str;
    }

    /**
     * Build the subtitles members.
     * It accepts that files may adopt several syntax to
     * be dispatched on clips and selected as for language:
     *
     * {n}_subtitlefilename.vtt
     * {n}_subtitlefilename_{lang}.vtt
     * subtitlefilename_{lang}.vtt
     *
     * are accepted, with n numeric addressing the playlist index (0 for current clip).
     *
     * @param object $mplayer the mplayer instance
     * @return an HTML String with track element list
     */
    public function flowplayer_subtitles($mplayer) {
        global $CFG, $COURSE, $USER;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $fs = get_file_storage();

        $js = '';

        $strm = get_string_manager();
        $languages = $strm->get_list_of_languages();
        $langs = implode('|', array_keys($languages));

        if ($files = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/tracks/', true, false,
                                              'filepath, filename')) {

            while ($file = array_shift($files)) {
                $filename = pathinfo($file->get_filename(), PATHINFO_FILENAME);
                $filepath = $file->get_filepath();
                if (preg_match("/_($langs)/", $filename, $matches)) {
                    $lang = $matches[1];
                } else {
                    $lang = 'en';
                }

                if (preg_match('#^/tracks/(\d+)/#', $filepath, $matches)) {
                    $ix = $matches[1];
                } else {
                    if (preg_match("/^(\d+)_/", $filename, $matches)) {
                        $ix = $matches[1];
                    } else {
                        $ix = 0;
                    }
                }

                if ($mplayer->langselection == 0) {
                    $expectedlang = $COURSE->lang;
                } else if ($mplayer->langselection == 1) {
                    $expectedlang = $USER->lang;
                } else if ($mplayer->langselection == 2) {
                    assert(1);
                } else if ($mplayer->langselection == 2) {
                    $expectedlang = $mplayer->langforced;
                }

                if (!empty($mplayer->selectlanguage)) {
                    if (!empty($lang) && $expectedlang != $lang) {
                        continue;
                    }
                }

                $trackurl = moodle_url::make_pluginfile_url($context->id, 'mod_mplayer', 'mplayerfiles', 0, $file->get_filepath(),
                                                            $file->get_filename());
                $subtitles[$lang][$ix] = $trackurl;
            }

            foreach ($subtitles as $lang => $arr) {
                foreach ($arr as $ix => $trackurl) {
                    $langlabel = $languages[$lang];
                    if ($ix == 0) {
                        $js .= 'flp'.$mplayer->id.".setSubtitle('subtitles', '$trackurl', '$lang', '$langlabel', true)\n";
                        $js .= 'flp'.$mplayer->id.".addSubtitle(0, 'subtitles', '$trackurl', '$lang', '$langlabel', true)\n";
                    } else {
                        $js .= 'flp'.$mplayer->id.".addSubtitle($ix, 'subtitles', '$trackurl', '$lang', '$langlabel')\n";
                    }
                }
            }
        }

        return $js;
    }

    /**
     * Get cue list definitions from mplayer configuration and prepare
     * Cue point arrays and HTML output.
     * @param object $mplayer the HTML5 MPlayer instance
     * @param arrayref $datacuepointsarr An array of cue points to fill
     */
    public function flowplayer_cuepoints(&$mplayer, $context) {

        // First get cue files if any.
        $fs = get_file_storage();

        $order = 'filepath, filename';
        $cuefiles = $fs->get_directory_files($context->id, 'mod_mplayer', 'mplayerfiles', 0, '/cues/', true, false, $order);
        $cues = array();
        if (!empty($cuefiles)) {
            foreach ($cuefiles as $storedfile) {
                $filepath = $storedfile->get_filepath();
                $filename = $storedfile->get_filename();

                if ($filepath == '/cues/') {
                    if (preg_match('/^(\d+)_/', $filename, $matches)) {
                        $ix = $matches[0];
                    } else {
                        $ix = 0;
                    }
                } else if (preg_match('#/cues/(\d+)/#', $filepath, $matches)) {
                    $ix = $matches[1];
                } else {
                    continue;
                }
                // Ignore all other files.
                $cuelist = $storedfile->get_content();
                $cuelist = preg_replace("/\r/", '', $cuelist); // Protect windows end lines.
                $cuearr = explode("\n", $cuelist);
                foreach ($cuearr as $c) {
                    $cues[] = $ix.'|'.$c;
                }
            }
        }

        $js = '';

        if (!empty($cues)) {
            $mplayer->_has_cues = true;
            foreach ($cues as $cue) {
                @list($ix, $time, $url, $cueout, $mandatory) = explode('|', trim($cue));
                if (empty($time)) {
                    continue;
                }
                if (empty($mandatory)) {
                    $mandatory = 'optional';
                }

                // Guess a type from url.
                $type = '';
                if (preg_match('#\/mod/(.+?)/view#', $url, $matches)) {
                    $type = 'mod_'.$matches[1];
                }

                list($h, $m, $s) = explode(':', $time);
                $sectime = $h * 3600 + $m * 60 + $s;

                if ($ix == 0) {
                    $js .= 'flp'.$mplayer->id.".setCue('$sectime', '$url', '$cueout', '$type', '$mandatory');\n";
                } else {
                    $js .= 'flp'.$mplayer->id.".addCue($ix, '$sectime', '$url', '$cueout', '$type', '$mandatory');\n";
                }
            }
        }
        return $js;
    }

    public function flowplayer_cue_panels($mplayer) {
        $str = '';

        if (empty($mplayer->_has_cues)) {
            return $str;
        }

        $str .= '<div id="fp-cue-in-'.$mplayer->id.'" class="fp-cue-in-panel">';
        $str .= '</div>';
        $str .= '<div id="fp-cue-out-'.$mplayer->id.'" class="fp-cue-resume-panel">';
        $str .= get_string('resumefromcue', 'mod_mplayer');
        $str .= '</div>';

        return $str;
    }

    /**
     * Writes once only the js calls
     * @param string $playlistsheet
     */
    public function flowplayer_init_scripts($playlistsheet) {
        global $CFG, $PAGE;
        static $loaded = false;

        $scriptloadfragment = '';
        if (!$loaded) {
            $flowplayercompletionjscodeurl = new moodle_url('/mod/mplayer/js/completion.js');
            $flowplayercuejscodeurl = new moodle_url('/mod/mplayer/js/cuepoints.js');
            if (!debugging()) {
                $flowplayerjscodeurl = new moodle_url('/mod/mplayer/flowplayer6/flowplayer.min.js');
            } else {
                $flowplayerjscodeurl = new moodle_url('/mod/mplayer/flowplayer6/flowplayer.js');
            }
            $flowplayerjswrapperurl = new moodle_url('/mod/mplayer/js/flowplayer.js');
            $flowplayercssurl = new moodle_url('/mod/mplayer/flowplayer6/skin/functional.css');
            $flowplayerplaylistcssurl = new moodle_url('/mod/mplayer/flowplayer6/'.$playlistsheet.'.css');

            if (isloggedin() && !is_guest($PAGE->context)) {
                $scriptloadfragment .= '
                    <script type="text/javascript" src="'.$flowplayercompletionjscodeurl.'"></script>';
            }
            $scriptloadfragment .= '
                <script type="text/javascript" src="'.$flowplayercuejscodeurl.'"></script>
                <script type="text/javascript" src="'.$flowplayerjswrapperurl.'"></script>
                <script type="text/javascript" src="'.$flowplayerjscodeurl.'"></script>
                <link rel="stylesheet" type="text/css" href="'.$flowplayercssurl.'">
                <link rel="stylesheet" type="text/css" href="'.$flowplayerplaylistcssurl.'">
                <script type="text/javascript">
                var wwwroot = \''.$CFG->wwwroot.'\';
                </script>
            ';

            $loaded = true;
        }
        return $scriptloadfragment;
    }

    /**
     * Not used.
     */
    public function flowplayer_flash_body() {
        global $CFG;

        $body = '
            var _flowplayer = flowplayer("flowplayer", "'.$CFG->wwwroot.'/mod/mplayer/skins/'.$mplayer->skin.'", {
            plugins: {
            controls: {
            url: "'.$CFG->wwwroot.'/mod/mplayer/flowplayer/flowplayer.swf",

            // Customize the appearance make it have a lighter look.
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
            playlist: ' . json_encode($this->playlist) . '

            });
        ';
    }

    /**
     * Builds the flowplayer class and style ruleset
     * @param objectref &$mplayer
     */
    public function flowplayer_build_style(&$mplayer) {
        $style = '';

        if ($mplayer->screencolor) {
            $style .= '.flowplayer {background-color: #'.str_replace('#', '', $mplayer->screencolor).' !important;}';
        }
        if ($mplayer->backcolor) {
            $style .= '.flowplayer .fp-controls {background-color: #'.str_replace('#', '', $mplayer->backcolor).' !important;}';
        }
        if ($mplayer->frontcolor) {
            $style .= '.flowplayer .fp-progress, .flowplayer .fp-volumelevel {
                background-color: #'.str_replace('#', '', $mplayer->frontcolor).' !important;
            }';
        }
        if ($mplayer->lightcolor) {
            $style .= '.flowplayer .fp-buffer {background-color: #'.str_replace('#', '', $mplayer->lightcolor).' !important;}';
            $style .= '.flowplayer .fp-time .fp-elapsed, .flowplayer .fp-time .fp-duration, .flowplayer .fp-mute {
                color: #'.str_replace('#', '', $mplayer->lightcolor).' !important;
            }';
        }

        return $style;
    }

    /**
     * Prints JW player body.
     *
     * @param objectref &$mplayer
     * @param object $cm
     * @param object $context
     * @return string
     */
    public function jwplayer_body(&$mplayer, $cm, $context) {
        global $CFG;

        $listbar = $mplayer->playlist ? $mplayer->playlist : 'none';

        if (1) {
            switch ($mplayer->type) {

                case 'video':
                case 'sound': {
                    $urlarray = mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/medias/0/', true);
                    break;
                }

                case 'url': {
                    $urlarray = explode(';', ' ;' . $mplayer->external);
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
            $this->playlist = array();

            if (is_array($urlarray)) {
                foreach ($urlarray as $index => $url) {
                    if ($index !== '' && $url) {
                        $this->playlist[] = array(
                            'file'  => $url,
                            'image' => isset($playlistthumb[$index]) ? $playlistthumb[$index] : '',
                            'title' => 'test'
                        );
                    }
                }
            }
        }

        $jwbody = '<script type="text/javascript" src="'.$CFG->wwwroot.'/mod/mplayer/jw/6.11/jwplayer.js"></script>
        <script type="text/javascript">jwplayer.key="pZDZgizUElLVj2BEBWMBql9bbp9Bnckbg7qQxw==";</script>
        <div id="jw-player">'.get_string('loadingplayer', 'mplayer').'</div>
        <script type="text/javascript">
            jwplayer("jw-player").setup({
                "file" : "'.$urlarray[0].'",
                "image": "'.mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/posters/').'",
                "playlist" : '.json_encode($this->playlist).',
                "height" : "'.$mplayer->height.'",
                "width" : "'.$mplayer->width.'",
                volume: "'.$mplayer->volume.'",
                autostart: "'.$mplayer->autostart.'",
                listbar: {
                    position: "'.$listbar.'",
                    size: "'.$mplayer->playlistsize.'"
                }
            });
        </script>';

        return $jwbody;
    }

    /**
     * Draws a responsive progress bar
     * outside style of progress bar is driven by mplayer stylesheet,
     * unless innerbar width.
     * @see ajax/markmediacompletion.php
     *
     * @param int $progress
     * @param int $progress2
     */
    public function progressbar($progress, $progress2 = null) {
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


    /**
     * plays a soundcard
     *
     * @param reference $flashcard
     * @param string $soundname the local name of the sound file. Should be wav or any playable sound format.
     * @param string $autostart if 'true' the sound starts playing immediately
     * @see mod_flashcard
     * NOT USED YET
     */
    public function play_sound(&$mplayer, $clipid, $autostart = 'false', $htmlname = '') {
        global $CFG, $COURSE;

        $strmissingsound = get_string('missingsound', 'mplayer');

        $fs = get_file_storage();

        // New way : probably no effective fieldids storage needed anymore.
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);
        $contextid = $context->id;
        $soundfiles = $fs->get_directory_files($context->id, 'mod_mplayer', $filearea, 0, '/media/');

        if (empty($soundfiles)) {
            $soundfileurl = $this->output->pix_url('notfound', 'mod_mplayer');
            $soundhtml = "<img src=\"{$soundfileurl}\" />";
            return $soundhtml;
        }

        $soundfile = array_pop($soundfiles);
        $filename = $soundfile->get_filename();

        $magic = rand(0, 100000);
        if ($htmlname == '') {
            $htmlname = "bell_{$magic}";
        }

        $soundfileurl = $CFG->wwwroot."/pluginfile.php/{$contextid}/mod_mplayer/{$filearea}/0/media/{$clipid}/{$filename}";

        if (!preg_match('/\.mp3$/i', $filename)) {
            $soundhtml = "<embed src=\"{$soundfileurl}\"
                                 autostart=\"{$autostart}\"
                                 hidden=\"false\"
                                 id=\"{$htmlname}_player\"
                                 height=\"20\"
                                 width=\"200\" />";
            $soundhtml .= "<a href=\"{$soundfileurl}\"
                              autostart=\"{$autostart}\"
                              hidden=\"false\"
                              id=\"{$htmlname}\"
                              height=\"20\"
                              width=\"200\" />";
        } else {
            $soundhtml = flashcard_mp3_dewplayer($flashcard, $soundfileurl, $htmlname);
        }

        return $soundhtml;
    }
}