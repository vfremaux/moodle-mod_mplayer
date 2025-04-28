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
 *
 * @package    mod_mplayer
 * @category   mod
 * @author     Valery Fremaux <valery.fremaux@gmail.com>
 * @copyright  (C) 2008 onwards Valery Fremaux (http://www.mylearningfactory.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL
 *
 */
namespace mod_mplayer;

defined('MOODLE_INTERNAL') || die;

class highlightzones_controller {

    public function receive($cmd, $data = array()) {

        if (!empty($data)) {
            // Data is fed from outside.
            $this->data = (object)$data;
            $this->received = true;
            return;
        } else {
            $this->data = new \StdClass;
        }

        switch ($cmd) {
            case 'delete': {
                $this->data->zoneid = required_param('zoneid', PARAM_INT);
                break;
            }

        }

        $this->received = true;
    }

    public function process($cmd) {
        global $DB;

        if (!$this->received) {
            throw new \coding_exception('Data must be received in controller before operation. this is a programming error.');
        }

        switch ($cmd) {
            case 'delete': {
                $DB->delete_records('mplayer_highlighted_zones', ['id' => $this->data->zoneid]);
                break;
            }

            case 'edit': {
                $zone = $this->data;

                $this->data->startpoint = mplayer_parse_time($this->data->startpoint);
                $this->data->endpoint = mplayer_parse_time($this->data->endpoint);

                if (empty($zone->zoneid)) {
                    // Creating new.
                    unset($zone->id);
                    $zone->id = $DB->insert_record('mplayer_highlighted_zones', $zone);
                } else {
                    $zone->id = $zone->zoneid;
                    $DB->update_record('mplayer_highlighted_zones', $zone);
                }
                return $zone;
            }
        }
    }
}

