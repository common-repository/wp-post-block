/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
const { __ } = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;

/**
 * Internal dependencies
 */
import edit from './edit';
import './style.scss';

const supports = {
	className: false,
};

const schema = {
	id: {
		type: 'number',
	},
	classes: {
		type: 'string',
		default: '',
	},
	className: {
		type: 'string',
		default: '',
	},
	showRelated: {
		type: 'boolean',
		default: false,
	},
	showSection: {
		type: 'boolean',
		default: true,
	},
	showAuthor: {
		type: 'boolean',
		default: false,
	},
	showAuthorPhoto: {
		type: 'boolean',
		default: false,
	},
	showLead: {
		type: 'boolean',
		default: true,
	},
	showStatus: {
		type: 'boolean',
		default: false,
	},
	showContent: {
		type: 'boolean',
		default: true,
	},
	useImageShadow: {
		type: 'boolean',
		default: false,
	},
	useTextShadow: {
		type: 'boolean',
		default: false,
	},
	useBackgroundColor: {
		type: 'boolean',
		default: false,
	},
	displayType: {
		type: 'boolean',
		default: true,
	},
	allowedOptions: {
		type: 'array',
		default: [ 'all' ],
	},
	imageSize: {
		type: 'string',
		default: '',
	},
};

const name = 'wp-post-block/article-block';

const settings = {
	title: __( 'Post Block', 'wp-post-block' ),
	description: __( 'Post Block description', 'wp-post-block' ),
	icon: 'welcome-write-blog',
	category: 'wp-post-block',
	keywords: [ __( 'text' ) ],
	supports,
	attributes: schema,

	getEditWrapperProps( attributes ) {
		return {
			'data-article-style': attributes.className || 'is-style-normal',
		};
	},

	edit,

	save() {
		return null;
	},
};

// Register the Block
registerBlockType( name, settings );
