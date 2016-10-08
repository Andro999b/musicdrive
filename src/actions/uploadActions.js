import { createAction } from 'redux-actions';
import {reloadFolder} from '../actions/foldersActions'
import {checkFiles, STATUS_CAN_DROP} from '../reducers/upload'
import FileUploader from '../utils/fileUploader';

const newUploader = createAction("NEW_UPLOADER",  fileUploader => fileUploader)
const removeUploader = createAction("REMOVE_UPLOADER",  fileUploader => fileUploader)

export const onDragEnter = createAction("ON_DRAG_ENTER", items => ({items}));
export const onDragLeave = createAction("ON_DRAG_LEAVE");
export const onDrop = function(items, files) {
    return function(dispatch, getState){
        if(checkFiles(items) == STATUS_CAN_DROP) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const parent = getState().files.currentFolder;
                const fileUploader = new FileUploader(file, parent);
                
                fileUploader.once("finish", () => {
                    dispatch(removeUploader(fileUploader));
                    dispatch(reloadFolder(fileUploader));
                });

                fileUploader.once("error", e => {
                    dispatch(removeUploader(fileUploader));
                    console.log(e);
                });

                fileUploader.upload();
                dispatch(newUploader(fileUploader))
            }
        }
    }
}