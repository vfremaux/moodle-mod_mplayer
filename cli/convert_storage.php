<?php

define('CLI_SCRIPT', true);
global $CLI_VMOODLE_PRECHECK;

$CLI_VMOODLE_PRECHECK = true; // force first config to be minimal
require(dirname(dirname(dirname(dirname(__FILE__)))).'/config.php'); // Global moodle config file.
require_once($CFG->dirroot.'/lib/clilib.php'); // CLI only functions
require($CFG->dirroot.'/mod/mplayer/db/upgrade.php');

// Ensure errors are well explained.
$CFG->debug = E_ALL;

// Now get cli options.
list($options, $unrecognized) = cli_get_params(
    array(
        'verbose'           => false,
        'help'              => false,
        'courseid'          => false,
        'host'              => false,
    ),
    array(
        'h' => 'help',
        'v' => 'verbose',
        'c' => 'courseid',
        'H' => 'host'
    )
);

if ($unrecognized) {
    $unrecognized = implode("\n  ", $unrecognized);
    cli_error(get_string('cliunknowoption', 'admin', $unrecognized));
}

if ($options['help']) {
    $help =
        "Command line MNET Table Consistancy Fixture.
        
        Fixes all surnumerous RPC and Service records, and clean up irrelevnat
        binding records.
        
        Options:
        --verbose           Provides lot of output
        -h, --help          Print out this help
        -c, --courseid      Process course only
        -H, --host          Set the host (physical or virtual) to operate on
    
        "; //TODO: localize - to be translated later when everything is finished

    echo $help;
    die;
}

if (!empty($options['host'])) {
    // Arms the vmoodle switching.
    echo('Arming for '.$options['host']); // mtrace not yet available.
    define('CLI_VMOODLE_OVERRIDE', $options['host']);
}

// Replay full config whenever. If vmoodle switch is armed, will switch now config.
if (!$CLI_VMOODLE_PRECHECK) {
    require(dirname(dirname(dirname(dirname(__FILE__)))).'/config.php'); // Global moodle config file.
    echo('Config check : playing for '.$CFG->wwwroot);
}

$courseid = 0;
if (!empty($options['courseid'])) {
    $courseid = $options['courseid'];
}

mplayer_convert_legacy_storage($courseid, true);