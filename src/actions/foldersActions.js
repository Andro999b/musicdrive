import { createAction } from 'redux-actions';
import songName from '../utils/songName';

const fields = 'files(id,kind,mimeType,name,webContentLink,properties),kind';

function makePayload(parent, resp) {
    return {
        folderId: parent,
        files: resp.result.files
            .filter(file => {//filter mp3 files
                const mimeType = file.mimeType;
                return file.mimeType.startsWith("audio") || mimeType.endsWith("folder")
            })
            //add folder flag
            .map(file => Object.assign({}, file, {folder: file.mimeType.endsWith("folder"), name: songName(file)}))
            .sort((f1, f2) => {//sort folder first
                let a = f2.folder + 0;
                let b = f1.folder + 0;
                let diff = a - b;

                if(diff == 0)
                    return f1.name.localeCompare(f2.name);
                
                return diff;
            })
    }
}

function nextFolder(parent = 'root') {
    return function (dispatch) {
        gapi.client.drive.files.list({
            q: `'${parent}' in parents`,
            fields
        }).then(resp => {
            dispatch({
                type: "GO_FOLDER",
                payload: makePayload(parent, resp)
            })
        })
    }
}

function reloadFolder() {
    return function (dispatch, getState) {
        const history = getState().files.history;
        const last = history[history.length - 1];

        gapi.client.drive.files.list({
            q: `'${last.folderId}' in parents`,
            fields
        }).then(resp => {
            dispatch({
                type: "RELOAD",
                payload: makePayload(last.folderId, resp)
            })
        })
    }
}


function deleteFile(fileId) {
    return function (dispatch) {
        gapi.client.drive.files.delete({fileId}).then(() => {
            dispatch(reloadFolder())
        })
    }
}

const goBack = createAction("GO_BACK");

export {nextFolder, goBack, reloadFolder, makePayload, deleteFile}; 