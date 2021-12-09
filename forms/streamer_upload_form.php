<?php

require_once($CFG->dirroot.'/lib/formslib.php');

MoodleQuickForm::registerElementType('file', $CFG->dirroot.'/mod/mplayer/lib/form/file.php', 'MoodleQuickForm_file');

class StreamerUploadForm extends moodleform {

    function definition() {

        $mform = $this->_form;

        $mform->addElement('hidden', 'id');
        $mform->setType('id', PARAM_INT);

        $mform->addElement('filepicker', 'media', get_string('videomedia', 'mplayer'));
        $mform->setType('media', PARAM_FILE);
        $mform->setType('MAX_FILE_SIZE', PARAM_INT);

        $this->add_action_buttons();
    }

    function validation($data, $files) {
    }
}