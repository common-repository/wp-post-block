<?php

namespace WpPostBlock;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since    1.0.0
 */
class Main
{

    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
     */
    protected $loader;


    /**
     * The unique identifier of this plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this plugin.
     */
    protected $plugin_name;


    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected $version;

    /**
     * The dynamic assets distribution path.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $asset_path    URL the assets dist directory.
     */
    public static $asset_path;

    /**
     * Checks if manifest data exists
     *
     * @since    1.0.0
     * @access   protected
     * @var      bool|array    $manifest    Array containing the parsed manifest.json file or false.
     */
    public static $manifest = false;

    /**
     * Define the core functionality of the plugin.
     *
     * Set the plugin name and the plugin version that can be used throughout the plugin.
     * Load the dependencies, define the locale, and set the hooks for the admin area and
     * the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function __construct($plugin_file)
    {
        $this->plugin_name = 'wp-post-block';
        $this->version = '1.0.0';
        $this->loader = new utils\Loader();

        $this->setAssetPath($plugin_file);
        $this->setLocale();
        $this->defineAdminHooks();
        $this->definePublicHooks();
    }


    /**
     * Define the locale for this plugin for internationalization.
     *
     * Uses the Internationalization class in order to set the domain and to register the hook
     * with WordPress.
     *
     * @since    1.0.0
     * @access   private
     */
    private function setLocale()
    {

        $plugin_i18n = new utils\Internationalization();
        $plugin_i18n->setDomain($this->getPluginName());

        $this->loader->addAction('plugins_loaded', $plugin_i18n, 'loadPluginTextDomain');
    }


    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function defineAdminHooks()
    {

        $plugin_admin = new admin\Controller($this->getPluginName(), $this->getVersion());

        $this->loader->addAction('admin_enqueue_scripts', $plugin_admin, 'enqueueStyles');
        $this->loader->addAction('admin_enqueue_scripts', $plugin_admin, 'enqueueScripts');
        $this->loader->addAction('block_categories', $plugin_admin, 'setGutenbergCategory');
        $this->loader->addAction('init', $plugin_admin, 'loadGutenbergBlocks');
    }


    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function definePublicHooks()
    {

        $plugin_public = new front\Controller($this->getPluginName(), $this->getVersion());

        $this->loader->addAction('wp_enqueue_scripts', $plugin_public, 'enqueueStyles');
        $this->loader->addAction('wp_enqueue_scripts', $plugin_public, 'enqueueScripts');
        $this->loader->addAction('init', $plugin_public, 'addImageSizes');
    }


    /**
     * Run the loader to execute all of the hooks with WordPress.
     *
     * @since    1.0.0
     */
    public function run()
    {
        $this->loader->run();
    }


    /**
     * The name of the plugin used to uniquely identify it within the context of
     * WordPress and to define internationalization functionality.
     *
     * @since    1.0.0
     * @return    string    The name of the plugin.
     */
    public function getPluginName()
    {
        return $this->plugin_name;
    }


    /**
     * The reference to the class that orchestrates the hooks with the plugin.
     *
     * @since    1.0.0
     * @return    Loader    Orchestrates the hooks of the plugin.
     */
    public function getLoader()
    {
        return $this->loader;
    }


    /**
     * Retrieve the version number of the plugin.
     *
     * @since     1.0.0
     * @return    string    The version number of the plugin.
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Retrieve the path to assets by mantifest.json
     *
     * @return  string
     */
    public static function getAssetPath($filename)
    {
        $manifest = self::$manifest;
        $dist_path = self::$asset_path;
        if ($manifest !== false) {
            if (array_key_exists($filename, $manifest)) {
                return "{$dist_path}{$manifest->$filename}";
            }
        }
        return "{$dist_path}{$filename}";
    }

    /**
     * Defines the asset path based on a manifest.json file.
     *
     * When a manifest.json is found, parses its content into memory to be reused later
     *
     * @since    1.0.0
     * @access   private
     */
    private function setAssetPath($plugin_file)
    {
        $dist_path = 'assets/dist';
        $plugin_dir = plugin_dir_path($plugin_file);
        $plugin_url = plugin_dir_url($plugin_file);
        $manifest_file  = "{$plugin_dir}{$dist_path}/manifest.json";
        if (file_exists($manifest_file)) {
            $manifest_data = file_get_contents($manifest_file);
            self::$manifest = json_decode($manifest_data);
        }
        self::$asset_path = "{$plugin_url}/{$dist_path}/";
    }
}
