import { handleActions } from 'redux-actions';

export default handleActions({
    "PLAY_FILES": (state, action) => {
        const files = action.payload.files.filter(f => !f.folder);
        const currentPlay = files[0];

        return Object.assign({}, state, {files, currentPlay});
    },
    "ADD_PLAYLIST_FILES": (state, action) => {
        const files = action.payload.files.filter(f =>
           !(f.folder || state.files.find(sf => sf.id == f.id))
        );
        return Object.assign({}, state, {
            files: state.files.concat(files),
            currentPlay: state.currentPlay
        })
    },
    "REMOVE_PLAYLIST_FILE": (state, action) => {
        const files = state.files.filter(f => f.id != action.payload.id);
        return Object.assign({}, state, {files: files});
    },
    "CLEAR_PLAYLIST_FILES": (state, action) => {
        const files = state.files.filter(f => f.id != action.payload.id);
        return Object.assign({}, state, {files: files});
    },
    "SET_CURRENT_PLAYLIST_FILE": (state, action) => {
        return Object.assign({}, state, {
            currentPlay: action.payload
        });
    },
    "PLAY_NEXT": (state, action) => {
        let currentIndex = 0;
        if(state.currentPlay){
            currentIndex = state.files.findIndex(file => file.id == state.currentPlay.id);
            currentIndex++;
        }

        if(currentIndex >= state.files.length){
            currentIndex = 0;
        }

        let currentPlay = state.files[currentIndex]

        return Object.assign({}, state, {
            currentPlay
        });
    }
}, {files: [], currentPlay:null});
