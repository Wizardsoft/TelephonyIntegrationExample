import React from 'react';
import queryString from 'query-string';
import {CallerRenderer} from './CallerRenderer';

export class Testing extends React.Component {
    static displayName = Testing.name;

    constructor(props) {
        super(props);
        this.state = { isRedirect: false };
    }

    async componentDidMount() {
        if(localStorage.getItem('access_token')) return;
        let {code} = queryString.parse(this.props.location.search);
        if (code) {
            let url = 'https://api.wizardsoft.com/core/connect/token';
            let r = encodeURIComponent('https://localhost:44302/auth/callback');
            let payload = `client_id=wSwdWUKkHLZyuPWYGHyZvPdwBe7LnDMwJexgIzZqjnwXyFFOXs&client_secret=pLITWzUVrd17dv4A0oLUMyNEfhxmHwRd2f7M4ssk0dzFYDoEOExkKNdrXWFdxMh4yixP1n133GCQ25U9cxHmEKiUSM38i9BCRpm&grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${r}`;
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
                    this.setState({token_data: data});
                }
                else this.setState({token_data: 'Login is required'});
            } catch (error) {
                this.setState({token_data: 'Login is required'});
            }
        }
    }

    startOAuthFlow = () => {
        localStorage.clear();
        this.setState({isRedirect: true});
        let c = encodeURIComponent('wSwdWUKkHLZyuPWYGHyZvPdwBe7LnDMwJexgIzZqjnwXyFFOXs');
        let r = encodeURIComponent('https://localhost:44302/auth/callback');
        let s = "read write offline_access";
        let state = 'aaabbbccc111222333'
        let url = `https://api.wizardsoft.com/core/connect/authorize?client_id=${c}&redirect_uri=${r}&scope=${s}&response_type=code&state=${state}`;
        // window.open(url);
        window.location.replace(url);
        //callback?code=4b162ba9927637656f252c1f5b6066c8&state=aaabbbccc111222333
    }

    simulateCall = async () => {
        let phone = encodeURIComponent(document.getElementById('txt-number').value);
        let token = localStorage.getItem('access_token');
        if (token) {
            // let url = `https://api.wizardsoft.com/api/telephony/lookup/${phone}`
            let url = `https://localhost:44302/api/caller-data?token=${token}&tel=${phone}`
            let res = await fetch(url);
            if (res.ok) {
                let data = await res.json();
                if (data.length > 0) {
                    this.setState({caller: data[0]});
                }
            }
        }
    }

    renderCaller = (caller) => {
        if (caller) {
            return <CallerRenderer caller={caller} />
        }
        return null;
    }

    render() {
        return (
            <div>
                <h1>Testing OAuth2</h1>
                <button className="btn btn-primary" onClick={this.startOAuthFlow}>LogIn</button>
                <h2>access_token: {localStorage.getItem('access_token')}</h2>
                <h2>refresh_token: {localStorage.getItem('refresh_token')}</h2>
                <input type="text" id="txt-number" />
                <br/>
                <button className="btn btn-primary" onClick={this.simulateCall}>Simulate Call</button>
                {this.renderCaller(this.state.caller)}
            </div>
        );
    }
}