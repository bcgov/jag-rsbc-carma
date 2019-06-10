#!/bin/sh

oc create -f image.json
oc create -f build.json
oc set triggers buildconfigs/carma-vip-adaptor --from-github

echo "build status:"
unset COMPLETE
oc describe builds carma-vip-adaptor | grep Status
while [[ ${#COMPLETE} -eq 0 ]]
do
    sleep 3
    oc describe builds carma-vip-adaptor | grep Status
    COMPLETE=`oc describe builds carma-vip-adaptor | grep Complete`
done

oc new-app carma-vip-adaptor:latest
echo "exposing..."
oc expose svc/carma-vip-adaptor

echo "starting app..."
sleep 5
oc get routes
APP=`oc get routes | grep carma-vip-adaptor | cut -f 4 -d ' '`
curl $APP/ping | json_pp 

echo ""
