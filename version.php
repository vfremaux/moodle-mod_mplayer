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
 * @package     mod_mplayer
 * @category    mod
 * @author      Matt Bury - matbury@gmail.com - http://matbury.com/
 * @author      Valery Fremaux (valery.fremaux@gmail.com) - Moodle 2 refactoring
 * @copyright   (C) 2009  Matt Bury
 * @licence http://www.gnu.org/copyleft/gpl.html GNU Public Licence
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version  = 2016033100;  // The current module version (Date: YYYYMMDDXX).
$plugin->release = 'Moodle 2.8.0 (Build 2015110105)';
$plugin->requires = 2014110400;
$plugin->component = 'mod_mplayer';
$plugin->maturity = MATURITY_BETA;

// Non moodle attributes.
$plugin->codeincrement = '2.8.0000';