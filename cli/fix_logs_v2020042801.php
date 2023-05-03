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
 * Recalculates all LTC checks from a given date
 *
 * @package    mod_learningtimecheck
 * @copyright  2020 onwards Valery Fremaux (http://www.activeprolearn.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

global $CLI_VMOODLE_PRECHECK;

define('CLI_SCRIPT', true);
define('CACHE_DISABLE_ALL', true);
$CLI_VMOODLE_PRECHECK = true; // Force first config to be minimal.

require(dirname(dirname(dirname(dirname(__FILE__)))).'/config.php');

if (!isset($CFG->dirroot)) {
    die ('$CFG->dirroot must be explicitely defined in moodle config.php for this script to be used');
}

require_once($CFG->dirroot.'/lib/clilib.php'); // Cli only functions.

$help =
    "Reset all states of learningtime check activities and recalculate.

Options:
   -H, --host                Host to play on.
   -h, --help                Print out this help.

Example:
\$ sudo -u www-data /usr/bin/php mod/mplayer/cli/fix_logs_v2020042801.php
";

list($options, $unrecognized) = cli_get_params(
    array(
        'host' => false,
        'help'    => false,
    ),
    array(
        'h' => 'help',
        'H' => 'host',
    )
);

if ($options['help']) {
    echo $help;
    exit(0);
}

if (!empty($options['host'])) {
    // Arms the vmoodle switching.
    echo('Arming for '.$options['host']."\n"); // Mtrace not yet available.
    define('CLI_VMOODLE_OVERRIDE', $options['host']);
}

// Replay full config whenever. If vmoodle switch is armed, will switch now config.

if (!defined('MOODLE_INTERNAL')) {
    // If we are still in precheck, this means this is NOT a VMoodle install and full setup has already run.
    // Otherwise we only have a tiny config at this location, sso run full config again forcing playing host if required.
    require(dirname(dirname(dirname(dirname(__FILE__)))).'/config.php'); // Global moodle config file.
}
echo('Config check : playing for '.$CFG->wwwroot."\n");

require_once($CFG->libdir.'/mod/mplayer/lib.php');
require_once($CFG->libdir.'/mod/mplayer/db/upgrade.php');

xmldb_mplayer_fix_all_logs();

exit(0);
