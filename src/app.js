import React from 'react'
import { connect } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';

import Files from './components/Files';
import Playlist from './components/Playlist';

import changeScrean from './actions/changeScrean'

injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Tabs value={this.props.tab} onChange={this.props.tabChange}>
                    <Tab label="files" value="files">
                        <Files/>
                    </Tab>
                    <Tab label="playlist" value="playlist">
                        <Playlist/>
                    </Tab>
                </Tabs>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({tab: state.screan.current})
const mapDispatchToProps = dispatch => ({
    tabChange(value) {
        dispatch(changeScrean(value))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
