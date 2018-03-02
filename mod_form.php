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
 * Creates instance of Media Player activity module
 * Adapted from mod_form.php template by Jamie Pratt
 *
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @copyright   (C) 2009 onwards Matt Bury
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

class mod_mplayer_mod_form extends moodleform_mod {

    public $descriptionoptions;

    public function definition() {
        global $CFG, $COURSE, $USER, $PAGE;

        $mform =& $this->_form;
        $PAGE->requires->js_call_amd('mod_mplayer/technologychooser', 'init', array('formid' => $mform->getAttribute('id')));

        $config = get_config('mplayer');
        $instance = $this->current;
        if (empty($instance)) {
            $instance = new StdClass();
        }
        if (empty($instance->technology)) {
            $instance->technology = $config->default_player;
        }

        $maxfiles = 99;                // TODO: add some setting.
        $maxbytes = $COURSE->maxbytes; // TODO: add some setting.
        $modcontext = $this->context;
        $this->descriptionoptions = array('trusttext' => true,
                                          'subdirs' => false,
                                          'maxfiles' => $maxfiles,
                                          'maxbytes' => $maxbytes,
                                          'context' => $modcontext);

        // Adding the "general" fieldset, where all the common settings are shown.
        $mform->addElement('header', 'general', get_string('general', 'form'));

        $mform->addElement('text', 'name', get_string('name'), array('size' => '64'));
        if (!empty($CFG->formatstringstriptags)) {
            $mform->setType('name', PARAM_TEXT);
        } else {
            $mform->setType('name', PARAM_CLEANHTML);
        }
        $mform->addRule('name', null, 'required', null, 'client');
        $mform->addRule('name', get_string('maximumchars', '', 255), 'maxlength', 255, 'client');

        // TECHNOLOGY.

        if (!empty($config->allowchoice)) {
            // Technology.
            $mform->addElement('select', 'technology', get_string('technology', 'mplayer'), mplayer_list_technologies());
            $mform->setDefault('technology', $config->default_player);
            $mform->addHelpButton('technology', 'mplayer_technology', 'mplayer');

        } else {
            $mform->addElement('hidden', 'technology', $config->default_player);
            $mform->setType('technology', PARAM_ALPHA);
        }

        // Introduction.
        $this->standard_intro_elements();

        // MEDIA SOURCE.

        $mform->addElement('header', 'mplayerresources', get_string('mplayerresources', 'mplayer'));
        $mform->addHelpButton('mplayerresources', 'mplayer_resources', 'mplayer');
        $mform->setExpanded('mplayerresources');

        // Mplayerfile.
        $options = array('subdirs' => true, 'courseid' => $COURSE->id, 'maxfiles' => 60);
        $mform->addElement('filemanager', 'mplayerfiles', get_string('mplayerfiles', 'mplayer'), null, $options);

        if (!empty($config->allowchoice)) {
            // Button to update player-specific options on technology change (will be hidden by JavaScript).
            $mform->registerNoSubmitButton('updatetechnology');
            $mform->addElement('submit', 'updatetechnology', get_string('updatetechnology', 'mplayer'));

            // Just a placeholder for the player options.
        }
        $mform->addElement('hidden', 'addtechnologyoptionshere');
        $mform->setType('addtechnologyoptionshere', PARAM_BOOL);

        // Add standard elements, common to all modules.
        $this->standard_coursemodule_elements();

        // Add standard buttons, common to all modules.
        $this->add_action_buttons();
    }

    public function set_data($defaults) {

        if ($defaults->coursemodule) {
            // This is when updating.
            $context = context_module::instance($defaults->coursemodule);

            $fs = get_file_storage();
            if ($fs->is_area_empty($context->id, 'mod_mplayer', 'mplayerfiles', 0)) {
                $cm = new StdClass();
                $cm->id = $defaults->coursemodule;
                mplayer_init_storage($cm);
            }

            $defaults = file_prepare_standard_editor($defaults, 'notes', $this->descriptionoptions, $context, 'mod_mplayer',
                                                     'notes', $defaults->id);

            // Saves draft customization image files into definitive filearea.
            $instancefiles = array('mplayerfiles', 'playlistfiles', 'configxml', 'audiodescriptionfile', 'captionsfile',
                                   'hdfile', 'livestreamfile', 'livestreamimage', 'logoboxfile', 'logofile');
            foreach ($instancefiles as $if) {
                $draftitemid = file_get_submitted_draft_itemid($if);
                $options = array();
                $options['maxfiles'] = ($if == 'mplayerfiles') ? -1 : 1;
                $options['subdirs'] = ($if == 'mplayerfiles') ? true : false;
                file_prepare_draft_area($draftitemid, $context->id, 'mod_mplayer', $if, 0, $options);
                if ($if == 'configxml') {
                    $defaults->configxmlgroup['configxml'] = $draftitemid;
                } else {
                    $defaults->$if = $draftitemid;
                }
            }
        }

        parent::set_data($defaults);
    }

    public function definition_after_data() {

        parent::definition_after_data();

        $mform = $this->_form;

        if (is_array($mform->getElementValue('technology'))) {
            // True if it is a visible list.
            $technologyvalue = array_pop($mform->getElementValue('technology'));
        } else {
            $technologyvalue = $mform->getElementValue('technology');
        }
        $playerelements = $this->get_player_elements($technologyvalue);

        // Add technology options.
        for ($i = 0; $i < count($playerelements); $i++) {
            $mform->insertElementBefore($mform->removeElement($playerelements[$i]->getName(), false),
                    'addtechnologyoptionshere');
        }

        $mplayerfiles =& $mform->getElement('mplayerfiles');
        $value = $mplayerfiles->getValue();
        if (empty($value)) {
            // This is when creating new.
            $draftitemid = file_get_unused_draft_itemid();
            mplayer_init_storage(null, $draftitemid);
            $value = $mplayerfiles->setValue($draftitemid);
        }
    }

    /**
     * Custom validation
     *
     * @param array $data
     * @param array $files
     * @return array
     */
    public function validation($data, $files) {
        $draftitemid = file_get_submitted_draft_itemid('mplayerfiles');
        $voiddata = file_get_drafarea_files($draftitemid);

        $errors = parent::validation($data, $files);

        return $errors;
    }

    public function add_completion_rules() {
        $mform =& $this->_form;

        $label = get_string('mediaviewed', 'mplayer');
        $mform->addElement('checkbox', 'completionmediaviewed', $label, get_string('completionmediaviewed', 'mplayer'));

        return array('completionmediaviewed');
    }

    public function completion_rule_enabled($data) {
        return(!empty($data['completionmediaviewed']));
    }

    protected function get_player_elements($technology) {
        global $CFG, $COURSE, $USER;

        $mplayerurlarray = array('size' => '80');
        $mplayerintarray = array('size' => '6');

        $mform =& $this->_form;

        $config = get_config('mplayer');

        $elements = array();

        // Type.
        $mform->addElement('select', 'type', get_string('type', 'mplayer'), mplayer_list_type($technology));
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
        $mform->setDefault('type', 'video');

        // External url alternative.
        $attrs = array('rows' => 5, 'style' => 'width:97%', 'height' => 0);
        $mform->addElement('textarea', 'external', get_string('external', 'mplayer'), $attrs);

        $mform->addElement('select', 'streamer', get_string('streamer', 'mplayer'), mplayer_list_streamer());
        $mform->disabledIf('streamer', 'type', 'neq', 'rtmp');
        $mform->setDefault('streamer', 'none');
        $mform->setAdvanced('streamer');

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        // Playlists ---------------------------------------.
>>>>>>> MOODLE_32_STABLE
=======
=======
=======
>>>>>>> MOODLE_32_STABLE
        if (!empty($config->allowchoice)) {
            // Button to update player-specific options on technology change (will be hidden by JavaScript).
            $mform->registerNoSubmitButton('updatetechnology');
            $mform->addElement('submit', 'updatetechnology', get_string('updatetechnology', 'mplayer'));

            // Just a placeholder for the player options.
            $mform->addElement('hidden', 'addtechnologyoptionshere');
            $mform->setType('addtechnologyoptionshere', PARAM_BOOL);
        }

        // Add standard elements, common to all modules.
        $this->standard_coursemodule_elements();

        // Add standard buttons, common to all modules.
        $this->add_action_buttons();
    }

    public function set_data($defaults) {

        if ($defaults->coursemodule) {
            // This is when updating.
            $context = context_module::instance($defaults->coursemodule);

            $fs = get_file_storage();
            if ($fs->is_area_empty($context->id, 'mod_mplayer', 'mplayerfiles', 0)) {
                $cm = new StdClass();
                $cm->id = $defaults->coursemodule;
                mplayer_init_storage($cm);
            }

            $defaults = file_prepare_standard_editor($defaults, 'notes', $this->descriptionoptions, $context, 'mod_techproject',
                                                     'notes', $defaults->id);

            // Saves draft customization image files into definitive filearea.
            $instancefiles = array('mplayerfiles', 'playlistfiles', 'configxml', 'audiodescriptionfile', 'captionsfile',
                                   'hdfile', 'livestreamfile', 'livestreamimage', 'logoboxfile', 'logofile');
            foreach ($instancefiles as $if) {
                $draftitemid = file_get_submitted_draft_itemid($if);
                $maxfiles = ($if == 'mplayerfiles') ? -1 : 1;
                $subdirs = ($if == 'mplayerfiles') ? true : false;
                file_prepare_draft_area($draftitemid, $context->id, 'mod_mplayer', $if, 0, $this->descriptionoptions);
                if ($if == 'configxml') {
                    $defaults->configxmlgroup['configxml'] = $draftitemid;
                } else {
                    $defaults->$if = $draftitemid;
                }
            }
        }

        parent::set_data($defaults);
    }

    public function definition_after_data() {

        parent::definition_after_data();

        $mform = $this->_form;

        $technologyvalue = $mform->getElementValue('technology');
        if (is_array($technologyvalue)) {
            $technologyvalue = array_pop($technologyvalue);
        }
        $playerelements = $this->get_player_elements($technologyvalue);

        // Add technology options.
        for ($i = 0; $i < count($playerelements); $i++) {
            $mform->insertElementBefore($mform->removeElement($playerelements[$i]->getName(), false),
                    'addtechnologyoptionshere');
        }

        $mplayerfiles =& $mform->getElement('mplayerfiles');
        $value = $mplayerfiles->getValue();
        if (empty($value)) {
            // This is when creating new.
            $draftitemid = file_get_unused_draft_itemid();
            mplayer_init_storage(null, $draftitemid);
            $value = $mplayerfiles->setValue($draftitemid);
        }
    }

    /**
     * Custom validation
     *
     * @param array $data
     * @param array $files
     * @return array
     */
    public function validation($data, $files) {
        $draftitemid = file_get_submitted_draft_itemid('mplayerfiles');
        $voiddata = file_get_drafarea_files($draftitemid);

        $errors = parent::validation($data, $files);

        return $errors;
    }

    public function add_completion_rules() {
        $mform =& $this->_form;

        $label = get_string('mediaviewed', 'mplayer');
        $mform->addElement('checkbox', 'completionmediaviewed', $label, get_string('completionmediaviewed', 'mplayer'));

        return array('completionmediaviewed');
    }

    public function completion_rule_enabled($data) {
        return(!empty($data['completionmediaviewed']));
    }

    protected function get_player_elements($technology) {
        global $CFG, $COURSE, $USER;

        $mplayerurlarray = array('size' => '80');
        $mplayerintarray = array('size' => '6');

        $mform =& $this->_form;

        $config = get_config('mplayer');

        $elements = array();

<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
        // Type.
        $mform->addElement('select', 'type', get_string('type', 'mplayer'), mplayer_list_type($technology));
        $mform->setDefault('type', 'video');
=======
        $value = $mform->getElementValue('type');
        $preset = (!empty($value)) ? $value[0] : 'video';
        $mform->setDefault('type', $preset);
>>>>>>> MOODLE_33_STABLE
=======
        $value = $mform->getElementValue('type');
        $preset = (!empty($value)) ? $value[0] : 'video';
        $mform->setDefault('type', $preset);
>>>>>>> MOODLE_34_STABLE

        // External url alternative.
        $attrs = array('rows' => 5, 'style' => 'width:97%', 'height' => 0);
        $mform->addElement('textarea', 'external', get_string('external', 'mplayer'), $attrs);

        $mform->addElement('select', 'streamer', get_string('streamer', 'mplayer'), mplayer_list_streamer());
        $mform->disabledIf('streamer', 'type', 'neq', 'rtmp');
        $value = $mform->getElementValue('streamer');
        $preset = (!empty($value)) ? $value[0] : 'none';
        $mform->setDefault('streamer', $preset);
        $mform->setAdvanced('streamer');

        // PLAYLISTS.

        $elements[] = $mform->addElement('header', 'playlists', get_string('playlists', 'mplayer'));
        $mform->addHelpButton('playlists', 'mplayer_playlist', 'mplayer');

        // Local file path template.
        $clipurl = $CFG->wwwroot.'/pluginfile.php/'.$this->context->id.'/mod_mplayer/mplayerfile/0/&lt;filename&gt;';
        $elements[] = $mform->addElement('static', 'playlistlocalpath', get_string('playlistlocalpath', 'mplayer'), $clipurl);

        // Playlist.
        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('select', 'playlist', get_string('playlist', 'mplayer'), mplayer_list_playlistposition());
        } else {
            $elements[] = $mform->addElement('select', 'playlist', get_string('playliststyle', 'mplayer'), mplayer_list_playliststyles());
        }
        $value = $mform->getElementValue('playlist');
        $preset = (!empty($value)) ? $value[0] : 'none';
        $mform->setDefault('playlist', $preset);

        // Playlistsize.
        $elements[] = $mform->addElement('text', 'playlistsize', get_string('playlistsize', 'mplayer'), $mplayerintarray);
        $mform->setType('playlistsize', PARAM_INT);
        $value = $mform->getElementValue('playlistsize');
        $preset = (!empty($value)) ? $value : '180';
        $mform->setDefault('playlistsize', $preset);
        $mform->setAdvanced('playlistsize');

        // Item.
        // TODO : Check if still necessary.
        $elements[] = $mform->addElement('text', 'item', get_string('item', 'mplayer'), $mplayerintarray);
        $mform->setType('item', PARAM_TEXT);
        $value = $mform->getElementValue('item');
        $preset = (!empty($value)) ? $value : '';
        $mform->setDefault('item', $preset);
        $mform->setAdvanced('item');

        // Repeat.
        $elements[] = $mform->addElement('select', 'mplayerrepeat', get_string('mplayerrepeat', 'mplayer'), mplayer_list_repeat());
        $value = $mform->getElementValue('mplayerrepeat');
        $preset = (!empty($value)) ? $value[0] : 'none';
        $mform->setDefault('mplayerrepeat', $preset);
        $mform->setAdvanced('mplayerrepeat');

        // Shuffle.
        $elements[] = $mform->addElement('select', 'shuffle', get_string('shuffle', 'mplayer'), mplayer_list_truefalse());
        $value = $mform->getElementValue('shuffle');
        $preset = (!empty($value)) ? $value[0] : 'false';
        $mform->setDefault('shuffle', $preset);
        $mform->setAdvanced('shuffle');

        // SUBTITLES.

        if ('jw' != substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'configsubtitles', get_string('configsubtitles', 'mplayer'));

            $elements[] = $mform->addElement('select', 'langselection', get_string('langselection', 'mplayer'), mplayer_list_langchoiceoptions());
            $value = $mform->getElementValue('langselection');
            $preset = (!empty($value)) ? $value[0] : 'langcourse';
            $mform->setDefault('langselection', $preset);

            $elements[] = $mform->addElement('select', 'langforced', get_string('langforced', 'mplayer'), mplayer_list_availablelangoptions());
            $value = $mform->getElementValue('langforced');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('langforced', $preset);
            $mform->disabledIf('langforced', 'langselection', 'neq', 'langteacherchoice');
        }

        // CONFIGXML.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'config', get_string('config', 'mplayer'));
            $mform->addHelpButton('config', 'mplayer_configxml', 'mplayer');
            $fmoptions = array('maxfiles' => 1, 'subdirs' => false);
            $elements[] = $mform->addElement('filemanager', 'configxml', get_string('configxml', 'mplayer'), $fmoptions);
        } else {
            $elements[] = $mform->addElement('hidden', 'configxml');
            $mform->setType('configxml', PARAM_FILE);
        }

        // APPEARANCE.

        $elements[] = $mform->addElement('header', 'appearance', get_string('appearance', 'mplayer'));
        $mform->addHelpButton('appearance', 'mplayer_appearance', 'mplayer');

        // Notes.
        $elements[] = $mform->addElement('editor', 'notes_editor', get_string('notes', 'mplayer'), null, $this->descriptionoptions);
        $mform->setType('notes_editor', PARAM_RAW);

        // Width.
        $elements[] = $mform->addElement('text', 'width', get_string('width', 'mplayer'), $mplayerintarray);
        $mform->setType('width', PARAM_TEXT);
        // $mform->addRule('width', get_string('required'), 'required', null, 'client');

        if (empty($config->default_width)) {
            set_config('default_width', '100%', 'mplayer');
            $config->default_width = '100%';
        }

        $value = $mform->getElementValue('width');
        $preset = (!empty($value)) ? $value : $config->default_width;
        $mform->setDefault('width', $preset);

        // Height.
        $elements[] = $mform->addElement('text', 'height', get_string('height', 'mplayer'), $mplayerintarray);
        $mform->setType('height', PARAM_TEXT);
        // $mform->addRule('height', get_string('required'), 'required', null, 'client');
        if (empty($CFG->default_height)) {
            $CFG->mplayer_default_height = 570;
            $config->default_height = 570;
        }
        $value = $mform->getElementValue('height');
        $preset = (!empty($value)) ? $value : $config->default_height;
        $mform->setDefault('height', $preset);

        $elements[] = $mform->addElement('hidden', 'skin', '');
        $mform->setType('skin', PARAM_TEXT);

        // Icons.
        $elements[] = $mform->addElement('select', 'icons', get_string('icons', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_icons)) {
            set_config('default_icons', 'true', 'mplayer');
            $config->default_icons = 'true';
        }
        $value = $mform->getElementValue('icons');
        $preset = (!empty($value)) ? $value : $config->default_icons;
        $mform->setDefault('icons', $preset);
        $mform->setAdvanced('icons');

        // Controlbar.
        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('select', 'controlbar', get_string('controlbar', 'mplayer'), mplayer_list_controlbar());
            if (empty($config->default_controlbar)) {
                set_config('default_controlbar', 'bottom', 'mplayer');
                $config->default_controlbar = 'bottom';
            }
            $value = $mform->getElementValue('controlbar');
            $preset = (!empty($value)) ? $value[0] : $config->default_controlbar;
            $mform->setDefault('controlbar', $preset);
            $mform->setAdvanced('controlbar');
        }

        // Backcolor.
        $elements[] = $mform->addElement('text', 'backcolor', get_string('backcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('backcolor', PARAM_TEXT);
        if (!isset($config->default_backcolor)) {
            set_config('default_backcolor', '#000000', 'mplayer');
            $config->default_backcolor = '#000000';
        }
<<<<<<< HEAD
<<<<<<< HEAD
        $mform->setDefault('backcolor', $config->default_backcolor);
>>>>>>> MOODLE_32_STABLE
=======
        $value = $mform->getElementValue('backcolor');
        $preset = (!empty($value)) ? $value : $config->default_backcolor;
        $mform->setDefault('backcolor', $preset);
>>>>>>> MOODLE_33_STABLE
=======
        $value = $mform->getElementValue('backcolor');
        $preset = (!empty($value)) ? $value : $config->default_backcolor;
        $mform->setDefault('backcolor', $preset);
>>>>>>> MOODLE_34_STABLE
        $mform->setAdvanced('backcolor');

        // Frontcolor.
        $elements[] = $mform->addElement('text', 'frontcolor', get_string('frontcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('frontcolor', PARAM_TEXT);
        if (!isset($config->default_frontcolor)) {
            set_config('default_frontcolor', '#dddddd', 'mplayer');
            $config->default_frontcolor = '#dddddd';
        }
<<<<<<< HEAD
<<<<<<< HEAD
        $mform->setDefault('frontcolor', $config->default_frontcolor);
>>>>>>> MOODLE_32_STABLE
=======
        $value = $mform->getElementValue('frontcolor');
        $preset = (!empty($value)) ? $value : $config->default_frontcolor;
        $mform->setDefault('frontcolor', $preset);
>>>>>>> MOODLE_33_STABLE
=======
        $value = $mform->getElementValue('frontcolor');
        $preset = (!empty($value)) ? $value : $config->default_frontcolor;
        $mform->setDefault('frontcolor', $preset);
>>>>>>> MOODLE_34_STABLE
        $mform->setAdvanced('frontcolor');

        // Lightcolor.
        $elements[] = $mform->addElement('text', 'lightcolor', get_string('lightcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('lightcolor', PARAM_TEXT);
        if (!isset($config->default_lightcolor)) {
            set_config('default_lightcolor', '#ffffff', 'mplayer');
            $config->default_lightcolor = '#ffffff';
        }
        $value = $mform->getElementValue('lightcolor');
        $preset = (!empty($value)) ? $value : $config->default_lightcolor;
        $mform->setDefault('lightcolor', $preset);
        $mform->setAdvanced('lightcolor');

        // Screencolor.
        $elements[] = $mform->addElement('text', 'screencolor', get_string('screencolor', 'mplayer'), $mplayerintarray);
        $mform->setType('screencolor', PARAM_TEXT);
        if (!isset($config->default_screencolor)) {
            set_config('default_screencolor', '#80ff80', 'mplayer');
            $config->default_screencolor = '#80ff80';
        }
        $value = $mform->getElementValue('screencolor');
        $preset = (!empty($value)) ? $value : $config->default_screencolor;
        $mform->setDefault('screencolor', $preset);
        $mform->setAdvanced('screencolor');

        // Smoothing.
        $elements[] = $mform->addElement('select', 'smoothing', get_string('smoothing', 'mplayer'), mplayer_list_truefalse());
        $value = $mform->getElementValue('smoothing');
        $preset = (!empty($value)) ? $value[0] : 'true';
        $mform->setDefault('smoothing', $preset);
        $mform->setAdvanced('smoothing');

        // Quality.
        $elements[] = $mform->addElement('select', 'quality', get_string('quality', 'mplayer'), mplayer_list_quality());
        $value = $mform->getElementValue('quality');
        $preset = (!empty($value)) ? $value[0] : 'best';
        $mform->setDefault('quality', $preset);
        $mform->setAdvanced('quality');

        // BEHAVIOUR.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
        $elements[] = $mform->addElement('select', 'smoothing', get_string('smoothing', 'mplayer'), mplayer_list_truefalse());
        $value = $mform->getElementValue('smoothing');
        $preset = (!empty($value)) ? $value[0] : 'true';
        $mform->setDefault('smoothing', $preset);
        $mform->setAdvanced('smoothing');

        // Quality.
        $elements[] = $mform->addElement('select', 'quality', get_string('quality', 'mplayer'), mplayer_list_quality());
        $value = $mform->getElementValue('quality');
        $preset = (!empty($value)) ? $value[0] : 'best';
        $mform->setDefault('quality', $preset);
        $mform->setAdvanced('quality');

        // BEHAVIOUR.
>>>>>>> MOODLE_33_STABLE
=======
>>>>>>> MOODLE_34_STABLE

        $elements[] = $mform->addElement('header', 'behaviour', get_string('behaviour', 'mplayer'));
        $mform->addHelpButton('behaviour', 'mplayer_behaviour', 'mplayer');

        // Autostart.
        $elements[] = $mform->addElement('select', 'autostart', get_string('autostart', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_autostart)) {
            set_config('default_autostart', 'false', 'mplayer');
            $config->default_autostart = 'false';
        }
        $value = $mform->getElementValue('autostart');
        $preset = (!empty($value)) ? $value[0] : $config->default_autostart;
        $mform->setDefault('autostart', $preset);
        $mform->disabledIf('autostart', 'splashmode', 'eq', 'is-splash');

        // Fullscreen.
        $elements[] = $mform->addElement('select', 'fullscreen', get_string('fullscreen', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_fullscreen)) {
            set_config('default_fullscreen', 'true', 'mplayer');
            $config->default_fullscreen = 'true';
        }
        $value = $mform->getElementValue('fullscreen');
        $preset = (!empty($value)) ? $value[0] : $config->default_fullscreen;
        $mform->setDefault('fullscreen', $preset);

        // Splashmode.
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        if ($instance->technology == 'jw') {
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('hidden', 'splashmode');
            $mform->setType('splashmode', PARAM_TEXT);
        } else {
            $splashoptions = array('' => get_string('nosplash', 'mplayer'), 'is-splash' => get_string('splashenabled', 'mplayer'));
            $mform->addElement('select', 'splashmode', get_string('splashmode', 'mplayer'), $splashoptions);
<<<<<<< HEAD
            if (empty($CFG->mplayer_default_splashmode)) {
                set_config('mplayer_default_splashmode', 'is-splash');
            }
            $mform->setDefault('splashmode', $CFG->mplayer_default_splashmode);
            $mform->setAdvanced('splashmode');
        }

        // stretching 
        if ($CFG->mplayer_default_player == 'jw') {
            $mform->addElement('select', 'stretching', get_string('stretching', 'mplayer'), mplayer_list_stretching());
            if (empty($CFG->mplayer_default_stretching)) {
                $CFG->mplayer_default_stretching = 'uniform';
            }
            $mform->setDefault('stretching', $CFG->mplayer_default_stretching);
=======
=======
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('hidden', 'splashmode');
            $mform->setType('splashmode', PARAM_TEXT);
        } else {
            $splashoptions = array('' => get_string('nosplash', 'mplayer'), 'is-splash' => get_string('splashenabled', 'mplayer'));
            $elements[] = $mform->addElement('select', 'splashmode', get_string('splashmode', 'mplayer'), $splashoptions);
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
            $elements[] = $mform->addElement('hidden', 'splashmode');
            $mform->setType('splashmode', PARAM_TEXT);
        } else {
            $splashoptions = array('' => get_string('nosplash', 'mplayer'), 'is-splash' => get_string('splashenabled', 'mplayer'));
            $elements[] = $mform->addElement('select', 'splashmode', get_string('splashmode', 'mplayer'), $splashoptions);
>>>>>>> MOODLE_33_STABLE
=======
>>>>>>> MOODLE_34_STABLE
            if (empty($config->default_splashmode)) {
                set_config('default_splashmode', 'is-splash', 'mplayer');
                $config->default_splashmode = 'is-splash';
            }
            $value = $mform->getElementValue('splashmode');
            $preset = (!empty($value)) ? $value[0] : $config->default_splashmode;
            $mform->setDefault('splashmode', $preset);
            $mform->setAdvanced('splashmode');
            $mform->disabledIf('splashmode', 'autostart', 'eq', 'true');
        }

        // Stretching.
        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('select', 'stretching', get_string('stretching', 'mplayer'), mplayer_list_stretching());
            if (empty($config->default_stretching)) {
                set_config('default_stretching', 'uniform', 'mplayer');
                $config->default_stretching = 'uniform';
            }
<<<<<<< HEAD
<<<<<<< HEAD
            $mform->setDefault('stretching', $config->default_stretching);
>>>>>>> MOODLE_32_STABLE
=======
            $value = $mform->getElementValue('stretching');
            $preset = (!empty($value)) ? $value[0] : $config->default_stretching;
            $mform->setDefault('stretching', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('stretching');
            $preset = (!empty($value)) ? $value[0] : $config->default_stretching;
            $mform->setDefault('stretching', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('stretching');
        } else {
            $elements[] = $mform->addElement('hidden', 'stretching');
            $mform->setType('stretching', PARAM_TEXT);
        }

        // Volume.
        $elements[] = $mform->addElement('select', 'volume', get_string('volume', 'mplayer'), mplayer_list_volume());
        if (empty($config->default_volume)) {
            set_config('default_volume', '90', 'mplayer');
            $config->default_volume = '90';
        }
        $value = $mform->getElementValue('volume');
        $preset = (!empty($value)) ? $value[0] : $config->default_volume;
        $mform->setDefault('volume', $preset);
        $mform->setAdvanced('volume');

        // Mute.
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
        $mform->addElement('select', 'mute', get_string('mute', 'mplayer'), mplayer_list_truefalse());
        $mform->setDefault('mute', 'false');
        $mform->setAdvanced('mute');

<<<<<<< HEAD
        if ($CFG->mplayer_default_player == 'jw') {
            // mplayerstart 
=======
        if ($instance->technology == 'jw') {
            // Mplayerstart.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'mplayerstart', get_string('mplayerstart', 'mplayer'), $mplayer_int_array);
=======
            $mform->addElement('text', 'mplayerstart', get_string('mplayerstart', 'mplayer'), $mplayerintarray);
>>>>>>> MOODLE_32_STABLE
=======
        $elements[] = $mform->addElement('select', 'mute', get_string('mute', 'mplayer'), mplayer_list_truefalse());
        $value = $mform->getElementValue('mute');
        $preset = (!empty($value)) ? $value[0] : 'false';
        $mform->setDefault('mute', $preset);
        $mform->setAdvanced('mute');

        if ('jw' == substr($technology, 0, 2)) {
            // Mplayerstart.
            $elements[] = $mform->addElement('text', 'mplayerstart', get_string('mplayerstart', 'mplayer'), $mplayerintarray);
>>>>>>> MOODLE_32_STABLE
            $mform->setType('mplayerstart', PARAM_INT);
            $value = $mform->getElementValue('mplayerstart');
            $preset = (!empty($value)) ? $value : 0;
            $mform->setDefault('mplayerstart', $preset);
            $mform->setAdvanced('mplayerstart');
<<<<<<< HEAD
    
            // bufferlength 
            $mform->addElement('select', 'bufferlength', get_string('bufferlength', 'mplayer'), mplayer_list_bufferlength());
            $mform->setDefault('bufferlength', '1');
            $mform->setAdvanced('bufferlength');
    
            // resizing - deprecated
            //$mform->addElement('select', 'resizing', get_string('resizing', 'mplayer'), mplayer_list_truefalse());
            //$mform->setAdvanced('resizing');
    
            // plugins 
=======

            // Bufferlength.
            $elements[] = $mform->addElement('select', 'bufferlength', get_string('bufferlength', 'mplayer'), mplayer_list_bufferlength());
            $value = $mform->getElementValue('bufferlength');
            $preset = (!empty($value)) ? $value[0] : 1;
            $mform->setDefault('bufferlength', $preset);
            $mform->setAdvanced('bufferlength');

            // Plugins.
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'plugins', get_string('plugins', 'mplayer'), $mplayer_url_array);
=======
            $mform->addElement('text', 'plugins', get_string('plugins', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('text', 'plugins', get_string('plugins', 'mplayer'), $mplayerurlarray);
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
=======
>>>>>>> MOODLE_34_STABLE
        $elements[] = $mform->addElement('select', 'mute', get_string('mute', 'mplayer'), mplayer_list_truefalse());
        $value = $mform->getElementValue('mute');
        $preset = (!empty($value)) ? $value[0] : 'false';
        $mform->setDefault('mute', $preset);
        $mform->setAdvanced('mute');

        if ('jw' == substr($technology, 0, 2)) {
            // Mplayerstart.
            $elements[] = $mform->addElement('text', 'mplayerstart', get_string('mplayerstart', 'mplayer'), $mplayerintarray);
            $mform->setType('mplayerstart', PARAM_INT);
            $value = $mform->getElementValue('mplayerstart');
            $preset = (!empty($value)) ? $value : 0;
            $mform->setDefault('mplayerstart', $preset);
            $mform->setAdvanced('mplayerstart');

            // Bufferlength.
            $elements[] = $mform->addElement('select', 'bufferlength', get_string('bufferlength', 'mplayer'), mplayer_list_bufferlength());
            $value = $mform->getElementValue('bufferlength');
            $preset = (!empty($value)) ? $value[0] : 1;
            $mform->setDefault('bufferlength', $preset);
            $mform->setAdvanced('bufferlength');

            // Plugins.
            $elements[] = $mform->addElement('text', 'plugins', get_string('plugins', 'mplayer'), $mplayerurlarray);
            $mform->setType('plugins', PARAM_TEXT);
<<<<<<< HEAD
            $mform->setDefault('plugins', '');
=======
            $mform->setType('plugins', PARAM_TEXT);
            $value = $mform->getElementValue('plugins');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('plugins', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('plugins');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('plugins', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('plugins');
        } else {
            $elements[] = $mform->addElement('hidden', 'mplayerstart');
            $mform->setType('mplayerstart', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'bufferlength');
            $mform->setType('bufferlength', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'plugins');
            $mform->setType('plugins', PARAM_TEXT);
        }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        //--------------------------------------- metadata ---------------------------------------

        if ($CFG->mplayer_default_player == 'jw') {
            $mform->addElement('header', 'metadata', get_string('metadata', 'mplayer'));
            $mform->addHelpButton('metadata', 'mplayer_metadata', 'mplayer');
    
            // author
=======
        // Metadata ---------------------------------------.
=======
        // Metadata.
>>>>>>> MOODLE_32_STABLE

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'metadata', get_string('metadata', 'mplayer'));
            $mform->addHelpButton('metadata', 'mplayer_metadata', 'mplayer');

            // Author.
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'author', get_string('author', 'mplayer'), $mplayer_url_array);
=======
            $mform->addElement('text', 'author', get_string('author', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('text', 'author', get_string('author', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
            $mform->setType('author', PARAM_TEXT);
            $value = $mform->getElementValue('author');
            $preset = (!empty($value)) ? $value : fullname($USER);
            $mform->setDefault('author', $preset);
            $mform->setAdvanced('author');
<<<<<<< HEAD
    
            // mplayerdate
=======

            // Mplayerdate.
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'mplayerdate', get_string('mplayerdate', 'mplayer'), $mplayer_url_array);
=======
            $mform->addElement('text', 'mplayerdate', get_string('mplayerdate', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('text', 'mplayerdate', get_string('mplayerdate', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
            $mform->setType('mplayerdate', PARAM_TEXT);
            $value = $mform->getElementValue('mplayerdate');
            $preset = (!empty($value)) ? $value : date('l jS \of F Y');
            $mform->setDefault('mplayerdate', $preset);
            $mform->setAdvanced('mplayerdate');
<<<<<<< HEAD
    
            // title
            $mform->addElement('text', 'title', get_string('title', 'mplayer'), $mplayer_url_array);
=======
=======
>>>>>>> MOODLE_34_STABLE
        // Metadata.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'metadata', get_string('metadata', 'mplayer'));
            $mform->addHelpButton('metadata', 'mplayer_metadata', 'mplayer');

            // Author.
            $elements[] = $mform->addElement('text', 'author', get_string('author', 'mplayer'), $mplayerurlarray);
            $mform->setType('author', PARAM_TEXT);
            $value = $mform->getElementValue('author');
            $preset = (!empty($value)) ? $value : fullname($USER);
            $mform->setDefault('author', $preset);
            $mform->setAdvanced('author');

            // Mplayerdate.
            $elements[] = $mform->addElement('text', 'mplayerdate', get_string('mplayerdate', 'mplayer'), $mplayerurlarray);
            $mform->setType('mplayerdate', PARAM_TEXT);
            $value = $mform->getElementValue('mplayerdate');
            $preset = (!empty($value)) ? $value : date('l jS \of F Y');
            $mform->setDefault('mplayerdate', $preset);
            $mform->setAdvanced('mplayerdate');

            // Title.
            $elements[] = $mform->addElement('text', 'title', get_string('title', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('title');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('title', $preset);
            $mform->setType('title', PARAM_CLEANHTML);
            $mform->setAdvanced('title');

            // Description.
            $elements[] = $mform->addElement('text', 'description', get_string('description', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('description');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('description', $preset);
            $mform->setType('description', PARAM_CLEANHTML);
            $mform->setAdvanced('description');
<<<<<<< HEAD
<<<<<<< HEAD
    
            // tags
            $mform->addElement('text', 'tags', get_string('tags', 'mplayer'), $mplayer_url_array);
            $mform->setType('tags', PARAM_CLEANHTML);
            $mform->setAdvanced('tags');
=======

            // Title.
            $elements[] = $mform->addElement('text', 'title', get_string('title', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('title');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('title', $preset);
            $mform->setType('title', PARAM_CLEANHTML);
            $mform->setAdvanced('title');

            // Description.
            $elements[] = $mform->addElement('text', 'description', get_string('description', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('description');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('description', $preset);
            $mform->setType('description', PARAM_CLEANHTML);
            $mform->setAdvanced('description');

>>>>>>> MOODLE_32_STABLE
=======

>>>>>>> MOODLE_33_STABLE
=======

>>>>>>> MOODLE_34_STABLE
        } else {
            $elements[] = $mform->addElement('hidden', 'author');
            $mform->setType('author', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'date');
            $mform->setType('date', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'title');
            $mform->setType('title', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'description');
            $mform->setType('description', PARAM_CLEANHTML);

        }

        // AUDIODESCRIPTION.

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        if ($CFG->mplayer_default_player == 'jw') {
            $mform->addElement('header', 'audiodescription', get_string('audiodescription', 'mplayer'));
=======
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
            $elements[] = $mform->addElement('header', 'audiodescription', get_string('audiodescription', 'mplayer'));
>>>>>>> MOODLE_33_STABLE
            $mform->addHelpButton('audiodescription', 'mplayer_audiodescription', 'mplayer');

            // Audiodescriptionfile.
            $options = array('courseid' => $COURSE->id);
            $label = get_string('audiodescriptionfile', 'mplayer');
            $elements[] = $mform->addElement('filepicker', 'audiodescriptionfile', $label, $options);
            $mform->setAdvanced('audiodescriptionfile');
<<<<<<< HEAD
    
            // audiodescriptionstate
=======

        }

        // AUDIODESCRIPTION.

        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('header', 'audiodescription', get_string('audiodescription', 'mplayer'));
            $mform->addHelpButton('audiodescription', 'mplayer_audiodescription', 'mplayer');

            // Audiodescriptionfile.
            $options = array('courseid' => $COURSE->id);
            $label = get_string('audiodescriptionfile', 'mplayer');
            $elements[] = $mform->addElement('filepicker', 'audiodescriptionfile', $label, $options);
            $mform->setAdvanced('audiodescriptionfile');

            // Audiodescriptionstate.
            $label = get_string('audiodescriptionstate', 'mplayer');
            $elements[] = $mform->addElement('select', 'audiodescriptionstate', $label, mplayer_list_truefalse());
            $value = $mform->getElementValue('audiodescriptionstate');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('audiodescriptionstate', $preset);
            $mform->setAdvanced('audiodescriptionstate');

            // Audiodescriptionvolume.
            $label = get_string('audiodescriptionvolume', 'mplayer');
            $elements[] = $mform->addElement('select', 'audiodescriptionvolume', $label, mplayer_list_volume());
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======

            // Audiodescriptionstate.
            $label = get_string('audiodescriptionstate', 'mplayer');
            $elements[] = $mform->addElement('select', 'audiodescriptionstate', $label, mplayer_list_truefalse());
            $value = $mform->getElementValue('audiodescriptionstate');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('audiodescriptionstate', $preset);
            $mform->setAdvanced('audiodescriptionstate');

            // Audiodescriptionvolume.
            $label = get_string('audiodescriptionvolume', 'mplayer');
            $elements[] = $mform->addElement('select', 'audiodescriptionvolume', $label, mplayer_list_volume());
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
            $mform->setDefault('audiodescriptionvolume', '90');
=======
            $value = $mform->getElementValue('audiodescriptionvolume');
            $preset = (!empty($value)) ? $value[0] : '90';
            $mform->setDefault('audiodescriptionvolume', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('audiodescriptionvolume');
            $preset = (!empty($value)) ? $value[0] : '90';
            $mform->setDefault('audiodescriptionvolume', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('audiodescriptionvolume');
        } else {
            $elements[] = $mform->addElement('hidden', 'audiodescriptionstate');
            $mform->setType('audiodescriptionstate', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'audiodescriptionvolume');
            $mform->setType('audiodescriptionvolume', PARAM_INT);
        }

        // CAPTIONS.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'captions', get_string('captions', 'mplayer'));
            $mform->addHelpButton('captions', 'mplayer_captions', 'mplayer');

            // Captionsback.
            $elements[] = $mform->addElement('select', 'captionsback', get_string('captionsback', 'mplayer'), mplayer_list_truefalse());
            $value = $mform->getElementValue('captionsback');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('captionsback', $preset);
            $mform->setAdvanced('captionsback');

            // Captionsfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'captionsfile', get_string('captionsfile', 'mplayer'), $options);
            $mform->setAdvanced('captionsfile');

            // Captionsfontsize.
            $elements[] = $mform->addElement('text', 'captionsfontsize', get_string('captionsfontsize', 'mplayer'), $mplayerintarray);
            $mform->setType('captionsfontsize', PARAM_INT);
            $value = $mform->getElementValue('captionsfontsize');
            $preset = (!empty($value)) ? $value : '14';
            $mform->setDefault('captionsfontsize', $preset);
            $mform->setAdvanced('captionsfontsize');

            // Captionsstate.
            $elements[] = $mform->addElement('select', 'captionsstate', get_string('captionsstate', 'mplayer'), mplayer_list_truefalse());
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
            $mform->setDefault('captionsstate', 'true');
=======
            $value = $mform->getElementValue('captionsstate');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('captionsstate', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('captionsstate');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('captionsstate', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('captionsstate');
        } else {
            $elements[] = $mform->addElement('hidden', 'captionsback');
            $mform->setType('captionsback', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'captionsfontsize');
            $mform->setType('captionsfontsize', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'captionsstate');
            $mform->setType('captionsstate', PARAM_TEXT);
        }

        // HD.

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('header', 'hd', get_string('hd', 'mplayer'));
            $mform->addHelpButton('hd', 'mplayer_hd', 'mplayer');

            // Hdbitrate.
            $elements[] = $mform->addElement('text', 'hdbitrate', get_string('hdbitrate', 'mplayer'), $mplayerintarray);
            $mform->setType('hdbitrate', PARAM_INT);
            $value = $mform->getElementValue('hdbitrate');
            $preset = (!empty($value)) ? $value : '1500';
            $mform->setDefault('hdbitrate', $preset);
            $mform->setAdvanced('hdbitrate');

            // Hdfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'hdfile', get_string('hdfile', 'mplayer'), $options);
            $mform->setAdvanced('hdfile');

            // Hdfullscreen.
            $elements[] = $mform->addElement('select', 'hdfullscreen', get_string('hdfullscreen', 'mplayer'), mplayer_list_truefalse());
            $value = $mform->getElementValue('hdfullscreen');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('hdfullscreen', $preset);
            $mform->setAdvanced('hdfullscreen');

            // Hdstate.
            $elements[] = $mform->addElement('select', 'hdstate', get_string('hdstate', 'mplayer'), mplayer_list_truefalse());
            $value = $mform->getElementValue('hdstate');
            $preset = (!empty($value)) ? $value : 'true';
            $mform->setDefault('hdstate', $preset);
            $mform->setAdvanced('hdstate');
        } else {
            $elements[] = $mform->addElement('hidden', 'hdbitrate');
            $mform->setType('hdbitrate', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'hdfullscreen');
            $mform->setType('hdfullscreen', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'hdstate');
            $mform->setType('hdstate', PARAM_INT);
        }

        // INFOBOX.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'infobox', get_string('infobox', 'mplayer'));
            $mform->addHelpButton('infobox', 'mplayer_infobox', 'mplayer');

            // Infoboxcolor.
            $elements[] = $mform->addElement('text', 'infoboxcolor', get_string('infoboxcolor', 'mplayer'), $mplayerintarray);
            $mform->setType('infoboxcolor', PARAM_TEXT);
            $value = $mform->getElementValue('infoboxcolor');
            $preset = (!empty($value)) ? $value : 'ffffff';
            $mform->setDefault('infoboxcolor', $preset);
            $mform->setAdvanced('infoboxcolor');

            // Infoboxposition.
            $label = get_string('infoboxposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'infoboxposition', $label, mplayer_list_infoboxposition());
            $value = $mform->getElementValue('infoboxposition');
            $preset = (!empty($value)) ? $value : 'none';
            $mform->setDefault('infoboxposition', $preset);
            $mform->setAdvanced('infoboxposition');

            // Infoboxsize.
            $elements[] = $mform->addElement('text', 'infoboxsize', get_string('infoboxsize', 'mplayer'), $mplayerintarray);
            $mform->setType('infoboxsize', PARAM_INT);
            $value = $mform->getElementValue('infoboxsize');
            $preset = (!empty($value)) ? $value : '85';
            $mform->setDefault('infoboxsize', $preset);
            $mform->setAdvanced('infoboxsize');
        } else {
            $elements[] = $mform->addElement('hidden', 'infoboxcolor');
            $mform->setType('infoboxcolor', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'infoboxposition');
            $mform->setType('infoboxposition', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'infoboxsize');
            $mform->setType('infoboxsize', PARAM_INT);
        }

        // LIVESTREAM.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'livestream', get_string('livestream', 'mplayer'));
            // $mform->addHelpButton('livestream', 'mplayer_livestream', 'mplayer');

            // Livestreamfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'livestreamfile', get_string('livestreamfile', 'mplayer'), $options);
            $mform->setAdvanced('livestreamfile');

            // Livestreamimage.
            $elements[] = $mform->addElement('filepicker', 'livestreamimagefile', get_string('livestreamimage', 'mplayer'), $options);
            $mform->setAdvanced('livestreamimagefile');

            // Livestreaminterval.
            $elements[] = $mform->addElement('text', 'livestreaminterval', get_string('livestreaminterval', 'mplayer'), $mplayerintarray);
            $mform->setType('livestreaminterval', PARAM_INT);
            $value = $mform->getElementValue('livestreaminterval');
            $preset = (!empty($value)) ? $value : '15';
            $mform->setDefault('livestreaminterval', $preset);
            $mform->setAdvanced('livestreaminterval');

            // Livestreammessage.
            $elements[] = $mform->addElement('text', 'livestreammessage', get_string('livestreammessage', 'mplayer'), $mplayerurlarray);
            $mform->setType('livestreammessage', PARAM_CLEANHTML);
            $value = $mform->getElementValue('livestreammessage');
            $preset = (!empty($value)) ? $value : 'Checking for livestream...';
            $mform->setDefault('livestreammessage', $preset);
            $mform->setAdvanced('livestreammessage');

            // Livestreamstreamer.
            $label = get_string('livestreamstreamer', 'mplayer');
            $elements[] = $mform->addElement('select', 'livestreamstreamer', $label, mplayer_list_streamer());
            $value = $mform->getElementValue('livestreamstreamer');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('livestreamstreamer', $preset);
            $mform->setAdvanced('livestreamstreamer');

            // Livestreamtags.
            $elements[] = $mform->addElement('text', 'livestreamtags', get_string('livestreamtags', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('livestreamtags');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('livestreamtags', $preset);
            $mform->setType('livestreamtags', PARAM_INT);
            $mform->setAdvanced('livestreamtags');
        } else {
            $elements[] = $mform->addElement('hidden', 'livestreaminterval');
            $mform->setType('livestreaminterval', PARAM_CLEANHTML);
            $elements[] = $mform->addElement('hidden', 'livestreammessage');
            $mform->setType('livestreammessage', PARAM_CLEANHTML);
            $elements[] = $mform->addElement('hidden', 'livestreamstreamer');
            $mform->setType('livestreamstreamer', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'livestreamtags');
            $mform->setType('livestreamtags', PARAM_CLEANHTML);
        }

        // LOGOBOX.

        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'logobox', get_string('logobox', 'mplayer'));
            $mform->addHelpButton('logobox', 'mplayer_logobox', 'mplayer');

            // Logoboxalign.
            $elements[] = $mform->addElement('select', 'logoboxalign', get_string('logoboxalign', 'mplayer'), mplayer_list_logoboxalign());
            $value = $mform->getElementValue('logoboxalign');
            $preset = (!empty($value)) ? $value : 'left';
            $mform->setDefault('logoboxalign', $preset);
            $mform->setAdvanced('logoboxalign');

            // Logoboxfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'logoboxfile', get_string('logoboxfile', 'mplayer'), $options);
            $mform->setAdvanced('logoboxfile');

            // Logoboxlink.
            $elements[] = $mform->addElement('text', 'logoboxlink', get_string('logoboxlink', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('logoboxlink');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('logoboxlink', $preset);
            $mform->setType('logoboxlink', PARAM_URL);
            $mform->setAdvanced('logoboxlink');

            // Logoboxmargin.
            $elements[] = $mform->addElement('text', 'logoboxmargin', get_string('logoboxmargin', 'mplayer'), $mplayerintarray);
            $mform->setType('logoboxmargin', PARAM_INT);
            $value = $mform->getElementValue('logoboxmargin');
            $preset = (!empty($value)) ? $value : '15';
            $mform->setDefault('logoboxmargin', $preset);
            $mform->setAdvanced('logoboxmargin');

            // Logoboxposition.
            $label = get_string('logoboxposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'logoboxposition', $label, mplayer_list_infoboxposition());
            $value = $mform->getElementValue('logoboxposition');
            $preset = (!empty($value)) ? $value : 'top';
            $mform->setDefault('logoboxposition', $preset);
            $mform->setAdvanced('logoboxposition');
        } else {
            $elements[] = $mform->addElement('hidden', 'logoboxalign');
            $mform->setType('logoboxalign', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'logoboxlink');
            $mform->setType('logoboxlink', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'logoboxmargin');
            $mform->setType('logoboxmargin', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'logoboxposition');
            $mform->setType('logoboxposition', PARAM_TEXT);
        }

        // Metaviewer ---------------------------------------.
        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'metaviewer', get_string('metaviewer', 'mplayer'));
            $mform->addHelpButton('metaviewer', 'mplayer_metaviewer', 'mplayer');

            // Metaviewerposition.
            $label = get_string('metaviewerposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'metaviewerposition', $label, mplayer_list_metaviewerposition());
            $value = $mform->getElementValue('metaviewerposition');
            $preset = (!empty($value)) ? $value[0] : 'none';
            $mform->setDefault('metaviewerposition', $preset);
            $mform->setAdvanced('metaviewerposition');

            // Metaviewersize.
            $elements[] = $mform->addElement('text', 'metaviewersize', get_string('metaviewersize', 'mplayer'), $mplayerintarray);
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
            $label = get_string('metaviewerposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'metaviewerposition', $label, mplayer_list_metaviewerposition());
            $value = $mform->getElementValue('metaviewerposition');
            $preset = (!empty($value)) ? $value[0] : 'none';
            $mform->setDefault('metaviewerposition', $preset);
            $mform->setAdvanced('metaviewerposition');

            // Metaviewersize.
            $elements[] = $mform->addElement('text', 'metaviewersize', get_string('metaviewersize', 'mplayer'), $mplayerintarray);
>>>>>>> MOODLE_33_STABLE
=======
>>>>>>> MOODLE_34_STABLE
            $mform->setType('metaviewersize', PARAM_INT);
            $value = $mform->getElementValue('metaviewersize');
            $preset = (!empty($value)) ? $value[0] : '100';
            $mform->setDefault('metaviewersize', $preset);
            $mform->setAdvanced('metaviewersize');
        } else {
            $elements[] = $mform->addElement('hidden', 'metaviewerposition');
            $mform->setType('metaviewerposition', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'metaviewersize');
            $mform->setType('metaviewersize', PARAM_INT);
        }

        // SEARCHBAR.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE

<<<<<<< HEAD
<<<<<<< HEAD
        if ($instance->technology == 'jw') {
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('header', 'searchbar', get_string('searchbar', 'mplayer'));
=======
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
            $elements[] = $mform->addElement('header', 'searchbar', get_string('searchbar', 'mplayer'));
>>>>>>> MOODLE_32_STABLE
            $mform->addHelpButton('searchbar', 'mplayer_searchbar', 'mplayer');
            $mform->setAdvanced('searchbar');

<<<<<<< HEAD
            // searchbarcolor 
=======
            // Searchbarcolor.
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'searchbarcolor', get_string('searchbarcolor', 'mplayer'), $mplayer_int_array);
=======
            $mform->addElement('text', 'searchbarcolor', get_string('searchbarcolor', 'mplayer'), $mplayerintarray);
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('text', 'searchbarcolor', get_string('searchbarcolor', 'mplayer'), $mplayerintarray);
>>>>>>> MOODLE_32_STABLE
            $mform->setType('searchbarcolor', PARAM_TEXT);
            $value = $mform->getElementValue('searchbarcolor');
            $preset = (!empty($value)) ? $value : 'CC0000';
            $mform->setDefault('searchbarcolor', $preset);
            $mform->setAdvanced('searchbarcolor');
<<<<<<< HEAD
    
            // searchbarlabel 
=======

            // Searchbarlabel.
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('text', 'searchbarlabel', get_string('searchbarlabel', 'mplayer'), $mplayer_url_array);
=======
            $mform->addElement('text', 'searchbarlabel', get_string('searchbarlabel', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('text', 'searchbarlabel', get_string('searchbarlabel', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_32_STABLE
            $mform->setType('searchbarlabel', PARAM_TEXT);
            $value = $mform->getElementValue('searchbarlabel');
            $preset = (!empty($value)) ? $value : 'Search';
            $mform->setDefault('searchbarlabel', $preset);
            $mform->setAdvanced('searchbarlabel');
<<<<<<< HEAD
    
            // searchbarposition 
=======

            // Searchbarposition.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('select', 'searchbarposition', get_string('searchbarposition', 'mplayer'), mplayer_list_searchbarposition());
            $mform->setDefault('searchbarposition', '');
            $mform->setAdvanced('searchbarposition');
    
<<<<<<< HEAD
            // searchbarscript 
=======
            // Searchbarscript.
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('select', 'searchbarscript', get_string('searchbarscript', 'mplayer'), mplayer_list_searchbarscript());
=======
            $label = get_string('searchbarposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'searchbarposition', $label, mplayer_list_searchbarposition());
            $value = $mform->getElementValue('searchbarposition');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('searchbarposition', $preset);
            $mform->setAdvanced('searchbarposition');

            // Searchbarscript.
            $label = get_string('searchbarscript', 'mplayer');
<<<<<<< HEAD
            $mform->addElement('select', 'searchbarscript', $label, mplayer_list_searchbarscript());
>>>>>>> MOODLE_32_STABLE
=======
            $elements[] = $mform->addElement('select', 'searchbarscript', $label, mplayer_list_searchbarscript());
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
        // SEARCHBAR.

        if ($technology == 'jw') {
=======

        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('header', 'searchbar', get_string('searchbar', 'mplayer'));
            $mform->addHelpButton('searchbar', 'mplayer_searchbar', 'mplayer');
            $mform->setAdvanced('searchbar');

            // Searchbarcolor.
            $elements[] = $mform->addElement('text', 'searchbarcolor', get_string('searchbarcolor', 'mplayer'), $mplayerintarray);
            $mform->setType('searchbarcolor', PARAM_TEXT);
            $value = $mform->getElementValue('searchbarcolor');
            $preset = (!empty($value)) ? $value : 'CC0000';
            $mform->setDefault('searchbarcolor', $preset);
            $mform->setAdvanced('searchbarcolor');

            // Searchbarlabel.
            $elements[] = $mform->addElement('text', 'searchbarlabel', get_string('searchbarlabel', 'mplayer'), $mplayerurlarray);
            $mform->setType('searchbarlabel', PARAM_TEXT);
            $value = $mform->getElementValue('searchbarlabel');
            $preset = (!empty($value)) ? $value : 'Search';
            $mform->setDefault('searchbarlabel', $preset);
            $mform->setAdvanced('searchbarlabel');

            // Searchbarposition.
            $label = get_string('searchbarposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'searchbarposition', $label, mplayer_list_searchbarposition());
            $value = $mform->getElementValue('searchbarposition');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('searchbarposition', $preset);
            $mform->setAdvanced('searchbarposition');

            // Searchbarscript.
            $label = get_string('searchbarscript', 'mplayer');
            $elements[] = $mform->addElement('select', 'searchbarscript', $label, mplayer_list_searchbarscript());
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
            $mform->setDefault('searchbarscript', '');
=======
            $value = $mform->getElementValue('searchbarscript');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('searchbarscript', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('searchbarscript');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('searchbarscript', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('searchbarscript');
        } else {
            $elements[] = $mform->addElement('hidden', 'searchbarcolor');
            $mform->setType('searchbarcolor', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'searchbarlabel');
            $mform->setType('searchbarlabel', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'searchbarposition');
            $mform->setType('searchbarposition', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'searchbarscript');
            $mform->setType('searchbarscript', PARAM_TEXT);
        }

        // SNAPSHOT.

<<<<<<< HEAD
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'snapshot', get_string('snapshot', 'mplayer'));
            $mform->addHelpButton('snapshot', 'mplayer_snapshot', 'mplayer');

            // Snapshotbitmap.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('select', 'snapshotbitmap', get_string('snapshotbitmap', 'mplayer'), mplayer_list_truefalse());
=======
            $elements[] = $mform->addElement('select', 'snapshotbitmap', get_string('snapshotbitmap', 'mplayer'), mplayer_list_truefalse());
>>>>>>> MOODLE_32_STABLE
            $mform->setDefault('snapshotbitmap', 'true');
            $mform->setAdvanced('snapshotbitmap');
<<<<<<< HEAD
    
<<<<<<< HEAD
            // snapshotscript
=======
=======

>>>>>>> MOODLE_32_STABLE
            // Snapshotscript.
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('select', 'snapshotscript', get_string('snapshotscript', 'mplayer'), mplayer_list_snapshotscript());
=======
            $elements[] = $mform->addElement('select', 'snapshotscript', get_string('snapshotscript', 'mplayer'), mplayer_list_snapshotscript());
>>>>>>> MOODLE_32_STABLE
=======
        // SNAPSHOT.

=======
>>>>>>> MOODLE_34_STABLE
        if ('jw' == substr($technology, 0, 2)) {
            $elements[] = $mform->addElement('header', 'snapshot', get_string('snapshot', 'mplayer'));
            $mform->addHelpButton('snapshot', 'mplayer_snapshot', 'mplayer');

            // Snapshotbitmap.
            $elements[] = $mform->addElement('select', 'snapshotbitmap', get_string('snapshotbitmap', 'mplayer'), mplayer_list_truefalse());
            $value = $mform->getElementValue('snapshotbitmap');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('snapshotbitmap', 'true');
            $mform->setAdvanced('snapshotbitmap');

            // Snapshotscript.
            $elements[] = $mform->addElement('select', 'snapshotscript', get_string('snapshotscript', 'mplayer'), mplayer_list_snapshotscript());
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
            $mform->setDefault('snapshotscript', '');
=======
            $value = $mform->getElementValue('snapshotscript');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('snapshotscript', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('snapshotscript');
            $preset = (!empty($value)) ? $value[0] : '';
            $mform->setDefault('snapshotscript', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setAdvanced('snapshotscript');
        } else {
            $elements[] = $mform->addElement('hidden', 'snapshotbitmap');
            $mform->setType('snapshotbitmap', PARAM_BOOL);
            $elements[] = $mform->addElement('hidden', 'snapshotscript');
            $mform->setType('snapshotscript', PARAM_TEXT);
        }

        // JW LOGO (licenced players only).

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_33_STABLE
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('header', 'logo', get_string('logo', 'mplayer'));
            // $mform->addHelpButton('logo', 'mplayer_logo', 'mplayer');
            $mform->setAdvanced('logo');

            // Logofile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'logofile', get_string('logofile', 'mplayer'), $options);
            $mform->setAdvanced('logofile');

            // Logolink.
            $elements[] = $mform->addElement('text', 'logolink', get_string('logolink', 'mplayer'), $mplayerurlarray);
            $value = $mform->getElementValue('logolink');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('logolink', $preset);
            $mform->setType('logolink', PARAM_URL);
            $mform->setAdvanced('logolink');

            // logohide.
            $elements[] = $mform->addElement('select', 'logohide', get_string('logohide', 'mplayer'), mplayer_list_truefalse());
            $value = $mform->getElementValue('logohide');
            $preset = (!empty($value)) ? $value[0] : 'true';
            $mform->setDefault('logohide', $preset);
            $mform->setAdvanced('logohide');

            // Logoposition.
            $elements[] = $mform->addElement('select', 'logoposition', get_string('logoposition', 'mplayer'), mplayer_list_logoposition());
            $value = $mform->getElementValue('logoposition');
            $preset = (!empty($value)) ? $value[0] : 'bottom-left';
            $mform->setDefault('logoposition', $preset);
            $mform->setAdvanced('logoposition');
        } else {
            $elements[] = $mform->addElement('hidden', 'logolink');
            $mform->setType('logolink', PARAM_URL);
            $elements[] = $mform->addElement('hidden', 'logohide');
            $mform->setType('logohide', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'logoposition');
            $mform->setType('logoposition', PARAM_TEXT);
        }

        // ADVANCED.

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        if ($instance->technology == 'jw') {
>>>>>>> MOODLE_32_STABLE
            $mform->addElement('header', 'advanced', get_string('advanced', 'mplayer'));
=======
        if ($technology == 'jw') {
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_33_STABLE
=======
        if ('jw' == substr($technology, 0, 2)) {
>>>>>>> MOODLE_34_STABLE
            $elements[] = $mform->addElement('header', 'advanced', get_string('advanced', 'mplayer'));
            $mform->addHelpButton('advanced', 'mplayer_advanced', 'mplayer');
            $mform->setAdvanced('advanced');

            // Fpversion.
            $elements[] = $mform->addElement('text', 'fpversion', get_string('fpversion', 'mplayer'), array('size' => '9'));
            $mform->setType('fpversion', PARAM_TEXT);
            $value = $mform->getElementValue('fpversion');
            $preset = (!empty($value)) ? $value : '9.0.115';
            $mform->setDefault('fpversion', $preset);
            $mform->setAdvanced('fpversion');

            // Tracecall.
            $elements[] = $mform->addElement('text', 'tracecall', get_string('tracecall', 'mplayer'), $mplayerurlarray);
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> MOODLE_32_STABLE
=======
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'advanced', get_string('advanced', 'mplayer'));
            $mform->addHelpButton('advanced', 'mplayer_advanced', 'mplayer');
            $mform->setAdvanced('advanced');

            // Fpversion.
            $elements[] = $mform->addElement('text', 'fpversion', get_string('fpversion', 'mplayer'), array('size' => '9'));
            $mform->setType('fpversion', PARAM_TEXT);
            $mform->setDefault('fpversion', '9.0.115');
            $mform->setAdvanced('fpversion');

            // Tracecall.
            $elements[] = $mform->addElement('text', 'tracecall', get_string('tracecall', 'mplayer'), $mplayerurlarray);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('tracecall');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('traceall', $preset);
>>>>>>> MOODLE_33_STABLE
=======
            $value = $mform->getElementValue('tracecall');
            $preset = (!empty($value)) ? $value : '';
            $mform->setDefault('traceall', $preset);
>>>>>>> MOODLE_34_STABLE
            $mform->setType('tracecall', PARAM_TEXT);
            $mform->setAdvanced('tracecall');
        } else {
            $elements[] = $mform->addElement('hidden', 'fpversion');
            $mform->setType('fpversion', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'tracecall');
            $mform->setType('tracecall', PARAM_TEXT);
        }

        return $elements;
    }
}
