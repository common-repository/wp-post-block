<?php

namespace WpPostBlock\utils;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since    1.0.0
 */
class Internationalization
{

    /**
     * The domain specified for this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $domain    The domain identifier for this plugin.
     */
    private $domain;

    /**
     * Load the plugin text domain for translation.
     *
     * @since    1.0.0
     */
    public function loadPluginTextDomain()
    {
        load_plugin_textdomain(
            $this->domain,
            false,
            self::getLanguageDir()
        );
    }

    /**
     * Set the domain equal to that of the specified domain.
     *
     * @since    1.0.0
     * @param    string    $domain    The domain that represents the locale of this plugin.
     */
    public function setDomain($domain)
    {
        $this->domain = $domain;
    }

    public static function getLanguageDir($full = false)
    {
        $file = $full ? plugin_dir_path(__FILE__) : dirname(plugin_basename(__FILE__));
        return dirname(dirname($file)) . '/languages/';
    }
}
