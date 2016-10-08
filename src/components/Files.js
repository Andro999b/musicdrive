import React from 'react'
import { connect } from 'react-redux';

import changeScrean from '../actions/changeScrean'
import {onDragEnter, onDragLeave, onDrop} from '../actions/uploadActions'
import {nextFolder, goBack, reloadFolder, deleteFile} from '../actions/foldersActions'
import {addFilesToPlaylist, playFiles} from '../actions/playlistActions'

import {List, ListItem} from 'material-ui/List';

import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh'
import FileFolder from 'material-ui/svg-icons/file/folder';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import AvQueue from 'material-ui/svg-icons/av/queue';
import AvPlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import AvPlaylistPlay from 'material-ui/svg-icons/av/playlist-play';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import FileUpload from './FileUpload'
import DeleteAlert from './dialog/DeleteAlert'

class Files extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteFile: null
        }
    }
    deleteFile(file) {
        this.setState({deleteFile: file});
    }
    cancelDelete() {
        this.setState({deleteFile: null});
    }
    acceptDelete() {
        this.props.deleteFile(this.state.deleteFile);
        this.setState({deleteFile: null});
    }
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
                        <IconButton onTouchTap={() => this.props.addToPlaylist(file) }>
                            <AvQueue/>
                        </IconButton>
                        <IconMenu
                            iconButtonElement={
                                <IconButton touch={true}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            >
                            <MenuItem primaryText="Download" onTouchTap={() => window.open(file.webContentLink, "_blank") }/>
                            <MenuItem primaryText="Delete" onTouchTap={() => this.deleteFile(file)}/>
                        </IconMenu>
                    </div>
                )

                return (<ListItem
                    key={file.id}
                    innerDivStyle={{ paddingRight: 92 }}
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

        
        let showDeletDialog = this.state.deleteFile != null;
        let deleteDialog= <DeleteAlert 
                open={showDeletDialog}
                fileName={showDeletDialog?this.state.deleteFile.name:""} 
                onCancel={() => this.cancelDelete()} 
                onOk={() => this.acceptDelete()}
            />
        
        return (
            <div style={this.props.style}
                onDragEnter={e => this.props.onDragEnter(e) }
                onMouseOut={() => this.props.onDragLeave() }
                onDrop={e => this.props.onDrop(e) }
                >
                {deleteDialog}
                <div style={{ marginBottom: 56 }}>
                    <FileUpload/>
                    <List style={{ paddingTop: 0 }}>
                        {items}
                    </List>
                </div>
                <div style={{ position: "fixed", width: "100%", bottom: 0 }}>
                    <Toolbar style={{ padding: null }}>
                        <ToolbarGroup style={{ margin: "0 auto" }}>
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
    deleteFile(file) {
        dispatch(deleteFile(file.id))
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
    },
    onDragEnter(e) {
        dispatch(onDragEnter(e.dataTransfer.items))
    },
    onDragLeave() {
        dispatch(onDragLeave())
    },
    onDrop(e) {
        const dt = e.dataTransfer;
        dispatch(onDrop(dt.items, dt.files))
    }
})

export default connect(state => state.files, mapDispatchToProps)(Files)