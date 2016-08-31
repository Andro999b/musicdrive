import { createStore, combineReducers, applyMiddleware } from 'redux'
import trunk from 'redux-thunk'

import filesReducer from './reducers/files'
import screanReducer from './reducers/screan'
import playlistReducer from './reducers/playlist'

export default createStore(combineReducers({
    files: filesReducer,
    screan: screanReducer,
    playlist: playlistReducer
}), applyMiddleware(trunk))