oc create -f image.json
oc create -f build.json
oc set triggers buildconfigs/carma-vip-adaptor --from-github
echo "building..."
sleep 15
oc describe builds carma-vip-adaptor | grep Status
oc new-app carma-vip-adaptor:latest
echo "exposing..."
oc expose svc/carma-vip-adaptor
