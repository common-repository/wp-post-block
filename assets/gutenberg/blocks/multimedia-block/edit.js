/**
 * Internal dependencies
 */
import { withChildren } from '../util';

/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX

const { Component, Fragment } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;
const { __ } = wp.i18n;
const { dispatch } = wp.data;

class MultimediaBlock extends Component {
	constructor( props ) {
		super( props );

		this.getTemplate = this.getTemplate.bind( this );
		this.fixArticlesAttrs = this.fixArticlesAttrs.bind( this );
	}

	// Renders the title if there is one to render
	renderTitle() {
		return this.props.attributes.sectionTitle ? ( <h2>{ this.props.attributes.sectionTitle }</h2> ) : '';
	}

	getTemplate() {
		const itemAttrs = this.getArticleAttrs();
		return [
			[ 'wp-post-block/article-block', this.getArticleAttrs( true ) ],
			...Array( 4 ).fill( [ 'wp-post-block/article-block', itemAttrs ] ),
		];
	}

	getArticleAttrs( isFirst = false ) {
		return {
			allowedOptions: isFirst ? [ 'showSection' ] : [],
			className: isFirst ? 'is-style-text-highlight' : 'is-style-image-highlight',
			displayType: false,
			imageSize: isFirst ? 'horizontal' : 'multimediaSmall',
			useTextShadow: ! isFirst,
			showAuthor: false,
			showContent: true,
			showLead: isFirst,
			showSection: isFirst,
		};
	}

	// Forces the first article to have the class representing the big article
	// and all the other ones to have the class representing the small article.
	// Also forces the attributes to block features and to force certain elements
	fixArticlesAttrs() {
		const articles = this.props.childBlocks;
		articles.forEach( ( article, index ) => {
			// Default nested item attributes
			const itemAttrs = this.getArticleAttrs( index === 0 );

			// check if we need a re-render based on the current item class
			if ( article.attributes.className !== itemAttrs.className ) {
				dispatch( 'core/editor' ).updateBlockAttributes( article.clientId, itemAttrs );
			}
		} );
	}

	render() {
		this.fixArticlesAttrs();
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Block Settings', 'wp-post-block' ) }>
						<TextControl
							label={ __( 'Block title', 'wp-post-block' ) }
							value={ this.props.attributes.sectionTitle || '' }
							onChange={ ( title ) => {
								this.props.setAttributes( { sectionTitle: title } );
							} } />
					</PanelBody>
				</InspectorControls>
				<div className="multimedia-block-wrapper">
					{ this.renderTitle() }
					<InnerBlocks template={ this.getTemplate() } allowedBlocks={ [ 'wp-post-block/article-block' ] } />
				</div>
			</Fragment>
		);
	}
}

export default withChildren( MultimediaBlock );
