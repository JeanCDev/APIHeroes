docker ps - mostra os processos do docker na máquina

________________________________________________
## Criando uma nova imagem com o docker e postgres
________________________________________________

docker run --name postgres -e POSTGRES_USER=jeancdev -e POSTGRES_PASSWORD=19029696 -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

________________________________________________
## Criando uma nova imagem com o docker e mongodb
________________________________________________

docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=19029696 -p 27017:27017 -d mongo:4

__________________________________
## Executa a instância do docker para o postgres
__________________________________
docker exec -it postgres /bin/bash

__________________________________
## Executa a instância do docker para o mongodb
__________________________________
docker exec -it mongodb mongo --host localhost -u admin -p 19029696 --autenticationDatabase admin --eval "db.getSiblingDB('heroes').createUser({user: 'jeancdev', pwd: '19029696', roles:[{role: 'readWrite', db: 'heroes'}]})"

__________________________________
## Executar instância concorrente do postgres
__________________________________
docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer
__________________________________
## Executar instância concorrente do mongodb
__________________________________
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
