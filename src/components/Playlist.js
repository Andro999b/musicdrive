import React from 'react'
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

import Player from './Player';

import {removeFromPlaylist, setCurrentPlaylistFile, movePlaylistFile} from '../actions/playlistActions';

import ContentRemove from 'material-ui/svg-icons/content/remove';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import FileDownload from 'material-ui/svg-icons/file/file-download';

import IconButton from 'material-ui/IconButton';

const DragHandler = SortableHandle(({content}) => {
  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    margin: 12
  }

  return (<span style={style}>{content}</span>);
})

const SortableItem = SortableElement(({file, currentPlay, callbacks}) => {
  const rightIconButton = (
    <div>
      <IconButton onTouchTap={() => window.open(file.webContentLink, "_blank") }>
        <FileDownload/>
      </IconButton>
      <IconButton onTouchTap={() => callbacks.removeFromPlaylist(file) }>
        <ContentRemove/>
      </IconButton>
    </div>
  );

  let leftIcon;
  if (currentPlay && file.id == currentPlay.id) {
    leftIcon = <AvPlayArrow/>;
  } else {
    leftIcon = <AvMusicVideo/>;
  }

  let dragHandler = <DragHandler content={leftIcon}/>;

  return (<ListItem
    onTouchTap={() => callbacks.setCurrentPlaylistFile(file) }
    innerDivStyle={{ paddingRight: 92 }}
    primaryText={file.name}
    rightIconButton={rightIconButton}
    leftIcon={dragHandler}/>)
}
);

const SortableList = SortableContainer(({files, currentPlay, callbacks}) => {
  return (
    <List>
      {files.map((file, index) =>
        <SortableItem key={file.id} index={index} file={file} currentPlay={currentPlay} callbacks={callbacks}/>
      ) }
    </List>
  );
});

class Playlist extends React.Component {
  onSortEnd({oldIndex, newIndex}) {
    this.props.moveFile(oldIndex, newIndex)
  }
  render() {
    const {files, currentPlay} = this.props;
    const itemCallbacks = {
      setCurrentPlaylistFile: this.props.setCurrentPlaylistFile,
      removeFromPlaylist: this.props.removeFromPlaylist
    }

    return (
      <div>
        <Player/>
        <SortableList
          files={files}
          useDragHandle={true}
          currentPlay={currentPlay}
          callbacks={itemCallbacks}
          onSortEnd={this.onSortEnd.bind(this) }/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    moveFile(oldIndex, newIndex) {
      dispatch(movePlaylistFile(oldIndex, newIndex))
    },
    setCurrentPlaylistFile(file) {
      dispatch(setCurrentPlaylistFile(file))
    },
    removeFromPlaylist(file) {
      dispatch(removeFromPlaylist(file))
    }
  }
}

export default connect(state => state.playlist, mapDispatchToProps)(Playlist)
