<?php
// Determine if we have to apply a shadow to article image
$imageShadowClass = '';
if (!empty($attributes['useImageShadow'])) {
    $imageShadowClass = 'article-block-media-shadow';
}

$postFormat = '';
$postFormat = apply_filters('dip_gutenberg_post_format', $post->ID);
if (!has_filter('dip_gutenberg_post_format')) {
    $postFormat = get_post_format($post->ID);
}
$postFormatIcons = [
    'video' => 'dashicons dashicons-video-alt2',
    'gallery' => 'dashicons dashicons-format-gallery',
];
$postFormatIcons = apply_filters('dip_gutenberg_post_format_icons', $postFormatIcons);
$postFormatMarkup = '';
if (!empty($postFormat) && !empty($postFormatIcons) && in_array($postFormat, array_keys($postFormatIcons))) {
    $postFormatMarkup = '<span class="article-block-post-format ' . $postFormatIcons[$postFormat] . '"></span>';
}

$postStatusMarkup = '';
$postStatus = apply_filters('dip_gutenberg_post_flag', '', $post);
if (!empty($postStatus) && !empty($attributes['showStatus'])) {
    $postStatusMarkup = '<span class="article-block-status">' . $postStatus . '</span>';
}

?>

<a href="<?php echo esc_url($postUrl) ?>" class="article-block-media <?php echo $imageShadowClass; ?>">
    <?php echo get_the_post_thumbnail($post->ID, $attributes['imageSize'], $thumbnail_attrs); ?>
    <?php echo $postFormatMarkup; ?>
    <?php echo $postStatusMarkup; ?>
</a>
