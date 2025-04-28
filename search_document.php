<?php
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

/**
 * Global Search Engine for Moodle
 *
 * @package mod_mplayer
 * @category mod
 * @subpackage document_wrappers
 * @author Valery Fremaux [valery.fremaux@gmail.com] > 1.8
 * @date 2008/03/31
 * @license http://www.gnu.org/copyleft/gpl.html GNU Public License
 *
 * document handling for the mplayer page module
 * A video media can be indexed using description and some metadata information.
 */
namespace local_search;

use \StdClass;
use \context_course;
use \context_module;
use \moodle_url;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/local/search/documents/document.php');
require_once($CFG->dirroot.'/local/search/documents/document_wrapper.class.php');
require_once($CFG->dirroot.'/mod/mplayer/lib.php');

define('X_SEARCH_TYPE_MPLAYER', 'mplayer');

/**
 * a class for representing searchable information
 *
 */
class MPLayerSearchDocument extends SearchDocument {

    /**
     * constructor
     */
    public function __construct(&$media, $courseid, $contextid) {
        global $DB;

        $context = $DB->get_record('context', array('id' => $contextid));

        // Generic information; required.
        $doc = new StdClass;
        $doc->docid         = $media['id'];
        $doc->documenttype  = X_SEARCH_TYPE_MPLAYER;
        $doc->itemtype      = 'video';
        $doc->contextid     = $contextid;

        // We cannot call userdate with relevant locale at indexing time.
        $doc->title         = $media['name'];
        $doc->date          = $media['timecreated'];

        // Remove '(ip.ip.ip.ip)' from chat author list.
        $doc->author        = '';
        $doc->contents      = strip_tags($media['intro']);
        $doc->url           = mplayer_document_wrapper::make_link($media['id']);

        // Module specific information; optional.
        $data = new StdClass;
        $data->media      = $media['id'];
        $data->metadata   = strip_tags($media['id']);

        // Construct the parent class.
        parent::__construct($doc, $data, $courseid, 0, 0, 'mod/'.X_SEARCH_TYPE_MPLAYER);
    }
}

class mplayer_document_wrapper extends document_wrapper {

    /**
     * constructs a valid link to a page content
     *
     * @param media_id the mplayer course module
     * @return a well formed link to session display
     */
    public static function make_link($instanceid, $contextid = null) {
        return new moodle_url('/mod/mplayer/view.php', array('id' => $instanceid));
    }

    /**
     * part of search engine API
     *
     */
    public static function get_iterator() {
        global $DB;

        return array(true);
    }

    /**
     * part of search engine API
     *
     */
    public static function get_content_for_index(&$unused) {
        global $DB;

        $mplayers = $DB->get_records('mplayer');

        $documents = array();
        foreach ($mplayers as $mplayer) {

            $course = $DB->get_record('course', array('id' => $mplayer->course));
            $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
            $context = context_module::instance($cm->id);
    
            $mplayer->authors = '';
            $mplayerarr = get_object_vars($mplayer);
            $documents[] = new MPlayerSearchDocument($mplayerarr, $mplayer->course, $context->id);
        }
        return $documents;
    }

    /**
     * returns a single data search document based on a mplayer
     * @param itemtype the type of information (page is the only type)
     */
    public static function single_document($id, $itemtype) {
        global $DB;

        $mplayer = $DB->get_record('mplayer', array('id' => $id));
        $cm = get_coursemodule_from_instance('mplayer', $mplayer->id);
        $course = $DB->get_record('course', array('id' => $mplayer->course));
        $context = context_module::instance($cm->id);

        $mplayer->authors = '';
        $mplayerarr = get_object_vars($page);
        $document = new MPlayerSearchDocument($mplayerarr, $course->id, $context->id);
        return $document;
    }

    /**
     * returns the var names needed to build a sql query for addition/deletions
     * // TODO cms indexable records are virtual. Should proceed in a special way
     */
    public static function db_names() {
        // Template: [primary id], [table name], [time created field name], [time modified field name].
        return array('id', 'mplayer', 'timecreated', 'timemodified', 'video');;
    }

    /**
     * this function handles the access policy to contents indexed as searchable documents. If this
     * function does not exist, the search engine assumes access is allowed.
     * When this point is reached, we already know that :
     * - user is legitimate in the surrounding context
     * - user may be guest and guest access is allowed to the module
     * - the function may perform local checks within the module information logic
     * @param path the access path to the module script code
     * @param itemtype the information subclassing (usefull for complex modules, defaults to 'standard')
     * @param this_id the item id within the information class denoted by entry_type. In cms pages, this navi_data id
     * @param user the user record denoting the user who searches
     * @param group_id the current group used by the user when searching
     * @return true if access is allowed, false elsewhere
     */
    public static function check_text_access($path, $itemtype, $thisid, $user, $groupidunused, $contextidunused) {
        global $CFG, $DB;

        include_once("{$CFG->dirroot}/{$path}/lib.php");

        $course = $DB->get_record('course', array('id' => $mplayer->course));
        $cm = get_coursemodule_from_instance('mplayer', $thisid);
        $coursecontext = context_course::instance($course->id);

        if (!is_enrolled($coursecontext, $user)) {
            return false;
        }

        if ($course->format == 'page') {
            require_once($CFG->dirroot.'/course/format/page/xlib.php');
            return page_module_is_visible($cm, false);
        }

        return true;
    }
}