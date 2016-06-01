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
        $coursecontext = get_context_instance(CONTEXT_COURSE, $mplayer->course);

        $legacypath = $CFG->dataroot.'/'.$mplayer->course;
        if (is_dir($legacypath)) {

            // convert course files pointed out by fields
            // All files are indexed from the moodledata course container root. No implicit use of moddata in this case.
            if (!empty($mplayer->mplayerfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->mplayerfile;
                if ($verbose) {
                    mtrace('converting source media file '.$sourcefile."\n");
                }

                $basename = basename($mplayer->mplayerfile);
                $pathname = '/'.dirname($mplayer->mplayerfile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                // Target record
                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'mplayerfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    if ($verbose) {
                        mtrace("Creating file from legacy moodledata course storage \n");
                    }
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } else {
                    if ($verbose) {
                        mtrace("Checking converted file as {$coursecontext->id}, 'course', 'legacy', 0, $pathname, $basename for mplayer main file \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Checking converted file as {$coursecontext->id}, 'course', 'legacy', 0, $pathname, $basename for mplayer main file \n");
                    }
                    if ($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                        if ($verbose) {
                            mtrace("Converting file \n");
                        }
                        if (function_exists('debug_trace')) {
                            debug_trace("Converting file ");
                        }
                        $fs->create_file_from_storedfile($filerec, $oldfile);
                    } else {
                        if ($verbose) {
                            mtrace("Missing file $sourcefile for mplayer main file \n");
                        }
                        if (function_exists('debug_trace')) {
                            debug_trace("Missing file $sourcefile for mplayer main file");
                        }
                    }
                }
            }

            if (!empty($mplayer->configxml)) {
                $sourcefile = $legacypath.'/'.$mplayer->configxml;

                $basename = basename($mplayer->configxml);
                $pathname = '/'.dirname($mplayer->configxml).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'configxml';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($coursefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for configxml \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for configxml");
                    }
                }
            }

            if (!empty($mplayer->hdfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->hdfile;

                $basename = basename($mplayer->hdfile);
                $pathname = '/'.dirname($mplayer->hdfile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'hdfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for hdfile \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for hdfile");
                    }
                }
            }

            if (!empty($mplayer->image)) {
                $sourcefile = $legacypath.'/'.$mplayer->image;

                $basename = basename($mplayer->image);
                $pathname = '/'.dirname($mplayer->image).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'image';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for image \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for image ");
                    }
                }
            }

            if (!empty($mplayer->livestreamfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->livestreamfile;

                $basename = basename($mplayer->image);
                $pathname = '/'.dirname($mplayer->image).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'livestreamfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for livestreamfile \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for livestreamfile");
                    }
                }
            }
    
            if (!empty($mplayer->livestreamimage)) {
                $sourcefile = $legacypath.'/'.$mplayer->livestreamimage;

                $basename = basename($mplayer->livestreamimage);
                $pathname = '/'.dirname($mplayer->livestreamimage).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'livestreamimagefile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for livestreamimage \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for livestreamimage");
                    }
                }
            }

            if (!empty($mplayer->audiodescriptionfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->audiodescriptionfile;

                $basename = basename($mplayer->audiodescriptionfile);
                $pathname = '/'.dirname($mplayer->audiodescriptionfile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'audiodescriptionfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for audiodescription \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for audiodescription");
                    }
                }
            }

            if (!empty($mplayer->logoboxfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->logoboxfile;

                $basename = basename($mplayer->logoboxfile);
                $pathname = '/'.dirname($mplayer->logoboxfile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'logoboxfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for logobox \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for logobox");
                    }
                }
            }

            if (!empty($mplayer->logofile)) {
                $sourcefile = $legacypath.'/'.$mplayer->logofile;

                $basename = basename($mplayer->logofile);
                $pathname = '/'.dirname($mplayer->logofile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'logofile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for logo \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for logo ");
                    }
                }
            }

            if (!empty($mplayer->captionsfile)) {
                $sourcefile = $legacypath.'/'.$mplayer->captionsfile;

                $basename = basename($mplayer->captionsfile);
                $pathname = '/'.dirname($mplayer->captionsfile).'/';
                $pathname = preg_replace('#//#', '/', $pathname);

                $filerec = new StdClass;
                $filerec->contextid = $context->id;
                $filerec->component = 'mod_mplayer';
                $filerec->filearea = 'captionsfile';
                $filerec->itemid = 0;
                $filerec->filepath = '/';
                $filerec->filename = $basename;

                if (file_exists($sourcefile)) {
                    $fs->create_file_from_pathname($filerec, $sourcefile);
                } elseif($oldfile = $fs->get_file($coursecontext->id, 'course', 'legacy', 0, $pathname, $basename)) {
                    $fs->create_file_from_storedfile($filerec, $oldfile);
                } else {
                    if ($verbose) {
                        mtrace("Missing file $sourcefile for captions \n");
                    }
                    if (function_exists('debug_trace')) {
                        debug_trace("Missing file $sourcefile for captions ");
                    }
                }
            }
        } else {
            if ($verbose) {
                mtrace("No legacy path \"$legacypath\" found for course $mplayer->course \n");
            }
            if (function_exists('debug_trace')) {
                debug_trace("No legacy path \"$legacypath\" found for course $mplayer->course ");
            }
        }
    }
}
