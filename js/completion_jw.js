/**
 * Completion Ajax scripts to track video media progress
 * retrieves a last reached progress bar fullfilled
 */
// jshint unused:false, undef:false

// This API relies on an available global wwwroot var setup before int the page.

function fire_video_finished(e, api) {

    var mpid = this.id.replace('flowplayer_', '');
    var url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php';
    url += 'mpid=' + mpid + '&what=finished';

    $.get(url, function(data, status) {
        $('#mplayer-progress-' + mpid).html(data);
    });
}

/*
 * Send video read progress and gets back html for a 'last reached progress point'
 */
function send_video_progress(jwplayer, mpid) {

        var progress = jwplayer.getPosition() * 100 / jwplayer.getDuration();

        var url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php';
        url += 'mpid=' + mpid + '&what=progress&progress=' + progress;

        $.get(url, function(data, status) {
            $('#mplayer-progress-' + mpid).html(data);
        });
    }
}

var jwVideoTracked = [];
var refreshTimeOutHandler = null;

function setup_player_completion(playerid, mpid) {
    static jws = 0;

    jwVideoTracked[mpid] = player;
    jws++;

    if (jws && !refreshTimeOutHandler) {
        refreshTimeOutHandler = setTimeout('triggerPositionUpdate', 300);
    }
}

function triggerPositionUpdate() {
    for playerid in jwVideoTracked {
        send_video_progress(jwVideoTracked[playerid], playerid);
    }
}