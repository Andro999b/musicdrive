import { handleActions } from 'redux-actions';

export default handleActions({
    "GO_FOLDER": (state, action) => (
        Object.assign({}, {
            history: state.history.concat(action.payload),
            currentFiles: action.payload.files
        })
    ),
    "GO_BACK": (state, action) => {
        //check if have any history
        const h = state.history;
        if(h.length == 0) return state;

        //pop previous history
        const prevHistory = h.slice(0, h.length- 1);
        let files = []
        if(prevHistory.length > 0)//check if have any history now
            files = prevHistory[prevHistory.length - 1].files//get files if we do
        
        return Object.assign({}, {
            history: prevHistory,
            currentFiles: files
        })
    }
}, {history: [], currentFiles: []})