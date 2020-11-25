import React from 'react';

export class CallerRenderer extends React.Component {
    render() {
        let entityTypes = {
            "1":	"Client",
            "2":	"Contact",
            "3":	"Candidate",
            "4":	"Job",
            "5":	"Placement",
            "6":	"Submission",
            "7":	"User",
            "8":	"Opportunity",
            "9":	"Site",
            "10":	"Meeting",
            "11":	"Interview",
            "12":	"Email",
            "13":	"Activity",
            "14":	"Document",
            "15":	"Advert"
        };
        let urlTypes = {
            "1": "https://app.recruitwizard.com/secure/clients/details.aspx?ClientID=",
            "2": "https://app.recruitwizard.com/secure/contacts/details.aspx?ContactID=",
            "3": "https://app.recruitwizard.com/secure/candidates/details.aspx?CandidateId="
        }
        let url = urlTypes[this.props.caller.Entity.toString()] + this.props.caller.ID.toString();
        return (
            <div>
                <h3>Full Name: {this.props.caller.FullName}</h3>
                <h3>Type: {entityTypes[this.props.caller.Entity.toString()]}</h3>
                <h3>Company: {this.props.caller.Company}</h3>
                <h3>Job Title: {this.props.caller.JobTitle}</h3>
                <h3><a href={url} target="_blank" rel="noopener noreferrer">View in Recruit Wizard</a></h3>
            </div>
        );
    }
}