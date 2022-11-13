## Comandos usados

`docker-compose up` starta o container

`docker-compose up --build` starta o container com novas modificacoes

`docker-compose exec app bash` entra no terminal do container

on windows use `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"` to configure bash as default npm script shell

obs: casos de uso, ja são serviços, ou seja, não precisa do arquivo de services do nestjs. Foram usados no curso apenas para exemplificação.
no clean arch usam usecases, no ddd, usam mais services

Conectar no banco de dados via command line:

- docker compose exec db bash
- mysql -u root -p
- use micro_videos;
- select \* from categories;
