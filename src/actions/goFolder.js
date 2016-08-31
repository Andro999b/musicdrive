import { createAction } from 'redux-actions';

export default createAction("GO_FOLDER", (parent = 'root') => (
    gapi.client.drive.files.list({
        q: `'${parent}' in parents`,
        fields: 'files(id,kind,mimeType,name,webContentLink),kind'
    }).then(resp => {
        return {
            parent,
            files: resp.result.files
                .filter(file => {//filter audio files
                    const mimeType = file.mimeType;
                    return mimeType.startsWith("audio") || mimeType.endsWith("folder")
                })
                //add folder flag
                .map(file => Object.assign({}, file, {folder: file.mimeType.endsWith("folder")}))
                .sort((f1, f2) => {//sort folder first
                    let a = f2.folder + 0;
                    let b = f1.folder + 0;
                    return a - b;
                })
        }
    })
))
