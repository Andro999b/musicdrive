import React, {PropTypes} from 'react'
import { connect } from 'react-redux';
import {List} from 'material-ui/List';

import FileUploadItem from './FileUploadItem';
import {STATUS_CAN_DROP, STATUS_WRONG_TYPE} from '../reducers/upload'
import ReactTransitionGroup from 'react-addons-transition-group';

import {
    red700 as red,
    green800 as grean
} from 'material-ui/styles/colors';

const DRAG_HERE = "Drag you mp3 files here"
const DROP_HERE = "Drop you mp3 files here"
const WRON_FILE_TYPE = "Wrong file type!"


class FileUpload extends React.Component {
    componentWillMount() {
        this.dragIndicatorStyle = {
            fontFamily: this.context.muiTheme.fontFamily,
            textAlign: "center",
            padding: "8px 0"
        }
    }
    render() {
        const {uploaders, status} = this.props;

        let indicatorText;
        let indicatorStyle;
        switch (status) {
            case STATUS_CAN_DROP: {
                indicatorText = DROP_HERE;
                indicatorStyle = Object.assign({
                    color: "white",
                    backgroundColor: grean
                }, this.dragIndicatorStyle);
                break;
            }
            case STATUS_WRONG_TYPE: {
                indicatorStyle = Object.assign({
                    color: "white",
                    backgroundColor: red
                }, this.dragIndicatorStyle);
                indicatorText = WRON_FILE_TYPE;
                break;
            }
            default: {
                indicatorStyle = this.dragIndicatorStyle;
                indicatorText = DRAG_HERE;
            }
        }

        const uploadersItems = uploaders.map(
            (uploader, index) => <FileUploadItem key={index} fileUploader={uploader}/>
        )

        return (
            <div>
                <div style={indicatorStyle}>
                     {indicatorText}
                </div>
                <List style={{paddingTop: 0, paddingBottom: 0}}>
                    <ReactTransitionGroup>
                        {uploadersItems}
                    </ReactTransitionGroup>    
                </List>
            </div>
        );
    }
    preventDefaultHandler(e) {
        e.preventDefault();
    }
    componentDidMount() {
        window.addEventListener("dragenter", this.preventDefaultHandler);
        window.addEventListener("dragleave", this.preventDefaultHandler);
        window.addEventListener("dragover", this.preventDefaultHandler);
        window.addEventListener("drop", this.preventDefaultHandler);
    }
    componentWillUnmount() {
        window.removeEventListener("dragenter", this.preventDefaultHandler);
        window.removeEventListener("dragleave", this.preventDefaultHandler);
        window.removeEventListener("dragover", this.preventDefaultHandler);
        window.removeEventListener("drop", this.preventDefaultHandler);
    }
}

FileUpload.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default connect(state => state.upload)(FileUpload);