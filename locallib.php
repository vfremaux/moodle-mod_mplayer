<?php

function mplayer_save_draft_file(&$mplayer, $filearea) {
    global $USER;
    static $fs;

    $usercontext = get_context_instance(CONTEXT_USER, $USER->id);
    $context = get_context_instance(CONTEXT_MODULE, $mplayer->coursemodule);

    $filepickeritemid = optional_param($filearea, 0, PARAM_INT);

    if (!$filepickeritemid) return;

    if (empty($fs)) {
        $fs = get_file_storage();
    }

    $mplayer->$filearea = 0;
    if (!$fs->is_area_empty($usercontext->id, 'user', 'draft', $filepickeritemid, true)){
        $filearea = preg_replace('/file$/', '', $filearea);
        file_save_draft_area_files($filepickeritemid, $context->id, 'mod_mplayer', $filearea, 0);
        if ($savedfiles = $fs->get_area_files($context->id, 'mod_flashcard', $filearea, 0)) {
            $savedfile = array_pop($savedfiles);
            $mplayer->$filearea = $savedfile->get_id();
        }
    }
}

function mplayer_get_file_url(&$mplayer, $filearea) {
    global $CFG;

    $url = false;

    $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);

    $fs = get_file_storage();

    if (!$fs->is_area_empty($context->id, 'mod_mplayer', $filearea, 0, true)) {
        if ($areafiles = $fs->get_area_files($context->id, 'mod_mplayer', $filearea, 0)) {
            $storedfile = array_pop($areafiles);
            $url = $CFG->wwwroot."/pluginfile.php/{$context->id}/mod_mplayer/{$filearea}/0/".$storedfile->get_filename();
        }
    }
    return $url;
}

function mplayer_get_fileareas() {
    return array('mplayerfile', 'configxml', 'image', 'audiodescriptionfile', 'captionsfile', 'hdfile', 'livestreamfile', 'livestreamimagefile', 'logoboxfile', 'logofile');

}