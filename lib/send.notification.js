const { basic } = require('../support/basic.auth' )
const { bodyOf } = require('../support/body.of.request')
const { send } = require('../support/https.request')
const flush = require('./flush')
const url = require('url')
const https = require('https')
const uuidv1 = require('uuid/v1')
const moment = require('moment')

const sendNotification = (req, response, observer) => {
    //console.log('DEBUG: SendNotification Called')
    var SplunkLogger = require("splunk-logging").Logger;

    var config = {
        token: "4b95ebfc-c50b-44f9-b46b-d3b108ee5910",
        url: "https://sandboxhec.monitoring.ag.gov.bc.ca:8088/services/collector"
    };

    var Logger = new SplunkLogger(config);

    var payload = {
        // Message can be anything; doesn't have to be an object
        "DEBUG Splunk Logging from CARMA"
    };

    console.log("Sending payload", payload);
    Logger.send(payload, function (err, resp, body) {
        // If successful, body will be { text: 'Success', code: 0 }
        console.log("Response from Splunk", body);
    });

    var expected = basic(process.env.API_USERNAME, process.env.API_PASSWORD)
    response.setHeader('content-type', 'application/json')
    if (req.headers['authorization'] !== expected) {
        response.statusCode = 401
        flush(response, observer)
    }
    else {
        bodyOf(req, (body)=>{
            observer.body = body
            var clientRequestId = uuidv1()
            var authentificationBody =
                       'client_id='+encodeURIComponent(process.env.CARMA_CLIENT_ID)
                     + '&client_secret='+encodeURIComponent(process.env.CARMA_CLIENT_SECRET)
                     + '&resource='+encodeURIComponent(process.env.CARMA_RESOURCE)
                     + '&username='+encodeURIComponent(process.env.CARMA_USERNAME)
                     + '&password='+encodeURIComponent(process.env.CARMA_PASSWORD)
                     + '&scope=openid'
                     + '&response_mode=form_post'
                     + '&grant_type=password'
            var authentification = {
                method: 'POST',
                host: url.parse(process.env.ADFS_URL).hostname,
                path: url.parse(process.env.ADFS_URL).pathname,
                port: url.parse(process.env.ADFS_URL).port,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(authentificationBody),
                    'client-request-id': clientRequestId,
                    'return-client-request-id': 'true',
                    'Accept': 'application/json'
                },
                body: authentificationBody
            }
            observer.authentification = authentification
            send(authentification, (err, res, answer)=> {
                if(err){
                    observer.error = err
                    console.log("ERROR: Authentication failure. " + err)
                    flush(response, observer)
                }
                else
                {
                    var noticeNumber = JSON.parse(body).noticeNumber
                    var token = JSON.parse(answer).access_token
                    var message = JSON.stringify({
                        rsbc_name: `${moment().format('YYYY_MM_DD_hh_mm_ss')}_${noticeNumber}`,
                        rsbc_payload: body
                    })
                    var notification = {
                        method: 'POST',
                        host: url.parse(process.env.CARMA_URL).hostname,
                        path: url.parse(process.env.CARMA_URL).pathname,
                        port: url.parse(process.env.CARMA_URL).port,
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
                    observer.sending = notification
                    send(notification, (err, res, message)=> {
                        if (err) {
                            observer.error = err
                            flush(response, observer)
                        }
                        else {
                            observer.answer = message
                            response.write(JSON.stringify({
                                message:message,
                                oauthClientRequestId:clientRequestId
                            }))
                            flush(response, observer)
                        }
                    })
                }
            })
        })
    }
}

module.exports = sendNotification
