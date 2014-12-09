<?php
/**
 * @package mod-mplayer
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
 */
require_once($CFG->dirroot . '/mod/mplayer/backup/moodle2/backup_mplayer_stepslib.php');

class backup_mplayer_activity_task extends backup_activity_task {

    protected function define_my_settings() {
    }

    protected function define_my_steps() {
        $this->add_step(new backup_mplayer_activity_structure_step('mplayer_structure', 'mplayer.xml'));
    }

    static public function encode_content_links($content) {
        global $CFG;

        return $content;
        
        $base = preg_quote($CFG->wwwroot . '/mod/mplayer', '#');

        $pattern = "#(" . $base . "\/index.php\?id\=)([0-9]+)#";
        $content = preg_replace($pattern, '$@mplayerINDEX*$2@$', $content);

        $pattern = "#(" . $base . "\/view.php\?id\=)([0-9]+)#";
        $content = preg_replace($pattern, '$@mplayerVIEWBYID*$2@$', $content);

        $pattern = "#(" . $base . "\/report.php\?id\=)([0-9]+)#";
        $content = preg_replace($pattern, '$@mplayerREPORT*$2@$', $content);

        $pattern = "#(" . $base . "\/edit.php\?id\=)([0-9]+)#";
        $content = preg_replace($pattern, '$@mplayerEDIT*$2@$', $content);

        return $content;
    }

}
