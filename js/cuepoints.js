/**
 * the main cuepoint event router
 */
// jshint unused:false, undef:false

function cuepoint_process(e, api, cue) {

    if (cue.url){

        // Stop video.
        api.pause();

        // Feed cue-in-panel with message and show it progresively.
        url = M.cfg.wwwroot + '/mod/mplayer/ajax/get_cue_invite.php';
        url += 'mpid=' + api.conf._mplayerid + '&cueurl=' + cue.url + '&type=' + cue.type + '&mandatory=' + cue.mandatory;
        url += '&cueout=' + cue.cueout;
        $.get(url, function(data, status) {
            $('#fp-cue-in-' + api.conf._mplayerid).html(data);
        });

        // TODO : replace by animate effect.
        $('#fp-cue-in-' + api.conf._mplayerid).css('display', 'block');
        $('#fp-cue-in-' + api.conf._mplayerid).css('visibility', 'visible');
    }
}

function cuepoint_resume(api, cueout) {

    $('#fp-cue-in-' + api.conf._mplayerid).css('display', 'none');
    $('#fp-cue-in-' + api.conf.mplayerid).css('visibility', 'hidden');

    if (cueout === 'reset') {
        api.seek(0);
    }

    api.resume();
}

function cuepoint_resume_from_id(playerid) {
    $('#fp-cue-in-' + playerid).css('display', 'none');
    $('#fp-cue-in-' + playerid).css('visibility', 'hidden');

    api.resume();
}

function disabledEventPropagation(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true;
    }
}