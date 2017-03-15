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
$plugin->requires = 2015111100;
$plugin->component = 'mod_mplayer';
$plugin->release = 'Moodle 3.0.0 (Build 2016033101)';
$plugin->maturity = MATURITY_BETA;

// Non Moodle attributes.
$plugin->codeincrement = '3.0.0001';