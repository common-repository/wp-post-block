/**
 * External dependencies
 */
import { map } from 'lodash';
import ReactPaginate from 'react-paginate';

/**
 * Internal dependencies
 */
import './style.scss';
import NewsItemDraggable from './news-list-item-draggable';

const { __ } = wp.i18n;
// eslint-disable-next-line
const { Component, Fragment, createElement } = wp.element;
const { dispatch } = wp.data;
const { Dashicon, Spinner } = wp.components;
const { decodeEntities } = wp.htmlEntities;

class NewsList extends Component {
	constructor( props ) {
		super( props );

		this.onClick = this.onClick.bind( this );

		this.state = {
			searching: false,
		};
	}

	componentDidMount() {
		this.setState( {
			searching: true,
		} );
	}

	onClick( postId ) {
		const { clientId } = this.props;

		if ( clientId && postId ) {
			dispatch( 'core/editor' ).updateBlockAttributes( clientId, { id: postId } );
		}
	}

	render() {
		const { posts, searchResults, searching, onPageChange, currentPage } = this.props;
		if ( posts.length ) {
			const { totalPages } = searchResults;
			const postList = map( posts, ( post ) => {
				const postTitle = decodeEntities( post.title.rendered );
				// Fix html entities
				post.title.rendered = postTitle;
				const elementId = `post-item-${ post.id }`;
				return (
					<li title={ postTitle } id={ elementId } className="components-news-list-item" key={ post.id } onClick={ ( e ) => this.onClick( post.id, e ) }>
						<NewsItemDraggable
							post={ post }
							elementId={ elementId }
						/>
					</li>
				);
			} );
			return (
				<Fragment>
					<ul className="components-news-list">
						{ postList }
					</ul>
					<div className="wp-core-ui components-news-paginator">
						<ReactPaginate
							onPageChange={ onPageChange }
							initialPage={ currentPage - 1 }
							pageCount={ totalPages }
							pageRangeDisplayed={ 0 }
							marginPagesDisplayed={ 1 }
							disableInitialCallback={ true }
							pageLinkClassName={ 'button' }
							previousLinkClassName={ 'button' }
							nextLinkClassName={ 'button' }
							activeLinkClassName={ 'active' }
							previousLabel={ <Dashicon icon="arrow-left-alt2" size="10" /> }
							nextLabel={ <Dashicon icon="arrow-right-alt2" size="10" /> }
						/>
					</div>
				</Fragment>
			);
		}
		if ( searching ) {
			return (
				<Fragment>
					<Spinner />
					<div className="components-news-list-empty">
						{ __( 'Loading', 'wp-post-block' ) }
					</div>
				</Fragment>
			);
		}
		return (
			<div className="components-news-list-empty">
				{ __( 'No posts matched the selected criteria', 'wp-post-block' ) }
			</div>
		);
	}
}

export default NewsList;
