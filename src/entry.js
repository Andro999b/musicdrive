import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux';

import checkAuth from './checkAuth'
import store from './store'
import restoreApp from './actions/reastoreApp'

import App from "./app"

checkAuth
    .then(() => {
        render((
            <Provider store={store}>
                <App/>
            </Provider>
        ), document.getElementById('root'))
    })
    .then(() => store.dispatch(restoreApp()))
    .catch((error) => console.log("Fail to boot with error: ", error))
