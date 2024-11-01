<?php

namespace WpPostBlock\front;

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-specific stylesheet and JavaScript.
 *
 * @since    1.0.0
 */
class Controller
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;


    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;


    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }


    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueueStyles()
    {

        wp_enqueue_style(
            $this->plugin_name,
            \WpPostBlock\Main::getAssetPath('public.css'),
            array(),
            $this->version,
            'all'
        );

        wp_enqueue_style(
            "{$this->plugin_name}_gutenberg",
            \WpPostBlock\Main::getAssetPath('gutenberg.css'),
            array(),
            $this->version,
            'all'
        );
    }

    /**
     * Register the scripts for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueueScripts()
    {
        wp_enqueue_script(
            $this->plugin_name,
            \WpPostBlock\Main::getAssetPath('public.js'),
            array(),
            $this->version,
            false
        );
    }

    /**
     * Sets the default image sizes optimized for each block
     *
     * @since    1.0.0
     */
    public function addImageSizes()
    {
        $disable = apply_filters('dip_gutenberg_disable_sizes', false);
        if (!$disable) {
            // Headline block
            add_image_size('HeadlineBlock', 910, 620, true);

            // Post block
            add_image_size('PostBlockHorizontal', 780, 414, true);
            add_image_size('PostBlockStandard', 480, 480, true);
            add_image_size('PostBlockVertical', 480, 654, true);
        }
    }
}
