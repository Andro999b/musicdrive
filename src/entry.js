import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux';

import checkAuth from './checkAuth'
import store from './store'
import goFolder from './actions/goFolder'

import App from "./app"

checkAuth
    .then(() => {
        render((
            <Provider store={store}>
                <App/>
            </Provider>
        ), document.getElementById('root'))
    })
    .then(() => store.dispatch(goFolder()))
