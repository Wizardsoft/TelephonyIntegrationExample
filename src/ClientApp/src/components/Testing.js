import React from 'react';
import queryString from 'query-string';
import {CallerRenderer} from './CallerRenderer';
import {JobRenderer} from './JobRenderer';
import {LogCallModal} from './LogCallModal';

export class Testing extends React.Component {
    static displayName = Testing.name;

    constructor(props) {
        super(props);
        let id = localStorage.getItem('client_id');
        let secret = localStorage.getItem('client_secret');
        let token = localStorage.getItem('access_token');
        this.state = {
            client_id: id ? id : '',
            client_secret: secret ? secret : '',
            access_token: token ? token : null,
            isRedirect: false, 
            phoneNumber: ''
        };
    }

    async componentDidMount() {
        if(localStorage.getItem('access_token')) return;
        let {code} = queryString.parse(this.props.location.search);
        if (code) {
            let url = 'https://api.wizardsoft.com/core/connect/token';
            let r = encodeURIComponent('https://localhost:44302/auth/callback');
            // let payload = `client_id=wSwdWUKkHLZyuPWYGHyZvPdwBe7LnDMwJexgIzZqjnwXyFFOXs
            //&client_secret=pLITWzUVrd17dv4A0oLUMyNEfhxmHwRd2f7M4ssk0dzFYDoEOExkKNdrXWFdxMh4yixP1n133GCQ25U9cxHmEKiUSM38i9BCRpm&grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${r}`;
            let payload = `client_id=${this.state.client_id}&client_secret=${this.state.client_secret}&grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${r}`;
            try {
                let res = await fetch(url, {
                    method: 'POST',
                    body: payload,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
                });
                if (res.ok) {
                    let data = await res.json();
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    this.setState({access_token: data.access_token});
                }
                else this.setState({token_data: 'Login is required'});
            } catch (error) {
                this.setState({token_data: 'Login is required'});
            }
        }
    }

    startOAuthFlow = () => {
        this.setState({isRedirect: true});
        let c = encodeURIComponent(this.state.client_id);
        let r = encodeURIComponent('https://localhost:44302/auth/callback');
        let s = "read write offline_access";
        let state = 'aaabbbccc111222333'
        let url = `https://api.wizardsoft.com/core/connect/authorize?client_id=${c}&redirect_uri=${r}&scope=${s}&response_type=code&state=${state}`;
        // window.open(url);
        window.location.replace(url);
        //callback?code=4b162ba9927637656f252c1f5b6066c8&state=aaabbbccc111222333
    }

    simulateCall = async () => {
        let apiUrl = 'https://localhost:44302/api/';
        let phone = encodeURIComponent(this.state.phoneNumber);
        let token = localStorage.getItem('access_token');
        if (token) {
            // let url = `https://api.wizardsoft.com/api/telephony/lookup/${phone}`
            let url = `${apiUrl}caller-data?token=${token}&tel=${phone}`
            let res = await fetch(url);
            if (res.ok) {
                let data = await res.json();
                if (data.length > 0) {
                    let caller = data[0];
                    this.setState({caller: caller});
                }
            }
        }
    }

    onEnterKey = async (event) =>{
        if(event.key === 'Enter' && this.state.phoneNumber !== '')
            await this.simulateCall();
    }

    getOpenJobs = async () => {
        let apiUrl = 'https://localhost:44302/api/';
        let caller = this.state.caller;
        let token = localStorage.getItem('access_token');

        let entityName = caller.Entity === 2 ? 'contact' : 'candidate';
        let jobsUrl = `${apiUrl}jobs/${entityName}/open/${caller.ID}?token=${token}`;
        let jobsRes = await fetch(jobsUrl);
        if (jobsRes.ok) {
            let jobsData = await jobsRes.json();
            this.setState({jobs: jobsData});
        }
    }

    handleClientIdChange = (e) => {
        localStorage.setItem('client_id', e.target.value);
        this.setState({client_id: e.target.value});
    }

    handleClientSecretChange = (e) => {
        localStorage.setItem('client_secret', e.target.value);
        this.setState({client_secret: e.target.value});
    }

    render() {
        return (
            <div>
                <h1>Testing OAuth2</h1>
                <div className="input-group mb-3">
                    <div className="input-group-prepend"><span className="input-group-text">client_id</span></div>
                    <input type="text" className="form-control" value={this.state.client_id} onChange={this.handleClientIdChange}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend"><span className="input-group-text">client_secret</span></div>
                    <input type="text" className="form-control" value={this.state.client_secret} onChange={this.handleClientSecretChange}/>
                </div>
                <button className="btn btn-primary" onClick={this.startOAuthFlow} disabled={this.state.client_id === '' || this.state.client_secret === ''} >Sign in with Recruit Wizard</button>
                {this.state.access_token ?
                    <div className="bg-light rounded m-3 p-3">
                        <h3 className="text-monospace text-break">access_token: {localStorage.getItem('access_token')}</h3>
                        <h3 className="text-monospace text-break mb-0">refresh_token: {localStorage.getItem('refresh_token')}</h3>
                    </div>
                    :
                    <div className="alert alert-danger mt-3">Please sign in to simulate calls</div>
                }
                <div className="input-group d-inline-flex mb-3" style={{"width": "auto"}}>
                    <div className="input-group-prepend">
                        <span className="input-group-text">Phone Number</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Phone Number" id="txt-number" onKeyPress={this.onEnterKey} value={this.state.phoneNumber} onChange={e => this.setState({phoneNumber: e.target.value})} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" onClick={this.simulateCall} disabled={!localStorage.getItem('access_token') || this.state.phoneNumber === ''}>Simulate Call</button>
                        {this.state.caller && <button className="btn btn-secondary" onClick={this.getOpenJobs}>Get Open Jobs</button>}
                        {this.state.caller && <button className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Log Call</button>}
                        {this.state.caller && 
                            <div className="dropdown-menu">
                                <button className="dropdown-item" data-toggle="modal" data-backdrop="static" data-keyboard="true" data-target="#logCallModal" onClick={() => this.setState({callType: 'Inbound', callTypeId: 1})}>As Inbound</button>
                                <button className="dropdown-item" data-toggle="modal" data-backdrop="static" data-keyboard="true" data-target="#logCallModal" onClick={() => this.setState({callType: 'Outbound', callTypeId: 4})}>As Outbound</button>
                            </div>
                        }
                    </div>
                </div>
                {this.state.caller && 
                    <div className="container-fuid">
                        <div className="row">
                            <div className="col-sm">
                                { this.state.caller && <CallerRenderer caller={this.state.caller} /> }
                            </div>
                            {this.state.jobs &&
                                <div className="col-sm bg-light overflow-auto" style={{height: '500px'}}>
                                    { this.state.jobs && this.state.jobs.map((job, index) => {
                                        return <JobRenderer job={job} key={index} />;
                                    }) }
                                </div>
                            }
                        </div>
                    </div>
                }
                { this.state.caller && <LogCallModal callType={this.state.callType} callTypeId={this.state.callTypeId} caller={this.state.caller} />}
            </div>
        );
    }
}