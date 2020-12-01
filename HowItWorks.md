# Telephony Integration Example - How it works

 - Authenticating using our oAuth2 workflow 

    [Recruit Wizard](https://recruitwizard.com) uses OAuth 2.0's Authorization code workflow to authorize users against it's [Public API](https://api.wizardsoft.com/swagger) .

    The telephony Integration Example Triggers this workflow [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/744cd775c78c091e601e633eb8df2766db872d39/src/ClientApp/src/components/Testing.js#L58) and handles the inbound code [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/744cd775c78c091e601e633eb8df2766db872d39/src/ClientApp/src/components/Testing.js#L32)

 - Refreshing a token

    TODO

 - Simulating a phone call and calling the telephony lookup method.

    The Recruit Wizard API accepts phone numbers in the E.164 format without the use of the + symbol.

    Example code is [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/744cd775c78c091e601e633eb8df2766db872d39/src/Controllers/AuthController.cs#L15)

    Swagger spec is [here](https://api.wizardsoft.com/swagger/ui/index#!/Telephony/Telephony_LookUp)    

 - Displaying a card based on the data returned from the telephony
   lookup method.

    How and what you display on an Insights Card is completely up to you, we highly recommend the following fields:

    1) Record Type
    2) Record Name
    3) Job Title
    4) Company
    5) Link

    All of these fields are returned from the telepony lookup method. If you want addition data you would need to get that [Contact](https://api.wizardsoft.com/swagger/ui/index#!/Contacts/Contacts_Get) or [Candidate](https://api.wizardsoft.com/swagger/ui/index#!/Candidates/Candidates_Get) record by ID.


 - Displaying a List of Open Jobs based on the record returned from the telephony lookup method

    Open Jobs are available for contacts only. 

    Example code is [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/744cd775c78c091e601e633eb8df2766db872d39/src/Controllers/AuthController.cs#L26)

    Swagger spec is [here](https://api.wizardsoft.com/swagger/ui/index#!/Jobs/Jobs_JobsByContactOpen) on the API will return them.    

 - Logging an Inbound / Outbound Call back into Recruit Wizard

    It is highly recommended that a user is prompted to log a note whenever a call finishes. The type of note will differ depending on if the call was inbound or outbound.

    Example code is [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/5baaa4013ef3d967933eece18113dcfb31521a96/src/Controllers/AuthController.cs#L48)

    Swagger spec is [here](https://github.com/Wizardsoft/TelephonyIntegrationExample/blob/5baaa4013ef3d967933eece18113dcfb31521a96/src/Controllers/AuthController.cs#L48)

    The Status of the Note should always be 'Closed' aka. StatusID = 2

    The Type will differ for Inbound = 1, Outbound = 4

    The Entity will differ for Contact = 2, Candidate = 3

    ```json
    {
        "StatusID": 2,
        "Notes": "Great conversation about plans for next year.",
        "TypeId": 1,
        "ActivityDate": "2020-11-29T22:10:20.721Z",
        "LinkedPlayers": [
            {
            "EntityID": 2,
            "PlayerID": 533995
            }
        ]
    }
    ```