import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux';

import checkAuth from './checkAuth'
import store from './store'
import {nextFolder} from './actions/foldersActions'

import App from "./app"

checkAuth
    .then(() => {
        render((
            <Provider store={store}>
                <App/>
            </Provider>
        ), document.getElementById('root'))
    })
    .then(() => store.dispatch(nextFolder()))
    .catch((error) => console.log("Fail to boot with error: ", error))
