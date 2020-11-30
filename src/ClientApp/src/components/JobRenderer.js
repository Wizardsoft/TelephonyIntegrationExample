import React from 'react';

export class JobRenderer extends React.Component {
    render() {
        let { Title, JobID, EmploymentType, Employer, Location_Country, Location_State, Location_Suburb } = this.props.job;
        let url = `https://app.recruitwizard.com/secure/jobs/details.aspx?JobID=${JobID}`;
        return (
            <div className='card'>
                <div className='card-body'>
                    <h5 className='card-title font-weight-bold'>{Title}</h5>
                    <table>
                        <tbody>
                            <tr>
                                <td className="font-weight-bold pr-2">ID:</td>
                                <td>{JobID}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Type:</td>
                                <td>{EmploymentType}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Employer:</td>
                                <td>{Employer}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Country:</td>
                                <td>{Location_Country}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">State:</td>
                                <td>{Location_State}</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold pr-2">Suburb:</td>
                                <td>{Location_Suburb}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="card-link">Open in Recruit Wizard</a>
                </div>
            </div>
        );
    }
}