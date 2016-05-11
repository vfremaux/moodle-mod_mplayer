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
 * Provides support for the conversion of moodle1 backup to the moodle2 format
 * Based off of a template @ http://docs.moodle.org/dev/Backup_1.9_conversion_for_developers
 *
 * @package    mod
 * @subpackage mplayer
 * @copyright  2011 Valery Fremaux <valery.fremaux@club-internet.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Tracker conversion handler
 */
class moodle1_mod_mplayer_handler extends moodle1_mod_handler {

    /** @var moodle1_file_manager */
    protected $fileman = null;

    /** @var int cmid */
    protected $moduleid = null;


    /**
     * Declare the paths in moodle.xml we are able to convert
     *
     * The method returns list of {@link convert_path} instances.
     * For each path returned, the corresponding conversion method must be
     * defined.
     *
     * Note that the path /MOODLE_BACKUP/COURSE/MODULES/MOD/MAGTEST does not
     * actually exist in the file. The last element with the module name was
     * appended by the moodle1_converter class.
     *
     * @return array of {@link convert_path} instances
     */
    public function get_paths() {
        return array(
            new convert_path(
                'magtest', '/MOODLE_BACKUP/COURSE/MODULES/MOD/MPLAYER'
            ),
       );
    }

    /**
     * This is executed every time we have one /MOODLE_BACKUP/COURSE/MODULES/MOD/MPLAYER
     * data available
     */
    public function process_mplayer($data) {
        // get the course module id and context id
        $instanceid = $data['id'];
        $cminfo     = $this->get_cminfo($instanceid);
        $moduleid   = $cminfo['id'];
        $contextid  = $this->converter->get_contextid(CONTEXT_MODULE, $moduleid);

        // get a fresh new file manager for this instance
        $this->fileman = $this->converter->get_file_manager($contextid, 'mod_mplayer');

        // convert course files embedded into the intro
        $this->fileman->filearea = 'intro';
        $this->fileman->itemid   = 0;
        $data['intro'] = moodle1_converter::migrate_referenced_files($data['intro'], $this->fileman);

        // convert course files pointed out by fields. 
        // All files are indexed from the moodledata course container root. No implicit use of moddata in this case.

        if (!empty($data['mplayerfile'])) {
            $this->fileman->filearea = 'mplayerfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['mplayerfile']);
        }

        if (!empty($data['configxml'])) {
            $this->fileman->filearea = 'configxml';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['configxml']);
        }

        if (!empty($data['hdfile'])) {
            $this->fileman->filearea = 'hdfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['hdfile']);
        }

        if (!empty($data['image'])) {
            $this->fileman->filearea = 'image';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['image']);
        }

        if (!empty($data['livestreamfile'])) {
            $this->fileman->filearea = 'livestreamfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['livestreamfile']);
        }

        if (!empty($data['livestreamimagefile'])) {
            $this->fileman->filearea = 'livestreamimage';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['livestreamimage']);
        }

        if (!empty($data['audiodescriptionfile'])) {
            $this->fileman->filearea = 'audiodescriptionfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['audiodescriptionfile']);
        }

        if (!empty($data['logoboxfile'])) {
            $this->fileman->filearea = 'logoboxfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['logoboxfile']);
        }

        if (!empty($data['logofile'])) {
            $this->fileman->filearea = 'logofile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['logofile']);
        }

        if (!empty($data['captionsfile'])) {
            $this->fileman->filearea = 'captionsfile';
            $this->fileman->itemid   = 0;
            $this->fileman->migrate_file($data['captionsfile']);
        }

        // write mplayer.xml
        $this->open_xml_writer("activities/mplayer_{$moduleid}/mplayer.xml");
        $this->xmlwriter->begin_tag('activity', array('id' => $instanceid, 'moduleid' => $moduleid,
            'modulename' => 'mplayer', 'contextid' => $contextid));

        $this->xmlwriter->begin_tag('mplayer', array('id' => $instanceid));

        foreach ($data as $field => $value) {
            if ($field <> 'id') {
                $this->xmlwriter->full_tag($field, $value);
            }
        }

        return $data;
    }

}
