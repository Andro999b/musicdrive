import { createStore, combineReducers, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'

import filesReducer from './reducers/files'
import screanReducer from './reducers/screan'
import playlistReducer from './reducers/playlist'

export default createStore(combineReducers({
    files: filesReducer,
    screan: screanReducer,
    playlist: playlistReducer
}), applyMiddleware(promiseMiddleware))