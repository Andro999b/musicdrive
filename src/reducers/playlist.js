import { handleActions } from 'redux-actions';

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export default handleActions({
    "PLAY_FILES": (state, action) => {
        const newFiles = action.payload.files.filter(f => !f.folder);
        const currentPlay = newFiles[0];

        return Object.assign({}, state, {files: newFiles, currentPlay});
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
        const newFiles = state.files.filter(f => f.id != action.payload.id);
        return Object.assign({}, state, {files: newFiles});
    },
    "SHUFFLE_PLAYLIST": (state, action) => {
        const newFiles = [].concat(shuffle(state.files));
        return Object.assign({}, state, {files: newFiles});
    },
    "CLEAR_PLAYLIST_FILES": (state, action) => {
        const newFiles = state.files.filter(f => f.id != action.payload.id);
        return Object.assign({}, state, {files: newFiles});
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
    },
    "MOVE_PLAYLIST_FILE": (state, action) => {
        const oldIndex = action.payload.oldIndex;
        const newIndex = action.payload.newIndex;

        const newFiles = [].concat(state.files);
        newFiles[newIndex] = state.files[oldIndex];
        newFiles[oldIndex] = state.files[newIndex];

        return Object.assign({}, state, {files: newFiles});
    }
}, {files: [], currentPlay:null});
