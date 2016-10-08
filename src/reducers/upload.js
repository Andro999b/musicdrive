import { handleActions } from 'redux-actions';
import FileUploader from '../utils/fileUploader';
import store from '../store';

export const STATUS_NORMAL = "normal";
export const STATUS_CAN_DROP = "can-drop";
export const STATUS_WRONG_TYPE = "wrong-type";

function checkFiles (files) {
    if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.kind != "file") {
                return STATUS_WRONG_TYPE;
            } else if(file.type && !file.type.startsWith("audio")){
                return STATUS_WRONG_TYPE;
            }
        }
        return STATUS_CAN_DROP;
    }
    return STATUS_WRONG_TYPE;
}

export {checkFiles};
export default handleActions({
    "ON_DRAG_ENTER": (state, action) => {
        return Object.assign({}, state, {
            status: checkFiles(action.payload.items)
        });
    },
    "ON_DRAG_LEAVE": (state) => {
        return Object.assign({}, state, {
            status: STATUS_NORMAL
        });
    },
    "NEW_UPLOADER": (state, action) => {
        const newState = {};
        newState.uploaders = state.uploaders.concat([action.payload]);
        return  Object.assign({}, state, newState);
    },
    "REMOVE_UPLOADER": (state, action) => {
        const newState = {};
        newState.uploaders = state.uploaders.filter(item => item !== action.payload);
        return  Object.assign({}, state, newState);
    },
}, {status: STATUS_NORMAL, uploaders: []})