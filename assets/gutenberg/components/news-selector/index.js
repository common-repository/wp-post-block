/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import NewsSearch from './news-search';
import { debounce } from 'lodash';

const { __ } = wp.i18n;
const { TextControl, SelectControl } = wp.components;
// eslint-disable-next-line
const { Component, Fragment, createElement } = wp.element;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

const storeName = 'wp-post-block/news-search';
const CATEGORY_LIMIT = 25;
const SEARCH_MIN_CHARS = 3;

class NewsPanel extends Component {
	constructor( props ) {
		super( props );
		this.onCategoryChange = this.onCategoryChange.bind( this );
		this.onTermChange = this.onTermChange.bind( this );
		this.onPageChange = this.onPageChange.bind( this );
		this.triggerSearch = debounce( this.props.setQueryArgs, 1000, { trailing: true } );
		this.state = {
			search: this.props.queryArgs.search,
		};
	}

	onCategoryChange( categories ) {
		this.props.setQueryArgs( { categories, page: 1 } );
	}

	onTermChange( search ) {
		this.setState( { search }, () => {
			if ( search.length === 0 || search.length >= SEARCH_MIN_CHARS ) {
				this.triggerSearch.cancel();
				this.triggerSearch( { search, page: 1 } );
			}
		} );
	}

	onPageChange( page ) {
		this.props.setQueryArgs( { page: page.selected + 1 } );
	}

	render() {
		let categoryList = this.props.categories;
		const { categories } = this.props.queryArgs;
		const { search } = this.state;
		if ( categoryList ) {
			categoryList = categoryList.map( ( category ) => {
				return { value: category.id, label: category.name };
			} );
			categoryList.unshift( { value: '', label: __( 'All categories', 'wp-post-block' ) } );
		}
		const clientId = this.props.clientId || {};
		return (
			<Fragment>
				<TextControl
					placeholder={ __( 'Search posts', 'wp-post-block' ) }
					value={ search }
					onChange={ this.onTermChange }
				/>

				<SelectControl
					label={ __( 'Category', 'wp-post-block' ) }
					options={ categoryList }
					value={ categories }
					onChange={ this.onCategoryChange }
				/>

				<NewsSearch
					queryArgs={ this.props.queryArgs }
					clientId={ clientId }
					onPageChange={ this.onPageChange }
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => {
		// This function here is the action we created before.
		const { setQueryArgs } = dispatch( storeName );

		return {
			setQueryArgs,
		};
	} ),
	withSelect( ( select ) => {
		const { isResolving } = select( 'core' );
		const categories = select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: CATEGORY_LIMIT } );
		return {
			categories,
			isRequesting: isResolving(),
		};
	} ),
	withSelect( ( select ) => {
		return {
			queryArgs: select( storeName ).getQueryArgs(),
		};
	} ),
] )( NewsPanel );
