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

class http_storage extends media_storage {

    public function __construct() {
        $this->name = 'http';
    }

    /**
     * computes an accessible media URL from the downloaded file
     */
    public function get_access_url(stored_file $storedfile) {

        $config = get_config('mplayer');
        $mediaserver = preg_replace('#//$#', '/', $config->httpmediaserver.'/');
        $mediapath = str_replace('//', '/', $config->httpmediapath.'/');
        $mediapath = preg_replace('#^/#', '', $mediapath);

        return $mediaserver.$mediapath.$storedfile->get_filename();
    }

    public function get_manifest(stored_file $storedfile, $type) {

        $config = get_config('mplayer');

        $mediacontentdir = str_replace('//', '/', $config->httpmediacontentdir.'/');

        $str = '<?xml version="1.0" encoding="UTF-8" ?>';
        $str .= '<video>';
        $str .= '   <source>'.$storedfile->get_filename().'</source>';
        $str .= '   <stream>'.$this->get_access_url($storedfile).'</stream>';
        $str .= '   <storage>http</storage>';
        $str .= '   <location>'.$mediacontentdir.$storedfile->get_filename().'</location>';
        $str .= '   <type>'.$type.'</type>';
        $str .= '</video>';

        return $str;
    }

    /**
     * stores media into remote storage location
     */
    public function store_media(stored_file $storedfile) {

        $config = get_config('mplayer');

        $mediacontentdir = str_replace('//', '/', $config->httpmediacontentdir.'/');

        // Move file to remote storage and discard local.
        $storedfile->copy_content_to($mediacontentdir.$storedfile->get_filename());
    }

    public function delete_media($medianame) {
        $config = get_config('mplayer');
        $mediacontentdir = str_replace('//', '/', $config->httpmediacontentdir.'/');
        unlink($mediacontentdir.$medianame);
    }

    public function get_settings(&$settings) {
        $settings->add(new admin_setting_configtext('mplayer/httpmediaserver', get_string('httpmediaserver', 'mplayer'), '', ''));

        $settings->add(new admin_setting_configtext('mplayer/httpmediapath', get_string('httpmediapath', 'mplayer'), '', ''));

        // Physical path for direct storage of media files.
        $label = get_string('httpmediacontentdir', 'mplayer');
        $settings->add(new admin_setting_configtext('mplayer/httpmediacontentdir', $label, '', ''));
    }
}