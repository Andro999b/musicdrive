import { createStore, combineReducers, applyMiddleware } from 'redux'
import trunk from 'redux-thunk'
import {saveState} from './persist'

import filesReducer from './reducers/files'
import screanReducer from './reducers/screan'
import playlistReducer from './reducers/playlist'

const store = createStore(combineReducers({
    files: filesReducer,
    screan: screanReducer,
    playlist: playlistReducer
}), applyMiddleware(trunk))

store.subscribe(() => saveState(store.getState()))

export default store;