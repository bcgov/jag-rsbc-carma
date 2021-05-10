# CARMA-VIPS OpenShift Integration

An integration for the Ministry of Attorney General, Road Safety BC. This application sits between Case and Records Management Application(CARMA), and Vehicle Impound and Prohibition System(VIPS).

## Integration details

This integration captures a secure REST requests from VIPS, and passes it along to CARMA if the payload is validated, and the multi-layered authentication and authorization passes.

## Routes

The routes in this integration are defined in

- [index.js](index.js)

### POST `/carma/v1/sendNotification`

Provides the process which a notification traverses to the CARMA application.

Example request body shape

```typescript
{
    "correlationId": <String>,
    "noticeNumber": <String>,
    "noticeTypeCd": <String>,
    "eventDtm": <Date>,
    "eventTypeCd": <String>
}
```

See implementation details in [send.notification.js](lib/send.notification.js)

### GET `/*`

Provides the caller with a pong response. This primarily used for checking the service is alive.

See implementation details in [pong.js](lib/pong.js)

## Local Development

### Development Requirements

You must install the following project:

- [nodejs](https://nodejs.org/en/) - Production uses v10, ensure compatibility from your local environment.

### Getting started

Starting to install this packages dependencies

```bash
# Download and open the source code to your local machine
git clone git@github.com:bcgov/jag-rsbc-carma.git
cd jag-rsbc-carma

# Install yarn if not already available
npm install -g yarn

# Install package dependencies
yarn install

# Test that all packages are pulled by seeing all tests pass
yarn test
```

To run the application locally,

```bash
# Following the steps above.
# Populate the .env file with you required variable values

# Start the application
yarn start
```

Now that the application is running, you may use your flavour of development tools to exercise the application. Some recommendations are [VSCode](https://code.visualstudio.com/) to update and maintain the code, and [Postman](https://www.postman.com/) to exercise REST endpoints.

## Logging

[Splunk](https://www.splunk.com/) is integrated for runtime logging, as interoperable system to track and view application execution.
