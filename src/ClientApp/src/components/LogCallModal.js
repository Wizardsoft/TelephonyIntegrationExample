import React from 'react';

export class LogCallModal extends React.Component {
    constructor(props) {
        super(props);
        // this.state={subject: '', note: ''};
        this.state={ note: ''};
    }

    onLogCall = async () => {
        let payload = {
            // "Subject": this.state.subject,
            "StatusID": 2,
            "Notes": this.state.note,
            "TypeId": this.props.callTypeId,
            "LinkedPlayers": [
              {
                "EntityID": this.props.caller.Entity,
                "PlayerID": this.props.caller.ID
              }
            ]
        };
        let token = localStorage.getItem('access_token');
        let url = `https://localhost:44302/api/activities?token=${token}`;
        let res = await fetch(url, {method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'}});
        if (res.ok) {
            let data = await res.json();
            // this.setState({subject: '', note: ''});
            this.setState({ note: ''});
            document.getElementById('close-button').click();
        }
    }

    render() {
        return (
            <div className="modal fade" id="logCallModal" tabIndex="-1" role="dialog" aria-labelledby="logCallModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="logCallModalLabel">Log {this.props.callType} Call</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                        <div className="form-group">
                            <label htmlFor="input-note" className="col-form-label">Note:</label>
                            <textarea className="form-control" id="input-note" value={this.state.note} onChange={(e) => this.setState({note: e.target.value})}></textarea>
                        </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" id="close-button" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={this.onLogCall}>Log call</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}