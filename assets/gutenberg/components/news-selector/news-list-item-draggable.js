/**
 * External dependencies
 */
import classnames from 'classnames';

const { Draggable } = wp.components;
// eslint-disable-next-line
const { Component, Fragment, createElement } = wp.element;
const { withSelect } = wp.data;
const { decodeEntities } = wp.htmlEntities;
const { Spinner } = wp.components;
const { dateI18n } = wp.date;

class NewsItemDraggable extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			block: { },
		};
	}

	componentDidMount() {
		const { post } = this.props;
		const block = {
			id: post.id,
			key: post.id,
			title: [ post.title.raw ],
			link: post.link,
			imageId: post.featured_media,
			categoryId: post.categories[ 0 ],
			authorId: post.author,
			type: 'block',
		};
		this.setState( { block } );
	}

	render() {
		const { isDragging, post, mediaObject, hasImage, ...props } = this.props;
		const { index, rootUID } = this.props.insertionPoint;
		const { block } = this.state;
		const excerpt = decodeEntities( post.excerpt.rendered );
		const className = classnames( 'components-news-list-item-draggable', {
			'is-visible': isDragging,
		} );
		const transferData = {
			type: 'block',
			fromIndex: index,
			rootUID,
			attributes: block,
		};
		let imageThumbnail = hasImage ? <Spinner /> : null;
		if ( hasImage && mediaObject ) {
			let thumbnail = mediaObject;
			let { width, height } = thumbnail.media_details;
			if ( mediaObject.media_details.sizes.thumbnail ) {
				thumbnail = mediaObject.media_details.sizes.thumbnail;
				width = mediaObject.media_details.sizes.thumbnail.width;
				height = mediaObject.media_details.sizes.thumbnail.height;
			}
			imageThumbnail = (
				<figure className="post-preview">
					<img alt={ excerpt } src={ thumbnail.source_url } height={ height } width={ width } />
				</figure>
			);
		}

		return (
			<Fragment>
				<Draggable className={ className } transferData={ transferData } { ...props }>
					{
						( { onDraggableStart, onDraggableEnd } ) => (
							<div draggable key={ index } className={ className } onDragStart={ onDraggableStart } onDragEnd={ onDraggableEnd } />
						)
					}
				</Draggable>
				<div className="components-news-list-item-wrapper">
					<div className="components-news-list-item-thumbnail">
						{ imageThumbnail }
					</div>
					<div className="components-news-list-item-info">
						<div className="components-news-list-item-pubdate">
							{ dateI18n( 'Y-m-d H:i', post.date ) }
						</div>
						<div className="components-news-list-item-title">
							{ post.title.rendered }
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	const hasImage = ownProps.post.featured_media > 0;
	return {
		hasImage,
		mediaObject: hasImage ? select( 'core' ).getMedia( ownProps.post.featured_media ) : null,
		insertionPoint: select( 'core/editor' ).getBlockInsertionPoint(),
	};
} )( NewsItemDraggable );
