<?php
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

$module = new StdClass;
$module->version  = 2014100100;  // The current module version (Date: YYYYMMDDXX)
$module->release = '2.2.0 (Build 20140801)';
$module->requires = 2011120511;
$module->component = 'mod_mplayer';
$module->cron     = 0;           // Period for cron to check this module (secs)
