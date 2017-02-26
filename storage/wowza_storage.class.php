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

defined('MOODLE_INTERNAL') || die();

/**
 * @package   mod_mplayer
 * @category  mod
 * @author   Valery Fremaux <valery.fremaux@gmail.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once($CFG->dirroot.'/mod/mplayer/storage/storage.class.php');

class wowza_storage extends media_storage {

    function __construct() {
        $this->name = 'wowza';
    }

    function get_access_url(stored_file $storedfile) {

        $config = get_config('mplayer');

        $url = $config->wowzaserver.'/'.$config->wowzaapplication.'/'.$this->get_stream_type($storedfile->get_filename()).$storedfile->get_filename();

        // Normalize path
        $url = str_replace('//', '/', $url);

        return $url;
    }

    function get_manifest(stored_file $storedfile, $type) {

        $config = get_config('mplayer');

        $str = '<?xml version="1.0" encoding="UTF-8" ?>
<video>
   <source>'.$storedfile->get_filename().'</source>
   <stream>'.$this->get_access_url($storedfile).'</stream>
   <storage>wowza</storage>
   <location>'.$config->wowzacontentdir.$storedfile->get_filename().'</location>
   <type>'.$type.'</type>
</video>
';

        return $str;
    }

    /**
     * stores media into remote storage location
     */
    function store_media(stored_file $storedfile) {

        $config = get_config('mplayer');

        // ensure we have slashed dir location
        $wowzacontentdir = str_replace('//', '/', $config->wowzacontentdir.'/');

        // Move file to remote storage and discard local.
        $storedfile->copy_content_to($wowzacontentdir.$storedfile->get_filename());
    }

    function delete_media($medianame) {

        $config = get_config('mplayer');

        // ensure we have slashed dir location
        $wowzacontentdir = str_replace('//', '/', $config->wowzacontentdir.'/');
        unlink($wowzacontentdir.$medianame);
    }

    function get_settings(&$settings) {
        $settings->add(new admin_setting_configtext('mplayer/wowzaserver', get_string('wowzaserver', 'mplayer'), '', ''));

        $settings->add(new admin_setting_configtext('mplayer/wowzaapplication', get_string('wowzaapplication', 'mplayer'), '', '/vod'));

        $settings->add(new admin_setting_configtext('mplayer/wowzacontentdir', get_string('wowzacontentdir', 'mplayer'), '', ''));
    }


    protected function get_stream_type($medianame) {
        if (preg_match('/\.mp4$/', $medianame)) {
            return 'mp4:';
        }
    }
}