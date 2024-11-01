/**
 * Internal dependencies
 */
import { withChildren } from '../util';

/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement, Component, Fragment } = wp.element;
const { InspectorControls, InnerBlocks } = wp.editor;
const { PanelBody, TextControl } = wp.components;
const { __ } = wp.i18n;

class SectionBlock extends Component {
	renderTitle() {
		const title = this.props.attributes.sectionTitle || __( 'Section title', 'wp-post-block' );
		return <h2 className="section-title">{ title }</h2>;
	}

	render() {
		const ALLOWED_BLOCKS = [ 'wp-post-block/article-block' ];
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Section Settings', 'wp-post-block' ) } className="blocks-font-size">
						<TextControl
							label={ __( 'Section title', 'wp-post-block' ) }
							help={ __( 'The headline of the section', 'wp-post-block' ) }
							value={ this.props.attributes.sectionTitle || '' }
							onChange={ ( nextValue ) => {
								this.props.setAttributes( {
									sectionTitle: nextValue,
								} );
							} } />
					</PanelBody>
				</InspectorControls>
				<div className="dip-block-container section-block-container">
					{ this.renderTitle() }
					<InnerBlocks template={ [] } allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
			</Fragment>
		);
	}
}

export default withChildren( SectionBlock );
