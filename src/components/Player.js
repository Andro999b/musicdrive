import React from "react"
import { connect } from 'react-redux';

import {playNext} from '../actions/playlistActions';

import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import AvVolumeOff from 'material-ui/svg-icons/av/volume-off';


import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';

function formatTime(ts) {
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
      looped: false
    }
  }
  changeMuted() {
    const muted = !this.state.muted;
    this.refs.audio.muted = muted;

    this.setState({muted})
  }
  playPause() {
    const paused = !this.state.paused;
    const audio = this.refs.audio;
    paused ? audio.pause() : audio.play();

    this.setState({paused})
  }
  updateTime() {
    const audio = this.refs.audio;
    this.setState({
      currentTime: audio.currentTime,
      duration: audio.duration
    })
  }
  setVolume(volume) {
    this.refs.audio.volume = volume;
    this.setState({volume})
  }
  setPosition() {
    const currentTime = this.refs.seeker.getValue();
    this.refs.audio.currentTime = currentTime;
    this.setState({currentTime})
  }
  displayPosition() {
    const currentTime = this.refs.seeker.getValue();
    this.setState({currentTime})
  }
  playNext() {
    if(!this.state.looped){
      this.setState({paused: true})
      this.props.playNext();
    }
  }
  componentDidMount() {
    this.refs.audio.volume = this.state.volume;
  }
  componentWillReceiveProps(props) {
    if(props.currentPlay)
      this.setState({
        paused: false,
        currentTime: 0, 
        duration: 0
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
    if(this.state.volume == 0 || this.state.muted){
      volumeIcon = <AvVolumeOff/>
    } else {
      volumeIcon = <AvVolumeUp/>
    }
    
    let playIcon;
    if(this.state.paused || currentPlay == null){
      playIcon = <AvPlayArrow/>
    } else {
      playIcon = <AvPause/>
    }

    return (
      <div>
        <Toolbar style={{paddingLeft: 5, paddingRight:5, height: null, justifyContent: "flex-start"}}>
          <ToolbarGroup>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.playPause()}>
              {playIcon}
            </IconButton>
            <ToolbarTitle text={`${formatTime(this.state.currentTime)} / ${formatTime(this.state.duration)}`} />
          </ToolbarGroup>
          <ToolbarGroup style={{height: 56}}>
            <Slider 
              ref="seeker" 
              style={{width: 250, marginTop: -5}} 
              value={this.state.currentTime} 
              max={this.state.duration} 
              step={1}
              onChange={() => this.displayPosition()}
              onDragStop={() => this.setPosition()}/>
          </ToolbarGroup>
          <ToolbarGroup style={{height: 56}}>
            <IconButton style={iconsBtnStyle} onTouchTap={() => this.changeMuted()}>
              {volumeIcon}
            </IconButton>
            <Slider style={{width: 100, marginTop: -5}} value={this.state.muted ? 0 : this.state.volume} onChange={(e, v) => this.setVolume(v)}/>
          </ToolbarGroup>
        </Toolbar>
        <audio 
          ref="audio" 
          src={src} autoPlay 
          onEnded={() => this.playNext()}
          onTimeUpdate={() => this.updateTime()}>
        </audio>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    playNext() {
      dispatch(playNext())
    }
  }
}

export default connect(state => state.playlist, mapDispatchToProps)(Player);
