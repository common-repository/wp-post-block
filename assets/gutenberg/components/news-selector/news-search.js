/**
 * Internal dependencies
 */
import NewsList from './news-list';

const { withSelect } = wp.data;
// eslint-disable-next-line
const { createElement } = wp.element;

const storeName = 'wp-post-block/news-search';
const blockType = 'wp-post-block/article-block';

function NewsSearch( props ) {
	const { searchResults } = props;
	let searching = true;
	let posts = [];
	if ( searchResults ) {
		posts = searchResults.results;
		searching = false;
	}
	posts = posts.map( ( post ) => ( { ...post, blockType } ) );
	return ( <NewsList
		posts={ posts }
		currentPage={ props.queryArgs.page }
		onPageChange={ props.onPageChange }
		searchResults={ searchResults }
		searching={ searching }
		clientId={ props.clientId }
	/> );
}

export default withSelect( ( select, ownProps ) => {
	const searchResults = select( storeName ).getResults( ownProps.queryArgs );
	return {
		searchResults,
	};
} )( NewsSearch );
