import React from 'react';
import {render} from 'react-dom';
import './css/style.css';
import './css/responsive.css';
import './css/bootstrap.css';

import Router from './components/Router';

render(<Router />, document.querySelector('#main'));