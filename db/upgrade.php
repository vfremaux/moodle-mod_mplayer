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
 * This file contains a renderer for the assignment class
 *
 * @package     mod_mplayer
 * @category    mod
 * @copyright   Mat Bury (1.9)
 * @author      Valery Fremaux <valery.fremaux@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/locallib.php');

function xmldb_mplayer_upgrade($oldversion = 0) {
    global $DB;

    $result = true;

    $dbman = $DB->get_manager();

    if ($oldversion < 2014081100) {
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('notesformat');
        $field->set_attributes(XMLDB_TYPE_INTEGER, 4, XMLDB_UNSIGNED, XMLDB_NOTNULL, null, 0, 'notes');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2014081100, 'mplayer');
    }

    if ($oldversion < 2014112900) {
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('splashmode');
        $field->set_attributes(XMLDB_TYPE_CHAR, 10, null, null, null, 'is-splash', 'snapshotscript');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2014112900, 'mplayer');
    }

    if ($oldversion < 2014121000) {
        // Add new fields to mplayer table.
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('completionviewed');
        $field->set_attributes(XMLDB_TYPE_INTEGER, 2, XMLDB_UNSIGNED, XMLDB_NOTNULL, null, 0, 'splashmode');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2014121000, 'mplayer');
    }

    if ($oldversion < 2014122700) {
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('external');
        $field->set_attributes(XMLDB_TYPE_TEXT, 'medium', null, null, null, null, 'mplayerfile');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        $field = new xmldb_field('cuelists');
        $field->set_attributes(XMLDB_TYPE_TEXT, 'medium', null, null, null, null, 'external');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2014122700, 'mplayer');
    }

    if ($oldversion < 2015010200) {
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('technology');
        $field->set_attributes(XMLDB_TYPE_TEXT, 'medium', null, null, null, null, 'timemodified');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2015010200, 'mplayer');
    }

    if ($oldversion < 2015010500) {
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('completionviewed', XMLDB_TYPE_INTEGER, 2, XMLDB_UNSIGNED, XMLDB_NOTNULL, null, 0);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->rename_field($field, 'completionmediaviewed');
        }

        upgrade_mod_savepoint(true, 2015010500, 'mplayer');
    }

    if ($oldversion < 2015072000) {

        $table = new xmldb_table('mplayer_userdata');

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('mplayerid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '11', null, XMLDB_NOTNULL, null, null);
        $table->add_field('maxprogress', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('finished', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, null);

        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        $table->add_index('ix_instanceid', XMLDB_INDEX_NOTUNIQUE, array('mplayerid'));

        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        upgrade_mod_savepoint(true, 2015072000, 'mplayer');
    }

    if ($oldversion < 2015110104) {
        mtrace('Converting storage');
        $allplayers = $DB->get_records('mplayer', array());
        if ($allplayers) {
            foreach ($allplayers as $mplayer) {
                mtrace('Converting storage '.$mplayer->id);
                mplayer_upgrade_storage($mplayer);
            }
        } else {
            mtrace('Converting storage : No player instances');
        }

        upgrade_mod_savepoint(true, 2015110104, 'mplayer');
    }

    if ($oldversion < 2015110105) {
        $table = new xmldb_table('mplayer_userdata');

        $field = new xmldb_field('clipid');
        $field->set_attributes(XMLDB_TYPE_INTEGER, 4, null, XMLDB_NOTNULL, null, 0, 'userid');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2015110105, 'mplayer');
    }

    if ($oldversion < 2015110602) {
        $table = new xmldb_table('mplayer');

        $field = new xmldb_field('langselection');
        $field->set_attributes(XMLDB_TYPE_INTEGER, 4, null, XMLDB_NOTNULL, null, 0, 'snapshotscript');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_mod_savepoint(true, 2015110602, 'mplayer');
    }

    return $result;
}
