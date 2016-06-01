/*
 * Completion Ajax scripts to track video media progress
 * retrieves a last reached progress bar fullfilled
 */

function fire_video_finished(e, api) {
    var mpid = this.id.replace('flowplayer_', '');
    var url = wwwroot+'/mod/mplayer/ajax/markmediacompletion.php?mpid='+mpid+'&what=finished';

    $.get(url, function(data,status) {
        $('#mplayer-progress-'+mpid).html(data);
    });
}

/*
 * Send video read progress and gets back html for a 'last reached progress point'
 *
 */

function send_video_progress(e, api, progresstime) {

    if (api.ready) {
            var progress = progresstime * 100 / api.video.duration
            var mpid = this.id.replace('flowplayer_', '');
    
        var url = wwwroot+'/mod/mplayer/ajax/markmediacompletion.php?mpid='+mpid+'&what=progress&progress='+progress;
    
        $.get(url, function(data,status) {
            $('#mplayer-progress-'+mpid).html(data);
        });
    }
}

var videoProgressInterval = new Array();

function setup_player_completion(playerid) {

    var mpid = playerid.replace('flowplayer_', '');
    clip = $('#'+playerid).data('flowplayer');
    clip.bind("progress", send_video_progress);
    clip.bind("finish", fire_video_finished);
}
