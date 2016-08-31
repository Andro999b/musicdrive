import {loadState} from '../persist'
import {nextFolder} from './foldersActions'
import {setVolume, addFilesToPlaylist} from './playlistActions'

export default function() {
    return function (dispatch, getState) {
        const playlist = loadState().playlist;
        dispatch(setVolume(playlist.volume || 0.5));
        dispatch(addFilesToPlaylist(playlist.files || []));
        dispatch(nextFolder());
    }    
}