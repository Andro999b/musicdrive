import React from "react"
import { connect } from 'react-redux';

import {playNext, shufflePlaylist, setVolume} from '../actions/playlistActions';

import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import AvVolumeOff from 'material-ui/svg-icons/av/volume-off';
import AvLoop from 'material-ui/svg-icons/av/loop';
import AvRepeatOne from 'material-ui/svg-icons/av/repeat-one';
import AvShuffle from 'material-ui/svg-icons/av/shuffle';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';

function formatTime(ts) {
  ts = isNaN(ts) ? 0 : ts;

  const min = Math.floor(ts / 60)
  let sec = Math.floor(ts % 60);
  sec = sec < 10 ? "0" + sec : "" + sec;
  return `${min}:${sec}`
}

class Player extends React.Component {
  constructor(params) {
    super(params)
    this.state = {
      muted: false,
      paused: false,
      currentTime: 0,
      duration: 1,
      buffered: 0,
      looped: false
    }
  }
  switchMute() {
    const muted = !this.state.muted;
    this.refs.audio.muted = muted;

    this.setState({ muted })
  }
  switchLoop() {
    const looped = !this.state.looped;
    this.refs.audio.loop = looped;

    this.setState({ looped })
  }
  playPause() {
    const audio = this.refs.audio;
    if (this.props.currentPlay) {
      const paused = !this.state.paused;
      paused ? audio.pause() : audio.play();

      this.setState({ paused })
    }
  }
  updateTime() {
    const audio = this.refs.audio;
    this.setState({
      currentTime: audio.currentTime,
      duration: audio.duration
    })
  }
  updateBuffered() {
    const audio = this.refs.audio;
    const timeRanges = audio.buffered;
    if (timeRanges.length > 0) {
      let buffered = Math.floor(timeRanges.end(timeRanges.length - 1) / audio.duration * 100);
      this.setState({ buffered })
    }
  }
  setVolume(volume) {
    this.refs.audio.volume = volume;
    this.props.setVolume(volume)
  }
  setPosition() {
    const currentTime = this.refs.seeker.getValue();
    if (isFinite(currentTime)) {
      this.refs.audio.currentTime = currentTime;
      this.setState({ currentTime })
    }
  }
  displayPosition() {
    const currentTime = this.refs.seeker.getValue();
    this.setState({ currentTime })
  }
  playNext() {
    if (this.props.currentPlay && !this.state.looped) {
      this.refs.audio.pause();
      this.setState({ paused: true, currentTime: 0, duration: 1, buffered: 0 })
      this.props.playNext();
    }
  }
  onError(event) {
    if (this.props.currentPlay) {
      console.log("Fail to play: ", this.props.currentPlay, event.nativeEvent);
      this.playNext()
    }
  }
  componentDidMount() {
    this.refs.audio.volume = this.props.volume;
    this.refs.audio.loop = this.state.loop;
  }
  componentWillReceiveProps(props) {
    //play another file
    if (props.currentPlay && props.currentPlay.webContentLink != this.refs.audio.currentSrc)
      this.setState({
        paused: false,
        buffered: 0
      })
  }
  componentDidUpdate() {
    const audio = this.refs.audio;
    if (this.props.currentPlay && !this.state.paused) {//emulate audio play
      audio.play();
    }
  }
  render() {
    const {muted, looped, paused, buffered, duration, currentTime} = this.state;
    const {currentPlay, volume} = this.props;
    let src = '';

    if (currentPlay)
      src = currentPlay.webContentLink

    const iconsBtnStyle = {
      height: 56
    }

    let volumeIcon;
    if (volume == 0 || muted) {
      volumeIcon = <AvVolumeOff/>
    } else {
      volumeIcon = <AvVolumeUp/>
    }

    let playIcon;
    if (paused || currentPlay == null) {
      playIcon = <AvPlayArrow/>
    } else {
      playIcon = <AvPause/>
    }

    let repeatLoopIcon;
    if (looped) {
      repeatLoopIcon = <AvRepeatOne/>
    } else {
      repeatLoopIcon = <AvLoop/>
    }

    let statusText;
    
    if(buffered > 0)
      statusText = `${formatTime(currentTime)} / ${formatTime(duration)} (${buffered}%)`;
    else 
      statusText = '--:-- / --:-- (00%)'

    const toolbarStyle = { paddingLeft: 5, paddingRight: 5, height: null, display: "block" };
    const toolbarGroupStyle = { height: 56, maxWidth: 375, margin: "0 auto" };

    return (
      <div>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup style={toolbarGroupStyle}>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.playPause() }>
              {playIcon}
            </IconButton>
            <Slider
              disabled={buffered == 0}
              ref="seeker"
              style={{ width: 210, marginBottom: -27 }}
              value={currentTime}
              max={duration}
              step={1}
              onChange={() => this.displayPosition() }
              onDragStop={() => this.setPosition() }/>
            <IconButton style={iconsBtnStyle}  onTouchTap={() => this.switchLoop() }>
              {repeatLoopIcon }
            </IconButton>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.props.shufflePlaylist() }>
              <AvShuffle/>
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup style={toolbarGroupStyle}>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.switchMute() }>
              {volumeIcon}
            </IconButton>
            <Slider style={{ width: 80, marginBottom: -27}} value={muted ? 0 : this.props.volume} onChange={(e, v) => this.setVolume(v) }/>
            <ToolbarTitle style={{ marginLeft: 5 }} text={statusText} />
          </ToolbarGroup>
        </Toolbar>
        <audio
          ref="audio"
          src={src}
          onProgress ={() => this.updateBuffered() }
          onLoadStart ={() => this.updateBuffered() }
          onEnded={() => this.playNext() }
          onError={(e) => this.onError(e) }
          onTimeUpdate={() => this.updateTime() }>
        </audio>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    setVolume(value) {
      dispatch(setVolume(value));
    },
    shufflePlaylist() {
      dispatch(shufflePlaylist());
    },
    playNext() {
      dispatch(playNext())
    }
  }
}

export default connect(state => state.playlist, mapDispatchToProps)(Player);
