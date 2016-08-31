import React from 'react'
import { connect } from 'react-redux';

import changeScrean from '../actions/changeScrean'
import goFolder from '../actions/goFolder'
import goBack from '../actions/goBack'
import {addFilesToPlaylist, playFiles} from '../actions/playlistActions'

import {List, ListItem} from 'material-ui/List';

import FileFolder from 'material-ui/svg-icons/file/folder';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {grey400} from 'material-ui/styles/colors';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

class Files extends React.Component {
    render() {
        const { history, currentFiles } = this.props;

        let items = currentFiles.map(file => {
            if(file.folder) {
                return (<ListItem key={file.id} 
                    primaryText={file.name} 
                    leftIcon={<FileFolder/>} 
                    onTouchTap={() => this.props.openFolder(file)}/>)
            } else {
                const rightIconButton = (
                    <IconButton onTouchTap={() => this.props.addToPlaylist(file)}>
                        <ContentAdd/>
                    </IconButton>
                )

                return (<ListItem key={file.id}
                    primaryText={file.name} 
                    leftIcon={<AvMusicVideo/>}
                    rightIconButton={rightIconButton}
                    onTouchTap={() => this.props.playFile(file)}/>)
            }     
        });

        if(history.length > 1) {
            items = [(
                <ListItem 
                    key="back" 
                    primaryText=".." 
                    leftIcon={<FileFolder/>} 
                    onTouchTap={() => this.props.onGoBack()}/>
            )].concat(items)
        }

        return (
            <div>
                <List>
                    {items}
                </List>
                <Toolbar>
                    <ToolbarGroup/>
                    <ToolbarGroup>
                        <FlatButton label="Add all" onTouchTap={() => this.props.addAllToPlaylist(currentFiles)}/>
                        <FlatButton label="Play all" onTouchTap={() => this.props.playAll(currentFiles)}/>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    openFolder(file) {
        dispatch(goFolder(file.id))
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