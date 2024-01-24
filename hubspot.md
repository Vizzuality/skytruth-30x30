# HubSpot configuration

## Contact form

There is a contact form defined there to collect submissions (Marketing -> Forms) called "30x30 Dashboard Contact Form".

It has the following fields:
  - email
  - full_name
  - organization
  - country
  - contact_reason
  - message
  - privacy_policy_consent

## Private application

There is also a private application (Settings -> Integrations -> Private Apps) with the same name. This app is needed to get an API token; the token is scoped to the forms API.

## Submitting the contact form via API

To submit the contact form data via API you need to:

  - authorise with a bearer token (that is the one generated for the private app)
  - provide the following parameters, which can be found in the URL when editing the form / displaying submissions (e.g. `https://app.hubspot.com/submissions/PORTALID/form/FORMGUID/performance`):
    - portalId (also account id, can be found in the user menu)
    - formGuid

Sample body:
```
{
  "fields": [
    {
  "objectTypeId": "0-1",
      "name": "email",
      "value": "example@example.com"85194fe7-a207-425f-81b3-2311bace0b04
    },
    {
  "objectTypeId": "0-1",
      "name": "full_name",
      "value": "Test User"
    },
    {
  "objectTypeId": "0-1",
      "name": "message",
      "value": "Testing"
    }
  ]
}
```

curl:
```
curl -d '{"fields":[{"objectTypeId":"0-1","name":"email","value":"test@example.com"},{"objectTypeId":"0-1","name":"full_name","value":"Test User"},{"objectTypeId":"0-1","name":"message","value":"Testing"}]}' -H "Content-Type: application/json" -H "Authorization: Bearer BEARER_TOKEN" -X POST https://api.hsforms.com/submissions/v3/integration/secure/submit/PORTALID/FORMGUID
```

## Client configuration

The submission URL is set in `frontend/src/pages/api/contact.ts`. The token is set in .env as `HUBSPOT_TOKEN`.