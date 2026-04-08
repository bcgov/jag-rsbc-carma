const { basic } = require('../support/basic.auth' )
const { bodyOf } = require('../support/body.of.request')
const { send } = require('../support/https.request')
const flush = require('./flush')
const url = require('url')
const https = require('https')
//const uuidv1 = require('uuid/v1')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')
const splunkLogger = require("splunk-logging").Logger
var logger
var payload
var splunkLoggingEnabled

const initialiseSplunk = () => {
    splunkLoggingEnabled = process.env.SPLUNK_LOGGING_ENABLED == "true"
    if(!splunkLoggingEnabled) return
    var config = {
        token: process.env.SPLUNK_TOKEN,
        url: process.env.SPLUNK_HEC_URL
    };

    logger = new splunkLogger(config);

    payload = {message:"",severity:""};
}

const logToSplunk = (message, severity) => {
    if(!splunkLoggingEnabled) return
    payload.message = message;
    payload.severity = severity;
    console.log("Sending payload", payload);
    logger.send(payload, function (err, resp, body) {
        // If successful, body will be { text: 'Success', code: 0 }
        console.log("Response from Splunk", body);
    });
}

const sendNotification = (req, response, observer) => {
    console.log('DEBUG: SendNotification Called')
    initialiseSplunk()
    logToSplunk("INFO: sendNotification STARTED.", "info")
    // var config = {
    //     token: "4b95ebfc-c50b-44f9-b46b-d3b108ee5910",
    //     url: "https://sandboxhec.monitoring.ag.gov.bc.ca:8088/services/collector"
    // };
   
    var expected = basic(process.env.API_USERNAME, process.env.API_PASSWORD)
    response.setHeader('content-type', 'application/json')
    if (req.headers['authorization'] !== expected) {
        console.log('DEBUG: Unauthorized request. Expected authorization header: ' + expected)
        console.log('DEBUG: Received authorization header: ' + req.headers['authorization'])
        response.statusCode = 401
        flush(response, observer)
    }
    else {
        console.log('DEBUG: Authorized request. Processing notification.')
        bodyOf(req, (body)=>{
            observer.body = body
            var clientRequestId = uuidv4()
            if(process.env.USE_CARMA_CLOUD == "true"){
                var tokenUrl = `https://login.microsoftonline.com/${process.env.CARMA_CLOUD_TENANT_ID}/oauth2/v2.0/token`;
                var authentificationBody =
                    'grant_type=client_credentials'
                    + '&client_id='+encodeURIComponent(process.env.CARMA_CLOUD_CLIENT_ID)
                    + '&client_secret='+encodeURIComponent(process.env.CARMA_CLOUD_CLIENT_SECRET)
                    + '&scope='+encodeURIComponent(process.env.CARMA_CLOUD_SERVER_APP_ID_URI + '.default')

                const parsedTokenUrl = new URL(tokenUrl);
                
                var authentification = {
                    method: 'POST',
                    host: parsedTokenUrl.hostname,
                    path: parsedTokenUrl.pathname,
                    port: parsedTokenUrl.port || 443,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(authentificationBody),
                        'client-request-id': clientRequestId,
                        'return-client-request-id': 'true',
                        'Accept': 'application/json'
                    },
                    body: authentificationBody
                }    
            } else {
                var authentificationBody =
                    'client_id='+encodeURIComponent(process.env.CARMA_CLIENT_ID)
                    + '&client_secret='+encodeURIComponent(process.env.CARMA_CLIENT_SECRET)
                    + '&resource='+encodeURIComponent(process.env.CARMA_RESOURCE)
                    + '&username='+encodeURIComponent(process.env.CARMA_USERNAME)
                    + '&password='+encodeURIComponent(process.env.CARMA_PASSWORD)
                    + '&scope=openid'
                    + '&response_mode=form_post'
                    + '&grant_type=password'
            
                const parsedAdfsUrl = new URL(process.env.ADFS_URL);
                var authentification = {
                    method: 'POST',
                    host: parsedAdfsUrl.hostname,
                    path: parsedAdfsUrl.pathname,
                    port: parsedAdfsUrl.port || 443,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(authentificationBody),
                        'client-request-id': clientRequestId,
                        'return-client-request-id': 'true',
                        'Accept': 'application/json'
                    },
                    body: authentificationBody
                }
            }
            observer.authentification = authentification
            console.log('DEBUG: Requesting token from ' + (process.env.USE_CARMA_CLOUD == "true" ? 'Azure AD' : 'ADFS') + ' with authentification request: ' + JSON.stringify(authentification))
            send(authentification, (err, res, answer)=> {
                if(err){
                    logToSplunk("ERROR: authentification failed." + err, "error")
                    observer.error = err
                    console.log("ERROR: authentification failed. " + err)
                    flush(response, observer)
                }
                else
                {
                    console.log('DEBUG: authentification sucessful. Received response from ADFS: ' + answer)

                    var noticeNumber = JSON.parse(body).noticeNumber
                    var token = JSON.parse(answer).access_token
                    var message = JSON.stringify({
                        rsbc_name: `${moment().format('YYYY_MM_DD_hh_mm_ss')}_${noticeNumber}`,
                        rsbc_payload: body
                    })
                    if(process.env.USE_CARMA_CLOUD == "true"){
                        const parsedCloudUrl = new URL(process.env.CARMA_CLOUD_URL);
                        var notification = {
                            method: 'POST',
                            host: parsedCloudUrl.hostname,
                            path: parsedCloudUrl.pathname,
                            port: parsedCloudUrl.port || 443,
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(message),
                                'OData-MaxVersion': '4.0',
                                'OData-Version': '4.0',
                                'Accept': 'application/json',
                                'Prefer': 'odata.maxpagesize=10'
                            },
                            body: message
                        }
                    }else {
                        const parsedCarmaUrl = new URL(process.env.CARMA_URL);
                        var notification = {
                            method: 'POST',
                            host: parsedCarmaUrl.hostname,
                            path: parsedCarmaUrl.pathname,
                            port: parsedCarmaUrl.port || 443,
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(message),
                                'OData-MaxVersion': '4.0',
                                'OData-Version': '4.0',
                                'Accept': 'application/json',
                                'Prefer': 'odata.maxpagesize=10'
                            },
                            body: message
                        }
                    }
                    observer.sending = notification
                    send(notification, (err, res, message)=> {
                        if (err) {
                            console.log('DEBUG: send failed. ' + err)

                            logToSplunk("ERROR: send failed." + err, "error")
                            observer.error = err
                            flush(response, observer)
                        }
                        else {
                            console.log('DEBUG: send sucessful. Received response from CARMA: ' + message)

                            observer.answer = message
                            response.write(JSON.stringify({
                                message:message,
                                oauthClientRequestId:clientRequestId
                            }))
                            flush(response, observer)
                            logToSplunk("INFO: sendNotification COMPLETED.", "info")
                        }
                    })
                }
            })
        })
    }
}

module.exports = sendNotification
