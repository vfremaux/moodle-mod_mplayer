<?php 
/**
 * @package mod-mplayer
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
 */
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/mod/mplayer/backup/moodle2/restore_mplayer_stepslib.php');

class restore_mplayer_activity_task extends restore_activity_task {
    
    protected function define_my_settings() {}
    
    protected function define_my_steps() {
        $this->add_step(new restore_mplayer_activity_structure_step('mplayer_structure', 'mplayer.xml'));
    }
    
    static public function define_decode_contents() {
        
        $contents = array();
        $contents[] = new restore_decode_content('mplayer', array('intro'), 'mplayer');
        //$contents[] = new restore_decode_content('mplayer_entries', array('text', 'entrycomment'), 'mplayer_entry');
        
        return $contents;
    }
    
    static public function define_decode_rules() {
        return array();
        $rules = array();
        $rules[] = new restore_decode_rule('mplayerINDEX', '/mod/mplayer/index.php?id=$1', 'course');
        $rules[] = new restore_decode_rule('mplayerVIEWBYID', '/mod/mplayer/view.php?id=$1', 'course_module');
        $rules[] = new restore_decode_rule('mplayerREPORT', '/mod/mplayer/report.php?id=$1', 'course_module');
        $rules[] = new restore_decode_rule('mplayerEDIT', '/mod/mplayer/edit.php?id=$1', 'course_module');

        return $rules;

    }
    static public function define_restore_log_rules() {
        $rules = array();

        return $rules;
    }
}
