// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.

import './css/reset.css';
import './css/fonts.scss';
import './css/base.scss';

// Some ES6+ features require the babel polyfill
// More info here: https://babeljs.io/docs/usage/polyfill/
// Uncomment the following line to enable the polyfill
// require("babel/polyfill");

import React from 'react';
import FluxComponent from 'flummox/component'
import TrackleFlux from './Flux';
import Application from './components/Application';

const flux = new TrackleFlux();
// flux.addListener('dispatch', payload => { console.log('Dispatch: ', payload); });

React.render(
  <FluxComponent
    flux={flux}
    render={() => <Application />} />, document.body);
