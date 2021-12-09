/**
 * Completion Ajax scripts to track video media progress
 * retrieves a last reached progress bar fullfilled
 */
// jshint unused:false, undef:false

// This API relies on an available global wwwroot var setup before int the page.

var clockdividers = [];

function fire_video_finished(e, api) {

    var mpid = this.id.replace('jwplayer_', '');
    var url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php';
    url += '?mpid=' + mpid + '&clipid=0&what=finished';

    $.get(url, function(data) {
        $('#mplayer-progress-' + mpid + '_0').html(data);
    }, 'html');
}

var jwVideoTracked = [];
var refreshTimeOutHandler = null;
var jws = 0;

/**
 * Registers a player in the completion stack.
 */
function setup_player_completion() {

    jwplayer().on('time', function (e) {

        var mpid = this.id.replace('jwplayer_', '');

        if (isNaN(clockdividers[mpid])) {
            clockdividers[mpid] = 0;
        }
        if ((clockdividers[mpid] % 16) !== 0) {
            clockdividers[mpid]++;
            return;
        }

        var progress = Math.ceil(jwplayer(this.id).getPosition() * 100 / jwplayer(this.id).getDuration());
        var url;

        if (progress >= 99) {
            // Be permissive on final bound.
            url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php';
            url += '?mpid=' + mpid + '&clipid=0&what=finished';
        } else {
            url = M.cfg.wwwroot + '/mod/mplayer/ajax/markmediacompletion.php';
            url += '?mpid=' + mpid + '&clipid=0&what=progress&progress=' + progress;
        }

        $.get(url, function(data) {
            $('#mplayer-progress-' + mpid + '_0').html(data);
            clockdividers[mpid]++;
        }, 'html');
    });
}
