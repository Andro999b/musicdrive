import React from "react"
import { connect } from 'react-redux';

import {playNext, shufflePlaylist} from '../actions/playlistActions';

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
      volume: 0.5,
      muted: false,
      paused: false,
      currentTime: 0,
      duration: 0,
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
    const paused = !this.state.paused;
    const audio = this.refs.audio;
    paused ? audio.pause() : audio.play();

    this.setState({ paused })
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
      let buffered = Math.floor(timeRanges.end(0) / audio.duration * 100);
      this.setState({ buffered })
    }
  }
  setVolume(volume) {
    this.refs.audio.volume = volume;
    this.setState({ volume })
  }
  setPosition() {
    const currentTime = this.refs.seeker.getValue();
    this.refs.audio.currentTime = currentTime;
    this.setState({ currentTime })
  }
  displayPosition() {
    const currentTime = this.refs.seeker.getValue();
    this.setState({ currentTime })
  }
  playNext() {
    if (!this.state.looped) {
      this.refs.audio.pause();
      this.setState({ paused: true, currentTime: 0, duration: 0, buffered: 0 })
      this.props.playNext();
    }
  }
  componentDidMount() {
    this.refs.audio.volume = this.state.volume;
    this.refs.audio.loop = this.state.loop;
  }
  componentWillReceiveProps(props) {
    if (props.currentPlay)
      this.setState({
        paused: false,
        buffered: 0
      })
  }
  render() {
    const currentPlay = this.props.currentPlay;
    let src = '';

    if (currentPlay)
      src = currentPlay.webContentLink

    const iconsBtnStyle = {
      height: 56
    }

    let volumeIcon;
    if (this.state.volume == 0 || this.state.muted) {
      volumeIcon = <AvVolumeOff/>
    } else {
      volumeIcon = <AvVolumeUp/>
    }

    let playIcon;
    if (this.state.paused || currentPlay == null) {
      playIcon = <AvPlayArrow/>
    } else {
      playIcon = <AvPause/>
    }

    let repeatLoopIcon;
    if (this.state.looped) {
      repeatLoopIcon = <AvRepeatOne/>
    } else {
      repeatLoopIcon = <AvLoop/>
    }

    const statusText = `${formatTime(this.state.currentTime)} / ${formatTime(this.state.duration)} (${this.state.buffered}%)`;
    const toolbarStyle = { paddingLeft: 5, paddingRight: 5, height: null, display: "block" };
    const toolbarGroupStyle = { height: 56, maxWidth: 375, margin: "0 auto"};

    return (
      <div>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup style={toolbarGroupStyle}>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.playPause() }>
              {playIcon}
            </IconButton>
            <Slider
              ref="seeker"
              style={{ width: 230, marginTop: -5 }}
              value={this.state.currentTime}
              max={this.state.duration}
              step={1}
              onChange={() => this.displayPosition() }
              onDragStop={() => this.setPosition() }/>
            <IconButton onTouchTap={() => this.switchLoop() }>
              {repeatLoopIcon }
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup style={toolbarGroupStyle}>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.switchMute() }>
              {volumeIcon}
            </IconButton>
            <Slider style={{ width: 80, marginTop: -5 }} value={this.state.muted ? 0 : this.state.volume} onChange={(e, v) => this.setVolume(v) }/>
            <ToolbarTitle style={{ marginLeft: 10 }} text={statusText} />
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.props.shufflePlaylist() }>
              <AvShuffle/>
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <audio
          ref="audio"
          src={src} autoPlay
          onProgress ={(e) => this.updateBuffered() }
          onLoadStart ={(e) => this.updateBuffered() }
          onEnded={() => this.playNext() }
          onError={() => this.playNext() }
          onTimeUpdate={() => this.updateTime() }>
        </audio>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    shufflePlaylist() {
      dispatch(shufflePlaylist());
    },
    playNext() {
      dispatch(playNext())
    }
  }
}

export default connect(state => state.playlist, mapDispatchToProps)(Player);
