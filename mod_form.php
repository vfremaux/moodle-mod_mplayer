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
        $PAGE->requires->yui_module('moodle-mplayer-technologychooser', 'M.course.init_technologychooser',
                array(array('formid' => $mform->getAttribute('id'))));

        $config = get_config('mplayer');

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

        // Introduction.
        $this->standard_intro_elements();

        // TECHNOLOGY.

        if (!empty($config->allowchoice)) {
            $mform->addElement('header', 'headertechnology', get_string('technology', 'mplayer'));
            $mform->addHelpButton('headertechnology', 'mplayer_technology', 'mplayer');
            $mform->setExpanded('headertechnology');

            // Technology.
            $mform->addElement('select', 'technology', get_string('technology', 'mplayer'), mplayer_list_technologies());
            $mform->setDefault('technology', $config->default_player);

        }

        // MEDIA SOURCE.

        $mform->addElement('header', 'mplayerresources', get_string('mplayerresources', 'mplayer'));
        $mform->addHelpButton('mplayerresources', 'mplayer_resources', 'mplayer');
        $mform->setExpanded('mplayerresources');

        // Mplayerfile.
        $options = array('subdirs' => true, 'courseid' => $COURSE->id, 'maxfiles' => 60);
        $mform->addElement('filemanager', 'mplayerfiles', get_string('mplayerfiles', 'mplayer'), null, $options);

        // Type.
        $mform->addElement('select', 'type', get_string('type', 'mplayer'), mplayer_list_type($instance));
        $mform->setDefault('type', 'video');

        // External url alternative.
        $attrs = array('rows' => 5, 'style' => 'width:97%', 'height' => 0);
        $mform->addElement('textarea', 'external', get_string('external', 'mplayer'), $attrs);

        $mform->addElement('select', 'streamer', get_string('streamer', 'mplayer'), mplayer_list_streamer());
        $mform->disabledIf('streamer', 'type', 'neq', 'rtmp');
        $mform->setDefault('streamer', 'none');
        $mform->setAdvanced('streamer');

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

        $technologyvalue = array_pop($mform->getElementValue('technology'));
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

        // PLAYLISTS.

        $elements[] = $mform->addElement('header', 'playlists', get_string('playlists', 'mplayer'));
        $mform->addHelpButton('playlists', 'mplayer_playlist', 'mplayer');

        // Local file path template.
        $clipurl = $CFG->wwwroot.'/pluginfile.php/'.$this->context->id.'/mod_mplayer/mplayerfile/0/&lt;filename&gt;';
        $elements[] = $mform->addElement('static', 'playlistlocalpath', get_string('playlistlocalpath', 'mplayer'), $clipurl);

        // Playlist.
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('select', 'playlist', get_string('playlist', 'mplayer'), mplayer_list_playlistposition());
        } else {
            $elements[] = $mform->addElement('select', 'playlist', get_string('playliststyle', 'mplayer'), mplayer_list_playliststyles());
        }

        // Playlistsize.
        $elements[] = $mform->addElement('text', 'playlistsize', get_string('playlistsize', 'mplayer'), $mplayerintarray);
        $mform->setType('playlistsize', PARAM_INT);
        $mform->setDefault('playlistsize', '180');
        $mform->setAdvanced('playlistsize');

        // Item.
        // TODO : Check if still necessary.
        $elements[] = $mform->addElement('text', 'item', get_string('item', 'mplayer'), $mplayerintarray);
        $mform->setType('item', PARAM_TEXT);
        $mform->setDefault('item', '');
        $mform->setAdvanced('item');

        // Repeat.
        $elements[] = $mform->addElement('select', 'mplayerrepeat', get_string('mplayerrepeat', 'mplayer'), mplayer_list_repeat());
        $mform->setDefault('mplayerrepeat', 'none');
        $mform->setAdvanced('mplayerrepeat');

        // Shuffle.
        $elements[] = $mform->addElement('select', 'shuffle', get_string('shuffle', 'mplayer'), mplayer_list_truefalse());
        $mform->setDefault('shuffle', 'false');
        $mform->setAdvanced('shuffle');

        // SUBTITLES.

        if ($technology != 'jw') {
            $elements[] = $mform->addElement('header', 'configsubtitles', get_string('configsubtitles', 'mplayer'));

            $elements[] = $mform->addElement('select', 'langselection', get_string('langselection', 'mplayer'), mplayer_list_langchoiceoptions());
            $mform->setDefault('langselection', 'langcourse');

            $elements[] = $mform->addElement('select', 'langforced', get_string('langforced', 'mplayer'), mplayer_list_availablelangoptions());
            $mform->disabledIf('langforced', 'langselection', 'neq', 'langteacherchoice');
        }

        // CONFIGXML.

        if ($technology == 'jw') {
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
        $mform->addRule('width', get_string('required'), 'required', null, 'client');
        if (empty($config->default_width)) {
            set_config('default_width', '100%', 'mplayer');
            $config->default_width = '100%';
        }
        $mform->setDefault('width', $config->default_width);

        // Height.
        $elements[] = $mform->addElement('text', 'height', get_string('height', 'mplayer'), $mplayerintarray);
        $mform->setType('height', PARAM_TEXT);
        $mform->addRule('height', get_string('required'), 'required', null, 'client');
        if (empty($CFG->default_height)) {
            $CFG->mplayer_default_height = 570;
            $config->default_height = 570;
        }
        $mform->setDefault('height', $config->default_height);

        $elements[] = $mform->addElement('hidden', 'skin', '');
        $mform->setType('skin', PARAM_TEXT);

        // Icons.
        $elements[] = $mform->addElement('select', 'icons', get_string('icons', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_icons)) {
            set_config('default_icons', 'true', 'mplayer');
            $config->default_icons = 'true';
        }
        $mform->setDefault('icons', $config->default_icons);
        $mform->setAdvanced('icons');

        // Controlbar.
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('select', 'controlbar', get_string('controlbar', 'mplayer'), mplayer_list_controlbar());
            if (empty($config->default_controlbar)) {
                set_config('default_controlbar', 'bottom', 'mplayer');
                $config->default_controlbar = 'bottom';
            }
            $mform->setDefault('controlbar', $config->default_controlbar);
            $mform->setAdvanced('controlbar');
        }

        // Backcolor.
        $elements[] = $mform->addElement('text', 'backcolor', get_string('backcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('backcolor', PARAM_TEXT);
        if (!isset($config->default_backcolor)) {
            set_config('default_backcolor', '#000000', 'mplayer');
            $config->default_backcolor = '#000000';
        }
        $mform->setDefault('backcolor', $config->default_backcolor);
        $mform->setAdvanced('backcolor');

        // Frontcolor.
        $elements[] = $mform->addElement('text', 'frontcolor', get_string('frontcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('frontcolor', PARAM_TEXT);
        if (!isset($config->default_frontcolor)) {
            set_config('default_frontcolor', '#dddddd', 'mplayer');
            $config->default_frontcolor = '#dddddd';
        }
        $mform->setDefault('frontcolor', $config->default_frontcolor);
        $mform->setAdvanced('frontcolor');

        // Lightcolor.
        $elements[] = $mform->addElement('text', 'lightcolor', get_string('lightcolor', 'mplayer'), $mplayerintarray);
        $mform->setType('lightcolor', PARAM_TEXT);
        if (!isset($config->default_lightcolor)) {
            set_config('default_lightcolor', '#ffffff', 'mplayer');
            $config->default_lightcolor = '#ffffff';
        }
        $mform->setDefault('lightcolor', $config->default_lightcolor);
        $mform->setAdvanced('lightcolor');

        // Screencolor.
        $elements[] = $mform->addElement('text', 'screencolor', get_string('screencolor', 'mplayer'), $mplayerintarray);
        $mform->setType('screencolor', PARAM_TEXT);
        if (!isset($config->default_screencolor)) {
            set_config('default_screencolor', '#80ff80', 'mplayer');
            $config->default_screencolor = '#80ff80';
        }
        $mform->setDefault('screencolor', $config->default_screencolor);
        $mform->setAdvanced('screencolor');

        // Smoothing.
        $elements[] = $mform->addElement('select', 'smoothing', get_string('smoothing', 'mplayer'), mplayer_list_truefalse());
        $mform->setDefault('smoothing', 'true');
        $mform->setAdvanced('smoothing');

        // Quality.
        $elements[] = $mform->addElement('select', 'quality', get_string('quality', 'mplayer'), mplayer_list_quality());
        $mform->setDefault('quality', 'best');
        $mform->setAdvanced('quality');

        // BEHAVIOUR.

        $elements[] = $mform->addElement('header', 'behaviour', get_string('behaviour', 'mplayer'));
        // $mform->addHelpButton('behaviour', 'mplayer_behaviour', 'mplayer');

        // Autostart.
        $elements[] = $mform->addElement('select', 'autostart', get_string('autostart', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_autostart)) {
            set_config('default_autostart', 'false', 'mplayer');
            $config->default_autostart = 'false';
        }
        $mform->setDefault('autostart', $config->default_autostart);
        $mform->disabledIf('autostart', 'splashmode', 'eq', 'is-splash');

        // Fullscreen.
        $elements[] = $mform->addElement('select', 'fullscreen', get_string('fullscreen', 'mplayer'), mplayer_list_truefalse());
        if (empty($config->default_fullscreen)) {
            set_config('default_fullscreen', 'true', 'mplayer');
            $config->default_fullscreen = 'true';
        }
        $mform->setDefault('fullscreen', $config->default_fullscreen);

        // Splashmode.
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('hidden', 'splashmode');
            $mform->setType('splashmode', PARAM_TEXT);
        } else {
            $splashoptions = array('' => get_string('nosplash', 'mplayer'), 'is-splash' => get_string('splashenabled', 'mplayer'));
            $elements[] = $mform->addElement('select', 'splashmode', get_string('splashmode', 'mplayer'), $splashoptions);
            if (empty($config->default_splashmode)) {
                set_config('default_splashmode', 'is-splash', 'mplayer');
                $config->default_splashmode = 'is-splash';
            }
            $mform->setDefault('splashmode', $config->default_splashmode);
            $mform->setAdvanced('splashmode');
            $mform->disabledIf('splashmode', 'autostart', 'eq', 'true');
        }

        // Stretching.
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('select', 'stretching', get_string('stretching', 'mplayer'), mplayer_list_stretching());
            if (empty($config->default_stretching)) {
                set_config('default_stretching', 'uniform', 'mplayer');
                $config->default_stretching = 'uniform';
            }
            $mform->setDefault('stretching', $config->default_stretching);
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
        $mform->setDefault('volume', $config->default_volume);
        $mform->setAdvanced('volume');

        // Mute.
        $elements[] = $mform->addElement('select', 'mute', get_string('mute', 'mplayer'), mplayer_list_truefalse());
        $mform->setDefault('mute', 'false');
        $mform->setAdvanced('mute');

        if ($technology == 'jw') {
            // Mplayerstart.
            $elements[] = $mform->addElement('text', 'mplayerstart', get_string('mplayerstart', 'mplayer'), $mplayerintarray);
            $mform->setType('mplayerstart', PARAM_INT);
            $mform->setDefault('mplayerstart', '0');
            $mform->setAdvanced('mplayerstart');

            // Bufferlength.
            $elements[] = $mform->addElement('select', 'bufferlength', get_string('bufferlength', 'mplayer'), mplayer_list_bufferlength());
            $mform->setDefault('bufferlength', '1');
            $mform->setAdvanced('bufferlength');

            // Plugins.
            $elements[] = $mform->addElement('text', 'plugins', get_string('plugins', 'mplayer'), $mplayerurlarray);
            $mform->setType('plugins', PARAM_TEXT);
            $mform->setDefault('plugins', '');
            $mform->setAdvanced('plugins');
        } else {
            $elements[] = $mform->addElement('hidden', 'mplayerstart');
            $mform->setType('mplayerstart', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'bufferlength');
            $mform->setType('bufferlength', PARAM_INT);
            $elements[] = $mform->addElement('hidden', 'plugins');
            $mform->setType('plugins', PARAM_TEXT);
        }

        // Metadata.

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'metadata', get_string('metadata', 'mplayer'));
            $mform->addHelpButton('metadata', 'mplayer_metadata', 'mplayer');

            // Author.
            $elements[] = $mform->addElement('text', 'author', get_string('author', 'mplayer'), $mplayerurlarray);
            $mform->setType('author', PARAM_TEXT);
            $mform->setDefault('author', fullname($USER));
            $mform->setAdvanced('author');

            // Mplayerdate.
            $elements[] = $mform->addElement('text', 'mplayerdate', get_string('mplayerdate', 'mplayer'), $mplayerurlarray);
            $mform->setType('mplayerdate', PARAM_TEXT);
            $mform->setDefault('mplayerdate', date('l jS \of F Y'));
            $mform->setAdvanced('mplayerdate');

            // Title.
            $elements[] = $mform->addElement('text', 'title', get_string('title', 'mplayer'), $mplayerurlarray);
            $mform->setType('title', PARAM_CLEANHTML);
            $mform->setAdvanced('title');

            // Description.
            $elements[] = $mform->addElement('text', 'description', get_string('description', 'mplayer'), $mplayerurlarray);
            $mform->setType('description', PARAM_CLEANHTML);
            $mform->setAdvanced('description');

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

        if ($technology == 'jw') {
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
            $mform->setDefault('audiodescriptionstate', 'true');
            $mform->setAdvanced('audiodescriptionstate');

            // Audiodescriptionvolume.
            $label = get_string('audiodescriptionvolume', 'mplayer');
            $elements[] = $mform->addElement('select', 'audiodescriptionvolume', $label, mplayer_list_volume());
            $mform->setDefault('audiodescriptionvolume', '90');
            $mform->setAdvanced('audiodescriptionvolume');
        } else {
            $elements[] = $mform->addElement('hidden', 'audiodescriptionstate');
            $mform->setType('audiodescriptionstate', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'audiodescriptionvolume');
            $mform->setType('audiodescriptionvolume', PARAM_INT);
        }

        // CAPTIONS.

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'captions', get_string('captions', 'mplayer'));
            $mform->addHelpButton('captions', 'mplayer_captions', 'mplayer');

            // Captionsback.
            $elements[] = $mform->addElement('select', 'captionsback', get_string('captionsback', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('captionsback', 'true');
            $mform->setAdvanced('captionsback');

            // Captionsfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'captionsfile', get_string('captionsfile', 'mplayer'), $options);
            $mform->setAdvanced('captionsfile');

            // Captionsfontsize.
            $elements[] = $mform->addElement('text', 'captionsfontsize', get_string('captionsfontsize', 'mplayer'), $mplayerintarray);
            $mform->setType('captionsfontsize', PARAM_INT);
            $mform->setDefault('captionsfontsize', '14');
            $mform->setAdvanced('captionsfontsize');

            // Captionsstate.
            $elements[] = $mform->addElement('select', 'captionsstate', get_string('captionsstate', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('captionsstate', 'true');
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

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'hd', get_string('hd', 'mplayer'));
            $mform->addHelpButton('hd', 'mplayer_hd', 'mplayer');

            // Hdbitrate.
            $elements[] = $mform->addElement('text', 'hdbitrate', get_string('hdbitrate', 'mplayer'), $mplayerintarray);
            $mform->setType('hdbitrate', PARAM_INT);
            $mform->setDefault('hdbitrate', '1500');
            $mform->setAdvanced('hdbitrate');

            // Hdfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'hdfile', get_string('hdfile', 'mplayer'), $options);
            $mform->setAdvanced('hdfile');

            // Hdfullscreen.
            $elements[] = $mform->addElement('select', 'hdfullscreen', get_string('hdfullscreen', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('hdfullscreen', 'true');
            $mform->setAdvanced('hdfullscreen');

            // Hdstate.
            $elements[] = $mform->addElement('select', 'hdstate', get_string('hdstate', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('hdstate', 'true');
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

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'infobox', get_string('infobox', 'mplayer'));
            $mform->addHelpButton('infobox', 'mplayer_infobox', 'mplayer');

            // Infoboxcolor.
            $elements[] = $mform->addElement('text', 'infoboxcolor', get_string('infoboxcolor', 'mplayer'), $mplayerintarray);
            $mform->setType('infoboxcolor', PARAM_TEXT);
            $mform->setDefault('infoboxcolor', 'ffffff');
            $mform->setAdvanced('infoboxcolor');

            // Infoboxposition.
            $label = get_string('infoboxposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'infoboxposition', $label, mplayer_list_infoboxposition());
            $mform->setDefault('infoboxposition', 'none');
            $mform->setAdvanced('infoboxposition');

            // Infoboxsize.
            $elements[] = $mform->addElement('text', 'infoboxsize', get_string('infoboxsize', 'mplayer'), $mplayerintarray);
            $mform->setType('infoboxsize', PARAM_INT);
            $mform->setDefault('infoboxsize', '85');
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

        if ($technology == 'jw') {
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
            $mform->setDefault('livestreaminterval', '15');
            $mform->setAdvanced('livestreaminterval');

            // Livestreammessage.
            $elements[] = $mform->addElement('text', 'livestreammessage', get_string('livestreammessage', 'mplayer'), $mplayerurlarray);
            $mform->setType('livestreammessage', PARAM_CLEANHTML);
            $mform->setDefault('livestreammessage', 'Checking for livestream...');
            $mform->setAdvanced('livestreammessage');

            // Livestreamstreamer.
            $label = get_string('livestreamstreamer', 'mplayer');
            $elements[] = $mform->addElement('select', 'livestreamstreamer', $label, mplayer_list_streamer());
            $mform->setDefault('livestreamstreamer', '');
            $mform->setAdvanced('livestreamstreamer');

            // Livestreamtags.
            $elements[] = $mform->addElement('text', 'livestreamtags', get_string('livestreamtags', 'mplayer'), $mplayerurlarray);
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

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'logobox', get_string('logobox', 'mplayer'));
            $mform->addHelpButton('logobox', 'mplayer_logobox', 'mplayer');

            // Logoboxalign.
            $elements[] = $mform->addElement('select', 'logoboxalign', get_string('logoboxalign', 'mplayer'), mplayer_list_logoboxalign());
            $mform->setDefault('logoboxalign', 'left');
            $mform->setAdvanced('logoboxalign');

            // Logoboxfile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'logoboxfile', get_string('logoboxfile', 'mplayer'), $options);
            $mform->setAdvanced('logoboxfile');

            // Logoboxlink.
            $elements[] = $mform->addElement('text', 'logoboxlink', get_string('logoboxlink', 'mplayer'), $mplayerurlarray);
            $mform->setType('logoboxlink', PARAM_URL);
            $mform->setAdvanced('logoboxlink');

            // Logoboxmargin.
            $elements[] = $mform->addElement('text', 'logoboxmargin', get_string('logoboxmargin', 'mplayer'), $mplayerintarray);
            $mform->setType('logoboxmargin', PARAM_INT);
            $mform->setDefault('logoboxmargin', '15');
            $mform->setAdvanced('logoboxmargin');

            // Logoboxposition.
            $label = get_string('logoboxposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'logoboxposition', $label, mplayer_list_infoboxposition());
            $mform->setDefault('logoboxposition', 'top');
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
        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'metaviewer', get_string('metaviewer', 'mplayer'));
            $mform->addHelpButton('metaviewer', 'mplayer_metaviewer', 'mplayer');

            // Metaviewerposition.
            $label = get_string('metaviewerposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'metaviewerposition', $label, mplayer_list_metaviewerposition());
            $mform->setDefault('metaviewerposition', 'none');
            $mform->setAdvanced('metaviewerposition');

            // Metaviewersize.
            $elements[] = $mform->addElement('text', 'metaviewersize', get_string('metaviewersize', 'mplayer'), $mplayerintarray);
            $mform->setType('metaviewersize', PARAM_INT);
            $mform->setDefault('metaviewersize', '100');
            $mform->setAdvanced('metaviewersize');
        } else {
            $elements[] = $mform->addElement('hidden', 'metaviewerposition');
            $mform->setType('metaviewerposition', PARAM_TEXT);
            $elements[] = $mform->addElement('hidden', 'metaviewersize');
            $mform->setType('metaviewersize', PARAM_INT);
        }

        // SEARCHBAR.

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'searchbar', get_string('searchbar', 'mplayer'));
            $mform->addHelpButton('searchbar', 'mplayer_searchbar', 'mplayer');
            $mform->setAdvanced('searchbar');

            // Searchbarcolor.
            $elements[] = $mform->addElement('text', 'searchbarcolor', get_string('searchbarcolor', 'mplayer'), $mplayerintarray);
            $mform->setType('searchbarcolor', PARAM_TEXT);
            $mform->setDefault('searchbarcolor', 'CC0000');
            $mform->setAdvanced('searchbarcolor');

            // Searchbarlabel.
            $elements[] = $mform->addElement('text', 'searchbarlabel', get_string('searchbarlabel', 'mplayer'), $mplayerurlarray);
            $mform->setType('searchbarlabel', PARAM_TEXT);
            $mform->setDefault('searchbarlabel', 'Search');
            $mform->setAdvanced('searchbarlabel');

            // Searchbarposition.
            $label = get_string('searchbarposition', 'mplayer');
            $elements[] = $mform->addElement('select', 'searchbarposition', $label, mplayer_list_searchbarposition());
            $mform->setDefault('searchbarposition', '');
            $mform->setAdvanced('searchbarposition');

            // Searchbarscript.
            $label = get_string('searchbarscript', 'mplayer');
            $elements[] = $mform->addElement('select', 'searchbarscript', $label, mplayer_list_searchbarscript());
            $mform->setDefault('searchbarscript', '');
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

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'snapshot', get_string('snapshot', 'mplayer'));
            $mform->addHelpButton('snapshot', 'mplayer_snapshot', 'mplayer');

            // Snapshotbitmap.
            $elements[] = $mform->addElement('select', 'snapshotbitmap', get_string('snapshotbitmap', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('snapshotbitmap', 'true');
            $mform->setAdvanced('snapshotbitmap');

            // Snapshotscript.
            $elements[] = $mform->addElement('select', 'snapshotscript', get_string('snapshotscript', 'mplayer'), mplayer_list_snapshotscript());
            $mform->setDefault('snapshotscript', '');
            $mform->setAdvanced('snapshotscript');
        } else {
            $elements[] = $mform->addElement('hidden', 'snapshotbitmap');
            $mform->setType('snapshotbitmap', PARAM_BOOL);
            $elements[] = $mform->addElement('hidden', 'snapshotscript');
            $mform->setType('snapshotscript', PARAM_TEXT);
        }

        // JW LOGO (licenced players only).

        if ($technology == 'jw') {
            $elements[] = $mform->addElement('header', 'logo', get_string('logo', 'mplayer'));
            // $mform->addHelpButton('logo', 'mplayer_logo', 'mplayer');
            $mform->setAdvanced('logo');

            // Logofile.
            $options = array('courseid' => $COURSE->id);
            $elements[] = $mform->addElement('filepicker', 'logofile', get_string('logofile', 'mplayer'), $options);
            $mform->setAdvanced('logofile');

            // Logolink.
            $elements[] = $mform->addElement('text', 'logolink', get_string('logolink', 'mplayer'), $mplayerurlarray);
            $mform->setType('logolink', PARAM_URL);
            $mform->setAdvanced('logolink');

            // logohide.
            $elements[] = $mform->addElement('select', 'logohide', get_string('logohide', 'mplayer'), mplayer_list_truefalse());
            $mform->setDefault('logohide', 'true');
            $mform->setAdvanced('logohide');

            // Logoposition.
            $elements[] = $mform->addElement('select', 'logoposition', get_string('logoposition', 'mplayer'), mplayer_list_logoposition());
            $mform->setDefault('logoposition', 'bottom-left');
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
