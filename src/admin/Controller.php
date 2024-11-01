<?php

namespace WpPostBlock\admin;

use WpPostBlock\utils\Internationalization;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
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
     * Plugin gutenberg JS asset handler
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $gutenberg_entrypoint    JS register for gutenberg blocks.
     */
    private $gutenberg_entrypoint;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->gutenberg_entrypoint = "${plugin_name}-gutenberg_blocks";
    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueueStyles()
    {

        wp_enqueue_style(
            "{$this->plugin_name}_admin",
            \WpPostBlock\Main::getAssetPath('admin.css'),
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
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueueScripts()
    {

        wp_enqueue_script(
            $this->plugin_name,
            \WpPostBlock\Main::getAssetPath('admin.js'),
            array(),
            $this->version,
            false
        );
    }

    /**
     * Load the Gutenberg blocks available in this plugin
     *
     * @since    1.0.0
     */
    public function loadGutenbergBlocks()
    {

        /* Load the Gutenberg Blocks JS entrypoint */
        wp_register_script(
            $this->gutenberg_entrypoint,
            \WpPostBlock\Main::getAssetPath('gutenberg.js'),
            ['wp-blocks', 'wp-element', 'wp-plugins', 'wp-edit-post',
            'wp-components', 'wp-i18n', 'wp-editor', 'wp-compose'],
            $this->version
        );
        /* Set translations */
        wp_set_script_translations(
            $this->gutenberg_entrypoint,
            $this->plugin_name,
            Internationalization::getLanguageDir(true)
        );

        /* Register all Gutenberg blocks */
        register_block_type("{$this->plugin_name}/article-block", array(
            'editor_script' => $this->gutenberg_entrypoint,
            'attributes' => [
                'classes' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'className' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'displayType' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'id' => [
                    'type' => 'number'
                ],
                'showAuthor' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'showAuthorPhoto' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'showLead' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showRelated' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'showSection' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showStatus' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'showContent' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'useBackgroundColor' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'useImageShadow' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'useTextShadow' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'imageSize' => [
                    'type' => 'string',
                    'default' => ''
                ],
            ],
            'render_callback' => array($this, 'dipRenderArticleBlock'),
        ));
        register_block_type("{$this->plugin_name}/headline-block", array(
            'editor_script' => $this->gutenberg_entrypoint,
        ));
        register_block_type("{$this->plugin_name}/section-block", array(
            'editor_script' => $this->gutenberg_entrypoint,
        ));
        register_block_type("{$this->plugin_name}/grid-item", array(
            'editor_script' => $this->gutenberg_entrypoint,
        ));
        register_block_type("{$this->plugin_name}/multimedia-block", array(
            'editor_script' => $this->gutenberg_entrypoint,
        ));
        register_block_type("{$this->plugin_name}/sidebar-block", array(
            'editor_script' => $this->gutenberg_entrypoint,
            'render_callback' => array($this, 'dipRenderSidebar'),
        ));
        register_block_type("{$this->plugin_name}/sidebar-block-ssr", array(
            'editor_script' => $this->gutenberg_entrypoint,
            'render_callback' => function () {
                ob_start();
                dynamic_sidebar('sidebar-primary');
                return ob_get_clean();
            }
        ));
    }

    public function dipRenderArticleBlock($attributes)
    {
        $content = '';
        if (!empty($attributes['id'])) {
            $post = get_post($attributes['id']);
            if ($post->post_status === 'publish') {
                // Allow themes and plugins change the article attributes before render
                $attributes = apply_filters('dip_gutenberg_article_block_attributes', $attributes, $post);
                // Change the requested JS imageSize to existing thumbnail sizes
                $attributes['imageSize'] = $this->getImageSize($attributes['imageSize'], $attributes);
                // Render the template
                $content = apply_filters('dip_gutenberg_article_block_override', $attributes, $post);
                if (!has_filter('dip_gutenberg_article_block_override')) {
                    ob_start();
                    include plugin_dir_path(dirname(__DIR__)) . 'src/front/partials/article-block.php';
                    $content = ob_get_clean();
                    $content = apply_filters('dip_gutenberg_article_block_output', $content, $attributes, $post);
                }
            }
        }

        return $content;
    }

    public function getImageSize($originalImageSize, $attributes)
    {
        $sizeMap = [
            'multimediaSmall' => 'PostBlockStandard',
            'standard'        => 'PostBlockStandard',
            'headlineSmall'   => 'PostBlockStandard',
            'headlineSquare'  => 'PostBlockHorizontal',
            'horizontal'      => 'PostBlockHorizontal',
            'headline'        => 'HeadlineBlock',
            'vertical'        => 'PostBlockVertical',
            'headlineFull'    => 'full',
            'default'         => 'PostBlockStandard'
        ];

        $key = array_key_exists($originalImageSize, $sizeMap) ? $originalImageSize : 'default';
        $newImageSize = $sizeMap[$key];
        return apply_filters('dip_gutenberg_article_block_image_size', $newImageSize, $originalImageSize, $attributes);
    }

    /**
     * Creates a new Gutenberg Block category to hold the blocks this plugin provides
     *
     * @since    1.0.0
     */
    public function setGutenbergCategory($categories)
    {
        $categories[] = [
            'slug' => 'wp-post-block',
            'title' => __('Digital Media Blocks', 'wp-post-block'),
        ];
        return $categories;
    }

    public function dipRenderSidebar($attributes, $inner_blocks)
    {
        $content = '';
        $attributes['innerBlocks'] = $inner_blocks;
        ob_start();
        include plugin_dir_path(dirname(__DIR__)) . 'src/front/partials/sidebar-block.php';
        $content = ob_get_clean();
        return $content;
    }
}
