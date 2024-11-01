/**
 * Internal dependencies
 */
import { ArticleChanger, ArticleShortcuts } from './sidebar';

/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.editor;

const {
	DropZone,
	PanelBody,
	ToggleControl,
	ServerSideRender,
} = wp.components;

const name = 'wp-post-block/article-block';

class ShowToggler extends Component {
	render() {
		const { option, label, setAttributes } = this.props;
		const { allowedOptions } = this.props.attributes;
		const checked = !! this.props.attributes[ option ];
		const extra = this.props.extra || false;
		const show = allowedOptions.includes( 'all' ) || allowedOptions.includes( option ) || extra;
		if ( show ) {
			return (
				<ToggleControl
					label={ label }
					checked={ checked }
					onChange={ ( value ) => {
						setAttributes( { [ option ]: value } );
					} }
				/>
			);
		}
		return null;
	}
}

const styleImageSizeRelation = {
	'is-style-normal': 'default',
	'is-style-vertical-image': 'vertical',
	'is-style-image-highlight': 'horizontal',
	'is-style-text-highlight': 'horizontal',
};

class ArticleBlockEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onDrop = this.onDrop.bind( this );
	}

	updateID( newId ) {
		this.props.setAttributes( { id: newId } );
	}

	onDrop( event ) {
		/* Validate if data is not empty */
		if ( ! event.dataTransfer ) {
			return;
		}

		let attributes;

		try {
			( { attributes } = JSON.parse( event.dataTransfer.getData( 'text' ) ) );
			this.updateID( attributes.id );
		} catch ( error ) {
		}
	}

	shouldComponentUpdate( nextProps ) {
		const newAttributes = {
			// useImageShadow: ( [ 'is-style-vertical-image', 'is-style-image-highlight' ].indexOf( nextProps.attributes.className ) >= 0 ),
		};

		if ( ! this.props.attributes.className ) {
			newAttributes.className = nextProps.attributes.className || 'is-style-normal';
			newAttributes.imageSize = styleImageSizeRelation[ newAttributes.className ];
		} else if ( this.props.attributes.className !== nextProps.attributes.className ) {
			newAttributes.imageSize = styleImageSizeRelation[ nextProps.attributes.className ];
		}

		this.props.setAttributes( newAttributes );

		return JSON.stringify( nextProps.attributes ) !== JSON.stringify( this.props.attributes );
	}

	render() {
		const { attributes } = this.props;
		const { allowedOptions, ...attrs } = attributes;

		const dropZoneHandler = (
			<DropZone onDrop={ this.onDrop } label={ __( 'Drag an article here', 'wp-post-block' ) } />
		);

		if ( attributes.id ) {
			return (
				<Fragment>
					<InspectorControls>
						{ !! allowedOptions.length &&
						<PanelBody title={ __( 'Article Settings', 'wp-post-block' ) }>
							<ShowToggler option={ 'showRelated' }
								label={ __( 'Show related articles', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'showSection' }
								label={ __( 'Show article section', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'showAuthor' }
								label={ __( 'Show author', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'showAuthorPhoto' } extra={ attrs.showAuthor }
								label={ __( 'Show author photo', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'showLead' }
								label={ __( 'Show lead', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'showStatus' }
								label={ __( 'Show status', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'useImageShadow' }
								label={ __( 'Image shadow', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'useTextShadow' }
								label={ __( 'Text shadow', 'wp-post-block' ) } { ... this.props } />
							<ShowToggler option={ 'useBackgroundColor' }
								label={ __( 'Background color', 'wp-post-block' ) } { ... this.props } />
						</PanelBody> }
					</InspectorControls>
					<ServerSideRender
						block={ name }
						attributes={ attrs }
					/>
					{ dropZoneHandler }
					<ArticleChanger { ... this.props } />
					<ArticleShortcuts id={ attrs.id } { ... this.props } />
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ dropZoneHandler }
				<div className="drag-wrapper dip-article-block">
					{ __( 'Select or drag an article here', 'wp-post-block' ) }
				</div>
				<ArticleChanger { ... this.props } />
			</Fragment>
		);
	}
}

export default ArticleBlockEdit;
