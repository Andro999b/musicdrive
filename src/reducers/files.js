import { handleActions } from 'redux-actions';

export default handleActions({
    "RELOAD": (state, action) => {
        state.history.pop();
        return Object.assign({}, {
            history: state.history.concat(action.payload),
            currentFolder: action.payload.folderId,
            currentFiles: action.payload.files
        })
    },
    "GO_FOLDER": (state, action) => {
        return Object.assign({}, {
            history: state.history.concat(action.payload),
            currentFolder: action.payload.folderId,
            currentFiles: action.payload.files
        })
    },
    "GO_BACK": (state) => {
        //check if have any history
        const h = state.history;
        if(h.length == 0) return state;

        //pop previous history
        const prevHistory = h.slice(0, h.length- 1);
        let files = []
        let folderId;
        if(prevHistory.length > 0){//check if have any history now
            let prev = prevHistory[prevHistory.length - 1];
            files = prev.files;//get files if we do
            folderId = prev.folderId;
        }
        
        return Object.assign({}, {
            history: prevHistory,
            currentFolder: folderId,
            currentFiles: files
        })
    }
}, {history: [], currentFiles: []})