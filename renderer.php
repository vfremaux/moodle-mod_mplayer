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
require_once($CFG->dirroot.'/mod/mplayer/classes/passpoint.class.php');

/**
 * A custom renderer class that extends the plugin_renderer_base and is used by the assign module.
 *
 * @package mod_mplayer
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_mplayer_renderer extends plugin_renderer_base {

    protected $mplayer;

    public function set_mplayer(&$mplayer) {
        $this->mplayer = $mplayer;
    }

    /**
     * @param objectref &$mplayer
     */
    public function intro(&$mplayer) {

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $str = '';

        if (!empty(strip_tags($mplayer->intro, '<img><a><button><input>'))) {
            $str .= '<div class="mplayer intro">';
            $introoptions = array('maxfiles' => EDITOR_UNLIMITED_FILES,
            'noclean' => true, 'context' => $context, 'subdirs' => true);
            $intro = file_rewrite_pluginfile_urls($mplayer->intro, 'pluginfile.php', $context->id,
            'mod_mplayer', 'intro', null, $introoptions);
            $str .= format_text($intro, $mplayer->introformat);
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
    public function print_body($mplayer) {
        global $CFG;
        static $styleloaded = false;

        // Register for some calls.
        $this->mplayer = $mplayer;

        $config = get_config('mplayer');

        // A nice small tiny library for detecting mobile devices.
        require_once($CFG->dirroot.'/mod/mplayer/extralib/Mobile_Detect.php');

        $detect = new Mobile_Detect();

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $mplayerbody = '';

        if (!$styleloaded) {
            if (!empty($config->extracss)) {
                $mplayerbody .= "
                    <style>
                    {$config->extracss}
                    </style>
                ";
            }
        }

        $mplayerbody .= $this->get_device_based_mplayer($mplayer, $cm, $context, $detect);

        $canassess = true;
        if ($canassess) {
            $mplayerbody .= $this->assessable_controls($mplayer, $cm);
        }

        return $mplayerbody;
    }

    /**
     * prints the body of the player
     * @param objectref &$mplayer the MPlayer instance
     * @param objectref &$cm the associated course module
     * @param objectref &$context the associated context
     * @return a complete HTML string with all flow player code.
     */
    public function get_device_based_mplayer($mplayer, $cm, $context) {
        global $CFG, $SESSION;

        $SESSION->assessabletries = 0;

        $isplaylist = false;

        if (in_array($mplayer->technology, array('flowplayer', 'flowplayer8'))) {
            $detector = new Mobile_Detect();
            if ($detector->isMobile() && $detector->isAndroid()) {
                $mplayerbody = $this->flowplayer_body($mplayer, $cm, $context, 'flash');
            } else {
                $mplayerbody = $this->flowplayer_body($mplayer, $cm, $context, 'html5');
            }
        } else {
            $mplayerbody = $this->jwplayer_body($mplayer, $cm, $context);
        }

        if (!empty(strip_tags($mplayer->notes, '<img><a><button><input>'))) {
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
    public function flowplayer_body($mplayer, $cm, $context, $forcedtype = '') {
        global $CFG, $DB, $PAGE;
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
            $mplayer->playlist = 'dots';
            mplayer_save_attributes($mplayer);
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
        $clips = mplayer_get_clips($mplayer, $context);

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
        $mplayerbody .= '<div class="mplayer-external-container">';
        $mplayerbody .= '<div class="mplayer-cont embed-responsive '.$mplayer->playlist.'"
                                style="width: '.$mplayer->width.'; height: '.$mplayer->height.'"
                              id="flp'.$mplayer->id.'">';

        $params = ['id' => $mplayer->id, 'width' => $mplayer->width, 'height' => $mplayer->height];
        $PAGE->requires->js_call_amd('mod_mplayer/mplayer', 'init', [$params]);
        $mplayerbody .= $this->flowplayer_cue_panels($mplayer);
        if ($mplayer->playlist) {
            $mplayerbody .= $this->flowplayer_playlist_html($mplayer, $clips);
        }
        $mplayerbody .= '</div>'; // Master flowplayer container.

        // Fake playlist takes the vertical room but does not show.
        $mplayerbody .= '<div class="shadow-playlist-cont" style="visibility: hidden">';
        if ($mplayer->playlist == 'thumbs') {
            $mplayerbody .= $this->flowplayer_playlist_shadow_html($mplayer, $clips);
        }
        $mplayerbody .= '</div>';

        $mplayerbody .= '</div>'; // External container.
        $mplayerbody .= $this->mplayer_completion($mplayer, $clips); // Completion container.
        $mplayerbody .= '<script type="text/javascript">'."\n";
        $mplayerbody .= 'flp'.$mplayer->id." = new FlowplayerConfig();\n";
        $mplayerbody .= $js;
        $mplayerbody .= 'flp'.$mplayer->id.'.render('.$mplayer->id.");\n";

        if (!empty($mplayer->forcefullscreen)) {
            $mplayerid = '#flp'.$mplayer->id;
            $mplayerbody .= ' $(\''.$mplayerid.'\').on(\'load\', function(e, api) { api.fullscreen(); }); '."\n";
        }

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

        $clips = (array)$clips;

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
        $str .= 'var mplayerinstance = flowplayer(\'#flp'.$mplayer->id.'\')'."\n";
        $smilurl = $CFG->wwwroot.'/mod/mplayer/extralib/players/flowplayer6/flowplayer.smil-3.2.9.swf';
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
                            class="mplayer-thumb-link"
                            id="item'.$i.'"
                            data-index="'.$i.'">'.$listitemcontent.'</a>';
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
     * Builds all HTML output for playlist visible parts
     * @param objectref &$mplayer
     * @param array $clips
     */
    public function flowplayer_playlist_shadow_html(&$mplayer, $clips) {

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $str = '';

        if (empty($clips)) {
            return $str;
        }

        $hgroups = '';
        $str .= '<div id="shadow-playlist-'.$mplayer->id.'" class="shadow-playlist '.$mplayer->playlist.'">';

        $i = 0;
        foreach ($clips as $clip) {

            $hasthumb = '';
            $listitemcontent = '';
            if (!empty($clip->thumb)) {
                $listitemcontent = '<img src="'.$clip->thumb.'" data-clipid="'.$i.'" />';
                $hasthumb = 'hasthumb';
            }
            $cliplink = '<a href="" class="mplayer-thumb-link '.$hasthumb.'">'.$listitemcontent.'</a>';
            $str .= $cliplink;

            $i++;
        }

        $str .= '</div>';

        return $str;
    }

    /**
     * Prints the completion widget
     * @param object $mplayer the MPlayer instance
     * @return string the completion HTML sequence and HTML representation.
     */
    public function mplayer_completion(&$mplayer, $clips, $user = null) {
        global $CFG, $USER, $DB;

        if (is_null($user)) {
            $user = $USER;
        }

        if ($mplayer->showpasspoints == 0) {
            return '';
        }

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        if (!isloggedin() || is_guest($context)) {
            return;
        }

        $passpoints = new \mod_mplayer\tracking\Passpoint($mplayer, $cm);

        $template = new StdClass;
        $template->mpid = $mplayer->id;

        $clips = (array)$clips;
        if ($clipsnum = count($clips)) {
            // $barpctwidth = 100 / $clipsnum - 1; // No ! each bar has 100% width
            $barpctwidth = 100;
            foreach (array_keys($clips) as $clipix) {
                $progressbartpl = new StdClass;
                $progressbartpl->clipid = $clipix;
                $progressbartpl->title = @$clips[$clipix]->cliptitle;
                $progressbartpl->barwidth = $barpctwidth;
                $passpoints->load_track($user->id, $clipix);
                $maxprogress = $passpoints->get_maxprogress($user->id, $clipix);

                $segmenttpl = new StdClass;
                $segmenttpl->id = 0;
                $segmenttpl->width = 0;
                $segmenttpl->class = 'currentread';
                $progressbartpl->segments[] = $segmenttpl;

                $segmenttpl = new StdClass;
                $segmenttpl->id = 1;
                $segmenttpl->width = $maxprogress;
                $segmenttpl->class = 'maxread';
                $progressbartpl->segments[] = $segmenttpl;

                $j = 2;
                if ($mplayer->showpasspoints || has_capability('mod/mplayer:assessor', $context)) {
                    $cliptrack = $passpoints->get_cliptrack($user->id, $clipix);

                    foreach ($cliptrack->passpoints as $ppc => $st) {
                        $segmenttpl = new StdClass;
                        $segmenttpl->width = 1;
                        $segmenttpl->id = $j;
                        $segmenttpl->left = $ppc * $barpctwidth / 100;
                        if ($st) {
                            $segmenttpl->class = 'passedpoint';
                        } else {
                            $segmenttpl->class = 'unpassedpoint';
                        }
                        $progressbartpl->segments[] = $segmenttpl;
                        $j++;
                    }
                }

                // Now process highlighters.
                if (!empty($clips[$clipix]->duration) &&
                        ($clips[$clipix]->duration >= 0) &&
                                $highlightzones = mplayer_get_highlighted_zones($mplayer, $clipix)) {
                    foreach ($highlightzones as $hlz) {
                        list($startpc, $endpc) = mplayer_compute_segment_points($hlz->startpoint, $hlz->endpoint, $clips[$clipix]);
                        $segmenttpl = new StdClass;
                        $segmenttpl->width = max(1, $endpc - $startpc);
                        $segmenttpl->id = $j;
                        $segmenttpl->left = $startpc * $barpctwidth / 100;
                        $segmenttpl->class = 'highlight';
                        $segmenttpl->title = format_string($hlz->name).' '.mplayer_format_time($hlz->startpoint).'-'.mplayer_format_time($hlz->endpoint);
                        $progressbartpl->segments[] = $segmenttpl;
                        $j++;
                    }
                }
                $progressbartpl->startcount = mplayer_get_highlighted_zones_counter($mplayer, $clipix);
                $template->progressbars[] = $progressbartpl;
            }
        }

        return $this->output->render_from_template('mod_mplayer/progresstrack', $template);
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
     * this is to include once the complementary JS we need.
     * NOTE : most of the js/css are now loaded via mplayer_require_js
     * @param string $playlistsheet
     */
    public function flowplayer_init_scripts($playlistsheet) {
        global $CFG, $PAGE;
        static $loaded = false;

        $scriptloadfragment = '';
        if (!$loaded) {
            $flowplayerbasecssurl = new moodle_url('/mod/mplayer/extralib/players/flowplayer6/skin/minimalist.css');
            $flowplayerplaylistcssurl = new moodle_url('/mod/mplayer/extralib/players/flowplayer6/'.$playlistsheet.'.css');
            $flowplayercompletionjscodeurl = new moodle_url('/mod/mplayer/js/completion.js');
            $flowplayerconfigjscodeurl = new moodle_url('/mod/mplayer/js/flowplayer.js');

            if (isloggedin() && !is_guest($PAGE->context)) {
                $scriptloadfragment .= '<script type="text/javascript" src="'.$flowplayerconfigjscodeurl.'"></script>';
                $scriptloadfragment .= '<script type="text/javascript" src="'.$flowplayercompletionjscodeurl.'"></script>';
            }
            $scriptloadfragment .= '
                <link rel="stylesheet" type="text/css" href="'.$flowplayerplaylistcssurl.'">
                <link rel="stylesheet" type="text/css" href="'.$flowplayerbasecssurl.'">
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
            var _flowplayer = flowplayer("flowplayer", "'.$CFG->wwwroot.'/mod/mplayer/extralib/players/skins/'.$mplayer->skin.'", {
            plugins: {
            controls: {
            url: "'.$CFG->wwwroot.'/mod/mplayer/extralib/players/flowplayer6/flowplayer.swf",

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
        global $CFG, $COURSE;

        $completioninfo = new completion_info($COURSE);

        $listbar = $mplayer->playlist ? $mplayer->playlist : 'none';
        $mute = ($mplayer->mute == 'true') ? 'true' : 'false';
        $autostart = ($mplayer->autostart == 'true') ? 'true' : 'false';

        $this->jw_build_playlist($mplayer, $context, $urlarray);

        $jwbody = '<div id="jwplayer_'.$mplayer->id.'" style="width: {$mpplayer->width}; height:{$mplayer->height}">'.get_string('loadingplayer', 'mplayer').'</div>';

        $jwbody .= '<script type="text/javascript">
        window.onload = function() {
            jwplayer.key = "pZDZgizUElLVj2BEBWMBql9bbp9Bnckbg7qQxw==";
            jwplayer("jwplayer_'.$mplayer->id.'").setup({
                "file": "'.$urlarray[0].'",
                "image": "'.mplayer_get_file_url($mplayer, 'mplayerfiles', $context, '/posters/').'",
                "playlist": '.json_encode($this->playlist).',
                "height": "'.$mplayer->height.'",
                "width": "'.$mplayer->width.'",
                "volume": "'.$mplayer->volume.'",
                "mute": "'.$mute.'",
                "autostart": "'.$autostart.'",
                "stretching": "'.$mplayer->stretching.'",
                "listbar": {
                    "position": "'.$listbar.'",
                    "size": "'.$mplayer->playlistsize.'",
                    "layout": "basic",
                }
            });
            setup_player_completion("jwplayer_'.$mplayer->id.'", "'.$mplayer->id.'");
        };

        </script>';

        if ($completioninfo->is_enabled($cm) && in_array($mplayer->technology, array('jw712', 'jw'))) {
            $jwbody .= '<div class="mplayer-jw-completion-container">';
            $jwbody .= $this->mplayer_completion($mplayer, $this->playlist);
            $jwbody .= '</div>';
        }

        return $jwbody;
    }

    public function jw_build_playlist($mplayer, $context, &$urlarray) {

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
        $this->playlist = array();

        if (is_array($urlarray)) {
            foreach ($urlarray as $index => $url) {
                if ($index !== '' && $url) {

                    // Admit failover type is encoded in piped extension.
                    $type = null;
                    $title = '';
                    if (strpos($url, '|') !== false) {
                        @list($url, $type, $title) = explode('|', $url);
                    }

                    $clip = new StdClass;
                    $clip->file = $url;
                    $clip->image = isset($playlistthumb[$index]) ? $playlistthumb[$index] : '';
                    $clip->title = $title;
                    if ($type) {
                        $clip->type = $type;
                    }
                    $clip->duration = -1;
                    $this->playlist[] = $clip;
                }
            }
        }
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
    public function progressbar(&$mplayer, $progress, $progress2 = null, $cliptrack = [], $highlights = [], $clipid = 0) {

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        if (preg_match('/^flowplayer/', $mplayer->technology)) {
            $clips = mplayer_get_clips($mplayer, $context);
        } else {
            if (!empty($this->playlist)) {
                $clips = $this->playlist;
            } else {
                $clips = ['1']; // count one.
            }
        }
        $barpctwidth = 100 / count($clips);

        $template = new StdClass;

        if (!is_null($progress2)) {
            $segmenttpl = new StdClass;
            $segmenttpl->width = $progress2 * $barpctwidth / 100;
            $segmenttpl->id = 0;
            $segmenttpl->left = 0;
            $segmenttpl->class = 'currentread';
            $template->segments[] = $segmenttpl;
        }

        $segmenttpl = new StdClass;
        $segmenttpl->width = $progress * $barpctwidth / 100;
        $segmenttpl->id = 1;
        $segmenttpl->left = 0;
        $segmenttpl->class = 'maxread';
        $template->segments[] = $segmenttpl;

        $j = 2;
        if ($mplayer->showpasspoints || has_capability('mod/mplayer:assessor', $context)) {
            foreach ($cliptrack->passpoints as $ppc => $st) {
                $segmenttpl = new StdClass;
                $segmenttpl->width = 1;
                $segmenttpl->id = $j;
                $segmenttpl->left = $ppc * $barpctwidth / 100;
                if ($st) {
                    $segmenttpl->class = 'passedpoint';
                } else {
                    $segmenttpl->class = 'unpassedpoint';
                }
                $template->segments[] = $segmenttpl;
                $j++;
            }
        }

        // Now process highlighters.
        if (!empty($clips[$clipid]->duration) && ($clips[$clipid]->duration >= 0) && !empty($highlights)) {
            foreach ($highlights as $hlz) {
                list($startpc, $endpc) = mplayer_compute_segment_points($hlz->startpoint, $hlz->endpoint, $clips[$clipid]);
                $segmenttpl = new StdClass;
                $segmenttpl->width = max(1, $endpc - $startpc);
                $segmenttpl->id = $j;
                $segmenttpl->left = $startpc * $barpctwidth / 100;
                $segmenttpl->class = 'highlight';
                $segmenttpl->title = format_string($hlz->name).' '.mplayer_format_time($hlz->startpoint).'-'.mplayer_format_time($hlz->endpoint);
                $template->segments[] = $segmenttpl;
                $j++;
            }
        }

        return $this->output->render_from_template('mod_mplayer/progressbar', $template);
    }

    public function progressicon($progressbar, $clipid) {
        if ($progressbar == 100) {
            return '<a title="Clip '.$clipid.'"><img class="mplayer-clip-state" src="'.$this->output->pix_url('ok', 'mplayer').'" alt="Clip $clipid not seen"></a>';
        } else {
            return '<a title="Clip '.$clipid.'"><img class="mplayer-clip-state" src="'.$this->output->pix_url('nook', 'mplayer').'" alt="Clip $clipid not seen"></a>';
        }
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
            $soundhtml = $this->output->pix_icon('notfound', '', 'mod_mplayer');
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

    public function clipselect($mplayer, $context) {
        $clips = mplayer_get_clips($mplayer, $context);

        if (empty($clips)) {
            return;
        }

        $clipcount = count($clips);

        for ( $i = 0 ; $i < $clipcount ; $i++ ) {
            if (!empty($clips[$i]->title)) {
                $options[$i] = $clips[$i]->title;
            } else {
                $options[$i] = $i;
            }
        }

        $clipid = optional_param('clipid', 0, PARAM_INT);

        $str = '<div class="mplayer-clip-select">';
        $str .= html_writer::select($options, 'clipid', $clipid, array());
        $str .= '</div>';
    }

    public function assessable_controls($mplayer) {
        global $DB;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = context_module::instance($cm->id);

        $template = new StdClass;

        $template->assessor = has_capability('mod/mplayer:assessor', $context);

        if ($mplayer->assessmode == MPLAYER_ASSESS_FIND_ZONES) {
            $template->findzones = true;
        } else if ($mplayer->assessmode == MPLAYER_ASSESS_MATCH_ZONES) {
            $template->matchzones = true;
        }

        $template->id = $mplayer->id;

        return $this->output->render_from_template('mod_mplayer/assesscontrols', $template);
    }

    public function report_table($mplayer, $users, $context) {
        global $OUTPUT, $COURSE, $PAGE;

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $modinfo = get_fast_modinfo($COURSE);
        $completioninfo = new completion_info($COURSE);

        if (empty($users)) {
            return $this->output->notification(get_string('nousers', 'mplayer'));
        }

        $userstr = get_string('user');
        $viewstatestr = get_string('viewstate', 'mplayer');
        $completionstatestr = get_string('completionstate', 'mplayer');

        $table = new html_table();
        $compenabled = false;
        if ($completioninfo->is_enabled($cm)) {
            $compenabled = true;
            $table->head = ['', $userstr, $viewstatestr, $completionstatestr, ''];
            $table->size = ['10%', '20%', '50%', '10%', '10%'];
        } else {
            $table->head = ['', $userstr, $viewstatestr, ''];
            $table->size = ['10%', '20%', '50%', '10%'];
        }
        $table->width = '100%';

        $clips = mplayer_get_clips($mplayer, $context);
        $courserenderer = $PAGE->get_renderer('course');

        foreach ($users as $u) {
            $row = [];
            $row[] = $this->output->user_picture($u);
            $row[] = fullname($u);

            $reseturl = new moodle_url('/mod/mplayer/report.php', ['id' => $cm->id, 'what' => 'reset', 'userid' => $u->id]);
            $cmds = '<a href="'.$reseturl.'">'.$OUTPUT->pix_icon('i/reset', get_string('reset'), 'core').'</a>';
            // $row[] = $cmds;

            $row[] = $this->mplayer_completion($mplayer, $clips, $u);
            if ($compenabled) {
                $modcomp = $completioninfo->get_data($cm, false, $u->id);
                $row[] = $courserenderer->course_section_cm_completion($COURSE, $completioninfo, $modinfo->cms[$cm->id]);
            }

            $table->data[] = $row;
        }

        return html_writer::table($table);
    }

    public function return_button($cm, $return) {
        global $COURSE, $CFG;

        $str = '';
        if (($COURSE->format != 'singleactivity') || ($COURSE->format == 'page' && optional_param('aspage', false, PARAM_INT))) {
            $str .= '<center>';
            if ($return == 'mod') {
                $params = array('id' => $cm->id);
                $label = get_string('backtoplayer', 'mplayer');
                $str .= $this->output->single_button(new moodle_url('/mod/mplayer/view.php', $params), $label);
            } else {
                if ($COURSE->format == 'page') {
                    include_once($CFG->dirroot.'/course/format/page/xlib.php');
                    page_print_page_format_navigation($cm, false);
                }
                $params = array('id' => $COURSE->id);
                $label = get_string('backtocourse', 'mplayer');
                $str .= $this->output->single_button(new moodle_url('/course/view.php', $params), $label);
            }
            $str .= '</center>';
        }

        return $str;
    }

    /**
     *
     */
    public function report_button($cm, $return = 'mod') {

        $str = '';
        $context = context_module::instance($cm->id);
        if (has_capability('mod/mplayer:assessor', $context)) {
            $str .= '<div class="mplayer-reports">';
            $str .= '<center>';
            $params = array('id' => $cm->id, 'return' => $return);
            $label = get_string('report', 'mplayer');
            $str .= $this->output->single_button(new moodle_url('/mod/mplayer/report.php', $params), $label);
            $str .= '</center>';
            $str .= '</div>';
        }
        return $str;
    }

    public function namefilter(&$thispageurl) {
        $str = '';

        $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $firstnamefilter = optional_param('filterfirstname', false, PARAM_TEXT);

        $str .= get_string('firstname').': ';
        for ($i = 0; $i < strlen($letters); $i++) {
            $letter = $letters[$i];
            if ($firstnamefilter == $letter) {
                $str .= $letter.'&nbsp';
            } else {
                $str .= '<a href="'.$thispageurl.'&filterfirstname='.$letter.'" >'.$letter.'</a>&nbsp';
            }
        }
        if (!$firstnamefilter) {
            $str .= get_string('all').'&nbsp';
        } else {
            $str .= '<a href="'.$thispageurl.'&filterfirstname=" >'.get_string('all').'</a>&nbsp';
        }

        $str .= '<br/>';

        $lastnamefilter = optional_param('filterlastname', false, PARAM_TEXT);

        $str .= get_string('lastname').': ';
        for ($i = 0; $i < strlen($letters); $i++) {
            $letter = $letters[$i];
            if ($lastnamefilter == $letter) {
                $str .= $letter.'&nbsp';
            } else {
                $str .= '<a href="'.$thispageurl.'&filterlastname='.$letter.'" >'.$letter.'</a>&nbsp';
            }
        }
        if (!$lastnamefilter) {
            $str .= get_string('all').'&nbsp';
        } else {
            $str .= '<a href="'.$thispageurl.'&filterlastname=" >'.get_string('all').'</a>&nbsp';
        }

        $params = array();
        if ($firstnamefilter) {
            $params['filterfirstname'] = $firstnamefilter;
        }
        if ($lastnamefilter) {
            $params['filterlastname'] = $lastnamefilter;
        }
        $thispageurl->params();

        return $str;
    }
}