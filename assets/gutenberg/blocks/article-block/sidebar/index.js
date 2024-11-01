/**
 * Internal dependencies
 */
import NewsPanel from '../../../components/news-selector';

const { __ } = wp.i18n;
// eslint-disable-next-line
const { Fragment, Component, createElement } = wp.element;
const { PanelBody, ExternalLink } = wp.components;
const { InspectorControls } = wp.editor;
const { addQueryArgs } = wp.url;
const { registerBlockStyle } = wp.blocks;
const { withSelect } = wp.data;

const name = 'wp-post-block/article-block';
const blockStyles = [
	{ name: 'normal', label: __( 'Normal', 'wp-post-block' ), isDefault: true },
	{ name: 'vertical-image', label: __( 'Vertical image', 'wp-post-block' ) },
	{ name: 'image-highlight', label: __( 'Image highlight', 'wp-post-block' ) },
	{ name: 'text-highlight', label: __( 'Text highlight', 'wp-post-block' ) },
];
blockStyles.forEach( ( blockStyle ) => registerBlockStyle( name, blockStyle ) );

class ArticleShortcutsComponent extends Component {
	render() {
		let getAttachmentUrl;
		if ( this.props.mediaId ) {
			getAttachmentUrl = (
				<div>
					<ExternalLink href={ addQueryArgs( 'upload.php', { item: this.props.mediaId } ) }>
						{ __( 'Edit image', 'wp-post-block' ) }
					</ExternalLink>
				</div>
			);
		}
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Shortcuts', 'wp-post-block' ) }>
						<div>
							<ExternalLink className="" href={ addQueryArgs( 'post.php', { post: this.props.id, action: 'edit' } ) }>
								{ __( 'Edit post', 'wp-post-block' ) }
							</ExternalLink>
						</div>
						{ getAttachmentUrl }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export const ArticleShortcuts = withSelect( ( select, ownProps ) => {
	if ( ownProps.id ) {
		const postObj = select( 'core' ).getEntityRecord( 'postType', 'post', ownProps.id );
		if ( postObj && postObj.featured_media ) {
			return { mediaId: postObj.featured_media };
		}
	}
} )( ArticleShortcutsComponent );

export const ArticleChanger = class ArticleChanger extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Change article', 'wp-post-block' ) }>
						<NewsPanel clientId={ this.props.clientId } />
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
};
