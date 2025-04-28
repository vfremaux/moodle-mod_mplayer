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
 * @package    mod_mplayer
 * @category   mod
 * @author     Valery Fremaux <valery.fremaux@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL
 * @copyright  (C) 1999 onwards Martin Dougiamas  http://dougiamas.com
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir.'/formslib.php');

class HighLightZoneForm extends moodleform {

    public function definition() {
        $mform = & $this->_form;

        $mform->addElement('hidden', 'what', 'edit');
        $mform->setType('what', PARAM_ALPHA);

        $mform->addElement('hidden', 'id', ''); // cmid
        $mform->setType('id', PARAM_INT);

        $mform->addElement('hidden', 'mplayerid', ''); // cmid
        $mform->setType('mplayerid', PARAM_INT);

        $mform->addElement('hidden', 'clipid', '');
        $mform->setType('clipid', PARAM_INT);

        $mform->addElement('hidden', 'zoneid', '');
        $mform->setType('zoneid', PARAM_INT);

        $mform->addElement('text', 'name', get_string('name'), array('maxlength' => 255, 'size' => 80));
        $mform->setType('name', PARAM_TEXT);

        $duration = mplayer_format_time($this->_customdata['clip']->duration);
        $mform->addElement('html', get_string('maxcliptime', 'mplayer', $duration));

        $mform->addElement('text', 'startpoint', get_string('startpoint', 'mplayer'), array('size' => 10));
        $mform->setType('startpoint', PARAM_TEXT);

        $mform->addElement('text', 'endpoint', get_string('endpoint', 'mplayer'), array('size' => 10));
        $mform->setType('endpoint', PARAM_TEXT);

        $this->add_action_buttons(false);
    }

    public function validation($data, $files = null) {
        $errors = array();

        if (empty($data['name'])) {
            $errors['name'] = get_string('emptynameerror', 'mplayer');
        }

        if (empty($data['startpoint'])) {
            $errors['startpoint'] = get_string('emptystartpointerror', 'mplayer');
        }

        if (!preg_match('/[0-9]+(\:[0-9]+)?(\:[0-9]+)?/', $data['startpoint'])) {
            $errors['startpoint'] = get_string('badtimeformat', 'mplayer');
        }

        if (empty($data['endpoint'])) {
            $errors['endpoint'] = get_string('emptyendpointerror', 'mplayer');
        }

        if (!preg_match('/[0-9]+(\:[0-9]+)?(\:[0-9]+)?/', $data['endpoint'])) {
            $errors['endpoint'] = get_string('badtimeformat', 'mplayer');
        }

        $parsedstart = mplayer_parse_time($data['startpoint']);
        $parsedend = mplayer_parse_time($data['endpoint']);

        if ($parsedstart > $parsedend) {
            $errors['startpoint'] = get_string('endpointafterstart', 'mplayer');
            $errors['endpoint'] = get_string('endpointafterstart', 'mplayer');
        }

        if ($parsedstart > $this->_customdata['clip']->duration) {
            $errors['startpoint'] = get_string('startpointtoofar', 'mplayer');
        }

        if ($parsedend > $this->_customdata['clip']->duration) {
            $errors['endpoint'] = get_string('endpointtoofar', 'mplayer');
        }

        return $errors;
    }
}
