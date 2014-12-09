<?php 
/**
 * @package mod-mplayer
 * @category mod
 * @author Valery Fremaux (valery.fremaux@gmail.com)
 */
class restore_mplayer_activity_structure_step extends restore_activity_structure_step {

    protected function define_structure() {

        $paths = array();
        $paths[] = new restore_path_element('mplayer', '/activity/mplayer');

        if ($this->get_setting_value('userinfo')) {
        }

        return $this->prepare_activity_structure($paths);
    }
    
    protected function process_mplayer($data) {
        global $DB;

        $data = (object)$data;

        $oldid = $data->id;
        unset($data->id);
        
        $data->course = $this->get_courseid();
        $data->timemodified = $this->apply_date_offset($data->timemodified);

        $newid = $DB->insert_record('mplayer', $data);
        $this->apply_activity_instance($newid);
        $this->set_mapping('mplayer', $oldid, $newid, true);
    }
}
