#!/bin/bash

echo What should the verion be? #chmod +x deploy.sh
read VERSION
echo $VERSION

#docker build -t gera/amadis:$VERSION
#docker push gera/amadis:$VERSION
#ssh root@64.227.13.208 "docker pull gera/amadis:$VERSION && docker tag gera/amadis:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"