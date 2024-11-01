/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { createElement } = wp.element; // Needed for JSX
const { Component } = wp.element;
const { withSelect, select } = wp.data;
const { compose, createHigherOrderComponent } = wp.compose;

export function getChildBlocks( clientId ) {
	return select( 'core/editor' ).getBlocks( clientId );
}

/**
 * A Higher Order Component used to provide and manage internal component state
 * via props.
 *
 * @param {?Object} initialState Optional initial state of the component.
 *
 * @return {Component} Wrapped component.
 */
export default function applyChildren( initialState = {} ) {
	return createHigherOrderComponent( ( OriginalComponent ) => {
		return class WrappedComponent extends Component {
			constructor() {
				super( ...arguments );
				this.state = initialState;
				// Update state childBlocks property from the innerBlocks prop
				this.state.childBlocks = getChildBlocks( this.props.clientId );
				this.setState = this.setState.bind( this );
			}

			/**
       * Only call the render method if a change is detected
       * inside the Component child blocks ids (cardinality & order).
       *
       * @param {Object} nextProps Props passed into this Component
       *
       * @return {boolean} Whether the render method should be called or not.
       */
			shouldComponentUpdate( nextProps ) {
				const getIds = ( item ) => {
					return item.clientId;
				};
				const currentIds = this.state.childBlocks.map( getIds );
				const newIds = nextProps.childBlocks.map( getIds );
				if ( JSON.stringify( currentIds ) !== JSON.stringify( newIds ) ) {
					this.setState( { childBlocks: nextProps.childBlocks } );
					return true;
				}
				return JSON.stringify( nextProps.attributes ) !== JSON.stringify( this.props.attributes );
			}

			/**
       * Inject props into the originally called Component
       */
			render() {
				return (
					<OriginalComponent { ...this.props } { ...this.state } />
				);
			}
		};
	}, 'withChildren' );
}

/**
 * Binder function to the withSelect HOC into the WrappedContainer
 */
const applyWithSelect = withSelect(
	( selectFn, { clientId } ) => {
		return {
			childBlocks: getChildBlocks( clientId ),
		};
	}
);

export function withChildren( OriginalComponent ) {
	return compose(
		applyWithSelect,
		applyChildren()
	)( OriginalComponent );
}
