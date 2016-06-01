<?php
/**
 * Capability definitions for Mplayer Activity Module.
 *
 * For naming conventions, see lib/db/access.php.
 * 
 * If you edit these capabilities, they won't take effect until you upgrade the module version.
 */
$capabilities = array(

    'mod/mplayer:addinstance' => array(
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes' => array(
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW
        )
    ),

    // Ability to see that swf exists, and the basic information about it.
    // For guests+
    'mod/mplayer:view' => array(
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes' => array(
            'guest' => CAP_ALLOW,
            'student' => CAP_ALLOW,
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW
        )
    ),

);

