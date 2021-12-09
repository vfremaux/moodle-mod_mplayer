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

// jshint unused: true, undef:true

define(['jquery', 'core/log', 'core/config'], function($, log, cfg) {

    var modmplayerassessables = {

        ismarking: false,
        currentzone: null,
        startpoint: 0,
        startpointtime: 0,
        endpoint: 0,
        endpointtime: 0,

        init: function() {
            $('.mplayer-bumper').bind('click', this.bump_in);
            $('.mplayer-punchinout').bind('click', this.start_marking);

            log.debug("AMD Mplayer Asessables initialized");
        },

        // When a student starts marking a zone for himself.
        // Start marking
        start_marking: function() {

            var that = $(this);
            var mplayerid = that.attr('id').replace('mplayer-punchinout-', '');

            // Get clip from associated flowplayer.
            var flowp = $('#flp' + mplayerid);
            var flowpclasses = flowp.attr('class');
            var matches = flowpclasses.match(/video([0-9]+)/);
            var clipid = 0 + parseInt(matches[1]);

            // Reveal new zone div and attach to current marking context.
            var mplayerclasses = ' .mod-mplayer-progressbar-outer .progressbar-segment.newzone';
            var newsegment = $('#mplayer-progress-' + mplayerid + '_' + clipid + mplayerclasses);
            var insertleft = 0;
            $(newsegment).removeClass('is-hidden');
            $(newsegment).css('left', insertleft + '%');
            modmplayerassessables.currentzone = newsegment;
            modmplayerassessables.ismarking = true;

            $('#mplayer-punchinout-' + mplayerid).attr('value', "Stop marking zone");
            $('#mplayer-punchinout-' + mplayerid).css('background-color', "red");
            $('#mplayer-punchinout-' + mplayerid).css('color', "white");

            // Rebind event for stop recording.
            $('#mplayer-punchinout-' + mplayerid).off('click');
            $('#mplayer-punchinout-' + mplayerid).bind('click', modmplayerassessables.stop_marking);
            $('#mplayer-punchinout-' + mplayerid).addClass('is-marking');
        },

        // When a student stops marking a zone for himself.
        stop_marking: function() {

            var that = $(this);
            var mplayerid = that.attr('id').replace('mplayer-punchinout-', '');

            // Get clip from associated flowplayer.
            var flowp = $('#flp' + mplayerid);
            var flowpclasses = flowp.attr('class');
            var matches = flowpclasses.match(/video([0-9]+)/);
            var clipid = 0 + parseInt(matches[1]);

            $('#mplayer-punchinout-' + mplayerid).attr('value', "Start marking zone");
            $('#mplayer-punchinout-' + mplayerid).css('background-color', "initial");
            $('#mplayer-punchinout-' + mplayerid).css('color', "black");

            var url = cfg.wwwroot + '/mod/mplayer/pro/ajax/services.php?';
            url += 'what=addzone';
            url += '&mplayerid=' + mplayerid;
            url += '&clipid=' + clipid;
            url += '&startpoint=' + modmplayerassessables.startpoint;
            url += '&endpoint=' + modmplayerassessables.endpoint;
            url += '&startpointtime=' + modmplayerassessables.startpointtime;
            url += '&endpointtime=' + modmplayerassessables.endpointtime;

            // get a new zone id on recoding.
            $.get(url, function() {
            }, 'json');

            var mplayerclasses = ' .mod-mplayer-progressbar-outer .progressbar-segment.newzone';
            var newsegment = $('#mplayer-progress-' + mplayerid + '_' + clipid + mplayerclasses);
            newsegment.addClass('is-hidden');

            modmplayerassessables.ismarking = false;
            modmplayerassessables.startpoint = modmplayerassessables.endpoint;
            $('#mplayer-punchinout-' + mplayerid).off('click');
            $('#mplayer-punchinout-' + mplayerid).bind('click', modmplayerassessables.start_marking);
            $('#mplayer-punchinout-' + mplayerid).removeClass('is-marking');
        },

        // When a student deletes a zone he has marked
        delete_zone: function() {

            var that = $(this);
            var parts = that.attr('data-zone').split('-');
            var mplayerid = parts[0];
            var clipid = parts[1];
            var zoneid = parts[2];

            var url = cfg.wwwroot + '/mod/mplayer/pro/ajax/services.php?';
            url += '&what=deletezone';
            url += '&mplayerid=' + mplayerid;
            url += '&clipid=' + clipid;
            url += '&zoneid=' + zoneid;

            $.get(url, function() {
                // Remove zone marking on screen.
                $('body').remove('#' + that.attr('id'));
            }, 'json');
        },

        // When a student bumps in a zone to discover it.
        bump_in: function() {

            var that = $(this);
            var mplayerid = that.attr('id').replace('mplayer-bumper-', '');

            // Get clip from associated flowplayer.
            var flowp = $('#flp' + mplayerid);
            var flowpclasses = flowp.attr('class');
            var matches = flowpclasses.match(/video([0-9]+)/);
            var clipid = 0 + parseInt(matches[1]);

            var url = cfg.wwwroot + '/mod/mplayer/pro/ajax/services.php?';
            url += 'what=bumpzone';
            url += '&mplayerid=' + mplayerid;
            url += '&clipid=' + clipid;
            url += '&progress=' + modmplayerassessables.startpoint;
            url += '&progresstime=' + modmplayerassessables.startpointtime;

            $.get(url, function(data) {
                if (data.matched == 'true') {
                    $('#mplayer-progress-' + data.mpid + '_' + data.index).html(data.progressbar);
                    $('#mplayer-assess-counts-' + data.mpid + '_' + data.index).html(data.counter);
                }
            }, 'json');
        },
    };

    // globalize for completion scripts.
    window.modmplayerassessables = modmplayerassessables;
    return modmplayerassessables;
});
