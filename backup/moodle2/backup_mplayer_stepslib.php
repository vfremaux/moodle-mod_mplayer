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
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @licence     http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */
defined('MOODLE_INTERNAL') || die();

class backup_mplayer_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {

        $mplayer = new backup_nested_element('mplayer', array('id'), array(
            'name', 'intro', 'introformat', 'timecreated', 'timemodified', 'technology', 
            'description', 'playerparams', 'mplayerfile', 'external', 'cuelists', 'image', 'mplayerstart',
            'title', 'type', 'notes', 'notesformat', 'completionmediaviewed', 'completionallmediaviewed', 'numpasspoints', 'passrule', 'passpercent',
            'showpasspoints', 'assessmode', 'grade'));

        // Sources.
        $mplayer->set_source_table('mplayer', array('id' => backup::VAR_ACTIVITYID));

        if ($this->get_setting_value('userinfo')) {
            assert(1);
        }

        // Define file annotations.
        $mplayer->annotate_files('mod_mplayer', 'intro', null); // This file areas haven't itemid.
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

        return $this->prepare_activity_structure($mplayer);
    }
}
