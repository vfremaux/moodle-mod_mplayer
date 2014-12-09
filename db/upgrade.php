<?php  //$Id: upgrade.php,v 1.2 2007/08/08 22:36:54 stronk7 Exp $
// This file keeps track of upgrades to the mplayer module
//
// The commands in here will all be database-neutral, using the functions defined in lib/ddllib.php
function xmldb_mplayer_upgrade($oldversion=0) {
    global $CFG, $THEME, $DB;

    $result = true;
    
    $dbman = $DB->get_manager();

    // ===== 1.9.0 to moodle 2 upgrade line ======//
    if ($oldversion < 2014081100) {
        // Add new fields to certificate table
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('notesformat');
        $field->set_attributes(XMLDB_TYPE_INTEGER, 4, XMLDB_UNSIGNED, XMLDB_NOTNULL, null, 0, 'notes');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Mplayer savepoint reached
        upgrade_mod_savepoint(true, 2014081100, 'mplayer');
    }

    if ($oldversion < 2014112900) {
        // Add new fields to certificate table
        $table = new xmldb_table('mplayer');
        $field = new xmldb_field('splashmode');
        $field->set_attributes(XMLDB_TYPE_CHAR, 10, null, null, null, 'is-splash', 'snapshotscript');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Mplayer savepoint reached
        upgrade_mod_savepoint(true, 2014112900, 'mplayer');
    }

    return $result;
}
