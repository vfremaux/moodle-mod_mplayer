<?php

/**
 * @package mod-mplayer
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
 */
class backup_mplayer_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {

        $mplayer = new backup_nested_element('mplayer', array('id'), array(
            'name', 'intro', 'introformat', 'timecreated', 'timemodified', 'configxml', 'author', 'mplayerdate', 'description',
            'infoboxcolor', 'infoboxposition', 'infoboxsize', 'duration', 'mplayerfile', 'hdbitrate', 'hdfile', 'hdfullscreen', 
            'hdstate', 'livestreamfile', 'livestreamimage', 'livestreaminterval', 'livestreammessage', 'livestreamstreamer',
            'livestreamtags', 'image', 'audiodescriptionfile', 'audiodescriptionstate', 'audiodescriptionvolume', 'mplayerstart', 
            'tags', 'title', 'type', 'backcolor', 'frontcolor', 'lightcolor', 'screencolor', 'controlbar', 'smoothing', 'height', 
            'playlist', 'playlistsize', 'skin', 'width', 'autostart', 'bufferlength', 'fullscreen', 'icons', 'item', 'logoboxalign',
            'logoboxfile', 'logoboxlink', 'logoboxmargin', 'logoboxposition', 'logofile', 'logolink', 'logohide', 'logoposition', 
            'mute', 'quality', 'mplayerrepeat', 'resizing', 'shuffle', 'state', 'stretching', 'volume', 'plugins', 'streamer',
            'tracecall', 'captionsback', 'captionsfile', 'captionsfontsize', 'captionsstate', 'fpversion', 'notes', 
            'metaviewerposition', 'metaviewersize', 'searchbarcolor', 'searchbarlabel', 'searchbarposition', 
            'searchbarscript', 'snapshotbitmap', 'snapshotscript', 'splashmode'));

        // Sources
        $mplayer->set_source_table('mplayer', array('id' => backup::VAR_ACTIVITYID));

        if ($this->get_setting_value('userinfo')) {
        }

        // Define file annotations
        $mplayer->annotate_files('mod_mplayer', 'intro', null); // This file areas haven't itemid
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

        return $this->prepare_activity_structure($mplayer);
    }
}
