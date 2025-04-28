<?php

class mod_form_extensions {

    public static function add_assessable_behaviours($moodleform, $mform, $instanceid) {

        $mform->addElement('header', 'assessableextensionshdr', get_string('assessableextensions', 'mplayer'));

        if (!empty($instanceid)) {
            $params = ['a' => $instanceid];
            $highlightzonesurl = new moodle_url('/mod/mplayer/pro/highlightzones.php', $params);
            $mform->addElement('html', '<a href="'.$highlightzonesurl.'">'.get_string('managehighlightzones', 'mplayer').'</a>');
        } else {
            $mform->addElement('html', get_string('managehighlightzonesonupdate', 'mplayer'));
        }

        // Assessmode.
        $assessmodes = [
            MPLAYER_NO_ASSESS => get_string('noassess', 'mplayer'),
            MPLAYER_ASSESS_FIND_ZONES => get_string('findzones', 'mplayer'),
            MPLAYER_ASSESS_MATCH_ZONES => get_string('matchzones', 'mplayer'),
        ];
        $elements[] = $mform->addElement('select', 'assessmode', get_string('assessmode', 'mplayer'), $assessmodes);
        $mform->setDefault('assessmode', MPLAYER_NO_ASSESS);

    }

}