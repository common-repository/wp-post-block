/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
const { InnerBlocks } = wp.editor;
const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import edit from './edit';
import './style.scss';

const schema = {
	sectionTitle: {
		type: 'string',
		default: __( 'Multimedia', 'wp-post-block' ),
	},
};

const name = 'wp-post-block/multimedia-block';
const editComponent = edit;

function renderTitle( title ) {
	return title ? ( <h2>{ title }</h2> ) : '';
}

const settings = {
	title: __( 'Multimedia block', 'wp-post-block' ),
	description: __( 'Block that represents a multimedia section', 'wp-post-block' ),
	icon: 'format-video',
	category: 'wp-post-block',
	keywords: [ 'multimedia' ],
	supports: {
		align: [ 'full' ],
	},
	attributes: schema,

	edit: editComponent,

	save( { attributes } ) {
		const { sectionTitle } = attributes;

		return (
			<div className="multimedia-block-wrapper">
				{ renderTitle( sectionTitle ) }
				<div className="multimedia-block-inner">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

// Register the Block
registerBlockType( name, settings );
