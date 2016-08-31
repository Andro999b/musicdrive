import React from 'react'
import { connect } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Tabs, Tab } from 'material-ui/Tabs';

import {
    indigo700,
    red300
} from 'material-ui/styles/colors';

import Files from './components/Files';
import Playlist from './components/Playlist';

import changeScrean from './actions/changeScrean'

injectTapEventPlugin();

const appTheme = getMuiTheme({
    palette: {
        primary1Color: indigo700,
        accent1Color: red300
    }
})

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={appTheme}>
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
