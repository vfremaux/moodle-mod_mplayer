/**
 * Completion Ajax scripts to track video media progress
 * retrieves a last reached progress bar fullfilled
 */
// jshint unused:false, undef:false

var clockdividers = [];

function fire_video_finished(e, api) {

    var index;
    var mpid = api.conf._mplayerid;

    if (api.video.index === undefined) {
        if (api.playlist.queue.idx === undefined) {
            index = 0;
        } else {
            index = api.playlist.queue.idx;
        }
    } else {
        index = api.video.index;
    }
    var url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php?mpid=' + mpid + '&clipid=' + index + '&what=finished';

    $.get(url, function(data) {
        $('#mplayer-progress-' + mpid + '_' + index).html(data);
    });
}

/*
 * Send video read progress and gets back html for a 'last reached progress point'
 *
 */
function send_video_progress(e, api, progresstime) {

    var index;
    var mpid = api.conf._mplayerid;

    if (isNaN(clockdividers[mpid])) {
        clockdividers[mpid] = 0;
    }
    if ((clockdividers[mpid] % 16) !== 0) {
        clockdividers[mpid]++;
        return;
    }

    if (api.video.index === undefined) {
        if (api.playlist.queue.idx === undefined) {
            index = 0;
        } else {
            index = api.playlist.queue.idx;
        }
    } else {
        index = api.video.index;
    }

    if (api.ready) {
        var progress = progresstime * 100 / api.video.duration;
        var url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php?';
        url += 'mpid=' + mpid + '&clipid=' + index + '&what=progress&progress=' + progress;

        $.get(url, function(data,status) {
            $('#mplayer-progress-' + mpid + '_' + index).html(data);
        });

        // If there is an assessable extension, push value to it
        if (modmplayerassessables !== undefined) {
            if (modmplayerassessables.ismarking) {
                // Push only segment end further.
                modmplayerassessables.endpoint = progress;
                modmplayerassessables.endpointtime = progresstime;
                modmplayerassessables.currentzone.css('width', progress - modmplayerassessables.startpoint);
            } else {
                // Push both segment ends further.
                modmplayerassessables.startpoint = progress;
                modmplayerassessables.startpointtime = progresstime;
                modmplayerassessables.endpoint = progress;
                modmplayerassessables.endpointtime = progresstime;
            }
        }
    }

    clockdividers[mpid]++;
}

function setup_video_progress(e, api) {
    var mpid = api.conf._mplayerid;
    clockdividers[mpid] = 0;
}

function setup_video_start(e, api) {
    api.loadSubtitles(0);
}