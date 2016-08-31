import React from 'react'
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Player from './Player';

import {removeFromPlaylist, setCurrentPlaylistFile} from '../actions/playlistActions';

import ContentRemove from 'material-ui/svg-icons/content/remove';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import GetApp from 'material-ui/svg-icons/action/get-app';

import IconButton from 'material-ui/IconButton';

class Playlist extends React.Component {
  render() {
    const {files, currentPlay} = this.props

    const items = files.map((file, i) => {
      const rightIconButton = (
        <div>
          <IconButton onTouchTap={() => window.open(file.webContentLink, "_blank")}>
            <GetApp/>
          </IconButton>
          <IconButton onTouchTap={() => this.props.removeFromPlaylist(file) }>
            <ContentRemove/>
          </IconButton>
        </div>
      );

      let leftIcon;
      if (currentPlay && file.id == currentPlay.id) {
        leftIcon = <AvPlayArrow/>;
      }else{
        leftIcon = <AvMusicVideo/>;
      }

      return (<ListItem
        key={file.id}
        onTouchTap={() => this.props.setCurrentPlaylistFile(file)}
        primaryText={file.name}
        rightIconButton={rightIconButton}
        leftIcon={leftIcon}/>)
    })

    return (
      <div>
        <List>
          {items}
        </List>
        <Player/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentPlaylistFile(file) {
      dispatch(setCurrentPlaylistFile(file))
    },
    removeFromPlaylist(file) {
      dispatch(removeFromPlaylist(file))
    }
  }
}

export default connect(state => state.playlist, mapDispatchToProps)(Playlist)
