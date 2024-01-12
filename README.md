<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Este proyecto fue hecho con NestJs.</p>
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



# Como correr el proyecto

<p align="center">Una vez se ha descargado, favor de ver el archivo de <strong>env.example</strong><p>

<p align="center">Que contendrá lo siguiente<p>

```
# General Config
NODE_ENV=development
PORT=8000

# Database
DATABASE_DEVELOPMENT=postgresql://postgres:12345@api_pg_db:5432/interview_ian_v
# DATABASE_DEVELOPMENT=postgresql://postgres:12345@localhost:7033/interview_ian_v    # -> Use this IF u do npm install locally, but use the db on docker
DATABASE_TEST=postgresql://user:pass@localhost/dbname
DATABASE_URL=postgresql://user:pass@localhost/dbname

# Authentication
SECRET_TOKEN=12345
SECRET_ADMIN_TOKEN=u85ErHYcu546
    # Use this as Bearer Token for admin routes -->  YWRtaW5fdG9rZW46dTg1RXJIWWN1NTQ2

```

<p align="center">Simplemente se tiene que <strong>borrar</strong> el <strong>.example</strong> del archivo o crear otro nuevo<p>

<p align="center">(Quería replicar lo más que pudiera el proceso de development)<p>

## Docker Compose

<p align="center">Una vez teniendo el archivo <strong>.env</strong>, asumiré que se dejará con las configuraciones por default<p>

<p align="center">La <strong>Database</strong> estará <strong>levantada</strong> en <strong>docker</strong> junto con la <strong>API</strong><p>

<p align="center">Les dejaré el comando completo por si quieren hacer un cambio en el código y levantar docker la API de nuevo<p>

<p align="center">La <strong>DB</strong> tiene un <strong>Volume</strong> así que no pasa nada si se <strong>destruye</strong> el <strong>contenedor</strong><p>

```
docker-compose up -d --build --force-recreate
```

<p align="center">Si todo está por default, podremos visualizar la <strong>documentación</strong> en el <strong>puerto 8000</strong> y ruta <strong>/docs</strong>: --> <strong>http://localhost:8000/docs</strong><p>

## Migraciones

<p align="center">Dejé <strong>2 scripts</strong> en el package.json. Uno para correr las migraciones y el otro para hacer drop de todas estas<p>

<p align="center">Dentro del contenedor se tiene que correr el siguiente comando<p>

```
npm run db:migrations
```

<p align="center">Se puede <strong>entrar al contenedor</strong> con la aplicación de <strong>Docker Desktop</strong> (windows y mac)<p>

<p align="center">O, en la <strong>ubicación del proyecto</strong> (a nivel del docker-compose) escribir<p>

```
docker ps 
```
<p align="center">Para obtener el ID del contenedor, y después<p>

```
docker exec -it CONTAINER_ID npm run db:migrations 
```

<p align="center">Para correr las migraciones<p>

<p align="center">Y para <strong>deshacer las migraciones</strong>, es con el comando:<p>

```
npm run db:migrations-undoall
```

## Insomia (Collección de Endpoints)

<p align="center">También dejé un <strong>JSON</strong> para tener una idea clara de la lógica de negocio existente y (datos en los endpoints listos para usarse)<p>

<p align="center">Con la herramienta de <strong>Insomia</strong> se puede <strong>importar</strong> y apreciar<p>

## Requerimientos

<p align="center">La lista de requerimientos que logré hacer es la siguiente<p>

<ul align="center">
  <li>Utiliza Node.js y Express.js para construir el backend✅.
</li>
  <li>Emplea Sequelize como ORM para interactuar con la base de datos✅.
</li>
  <li>Implementa Docker para contenerizar la aplicación y la base de datos✅.
</li>
  <li>Establece un sistema de autenticación utilizando JWT (JSON Web Tokens).✅
</li>
  <li>Crea rutas API para realizar operaciones de visualización y asignación de
inversiones✅
</li>
  <li>Implementa tres endpoints principales (registro, login,  Visualización y asignación de oportunidades de inversión✅)
</li>
  <li>Utiliza validación de datos en las rutas para garantizar la integridad de los datos✅
</li>
  <li>Asegura que las contraseñas de los usuarios se almacenen de manera segura
utilizando hashing✅
</li>
  <li>Agrega la posibilidad de retirar inversiones.
✅
</li>
</ul>

.
.
.
<p align="center">Las que no me dió tiempo de hacer y/o no comprendí fueron las siguientes<p>

<ul align="center">
  <li>Crea una interfaz de usuario simple (puede ser una página web o una aplicación de
línea de comandos) para interactuar con las rutas API ⛔
</li>
  <li> <strong>Razón:</strong> Swagger tiene una excelente página de visualización, no lo vi necesario (por el tiempo)
</li>
-
  <li> Implementar pruebas unitarias y de integración ⛔
</li>
  <li> <strong>Razón:</strong> Tiempo más que nada. NestJs tiene buenas herramientas con Jest para hacerlo bien
</li>
-
  <li> Implementa un sistema de notificaciones para informar a los usuarios sobre cambios en
sus inversiones. ⛔
</li>
  <li> <strong>Razón:</strong> Tiempo tambien
</li>
-
  <li> documentación que describa las rutas API, sus parámetros y <strong>respuestas</strong>
correspondientes. ⛔
</li>
  <li> <strong>Razón:</strong> Tiempo. solo me faltaron las <strong>respuestas</strong> de algunos endpoints si recuerdo bien
</li>
-
  <li> Es importante destacar que las oportunidades de inversión deberán presentar montos
comprendidos entre $40,000.00 y $600,000.00 MXN ⛔
</li>
  <li> <strong>Razón:</strong> Tiempo y Dudas. No comprendí esa parte si soy honesto 😅. Me faltó preguntar, my bad i guess 🙈.
</li>
-
</ul>

Todo lo demás por lo que recuerdo está en regla (si no me equivoco jaja)

Sin más que escribir, espero su respuesta 🙌