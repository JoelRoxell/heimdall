# Heimdall
> Authentication microservice.

Heimdall is a minimal authentication service tailored for dockerized development and deployment.

## Core technologies
- Node.js
- MongoDB
- Redis
- JWT

## API reference
TODO

## Usage

### Scripts
| **SCRIPT**            | **USAGE**                                           | **CAVEATS**
|----------------------:|-----------------------------------------------------|-------------
|**npm test**           |Runs all unit tests using mocha                      |The container must be running
|**npm run test:watch** |Runs all unit tests and watches for changes          |The container must be running
|**npm run cov**        |Runs all unit tests and generates coverage           |The container must be running
|**npm run open:cov**   |Opens the code coverage report in the default browser|The container must be running
|**npm run precommit**  |Runs eslint just like the git pre-commit hook does    |-
|**npm run bash**       |Enters the container with bash                       |The container must be running
|**npm run reinstall**  |Installs dependencies using yarn inside the container|The container must be running

## Development environment
* Support for ES6 (container runs Node 7 with --harmony-async-await).
* Process restarts on change (using [nodemon](https://github.com/remy/nodemon)).
* ESlint configuration extended from Google.
* Debug with Chrome Developer Tools using port 9222.
* Unit testing using [mocha](https://github.com/mochajs/mocha).
* Generate code coverage reports using [istanbul nyc](https://github.com/istanbuljs/nyc).

## Setup & Usage
* Install development dependencies with `npm install` (linter configs, pre-commit hooks)
* Start the container with `docker-compose up`

Restart the container when installing new dependencies in package.json
(or run `yarn` after entering container with `npm run bash`)

### Build process
Unit tests executes when building the Docker image. Failing tests will prevent
the image from being built.

Summary of Docker build sequence:
1. Copy app into container
2. Install yarn
3. Install dependencies
4. Run unit tests
5. Remove development dependencies
6. Start container

When container is started, the entry point script will simply start the
application if it´s the production environment. Otherwise it will install
the development dependencies again, and start the server with nodemon and
debugging server.

Yarn is used instead of npm to quickly install and remove dependencies between
environments without hitting the network.

Since the node_modules directory isn´t shared between the host and container,
you must restart the container, or run `npm run reinstall` in order to install
new dependencies in the container.

### Based on microservice project: [dompen](https://github.com/zappen999/dompen)
