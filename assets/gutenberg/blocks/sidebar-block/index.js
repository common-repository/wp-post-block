/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import edit from './edit';
import './style.scss';

const name = 'wp-post-block/sidebar-block';

const settings = {
	title: __( 'Sidebar content', 'wp-post-block' ),
	icon: 'editor-table',
	category: 'wp-post-block',
	description: __( 'Insert content side-by-side with a specific sidebar', 'wp-post-block' ),

	edit,

	save() {
		return <InnerBlocks.Content />;
	},
};

// Register the Block
registerBlockType( name, settings );
