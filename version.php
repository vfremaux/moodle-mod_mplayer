<<<<<<< HEAD
<?php
<<<<<<< HEAD
/**
 * Code fragment to define the version of mplayer
 * This fragment is called by moodle_needs_upgrading() and /admin/index.php
 *
 * @author Matt Bury - matbury@gmail.com - http://matbury.com/
 * @version $Id: version.php,v 0.3 2009/11/25 matbury Exp $
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 * @package mplayer
 **/
 
/**    Copyright (C) 2009  Matt Bury
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$plugin->version  = 2014112900;  // The current module version (Date: YYYYMMDDXX)
$plugin->release = "Moodle 2.6.0 (Build 2014081100)";
$plugin->requires = 2012120300;
$plugin->component = 'mod_mplayer';
$plugin->maturity = MATURITY_BETA;
$plugin->cron     = 0;           // Period for cron to check this module (secs)
=======
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
 * Version details.
 *
 * @package    mod_mplayer
 * @category   mod
 * @author     Matt Bury - matbury@gmail.com - http://matbury.com/
 * @copyright  (C) 2009  Matt Bury
 * @copyright  (C) 2015  Valery Fremaux (valery.fremaux@gmail.com)
 * @licence    http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version  = 2016033101;  // The current module version (Date: YYYYMMDDXX).
$plugin->requires = 2016052300;
$plugin->component = 'mod_mplayer';
$plugin->release = 'Moodle 3.2.0 (Build 2016033101)';
$plugin->maturity = MATURITY_BETA;

// Non Moodle attributes.
$plugin->codeincrement = '3.2.0001';
>>>>>>> MOODLE_32_STABLE
=======
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
 * Version details.
 *
 * @package    mod_mplayer
 * @category   mod
 * @author     Matt Bury - matbury@gmail.com - http://matbury.com/
 * @copyright  (C) 2009  Matt Bury
 * @copyright  (C) 2015  Valery Fremaux (valery.fremaux@gmail.com)
 * @licence    http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version  = 2016033101;  // The current module version (Date: YYYYMMDDXX).
$plugin->requires = 2016112900;
$plugin->component = 'mod_mplayer';
$plugin->release = 'Moodle 3.2.0 (Build 2016033101)';
$plugin->maturity = MATURITY_BETA;

// Non Moodle attributes.
$plugin->codeincrement = '3.2.0001';
>>>>>>> MOODLE_32_STABLE
