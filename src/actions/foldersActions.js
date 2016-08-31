import { createAction } from 'redux-actions';

const fields = 'files(id,kind,mimeType,name,webContentLink),kind';

function makePayload(parent, resp) {
    return {
        parent,
        files: resp.result.files
            .filter(file => {//filter audio files
                const mimeType = file.mimeType;
                return file.name.toLowerCase().endsWith("mp3") || mimeType.endsWith("folder")
            })
            //add folder flag
            .map(file => Object.assign({}, file, {folder: file.mimeType.endsWith("folder")}))
            .sort((f1, f2) => {//sort folder first
                let a = f2.folder + 0;
                let b = f1.folder + 0;
                return a - b;
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
            q: `'${last.parent}' in parents`,
            fields
        }).then(resp => {
            dispatch({
                type: "RELOAD",
                payload: makePayload(last.parent, resp)
            })
        })
    }
}

const goBack = createAction("GO_BACK");

export {nextFolder, goBack, reloadFolder}; 