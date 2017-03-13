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
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/storage/storage.class.php');

class local_storage extends media_storage {

    public function __construct() {
        $this->name = 'local';
    }

    public function get_access_url(stored_file $storedfile) {

        return moodle_url::make_plugin_url($storedfile->get_contextid(), 'mod_mplayer', 'mplayerfiles', 0,
                                           $storedfile->get_filepath(), $storedfile->get_filename());
    }

    public function get_manifest(stored_file $storedfile, $type) {
        return null;
    }

    /**
     * stores media into remote storage location
     */
    public function store_media(stored_file $storedfile) {
        return null;
    }

    public function delete_media($medianame) {
        return null;
    }

    public function get_settings(&$settings) {
        return false;
    }
}