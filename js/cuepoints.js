
/**
 * the main cuepoint event router
 */
function cuepoint_process(e, api, cue) {

    if (cue.url){

        // stop video
        api.pause();

        /*
        // this may be : 
        // -- surprizing
        // -- not easy to manage closing event.
        window.cuewin = window.open(cue.url, 'cuepoint'+api.conf._mplayerid, "width=820,height=630,resizable,scrollbars=yes,status=1,toolbars=no");
        window.cuewin.onload = function() {
            window.cuewin.onbeforeunload = function() {
                window.cuewin.opener.cuepoint_resume(api, cue);
            }
        };
        */

        // feed cue-in-panel with message and show it progresively
        url = wwwroot+'/mod/mplayer/ajax/get_cue_invite.php?mpid='+api.conf._mplayerid+'&cueurl='+cue.url+'&type='+cue.type+'&mandatory='+cue.mandatory+'&cueout='+cue.cueout;
        $.get(url, function(data,status) {
            $('#fp-cue-in-'+api.conf._mplayerid).html(data);
        });

        // TODO : replace by animate effect
        $('#fp-cue-in-'+api.conf._mplayerid).css('display', 'block');
        $('#fp-cue-in-'+api.conf._mplayerid).css('visibility', 'visible');
    }
}

function cuepoint_resume(api, cueout) {

    $('#fp-cue-in-'+api.conf._mplayerid).css('display', 'none');
    $('#fp-cue-in-'+api.conf.mplayerid).css('visibility', 'hidden');

    if (cueout == 'reset') {
        api.seek(0);
    }

    api.resume();
}

function cuepoint_resume_from_id(playerid) {
    $('#fp-cue-in-'+playerid).css('display', 'none');
    $('#fp-cue-in-'+playerid).css('visibility', 'hidden');

    api.resume();
}

function disabledEventPropagation(event) {
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}