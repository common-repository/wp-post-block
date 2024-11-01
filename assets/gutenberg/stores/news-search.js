/**
 * External dependencies
 */
import { parseInt } from 'lodash';

const { apiFetch } = wp;
const { registerStore } = wp.data;
const { addQueryArgs } = wp.url;

const hashArgs = ( data ) => {
	return JSON.stringify( data );
};

const DEFAULT_STATE = {
	queryArgs: {
		categories: '',
		search: '',
		order: 'desc',
		orderby: 'date',
		page: 1,
		per_page: 8,
	},
	searchResults: [],
};

/**
 * Set of functions that trigger a state change
 */
const actions = {
	setQueryArgs( queryArgs ) {
		return {
			type: 'SET_QUERY_ARGS',
			queryArgs,
		};
	},
	updateResults( results, key ) {
		return {
			type: 'UPDATE_RESULTS',
			results,
			key,
		};
	},
	fetchFromAPI( path, args ) {
		return {
			type: 'FETCH_FROM_API',
			path,
			args,
		};
	},
	fetchResponseBody( response ) {
		return {
			type: 'FETCH_RESPONSE_BODY',
			response,
		};
	},
};

registerStore( 'wp-post-block/news-search', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'UPDATE_RESULTS':
				return {
					...state,
					searchResults: {
						...state.searchResults,
						[ action.key ]: action.results,
					},
				};
			case 'SET_QUERY_ARGS':
				return {
					...state,
					queryArgs: {
						...state.queryArgs,
						...action.queryArgs,
					},
				};
		}

		return state;
	},

	actions,

	selectors: {
		getResults( state, args ) {
			const key = hashArgs( args );
			return state.searchResults[ key ];
		},
		getQueryArgs( state ) {
			return state.queryArgs;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: addQueryArgs( action.path, action.args ), parse: false } );
		},
		FETCH_RESPONSE_BODY( action ) {
			return action.response;
		},
	},

	resolvers: {
		* getResults( args ) {
			const response = yield actions.fetchFromAPI( '/wp/v2/posts/', args );
			const results = yield actions.fetchResponseBody( response.json() );
			const totalPages = parseInt( response.headers && response.headers.get( 'X-WP-TotalPages' ) );
			const totalResults = parseInt( response.headers && response.headers.get( 'X-WP-Total' ) );
			const searchResults = {
				results,
				totalPages,
				totalResults,
			};
			const key = hashArgs( args );
			return actions.updateResults( searchResults, key );
		},
	},
} );
