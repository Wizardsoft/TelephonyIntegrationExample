import React from 'react';

export class CallerRenderer extends React.Component {
    constructor(props) {
        super(props);
        console.log('props: ', props);
        this.state = {caller: props.caller};
    }

    render() {
        let {FullName,Entity,Company,JobTitle,ID} = this.state.caller;
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
        let url = urlTypes[Entity.toString()] + ID.toString();
        return (
            <div>
                <h3>Full Name: {FullName}</h3>
                <h3>Type: {entityTypes[Entity.toString()]}</h3>
                <h3>Company: {Company}</h3>
                <h3>Job Title: {JobTitle}</h3>
                <h3><a href={url} target="_blank" rel="noopener noreferrer">View in Recruit Wizard</a></h3>
            </div>
        );
    }
}