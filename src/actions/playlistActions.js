import { createAction } from 'redux-actions';

export const removeFromPlaylist = createAction("REMOVE_PLAYLIST_FILE", file => file);
export const setCurrentPlaylistFile = createAction("SET_CURRENT_PLAYLIST_FILE", file => file);
export const playFiles = createAction("PLAY_FILES", files => ({files}));
export const addFilesToPlaylist = createAction("ADD_PLAYLIST_FILES", files => ({files}));
export const playNext = createAction("PLAY_NEXT");
export const movePlaylistFile = createAction("MOVE_PLAYLIST_FILE", (oldIndex, newIndex) => ({oldIndex, newIndex}));
export const shufflePlaylist = createAction("SHUFFLE_PLAYLIST");
export const setVolume = createAction("SET_VOLUME", volume => volume);