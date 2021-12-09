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
 * Javascript controller for controlling the sections.
 *
 * @module     mod_mplayer/technologychooser
 * @package    mod_mplayer
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
// jshint unused: true, undef:true
define(['jquery', 'core/config', 'core/log'], function($, config, log) {

    var mplayer = {

        init: function(args) {
            if (args) {
                var updatebut = $('#' + args + ' #id_updatetechnology');
                var technologyselect = $('#' + args + ' #id_technology');
                var ancestor = updatebut.closest('fieldset');
                var action = $('form.mform').attr('action');
                if (updatebut && technologyselect) {
                    updatebut.css('display', 'none');
                    technologyselect.on('change', function() {
                        $('form.mform').attr('action', action + '#' + ancestor.attr('id'));
                        updatebut.trigger('click');
                    });
                }

                log.debug('Mod mplayer AMD initialized');
            }
        }
    };

    return mplayer;

});
