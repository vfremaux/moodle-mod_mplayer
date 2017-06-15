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
 * @package mod_mplayer
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/backup/moodle2/restore_mplayer_stepslib.php');

class restore_mplayer_activity_task extends restore_activity_task {

    protected function define_my_settings() {
        assert(1);
    }

    protected function define_my_steps() {
        $this->add_step(new restore_mplayer_activity_structure_step('mplayer_structure', 'mplayer.xml'));
    }

    static public function define_decode_contents() {

        $contents = array();
        $contents[] = new restore_decode_content('mplayer', array('intro'), 'mplayer');

        return $contents;
    }

    static public function define_decode_rules() {

        $rules = array();
        $rules[] = new restore_decode_rule('MPLAYERINDEX', '/mod/mplayer/index.php?id=$1', 'course');
        $rules[] = new restore_decode_rule('MAPLAYERVIEWBYID', '/mod/mplayer/view.php?id=$1', 'course_module');
        $rules[] = new restore_decode_rule('MPLAYERREPORT', '/mod/mplayer/report.php?id=$1', 'course_module');
        $rules[] = new restore_decode_rule('MPLAYEREDIT', '/mod/mplayer/edit.php?id=$1', 'course_module');

        return $rules;

    }

    static public function define_restore_log_rules() {
        $rules = array();

        return $rules;
    }
}
