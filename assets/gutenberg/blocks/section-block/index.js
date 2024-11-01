/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InnerBlocks } = wp.editor;
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import edit from './edit';

/* Internal dependency */
import './style.scss';

const name = 'wp-post-block/section-block';

const schema = {
	sectionTitle: {
		type: 'string',
		default: '',
	},
};

function renderTitle( title ) {
	return title ? ( <h2>{ title }</h2> ) : '';
}

const settings = {
	title: __( 'Section Block', 'wp-post-block' ),
	icon: 'grid-view',
	category: 'wp-post-block',
	description: __( 'A container for other blocks.', 'wp-post-block' ),
	supports: {
		reusable: false,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: schema,

	edit,

	save( { attributes } ) {
		const { sectionTitle } = attributes;

		return (
			<div className="dip-block-container section-block-container">
				{ renderTitle( sectionTitle ) }
				<InnerBlocks.Content />
			</div>
		);
	},

	deprecated: [
		// Initial version, without the dip-block-container class
		{
			attributes: schema,
			save( { attributes } ) {
				const { sectionTitle } = attributes;

				return (
					<div className="section-block-container">
						{ renderTitle( sectionTitle ) }
						<InnerBlocks.Content />
					</div>
				);
			},
		},
	],
};

// Register the Block
registerBlockType( name, settings );
