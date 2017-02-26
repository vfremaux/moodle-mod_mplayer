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

defined('MOODLE_INTERNAL') || die();

/**
 * Global Search Engine for Moodle
 *
 * @package mod_mplayer
 * @category mod
 * @subpackage document_wrappers
 * @author Valery Fremaux [valery.fremaux@club-internet.fr] > 1.8
 * @date 2008/03/31
 * @license http://www.gnu.org/copyleft/gpl.html GNU Public License
 *
 * document handling for the mplayer page module
 * A video media can be indexed using description and some metadata information.
 */

require_once($CFG->dirroot.'/local/search/documents/document.php');
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
    public function __construct(&$media, $course_id, $context_id) {

        // generic information; required
        $doc = new StdClass;
        $doc->docid         = $media->id;
        $doc->documenttype  = SEARCH_TYPE_MPLAYER;
        $doc->itemtype      = 'video';
        $doc->contextid     = $context_id;

        // We cannot call userdate with relevant locale at indexing time.
        $doc->title         = $media['name'];
        $doc->date          = $media['timecreated'];

        // Remove '(ip.ip.ip.ip)' from chat author list.
        $doc->author        = $lastuserid;
        $doc->contents      = strip_tags($media['summary']);
        $doc->url           = local_cms_make_link($page_id);

        // Module specific information; optional.
        $data = new StdClass;
        $data->media      = $media['id'];
        $data->metadata   = strip_tags($media['id']);

        // Construct the parent class.
        parent::__construct($doc, $data, $course_id, 0, 0, 'mod/'.X_SEARCH_TYPE_MPLAYER);
    } 
}

/**
 * constructs a valid link to a page content
 * @param media_id the mplayer course module
 * @uses CFG
 * @return a well formed link to session display
 */
function mplayer_make_link($media_id) {
    return new moodle_url('/mod/mplayer/view.php', array('id' => $media_id));
}

/**
 * part of search engine API
 *
 */
function mplayer_iterator() {
    global $DB;

    return array(true);
}

/**
 * part of search engine API
 *
 */
function mplayer_get_content_for_index(&$unused) {
    global $DB;

    $mplayers = $DB->get_records('mplayer');

    $documents = array();
    foreach($mplayers as $mplayer) {

        $course = $DB->get_record('course', array('id' => $mplayer->course));
        $context = context_module::instance($page->course);

        $user = $DB->get_record('user', array('id' => $page->lastuserid));
        $page->authors = '';
        $mplayerarr = get_object_vars($mplayer);
        $documents[] = new MPlayerSearchDocument($mplayerarr, $page->course, $context->id);
    }
    return $documents;
}

/**
 * returns a single data search document based on a mplayer
 * @param itemtype the type of information (page is the only type)
 */
function mplayer_single_document($id, $itemtype) {
    global $DB;

    $mplayer = $DB->get_record('mplayer', array('id' => $id));
    $course = $DB->get_record('course', array('id' => $mplayer->course));
    $context = context_module::instance($course->id);

    $mplayer->authors = '';
    $mplayerarr = get_object_vars($page);
    $document = new MPlayerSearchDocument($mplayerarr, $course->id, $context->id);
    return $document;
}

/**
 * dummy delete function that packs id with itemtype.
 * this was here for a reason, but I can't remember it at the moment.
 */
function mplayer_delete($info, $itemtype) {
    $object->id = $info;
    $object->itemtype = $itemtype;
    return $object;
}

/**
 * returns the var names needed to build a sql query for addition/deletions
 * // TODO cms indexable records are virtual. Should proceed in a special way 
 */
function mplayer_db_names() {
    //[primary id], [table name], [time created field name], [time modified field name]
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
 * @uses CFG
 * @return true if access is allowed, false elsewhere
 */
function mplayer_check_text_access($path, $itemtype, $this_id, $user, $group_id_unused, $context_id_unused) {
    global $CFG, $DB;

    include_once("{$CFG->dirroot}/{$path}/lib.php");

    $indexcontext = $DB->get_record('context', array('id' => $context_id));
    $cm = get_coursemodule_from_instance('mplayer', $this_id);

    if (!is_enrolled($context, $user)) {
        return false;
    }

    if ($page->publish || has_any_capability(array('local/cms:editpage', 'local/cms:publishpage', 'local/cms:deletepage'), $context)) {
        return false;
    }

    return true;
}

/**
 * this call back is called when displaying the link for some last post processing
 *
 */
function local_cms_post_processing($title) {
    global $CFG;

    return $title;
}
