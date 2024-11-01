/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * Internal dependencies
 */
import { withChildren } from '../util';

/**
 * WordPress dependencies
 */
// eslint-disable-next-line
const { Component, createElement, Fragment } = wp.element;
const { InnerBlocks } = wp.editor;
const { applyFilters } = wp.hooks;

const { ServerSideRender } = wp.components;

class SidebarBlock extends Component {
	render() {
		const ALLOWED_BLOCKS = [
			'wp-post-block/article-block',
			'wp-post-block/section-block',
			'wp-post-block/multimedia-block',
		];
		const whitelist = applyFilters( 'wp-post-block-sidebar-block-whitelist', ALLOWED_BLOCKS );
		return (
			<Fragment>
				<div className={ classnames( 'dip-block-container sidebar-block-wrapper', {} ) } >
					<div className={ 'sidebar-block-free' }>
						<InnerBlocks template={ [] } allowedBlocks={ whitelist } />
					</div>
					<div className={ 'sidebar-block-ssr' }>
						<ServerSideRender block={ 'wp-post-block/sidebar-block-ssr' } attributes={ {} } />
					</div>
				</div>
			</Fragment>
		);
	}
}

export default withChildren( SidebarBlock );

