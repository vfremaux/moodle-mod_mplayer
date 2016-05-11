<?php
// This file keeps track of upgrades to the mplayer module
//
// The commands in here will all be database-neutral, using the functions defined in lib/ddllib.php
function xmldb_mplayer_upgrade($oldversion=0) {
    global $CFG, $THEME, $DB;

    $result = true;

    // Moodle 2 horizon

    if ($result && $oldversion < 2014100100) { //New version in version.php
        // We need reintegrate files from legacy course to proper fileareas.
        mplayer_convert_legacy_storage();
    }

    return $result;
}

function mplayer_convert_legacy_storage($courseid = 0, $verbose = false) {
    global $DB, $CFG;

    $fs = get_file_storage();

    if ($courseid) {
        if ($verbose) mtrace('converting for course '.$courseid."\n");
        $mplayerinstances = $DB->get_records('mplayer', array('course' => $courseid));
    } else {
        if ($verbose) mtrace('converting all course '."\n");
        $mplayerinstances = $DB->get_records('mplayer');
    }

    if ($verbose) {
        mtrace('converting '.count($mplayerinstances).' instances');
    }

    foreach ($mplayerinstances as $mplayer) {

        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $context = get_context_instance(CONTEXT_MODULE, $cm->id);

        $legacypath = $CFG->dataroot.'/'.$mplayer->course;
        if (is_dir($legacypath)) {

            // convert course files pointed out by fields
            // All files are indexed from the moodledata course container root. No implicit use of moddata in this case.
            if (!empty($mplayer->mplayerfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->mplayerfile;
                if ($verbose) {
                    mtrace('converting source media file '.$sourcefile);
                }

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'mplayerfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->mplayerfile);
                    if ($verbose) {
                        mtrace("Building file ");
                        print_object($filerec);
                    }
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }

            if (!empty($mplayer->configxml)) {
                $sourcefile = $legacypath.'/'.$mplayer->configxml;

                if (file_exists($coursefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'configxml';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->configxml);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->hdfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->hdfile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'hdfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->hdfile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }

            if (!empty($mplayer->image)) {
                $sourcefile = $legacypath.'/'.$mplayer->image;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'image';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->image);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->livestreamfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->livestreamfile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'livestreamfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->livestreamfile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->livestreamimage)) {
                $sourcefile = $legacypath.'/'.$mplayer->livestreamimage;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'livestreamimagefile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->livestreamimage);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->audiodescriptionfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->audiodescriptionfile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'audiodescriptionfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->audiodescriptionfile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->logoboxfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->logoboxfile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'logoboxfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->logoboxfile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->logofile)) {
                $sourcefile = $legacypath.'/'.$mplayer->logofile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'logofile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->logofile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
    
            if (!empty($mplayer->captionsfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->captionsfile;

                if (file_exists($sourcefile)) {
                    $filerec = new StdClass;
                    $filerec->contextid = $context->id;
                    $filerec->component = 'mod_mplayer';
                    $filerec->filearea = 'captionsfile';
                    $filerec->itemid = 0;
                    $filerec->filepath = '/';
                    $filerec->filename = basename($mplayer->captionsfile);
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                }
            }
        } else {
            if ($verbose) {
                mtrace("No legacy path \"$legacypath\" found for course $mplayer->course ");
            }
        }
    }
}
