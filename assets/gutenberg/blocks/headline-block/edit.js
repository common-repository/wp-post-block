/**
 * Internal dependencies
 */
import { withChildren } from '../util';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
// eslint-disable-next-line
const { Component, Fragment } = wp.element;
// eslint-disable-next-line
const { SelectControl, PanelBody, ToggleControl } = wp.components;
// eslint-disable-next-line
const { InspectorControls, InnerBlocks } = wp.editor;
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { dispatch } = wp.data;

class HeadlineBlock extends Component {
	constructor( props ) {
		super( props );

		/* Bind functions to component */
		this.toggleFullScreen = this.toggleFullScreen.bind( this );
		this.getTemplate = this.getTemplate.bind( this );
	}

	/**
   * Set attribute to enable or disable fullscreen on block
   */
	toggleFullScreen() {
		const { attributes, setAttributes } = this.props;
		setAttributes( { fullscreen: ! attributes.fullscreen } );
	}

	/**
   * Return the template structure for inner blocks
   */
	getTemplate() {
		const defaultOptions = [ 'showStatus', 'useImageShadow', 'useTextShadow', 'showLead' ];
		const articleArgs = {
			className: 'is-style-image-highlight',
			imageSize: 'headline',
			allowedOptions: defaultOptions,
			displayType: false,
			useTextShadow: true,
			showStatus: true,
		};

		const articles = this.props.childBlocks;
		const number = articles.length;
		articles.forEach( ( article, i ) => {
			let imageSize = articleArgs.imageSize;
			const blockArgs = { ...articleArgs };
			if ( ( number === 2 && i === 0 ) || ( number >= 4 && i <= 1 ) || ( number === 3 ) ) {
				imageSize = 'headline';
			} else if ( ( number === 2 && i === 1 ) || ( number >= 4 && i > 1 && i <= 3 ) ) {
				imageSize = 'headlineSquare';
			} else if ( i === 0 && this.props.attributes.fullscreen ) {
				imageSize = 'headlineFull';
			}
			blockArgs.imageSize = imageSize;

			// check if we need a re-render based on the current item class
			if ( article.attributes.imageSize !== imageSize ) {
				dispatch( 'core/editor' ).updateBlockAttributes( article.clientId, blockArgs );
			}
		} );
		return Array( 1 ).fill( [ 'wp-post-block/article-block', {} ] );
	}

	/**
   * Returns the whole block structure
   */
	render() {
		const ALLOWED_BLOCKS = [ 'wp-post-block/article-block' ];
		const { attributes, setAttributes } = this.props;
		const templateLock = applyFilters( 'wp-post-block-headline-lock', 'insert' );

		setAttributes( { blocksNumber: this.props.childBlocks.length } );

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Headline Settings', 'wp-post-block' ) }>
						<ToggleControl
							label={ __( 'Full screen', 'wp-post-block' ) }
							checked={ !! attributes.fullscreen }
							onChange={ this.toggleFullScreen }
							help={ __( 'If enabled block will use the whole viewport', 'wp-post-block' ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ classnames( attributes.wrapperClassesFn( attributes, this.props.childBlocks.length ), 'edit-mode' ) }>
					<InnerBlocks templateLock={ templateLock } template={ this.getTemplate() } allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
			</Fragment>
		);
	}
}

export default withChildren( HeadlineBlock );
