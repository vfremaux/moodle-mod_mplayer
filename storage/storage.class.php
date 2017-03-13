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

/**
 * this class defines an abstract structure for describing a local or remote
 * media storage capable to deliver a media content flow.
 */
abstract class media_storage {

    protected $name;

    public function get_name() {
        return $name;
    }

    /**
     * Return an URL that defines the stream access to a streaming player.
     * @param stored_file a media file or a a media descriptor in which the access
     * URL can be found.
     */
    abstract public function get_access_url(stored_file $storedfile);

    /**
     * Given a stored media file, returns a manifest content that
     * describes stream access and metadata
     * @param stored_file $storedfile
     * @param string $type
     */
    abstract public function get_manifest(stored_file $storedfile, $type);

    /**
     * This function will store a media given as a stored file into a
     * final location. This is possibly a remote location for an external
     * streamer engine to operate on data. If nothing is done, the effective
     * media storage remains in Moodle.
     *
     * @param stored_file $storedfile
     */
    abstract public function store_media(stored_file $storedfile);

    /**
     * Deletes the media reference in effective final storage
     * @param string $medianame
     */
    abstract public function delete_media($medianame);

    /**
     * Returns specific storage settings portion and add it to moodle settings
     * object
     * @param objectref $settings an adminsetting container.
     */
    abstract public function get_settings(&$settings);

}