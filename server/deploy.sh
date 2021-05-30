#!/bin/bash

echo What should the verion be? #chmod +x deploy.sh
read VERSION
echo $VERSION

docker build -t gggfox/amadis:$VERSION .
docker push gggfox/amadis:$VERSION
ssh gera@52.168.30.144 "sudo docker pull gggfox/amadis:$VERSION && sudo docker tag gggfox/amadis:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"