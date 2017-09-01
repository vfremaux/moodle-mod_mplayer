<?php
<<<<<<< HEAD

/**
 * @package mod-mplayer
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

/**
<<<<<<< HEAD
<<<<<<< HEAD
 * @package mod_mplayer
>>>>>>> MOODLE_32_STABLE
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
=======
 * @package     mod_mplayer
 * @category    mod
 * @author  Valery Fremaux (valery.fremaux@gmail.com)
>>>>>>> MOODLE_32_STABLE
=======
 * @package     mod_mplayer
 * @category    mod
 * @author  Valery Fremaux (valery.fremaux@gmail.com)
>>>>>>> MOODLE_33_STABLE
 */
defined('MOODLE_INTERNAL') || die();

class backup_mplayer_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {

        $mplayer = new backup_nested_element('mplayer', array('id'), array(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            'name', 'intro', 'introformat', 'timecreated', 'timemodified', 'configxml', 'author', 'mplayerdate', 'description',
            'infoboxcolor', 'infoboxposition', 'infoboxsize', 'duration', 'mplayerfile', 'hdbitrate', 'hdfile', 'hdfullscreen', 
=======
            'name', 'intro', 'introformat', 'timecreated', 'timemodified', 'technology', 'configxml', 'author', 'mplayerdate', 'description',
            'infoboxcolor', 'infoboxposition', 'infoboxsize', 'duration', 'mplayerfile', 'external', 'cuelists', 'hdbitrate', 'hdfile', 'hdfullscreen', 
>>>>>>> MOODLE_32_STABLE
            'hdstate', 'livestreamfile', 'livestreamimage', 'livestreaminterval', 'livestreammessage', 'livestreamstreamer',
            'livestreamtags', 'image', 'audiodescriptionfile', 'audiodescriptionstate', 'audiodescriptionvolume', 'mplayerstart', 
            'tags', 'title', 'type', 'backcolor', 'frontcolor', 'lightcolor', 'screencolor', 'controlbar', 'smoothing', 'height', 
            'playlist', 'playlistsize', 'skin', 'width', 'autostart', 'bufferlength', 'fullscreen', 'icons', 'item', 'logoboxalign',
            'logoboxfile', 'logoboxlink', 'logoboxmargin', 'logoboxposition', 'logofile', 'logolink', 'logohide', 'logoposition', 
            'mute', 'quality', 'mplayerrepeat', 'resizing', 'shuffle', 'state', 'stretching', 'volume', 'plugins', 'streamer',
            'tracecall', 'captionsback', 'captionsfile', 'captionsfontsize', 'captionsstate', 'fpversion', 'notes', 
            'metaviewerposition', 'metaviewersize', 'searchbarcolor', 'searchbarlabel', 'searchbarposition', 
<<<<<<< HEAD
            'searchbarscript', 'snapshotbitmap', 'snapshotscript', 'splashmode'));
=======
            'searchbarscript', 'snapshotbitmap', 'snapshotscript', 'splashmode', 'completionmediaviewed'));
>>>>>>> MOODLE_32_STABLE
=======
=======
>>>>>>> MOODLE_33_STABLE
            'name', 'intro', 'introformat', 'timecreated', 'timemodified', 'technology', 'configxml', 'author', 'mplayerdate',
            'description', 'infoboxcolor', 'infoboxposition', 'infoboxsize', 'duration', 'mplayerfile', 'external', 'cuelists',
            'hdbitrate', 'hdfile', 'hdfullscreen', 'hdstate', 'livestreamfile', 'livestreamimage', 'livestreaminterval',
            'livestreammessage', 'livestreamstreamer', 'livestreamtags', 'image', 'audiodescriptionfile', 'audiodescriptionstate',
            'audiodescriptionvolume', 'mplayerstart', 'tags', 'title', 'type', 'backcolor', 'frontcolor', 'lightcolor',
            'screencolor', 'controlbar', 'smoothing', 'height', 'playlist', 'playlistsize', 'skin', 'width', 'autostart',
            'bufferlength', 'fullscreen', 'icons', 'item', 'logoboxalign', 'logoboxfile', 'logoboxlink', 'logoboxmargin',
            'logoboxposition', 'logofile', 'logolink', 'logohide', 'logoposition', 'mute', 'quality', 'mplayerrepeat',
            'resizing', 'shuffle', 'state', 'stretching', 'volume', 'plugins', 'streamer', 'tracecall', 'captionsback',
            'captionsfile', 'captionsfontsize', 'captionsstate', 'fpversion', 'notes', 'metaviewerposition', 'metaviewersize',
            'searchbarcolor', 'searchbarlabel', 'searchbarposition', 'searchbarscript', 'snapshotbitmap', 'snapshotscript',
            'splashmode', 'completionmediaviewed'));
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
>>>>>>> MOODLE_33_STABLE

        // Sources.
        $mplayer->set_source_table('mplayer', array('id' => backup::VAR_ACTIVITYID));

        if ($this->get_setting_value('userinfo')) {
            assert(1);
        }

<<<<<<< HEAD
<<<<<<< HEAD
        // Define file annotations
        $mplayer->annotate_files('mod_mplayer', 'intro', null); // This file areas haven't itemid
<<<<<<< HEAD
        $deck->annotate_files('mod_mplayer', 'mplayerfile', 'id');
        $deck->annotate_files('mod_mplayer', 'configxml', 'id');
        $deck->annotate_files('mod_mplayer', 'audiodescriptionfile', 'id');
        $deck->annotate_files('mod_mplayer', 'image', 'id');
        $deck->annotate_files('mod_mplayer', 'hdfile', 'id');
        $deck->annotate_files('mod_mplayer', 'captionsfile', 'id');
        $deck->annotate_files('mod_mplayer', 'livestreamfile', 'id');
        $deck->annotate_files('mod_mplayer', 'livestreamimage', 'id');
        $deck->annotate_files('mod_mplayer', 'logoboxfile', 'id');
        $deck->annotate_files('mod_mplayer', 'logofile', 'id');
=======
=======
        // Define file annotations.
        $mplayer->annotate_files('mod_mplayer', 'intro', null); // This file areas haven't itemid.
>>>>>>> MOODLE_32_STABLE
=======
        // Define file annotations.
        $mplayer->annotate_files('mod_mplayer', 'intro', null); // This file areas haven't itemid.
>>>>>>> MOODLE_33_STABLE
        $mplayer->annotate_files('mod_mplayer', 'mplayerfiles', null);
        $mplayer->annotate_files('mod_mplayer', 'notes', null);

        // These play for JWplayer.
        $mplayer->annotate_files('mod_mplayer', 'configxml', null);
        $mplayer->annotate_files('mod_mplayer', 'audiodescriptionfile', null);
        $mplayer->annotate_files('mod_mplayer', 'hdfile', null);
        $mplayer->annotate_files('mod_mplayer', 'captionsfile', null);
        $mplayer->annotate_files('mod_mplayer', 'livestreamfile', null);
        $mplayer->annotate_files('mod_mplayer', 'livestreamimagefile', null);
        $mplayer->annotate_files('mod_mplayer', 'logoboxfile', null);
        $mplayer->annotate_files('mod_mplayer', 'logofile', null);
>>>>>>> MOODLE_32_STABLE

        return $this->prepare_activity_structure($mplayer);
    }
}
