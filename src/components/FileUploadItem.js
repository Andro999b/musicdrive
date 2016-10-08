import React from 'react'
import ReactDOM from 'react-dom'
import {ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import ReactTransitionGroup from 'react-addons-transition-group';

class FileUploadItem extends React.Component {
    componentWillLeave(callback) {
        const style = ReactDOM.findDOMNode(this).style;
        style.opacity = '0';
        style.transition = 'opacity 1s linear';

        this.timer = setTimeout(callback, 1000);
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    render() {
        const {fileUploader} = this.props;
        return (
            <ListItem leftIcon={<FileUploadIcon/>} rightIcon={<CircularProgress size={24}/>}>
                {fileUploader.fileName() }
            </ListItem>
        )
    }
}

export default FileUploadItem;