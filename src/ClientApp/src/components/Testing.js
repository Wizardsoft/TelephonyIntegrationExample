import React from 'react';
import queryString from 'query-string';
import { CallerRenderer } from './CallerRenderer';
import { JobRenderer } from './JobRenderer';
import { LogCallModal } from './LogCallModal';

export class Testing extends React.Component {
    static displayName = Testing.name;

    constructor(props) {
        super(props);
        let id = localStorage.getItem('client_id');
        let secret = localStorage.getItem('client_secret');
        let token = localStorage.getItem('access_token');
        let refresh = localStorage.getItem('refresh_token');
        this.state = {
            client_id: id ? id : '',
            client_secret: secret ? secret : '',
            access_token: token ? token : null,
            refresh_token: refresh ? refresh : null,
            isRedirect: false,
            phoneNumber: '',
            loadingTokens: false,
            loadingCaller: false,
            loadingJobs: false
        };
    }

    async componentDidMount() {
        if (this.state.access_token) return;
        this.setState({loadingTokens: true});
        let { code } = queryString.parse(this.props.location.search);
        if (code) {
            let url = 'https://api.wizardsoft.com/core/connect/token';
            let r = encodeURIComponent('https://localhost:44302/auth/callback');
            let payload = `client_id=${this.state.client_id}&client_secret=${this.state.client_secret}&grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${r}`;
            try {
                let res = await fetch(url, {
                    method: 'POST',
                    body: payload,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
                });
                this.setState({loadingTokens: false});
                if (res.ok) {
                    let data = await res.json();
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    this.setState({ access_token: data.access_token, refresh_token: data.refresh_token });
                }
                else this.setState({ token_data: 'Login is required' });
            } catch (error) {
                this.setState({ token_data: 'Login is required', loadingTokens: false });
            }
        }
    }

    startOAuthFlow = () => {
        this.setState({ isRedirect: true });
        let c = encodeURIComponent(this.state.client_id);
        let r = encodeURIComponent('https://localhost:44302/auth/callback');
        let s = "read write offline_access";
        let state = 'aaabbbccc111222333';
        let url = `https://api.wizardsoft.com/core/connect/authorize?client_id=${c}&redirect_uri=${r}&scope=${s}&response_type=code&state=${state}`;
        window.location.replace(url);
    }

    refreshToken = async () => {
        if(!this.state.refresh_token) return;
        this.setState({loadingTokens: true});
        let url = 'https://api.wizardsoft.com/core/connect/token';
        let payload = `client_id=${this.state.client_id}&client_secret=${this.state.client_secret}&grant_type=refresh_token&refresh_token=${this.state.refresh_token}`;
        try {
            let res = await fetch(url, {
                method: 'POST',
                body: payload,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
            });
            this.setState({loadingTokens: false});
            if (res.ok) {
                let data = await res.json();
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                this.setState({ access_token: data.access_token, refresh_token: data.refresh_token });
            }
            else this.setState({ token_data: 'Login is required' });
        } catch (error) {
            this.setState({ token_data: 'Login is required', loadingTokens: false });
        }
    }

    simulateCall = async () => {
        this.setState({ caller: null, jobs: null, loadingCaller: true });
        let apiUrl = 'https://localhost:44302/api/';
        let phone = encodeURIComponent(this.state.phoneNumber);
        let token = localStorage.getItem('access_token');
        if (token) {
            // let url = `https://api.wizardsoft.com/api/telephony/lookup/${phone}`
            let url = `${apiUrl}caller-data?token=${token}&tel=${phone}`;
            let res = await fetch(url);
            this.setState({loadingCaller: false});
            if (res.ok) {
                let data = await res.json();
                if (data.length > 0) {
                    let caller = data[0];
                    this.setState({ caller: caller });
                }
            }
        }
    }

    onEnterKey = async (event) => {
        if (event.key === 'Enter' && this.state.phoneNumber !== '' && !this.state.loadingCaller)
            await this.simulateCall();
    }

    getOpenJobs = async () => {
        if(this.state.loadingJobs) return;
        this.setState({loadingJobs: true, jobs: null});
        let apiUrl = 'https://localhost:44302/api/';
        let caller = this.state.caller;
        let token = localStorage.getItem('access_token');

        let entityName = caller.Entity === 2 ? 'contact' : 'candidate';
        let jobsUrl = `${apiUrl}jobs/${entityName}/open/${caller.ID}?token=${token}`;
        let jobsRes = await fetch(jobsUrl);
        this.setState({loadingJobs: false});
        if (jobsRes.ok) {
            let jobsData = await jobsRes.json();
            this.setState({ jobs: jobsData });
        }
    }

    handleClientIdChange = (e) => {
        localStorage.setItem('client_id', e.target.value);
        this.setState({ client_id: e.target.value });
    }

    handleClientSecretChange = (e) => {
        localStorage.setItem('client_secret', e.target.value);
        this.setState({ client_secret: e.target.value });
    }

    clearTokens = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.setState({access_token: null, refresh_token: null});
    }

    clearAuth = () => {
        localStorage.removeItem('client_id');
        localStorage.removeItem('client_secret');
        this.setState({client_id: '', client_secret: ''});
    }

    clearAll = () => {
        localStorage.clear();
        this.setState({client_id: '', client_secret: '', access_token: null, refresh_token: null});
    }

    render() {
        return (
            <div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend"><span className="input-group-text">client_id</span></div>
                    <input type="text" className="form-control" value={this.state.client_id} onChange={this.handleClientIdChange} />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend"><span className="input-group-text">client_secret</span></div>
                    <input type="text" className="form-control" value={this.state.client_secret} onChange={this.handleClientSecretChange} />
                </div>
                <div className="btn-group" role="group">
                    <button className="btn btn-primary" onClick={this.startOAuthFlow} disabled={this.state.client_id === '' || this.state.client_secret === ''} >Sign in with Recruit Wizard</button>
                    <button className="btn btn-secondary" onClick={this.refreshToken} disabled={!this.state.refresh_token}>Refresh Token</button>
                    <div className="btn-group" role="group">
                        <button className="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">Clear Local Storage</button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={this.clearTokens}>Tokens</button>
                            <button className="dropdown-item" onClick={this.clearAuth}>Auth data</button>
                            <button className="dropdown-item" onClick={this.clearAll}>All</button>
                        </div>
                    </div>
                </div>
                {this.state.loadingTokens &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                }
                {this.state.access_token ?
                    <div className="bg-light rounded m-3 p-3">
                        <h3 className="text-monospace text-break">access_token: {this.state.access_token}</h3>
                        <h3 className="text-monospace text-break mb-0">refresh_token: {this.state.refresh_token}</h3>
                    </div>
                    :
                    <div className="alert alert-danger mt-3">Please sign in to simulate calls</div>
                }
                <div className="input-group d-inline-flex mb-3" style={{ "width": "auto" }}>
                    <div className="input-group-prepend">
                        <span className="input-group-text">Phone Number</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Phone Number" id="txt-number" onKeyPress={this.onEnterKey} value={this.state.phoneNumber} onChange={e => this.setState({ phoneNumber: e.target.value })} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" onClick={this.simulateCall} disabled={!this.state.access_token || this.state.phoneNumber === '' || this.state.loadingCaller}>Simulate Call</button>
                        {this.state.caller && <button className="btn btn-secondary" onClick={this.getOpenJobs} disabled={this.state.loadingJobs || this.state.caller.Entity !== 2 }>Get Open Jobs</button>}
                        {this.state.caller && <button className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Log Call</button>}
                        {this.state.caller &&
                            <div className="dropdown-menu">
                                <button className="dropdown-item" data-toggle="modal" data-backdrop="static" data-keyboard="true" data-target="#logCallModal" onClick={() => this.setState({ callType: 'Inbound', callTypeId: 1 })}>As Inbound</button>
                                <button className="dropdown-item" data-toggle="modal" data-backdrop="static" data-keyboard="true" data-target="#logCallModal" onClick={() => this.setState({ callType: 'Outbound', callTypeId: 4 })}>As Outbound</button>
                            </div>
                        }
                    </div>
                </div>
                {this.state.loadingCaller &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                }
                {this.state.caller &&
                    <div className="container-fuid">
                        <div className="row">
                            <div className="col-sm">
                                {this.state.caller && <CallerRenderer caller={this.state.caller} />}
                            </div>
                            {this.state.loadingJobs &&
                                <div className="col-sm justify-content-center">
                                    <div className="spinner-border" role="status"></div>
                                </div>
                            }
                            {this.state.jobs &&
                                <div className="col-sm bg-light overflow-auto" style={{ height: '500px' }}>
                                    {this.state.jobs.length > 0 ? 
                                        this.state.jobs.map((job, index) => {
                                            return <JobRenderer job={job} key={index} />;
                                        })
                                        :
                                        <div className="p-3 text-center">
                                            <h5>No jobs found</h5>
                                        </div>
                                    }
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