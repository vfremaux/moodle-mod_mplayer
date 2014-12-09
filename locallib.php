<?php

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
    if (!$fs->is_area_empty($usercontext->id, 'user', 'draft', $filepickeritemid, true)){
        $filearea = str_replace('fileid', '', $filearea);
        file_save_draft_area_files($filepickeritemid, $context->id, 'mod_mplayer', $filearea, 0);
        if ($savedfiles = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, 0)) {
            $savedfile = array_pop($savedfiles);
            $mplayer->$filearea = $savedfile->get_id();
        }
    }
}

/**
 * Gives the physical file location of a complementary file
 * sotred into mplayer fileareas.
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
 * Gives the file url of a complementary file
 * sotred into mplayer fileareas.
 */
function mplayer_get_file_url(&$mplayer, $filearea, $context = null) {
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
            $url = $CFG->wwwroot.'/pluginfile.php/'.$context->id.'/mod_mplayer/'.$filearea.'/0/'.$storedfile->get_filename();
        }
    }
    return $url;
}

function mplayer_clear_area(&$mplayer, $filearea) {

    if (!$cm = get_coursemodule_from_instance('mplayer', $mplayer->id)) {
        return false;
    }

    $context = context_module::instance($cm->id);

    $fs = get_file_storage();
    $fs->delete_area_files($context->id, 'mod_mplayer', $filearea);
}

function mplayer_get_playlist_thumb_url($image, $context) {
    global $CFG;

    return $CFG->wwwroot.'/pluginfile.php/'.$context->id.'/mod_mplayer/playlistthumb/0/'.$image;
}

function mplayer_require_js(){
    global $CFG, $PAGE;
    
    if ($CFG->mplayer_default_player == 'jw') {
        $PAGE->requires->js('/mod/mplayer/jw/6.9/jwplayer.js');
    }
}

function mplayer_check_jquery() {
    global $CFG, $PAGE, $JQUERYVERSION;

    $current = '1.11.0';
    if (empty($JQUERYVERSION)) {
        $JQUERYVERSION = '1.11.0';
        $PAGE->requires->js('/mod/mplayer/js/jquery-'.$current.'.min.js', true);
    } else {
        if ($JQUERYVERSION < $current) {
            debugging('the previously loaded version of jquery is lower than required. This may cause issues to dashboard. Programmers might consider upgrading JQuery version in the component that preloads JQuery library.', DEBUG_DEVELOPER, array('notrace'));
        }
    }
}

/**
 * Get all file areas used in module
 */
function mplayer_get_fileareas() {
    return array('intro', 'mplayerfile', 'playlistfile', 'playlistthumb', 'configxml', 'image', 'audiodescriptionfile', 'captionsfile', 'hdfile', 'livestreamfile', 'livestreamimage', 'logoboxfile', 'logofile');
}

/**
 * Construct Javascript mplayerObject embed code for <head> section of view.php
 * Please note: some URLs append a '?'.time(); query to prevent browser caching
 *
 * @param $mplayer (mdl_mplayer DB record for current mplayer module instance)
 * @return string
 */
function mplayer_print_header_js($mplayer) {
    // Build Javascript code for view.php print_header() function
    $mplayer_header_js = '<script type="text/javascript" src="swfobject/swfobject.js"></script>
        <script type="text/javascript">
            swfobject.registerObject("jwPlayer", "'.$mplayer->fpversion.'");
        </script>';
    // Don't show default dotted outline around Flash Player window in Firefox 3
    $mplayer_header_js .= '<style type="text/css" media="screen">
            object { outline:none; }
        </style>';
    return $mplayer_header_js;
}

/**
 * Print alternative FlashVars embed parameters
 *
 * @param $mplayer
 * @return string
 */
function mplayer_print_body_flashvars($mplayer) {
    // Build URL to moodledata directory
    $mplayer = mplayer_set_moodledata($mplayer);
    // Assign the correct path to the file parameter (media source)
    $mplayer = mplayer_set_type($mplayer);
    // Build URLs for FlashVars embed parameters
    $mplayer = mplayer_set_paths($mplayer);

    $mplayer_flashvars = '<param name="flashvars" value="'.
                $mplayer->author.
                $mplayer->autostart.
                $mplayer->audiodescriptionfile.
                $mplayer->audiodescriptionstate.
                $mplayer->audiodescriptionvolume.
                $mplayer->backcolor.
                $mplayer->bufferlength.
                $mplayer->captionsback.
                $mplayer->captionsfile.
                $mplayer->captionsfontsize.
                $mplayer->captionsstate.
                $mplayer->configxml.
                $mplayer->controlbar.
                $mplayer->mplayerdate.
                $mplayer->description.
                $mplayer->mplayerfile.
                $mplayer->frontcolor.
                $mplayer->hdbitrate.
                $mplayer->hdfile.
                $mplayer->hdfullscreen.
                $mplayer->hdstate.
                $mplayer->icons.
                $mplayer->image.
                $mplayer->item.
                $mplayer->lightcolor.
                $mplayer->infoboxcolor.
                $mplayer->infoboxposition.
                $mplayer->infoboxsize.
                $mplayer->livestreamfile.
                $mplayer->livestreamimage.
                $mplayer->livestreaminterval.
                $mplayer->livestreammessage.
                $mplayer->livestreamstreamer.
                $mplayer->livestreamtags.
                $mplayer->logoboxalign.
                $mplayer->logoboxfile.
                $mplayer->logoboxlink.
                $mplayer->logoboxmargin.
                $mplayer->logoboxposition.
                $mplayer->logofile.
                $mplayer->logolink.
                $mplayer->logohide.
                $mplayer->logoposition.
                $mplayer->metaviewerposition.
                $mplayer->metaviewersize.
                $mplayer->mute.
                $mplayer->playlist.
                $mplayer->playlistsize.
                $mplayer->plugins.
                $mplayer->mplayerrepeat.
                $mplayer->resizing.
                $mplayer->screencolor.
                $mplayer->searchbarcolor.
                $mplayer->searchbarlabel.
                $mplayer->searchbarposition.
                $mplayer->searchbarscript.
                $mplayer->shuffle.
                $mplayer->skin.
                $mplayer->snapshotbitmap.
                $mplayer->snapshotscript.
                $mplayer->mplayerstart.
                $mplayer->streamer.
                $mplayer->stretching.
                $mplayer->tags.
                $mplayer->title.
                $mplayer->tracecall.
                $mplayer->type.
                $mplayer->volume.'" />';
    return $mplayer_flashvars;
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
    return array(
        'best' => 'best',
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
function mplayer_list_type() {
    return array('video' => 'Video',
                'youtube' => 'YouTube',
                'url' => 'Full URL',
                'xml' => 'XML Playlist',
                'sound' => 'Sound',
                'image' => 'Image',
                'http' => 'HTTP (pseudo) Streaming',
                'lighttpd' => 'Lighttpd Streaming',
                'rtmp' => 'RTMP Streaming');
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
 * to reflect your streaming server's details. It's probably a good idea to change the 'RTMP' bit to the name of your streaming service,
 * i.e. 'My Media Server' or 'Acme Media Server'.
 * Remember not to include the ".mplayer" file extensions in video file names when using RTMP.
 * @return array
 */
function mplayer_list_streamer() {
    global $CFG;

    return array('' => 'none'
                 //, $CFG->wwwroot.'/mod/mplayer/xmoov/xmoov.php' => 'Xmoov-php (http)'
                 //, 'lighttpd' => 'Lighttpd'
                 //, 'rtmp://yourstreamingserver.com/yourmediadirectory' => 'RTMP'
                 );
}

/**
 * List array of available search scripts
 * None are provided as yet.
 * @return array
 */
function mplayer_list_searchbarscript() {
    global $CFG;

    return array('' => 'none'
                 , 'http://gdata.youtube.com/feeds/api/videos?vq=QUERY&format=5' => 'YouTube.com Search'
                 //, $CFG->wwwroot.'/mod/mplayer/scripts/search.php' => 'Search Script Label'
                 //, $CFG->wwwroot.'/file.php/'.$COURSE->id.'/scripts/search.php' => 'Search Script Label'
                 );
}

/**
 * List array of available search scripts
 * None are provided as yet.
 * @return array
 */
function mplayer_list_snapshotscript() {
    global $CFG;

    return array('none' => 'none'
                 , $CFG->wwwroot.'/mod/mplayer/scripts/snapshot.php' => 'Demo Snapshot Script'
                 //, $CFG->wwwroot.'/file.php/'.$COURSE->id.'/scripts/snapshot.php' => 'Snapshot Script Label'
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
    return array(
        'dots' => get_string('dots', 'mplayer'),
        'thumbs' => get_string('thumbs', 'mplayer')
    );
}

/**
 * Define position of infobox
 * @return array
 */
function mplayer_list_infoboxposition() {
    return array(
        'none' => 'none',
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
 * Define position of metaviewer
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
 * Define position of searchbar
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
 * Copy and paste the following line into the array below then edit it to match the name and filename of your new skin:
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
 * Define scaling properties of video stream
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

