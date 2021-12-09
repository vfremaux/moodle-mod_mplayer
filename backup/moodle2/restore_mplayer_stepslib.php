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
 *
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

class restore_mplayer_activity_structure_step extends restore_activity_structure_step {

    protected function define_structure() {

        $paths = array();
        $paths[] = new restore_path_element('mplayer', '/activity/mplayer');

        if ($this->get_setting_value('userinfo')) {
            assert(1);
            // Deal with user scope information.
        }

        return $this->prepare_activity_structure($paths);
    }

    protected function process_mplayer($data) {
        global $DB;

        $data = (object)$data;

        $oldid = $data->id;
        unset($data->id);

        $data->course = $this->get_courseid();
        $data->timemodified = $this->apply_date_offset($data->timemodified);

        $newid = $DB->insert_record('mplayer', $data);
        $this->apply_activity_instance($newid);
        $this->set_mapping('mplayer', $oldid, $newid, true);
    }

    protected function after_execute() {

        // Add mplayer related files, no need to match by itemname (just internally handled context).
        $this->add_related_files('mod_mplayer', 'intro', null);
        $this->add_related_files('mod_mplayer', 'mplayerfiles', null);
        $this->add_related_files('mod_mplayer', 'notes', null);

        // JW.
        $this->add_related_files('mod_mplayer', 'configxml', null);
        $this->add_related_files('mod_mplayer', 'audiodescriptionfile', null);
        $this->add_related_files('mod_mplayer', 'hdfile', null);
        $this->add_related_files('mod_mplayer', 'captionsfile', null);
        $this->add_related_files('mod_mplayer', 'livestreamfile', null);
        $this->add_related_files('mod_mplayer', 'livestreamimagefile', null);
        $this->add_related_files('mod_mplayer', 'logoboxfile', null);
        $this->add_related_files('mod_mplayer', 'logofile', null);
    }
}
