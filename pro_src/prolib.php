<?php
// This file is NOT part of Moodle - http://moodle.org/
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
 * @package     mod_mplayer
 * @category    mod
 * @author      Valery Fremaux <valery.fremaux@gmail.com>, Florence Labord <info@expertweb.fr>
 * @copyright   Valery Fremaux <valery.fremaux@gmail.com> (ActiveProLearn.com)
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace mod_mplayer;

use moodle_url;
use admin_setting_heading;
use admin_setting_configcheckbox;
use admin_setting_configtext;
use lang_string;
use cache;

defined('MOODLE_INTERNAL') || die();

final class pro_manager {

    public static $shortcomponent = 'mplayer';
    public static $component = 'mod_mplayer';
    public static $componentpath = 'mod/mplayer';
    public static $componentsettings = 'modsettingmplayer';
    public static $componentproviderrouterurl = 'http://www.mylearningfactory.com/providers/router.php';

    protected function __construct() {
        assert(1);
    }

    /**
     * Singleton implementation. Why it is better than pure static class :
     * Allows manipulation of methods through a single instance that
     * DO NOT mention the class name, so more portable accross plugins.
     * The class name is used just once per script when calling to the singleton.
     */
    public static function instance() {
        static $manager;

        if (is_null($manager)) {
            $manager = new pro_manager();
        }

        return $manager;
    }

    /**
     * When giving a feature, checks the pro license is active and the feature is registered.
     * When used with embty feature, just tests this is a pro equiped package.
     * @param string $feature the feature to check 
     * @return boolean true if pro check is asserted
     */
    public function require_pro($feature = false) {
        $func = self::$shortcomponent.'_supports_feature';
        if (!empty($feature)) {
            if ($func($feature)) {
                return (preg_match('/(SET|CHECK)_OK/', self::set_and_check_license_key()));
            }
        } else {
            return ('pro' == $func());
        }
    }

    /**
     * Adds additional settings to the component settings (generic part of the prolib system).
     * @param objectref &$admin
     * @param objectref &$settings
     */
    public function add_settings(&$admin, &$settings) {
        global $CFG, $PAGE;

        $PAGE->requires->js_call_amd(self::$component.'/pro', 'init');

        $settings->add(new admin_setting_heading('plugindisthdr', get_string('plugindist', self::$shortcomponent), ''));

        $key = self::$shortcomponent.'/emulatecommunity';
        $label = get_string('emulatecommunity', self::$shortcomponent);
        $desc = get_string('emulatecommunity_desc', self::$shortcomponent);
        $settings->add(new admin_setting_configcheckbox($key, $label, $desc, 0));

        $key = self::$shortcomponent.'/licenseprovider';
        $label = get_string('licenseprovider', self::$shortcomponent);
        $desc = get_string('licenseprovider_desc', self::$shortcomponent);
        $settings->add(new admin_setting_configtext($key, $label, $desc, ''));

        $key = self::$shortcomponent.'/licensekey';
        $label = get_string('licensekey', self::$shortcomponent);
        $desc = get_string('licensekey_desc', self::$shortcomponent);
        $settings->add(new admin_setting_configtext($key, $label, $desc, ''));

        $key = self::$shortcomponent.'/getkey';
        // $label = get_string('getlicensekey', self::$shortcomponent);
        $selfregisterurl = new moodle_url('/'.self::$componentpath.'/pro/getoptions.php');
        $desc = new lang_string('getlicensekey_desc', self::$shortcomponent, $selfregisterurl->out());
        $settings->add(new admin_setting_heading($key, false, $desc));

        // These are additional plugin context pro settings.
        if (file_exists($CFG->dirroot.'/'.self::$componentpath.'/pro/localprolib.php')) {
            include_once($CFG->dirroot.'/'.self::$componentpath.'/pro/localprolib.php');

            $key = self::$shortcomponent.'/specificprosettings';
            $label = get_string('specificprosettings', self::$shortcomponent);
            $desc = '';
            $settings->add(new admin_setting_heading($key, $label, $desc));

            local_pro_manager::add_settings($admin, $settings);
        }
    }

    /**
     * Sends an empty license using advice to registered provider.
     */
    public function send_empty_license_signal() {
        global $CFG;

        $config = get_config(self::$component);

        $func = self::$shortcomponent.'_supports_feature';
        if ($func() && empty($config->licensekey)) {
            if ($config->licensekeycheckdate < time() - 30 * DAYSECS) {

                $url = self::$componentproviderrouterurl;
                $url .= '?provider='.$config->licenseprovider.'&service=tell&component='.self::$component;
                $url .= '&host='.urlencode($CFG->wwwroot);

                $res = curl_init($url);
                self::set_proxy($res, $url);
                curl_setopt($res, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($res, CURLOPT_POST, false);

                curl_exec($res);
                set_config('licensekeycheckdate', time(), self::$shortcomponent);
            }
        }
    }

    public function return_url() {
        return new moodle_url('/admin/settings.php?section='.self::$componentsettings, [], 'getsupportlicense');
    }

    public function print_empty_license_message() {
        return get_string('emptysupportlicensemessage', self::$shortcomponent);
    }

    /**
     * checks the support license existance and validity and sends some site stats to the provider.
     * licensing status is cached for 10 days, after what it is checked again.
     * @param string $customerkey defaults to plugin configuration pro part. The customer validation key.
     * @param string $provider defaults to plugin configuration pro part. The license provider identity key.
     * @param string $interactive if true, prints error status to screen and stops immediately if license is NOT verified.
     */
    public function set_and_check_license_key($customerkey = null, $provider = null, $interactive = false) {
        global $CFG, $DB;

        $procache = cache::make(self::$component, 'pro');

        // Ask cache for data.
        $status = $procache->get('licensestatus');
        $checkdate = $procache->get('licensecheckdate');

        if (preg_match('/SET OK/', $status)) {
            if (time() < $checkdate + 10 * DAYSECS) {
                // If last check sooner than 10 days ago, do NOT ask again.
                return $status;
            }
        }

        $config = get_config(self::$shortcomponent);

        if (empty($customerkey)) {
            $customerkey = $config->licensekey;
        }

        if (empty($provider)) {
            $provider = $config->licenseprovider;
        }

        $regusers = $DB->count_records('user', array('deleted' => 0));
        $courses = $DB->count_records('course');
        $coursecats = $DB->count_records('course_categories');

        $url = self::$componentproviderrouterurl;
        $url .= '?provider='.$provider.'&service=check&customerkey='.$customerkey.'&component='.self::$component;
        $url .= '&host='.urlencode($CFG->wwwroot).'&users='.$regusers.'&courses='.$courses.'&coursecats='.$coursecats;

        $res = curl_init($url);
        self::set_proxy($res, $url);
        curl_setopt($res, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($res, CURLOPT_POST, false);
        if (function_exists('debug_trace')) {
            debug_trace($url, TRACE_DEBUG_FINE);
        }
        $result = curl_exec($res);

        // Get result content.
        if (!preg_match('/(SET|CHECK) OK/', $result)) {
            // Invalidate key.
            if (!$interactive) {
                if (function_exists('debug_trace')) {
                    debug_trace($url, TRACE_ERROR);
                }
                set_config('licensekey', $result, self::$shortcomponent);
                die();
            }
        }

        // Cache result for keeping the response valid for a while.
        $procache->set('licensestatus', $result);
        $procache->set('licensecheckdate', time());

        // Give exact service result without change.
        $SESSION->check_mod_learningtimecheck = $result;
        return $result;
    }

    /**
     * Allows a distributor having a distributor valid secret key to generate a support license key and register
     * the plugin instance into the provider shop. On success, settings of the plugin will be updated.
     * @param text $distributorkey The secret key of the distributor (Shop Partner secret key)
     * @param string $provider The provider's routing code.
     * @param string $option The purchase option from the remote provider shop.
     * @param string $error The purchase option from the remote provider shop.
     */
    public function get_license_key($distributorkey, $provider, $option, &$error) {
        global $CFG, $DB;

        if (empty($distributorkey)) {
            $error = get_string('errornodistributorkey', self::$shortcomponent);
            return false;
        }

        if (empty($provider)) {
            $config = get_config(self::$shortcomponent);
            $provider = $config->licenseprovider;
        }

        if (empty($provider)) {
            $error = get_string('errornoprovider', self::$shortcomponent);
            return false;
        }

        $regusers = $DB->count_records('user', array('deleted' => 0));
        $courses = $DB->count_records('course');
        $coursecats = $DB->count_records('course_categories');

        $url = self::$componentproviderrouterurl;
        $url .= '?provider='.$provider;
        $url .= '&service=get';
        $url .= '&customerkey='.$distributorkey;
        $url .= '&component='.self::$component;
        $url .= '&host='.urlencode($CFG->wwwroot);
        $url .= '&users='.$regusers;
        $url .= '&courses='.$courses;
        $url .= '&coursecats='.$coursecats;
        $url .= '&option='.$option;

        $res = curl_init($url);
        self::set_proxy($res, $url);
        curl_setopt($res, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($res, CURLOPT_POST, false);
        if (function_exists('debug_trace')) {
            debug_trace($url, TRACE_DEBUG_FINE);
        }
        $jsonresult = curl_exec($res);

        $result = json_decode($jsonresult);

        if (empty($result)) {
            if (function_exists('debug_trace')) {
                debug_trace($url, TRACE_ERRORS);
            }
            $error = get_string('errorjson', self::$shortcomponent);
            return false;
        }

        if ($result->status == 100) {
            if (function_exists('debug_trace')) {
                debug_trace($url, TRACE_ERRORS);
            }
            $error = get_string('errorresponse', self::$shortcomponent, $result->error);
            return false;
        }

        // Get result content.
        if (!preg_match('/[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/', $result->reference)) {
            $returnurl = new moodle_url('/'.self::$componentpath.'/pro/getkey.php');
            $error = get_string('errornokeygenerated', self::$shortcomponent);
            return false;
        }

        set_config('licensekey', $result->reference, self::$shortcomponent);
        set_config('licenseprovider', $provider, self::$shortcomponent);

        // Give exact service result without change.
        return true;
    }

    /**
     * Get the possible distribution options the distributor can activate for the plugin.
     * @param text $distributorkey
     * @param text $provider
     * @return an array of product descriptions; giving activation options.
     */
    public function get_activation_options($distributorkey, $provider = null) {
        global $CFG, $DB;

        if (empty($provider)) {
            $config = get_config(self::$shortcomponent);
            $provider = $config->licenseprovider;
        }

        if (empty($provider)) {
            print_error(get_string('errornoprovider', self::$shortcomponent));
        }

        $url = self::$componentproviderrouterurl;
        $url .= '?provider='.$provider.'&service=getproducts&customerkey='.$distributorkey.'&component='.self::$component;
        $url .= '&host='.urlencode($CFG->wwwroot);

        $res = curl_init($url);
        self::set_proxy($res, $url);
        curl_setopt($res, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($res, CURLOPT_POST, false);
        if (function_exists('debug_trace')) {
            debug_trace($url, TRACE_DEBUG_FINE);
        }
        $jsonresult = curl_exec($res);

        $result = json_decode($jsonresult);

        if (empty($result)) {
            if (function_exists('debug_trace')) {
                debug_trace($url, TRACE_ERRORS);
            }
            print_error(get_string('errorjson', self::$shortcomponent), $returnurl);
            die;
        }

        if ($result->status == 100) {
            if (function_exists('debug_trace')) {
                debug_trace($url, TRACE_ERRORS);
            }
            print_error(get_string('errorresponse', self::$shortcomponent, $result->error), $returnurl);
            die;
        }

        // Give exact service result without change.
        return $result->choices;
    }

    protected static function set_proxy(&$res, $url) {
        global $CFG;

        // Check for proxy.
        if (!empty($CFG->proxyhost) and !is_proxybypass($url)) {
            // SOCKS supported in PHP5 only
            if (!empty($CFG->proxytype) and ($CFG->proxytype == 'SOCKS5')) {
                if (defined('CURLPROXY_SOCKS5')) {
                    curl_setopt($res, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);
                } else {
                    curl_close($res);
                    print_error( 'socksnotsupported','mnet' );
                }
            }

            curl_setopt($res, CURLOPT_HTTPPROXYTUNNEL, false);

            if (empty($CFG->proxyport)) {
                curl_setopt($res, CURLOPT_PROXY, $CFG->proxyhost);
            } else {
                curl_setopt($res, CURLOPT_PROXY, $CFG->proxyhost.':'.$CFG->proxyport);
            }

            if (!empty($CFG->proxyuser) and !empty($CFG->proxypassword)) {
                curl_setopt($res, CURLOPT_PROXYUSERPWD, $CFG->proxyuser.':'.$CFG->proxypassword);
                if (defined('CURLOPT_PROXYAUTH')) {
                    // any proxy authentication if PHP 5.1
                    curl_setopt($res, CURLOPT_PROXYAUTH, CURLAUTH_BASIC | CURLAUTH_NTLM);
                }
            }
        }
    }
}