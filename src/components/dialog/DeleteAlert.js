import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class DeleteAlertDailog extends React.Component {
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.props.onCancel()}
                />,
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={() => this.props.onOk()}
                />,
        ];

        return (
            <Dialog
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={() => this.props.onCancel()}
                >
                Delete {this.props.fileName}?
            </Dialog>
        );
    }
};