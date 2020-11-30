import React from 'react';

export class CallerRenderer extends React.Component {
    render() {
        let entityTypes = {
            "1": "Client",
            "2": "Contact",
            "3": "Candidate",
            "4": "Job",
            "5": "Placement",
            "6": "Submission",
            "7": "User",
            "8": "Opportunity",
            "9": "Site",
            "10": "Meeting",
            "11": "Interview",
            "12": "Email",
            "13": "Activity",
            "14": "Document",
            "15": "Advert"
        };
        let urlTypes = {
            "1": "https://app.recruitwizard.com/secure/clients/details.aspx?ClientID=",
            "2": "https://app.recruitwizard.com/secure/contacts/details.aspx?ContactID=",
            "3": "https://app.recruitwizard.com/secure/candidates/details.aspx?CandidateId="
        }
        let url = urlTypes[this.props.caller.Entity.toString()] + this.props.caller.ID.toString();
        return (
            <div className="card shadow" style={{"width": "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title font-weight-bold">{this.props.caller.FullName}</h5>
                    <table>
                        <tbody>
                            <tr>
                                <td className="font-weight-bold pr-2">ID:</td>
                                <td>{this.props.caller.ID}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Type:</td>
                                <td>{entityTypes[this.props.caller.Entity.toString()]}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Company:</td>
                                <td>{this.props.caller.Company}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Job Title:</td>
                                <td>{this.props.caller.JobTitle}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="card-link">Open in Recruit Wizard</a>
                </div>
            </div>
        );
    }
}