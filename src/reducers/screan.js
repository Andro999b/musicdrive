import { handleActions } from 'redux-actions';

export default handleActions({
    "CHANGE_SCREAN": (state, action) => ({current: action.payload.screan})
}, {current: "files"})