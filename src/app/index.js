import ReactDOM from 'react-dom';
import React from 'react';

import "core-js/stable";
import "regenerator-runtime/runtime";

import App from 'components/App';
import 'sass/style.scss';

require('file-loader?name=[name].[ext]!../../index.html');
require('file-loader?name=[name]!../../.htaccess');

ReactDOM.render(
  <App />
  , document.getElementById('my-app')
);
