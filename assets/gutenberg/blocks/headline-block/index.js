/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
// eslint-disable-next-line
const { InnerBlocks } = wp.editor;
const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import edit from './edit';
import './style.scss';

const schema = {
	fullscreen: {
		type: 'boolean',
		default: false,
	},
	wrapperClassesFn: {
		default( attributes, articleNumber ) {
			let classes = 'headline-wrapper';

			if ( attributes.fullscreen ) {
				classes += ' headline-full';
			}
			classes += ' blocks-' + Math.min( articleNumber || attributes.blocksNumber, 4 );

			return classes;
		},
	},
	blocksNumber: {
		type: 'number',
		default: 0,
	},
};

const name = 'wp-post-block/headline-block';
const editComponent = edit;

const settings = {
	title: __( 'Headline block', 'wp-post-block' ),
	description: __( 'Block that represents a headline', 'wp-post-block' ),
	icon: 'cover-image',
	category: 'wp-post-block',
	keywords: [ 'headline' ],
	supports: {
		reusable: false,
		html: false,
		align: [ 'full' ],
	},
	attributes: schema,

	edit: editComponent,

	save( { attributes, innerBlocks } ) {
		return (
			<div className={ attributes.wrapperClassesFn( attributes, innerBlocks.length ) }>
				<InnerBlocks.Content />
			</div>
		);
	},
};

// Register the Block
registerBlockType( name, settings );
