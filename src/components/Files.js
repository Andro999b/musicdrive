import React from 'react'
import { connect } from 'react-redux';

import changeScrean from '../actions/changeScrean'
import {nextFolder, goBack, reloadFolder} from '../actions/foldersActions'
import {addFilesToPlaylist, playFiles} from '../actions/playlistActions'

import {List, ListItem} from 'material-ui/List';

import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh'
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FileFolder from 'material-ui/svg-icons/file/folder';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import AvQueue from 'material-ui/svg-icons/av/queue';
import AvPlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import AvPlaylistPlay from 'material-ui/svg-icons/av/playlist-play';

import {grey400} from 'material-ui/styles/colors';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

class Files extends React.Component {
    render() {
        const { history, currentFiles } = this.props;

        let items = currentFiles.map(file => {
            if (file.folder) {
                return (<ListItem key={file.id}
                    primaryText={file.name}
                    leftIcon={<FileFolder/>}
                    onTouchTap={() => this.props.openFolder(file) }/>)
            } else {
                const rightIconButton = (
                    <div>
                        <IconButton onTouchTap={() => window.open(file.webContentLink, "_blank") }>
                            <FileDownload/>
                        </IconButton>
                        <IconButton onTouchTap={() => this.props.addToPlaylist(file) }>
                            <AvQueue/>
                        </IconButton>
                    </div>
                )

                return (<ListItem
                    key={file.id}
                    innerDivStyle={{paddingRight: 92}}
                    primaryText={file.name}
                    leftIcon={<AvMusicVideo/>}
                    rightIconButton={rightIconButton}
                    onTouchTap={() => this.props.playFile(file) }/>)
            }
        });

        if (history.length > 1) {
            items = [(
                <ListItem
                    key="back"
                    primaryText=".."
                    leftIcon={<FileFolder/>}
                    onTouchTap={() => this.props.onGoBack() }/>
            )].concat(items)
        }

        let btnStyle = {
            margin: "10px 5px"
        }

        return (
            <div style={this.props.style}>
                <div style={{marginBottom: 56}}>
                    <List>
                        {items}
                    </List>
                </div>
                <div style={{position: "fixed", width: "100%", bottom: 0}}>
                    <Toolbar style={{ padding: null }}>
                        <ToolbarGroup style={{margin: "0 auto"}}>
                            <FlatButton style={btnStyle} label="Reload" icon={<NavigationRefresh/>} onTouchTap={() => this.props.reload() }/>
                            <FlatButton style={btnStyle} label="Add all" icon={<AvPlaylistAdd/>} onTouchTap={() => this.props.addAllToPlaylist(currentFiles) }/>
                            <FlatButton style={btnStyle} label="Play all" icon={<AvPlaylistPlay/>} onTouchTap={() => this.props.playAll(currentFiles) }/>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    reload() {
        dispatch(reloadFolder());
    },
    openFolder(file) {
        dispatch(nextFolder(file.id))
    },
    playFile(file) {
        dispatch(changeScrean("playlist"))
        dispatch(playFiles([file]))
    },
    playAll(files) {
        dispatch(changeScrean("playlist"))
        dispatch(playFiles(files))
    },
    addToPlaylist(file) {
        dispatch(changeScrean("playlist"))
        dispatch(addFilesToPlaylist([file]))
    },
    addAllToPlaylist(files) {
        dispatch(changeScrean("playlist"))
        dispatch(addFilesToPlaylist(files))
    },
    onGoBack() {
        dispatch(goBack())
    }
})

export default connect(state => state.files, mapDispatchToProps)(Files)