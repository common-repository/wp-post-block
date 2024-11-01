/**
 * Internal dependencies
 */
import './styles/main.scss';

import { WpPostBlockAdmin } from './scripts';

document.addEventListener( 'DOMContentLoaded', () => {
	new WpPostBlockAdmin();
} );
