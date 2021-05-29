yarn watch
yarn dev
redis-server
yarn create:migration //entity migration
graphql -> "request.credentials": "include" // cookie sotrage

sudo -u postgres -i
createdb amadis
psql postgres --password

how to make migrations

docker
build -t gera/amadis:test .
build -t user/project_name:version_name project_directory

clinet
yarn gen //genrate graphql mutation hook

update environment variables
npx gen-env-types .env -o src/env.d.ts -e .

# create typeorm migrations
npx typeorm migration:create -n MockPosts
npx typeorm migration:generate -n Initial

Recordar que debes tener en client el archivo .env.local
este archivo debe contener el url para conectarte con el backend NEXT_PUBLIC_API_URL = url:port\graphql

En .env cambiar la información para que se conecte con tu base de datos local DATABASE_URL= //user:password@localhost:port/dbName


# docker dev
//docker build -t docker_username/project_name:version
docker build -t gggfox/amadis:version
// should have image created at docker hub
docker push gggfox/amadis:version

# docker prod (ssh)
sudo docker pull gggfox/amadis:version
sudo docker tag gggfox/amadis:version dokku/api:version
dokku tags:deploy api latest


# dokku
postgres
redis
letsencrypt 
//https://github.com/dokku/dokku-letsencrypt
## dokku-comands
dokku domains:report 