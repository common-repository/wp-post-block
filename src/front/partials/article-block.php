<?php
$wrapperClasses = ['dip-article-block'];
$wrapperClasses[] = "article-{$post->ID}";
$wrapperClasses[] = $attributes['className'];
$wrapperClasses[] = $attributes['classes'];
if (!empty($attributes['useBackgroundColor'])) {
    $wrapperClasses[] = 'dip-article-block-bg';
}
$editContext = isset($_GET['context']) && $_GET['context'] === 'edit';

// Disable all post URLs to optimize UX on edit mode
$postUrl =  '#';
$thumbnail_attrs = [];

// On edit context
if (!$editContext) {
    $postUrl = get_permalink($post->ID);
    // Allow adding custom img attributes
    $thumbnail_attrs = apply_filters('dip_gutenberg_img_attrs', $thumbnail_attrs, $post);
}
?>

<div class="<?php echo implode(' ', $wrapperClasses); ?>">
    <?php include plugin_dir_path(dirname(__DIR__)) . 'front/partials/article-block-media.php'; ?>
    <?php include plugin_dir_path(dirname(__DIR__)) . 'front/partials/article-block-content.php'; ?>
</div>
