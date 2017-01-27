# Heimdall
> Authentication microservice.

Heimdall is a minimal authentication service tailored for dockerized development and deployment.

*Maintainer: Joel Roxell &lt;joel.roxell@na-kd.com&gt;*

## TOC
<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Dependencies](#dependencies)
- [API](#api)
	- [Post logs](#post-logs)
  - [Register a User](#register-a-user)
  - [Sign in](#sign-in)
  - [Reset User password](#reset-user-password)
- [Development](#development)
	- [Prerequisites](#prerequisites)
	- [Setup](#setup)
	- [Tools & Scripts](#tools-scripts)
- [Environment](#environment)
- [Contributing](#contributing)

<!-- /TOC -->

## Dependencies
- Redis
- MongoDB

## API
This service provides a JSON REST API.

## Routes
| METHOD | URI                  | ERROR CODE | SUCCESS CODE | OUTPUT         |
|:------:|:---------------------|:----------:|:------------:|----------------|
| POST   | /user/register       | 400, 409   | 201          | User           |
| GET    | /user                | 400, 403   | 200          | User           |
| POST   | /user/reset-password | 400, 403   | 200          | User           |
| POST   | /auth/sign-in        | 400, 401   | 200          | Token(encoded) |

### Register a User
**POST /user/register**
Creates a new User

**HEADERS**

Content-Type: `json/application`

**REQUEST BODY**

*NOTE:* both properties must be of type `String`
```json
{
  "email": "user@some-domain.com",
  "password": "someSecretPassword"
}
```

**RESPONSE**

HTTP 201 - *User was created successfully*
```json
{
  "email": "user@some-domain.com"
}
```

HTTP 400 - *Invalid request body*
```json
{
  "error": "request body did not pass validation"
}
```

HTTP 409 - *User Already exists*
```json
{
  "error": "a user with that email already exists"
}
```

### Get User information
**GET /user**
Returns a JSON string containing user information.

**HEADERS**

Content-Type: `json/application`
Authentication: `Bearer {encoded-JWT}`

**RESPONSE**

HTTP 200 - *User was created successfully*
```json
{
  "email": "user@some-domain.com"
}
```

HTTP 403 - *Invalid JWT*
```json
{
  "error": "jwt expired|invalid token"
}
```

### Sign in
**GET /user/sign-in**
Returnes a encoded JWT on success.

**HEADERS**

Content-Type: `json/application`

**RESPONSE**

HTTP 200 - *User signed in successfully*
```json
{
 "token": "{header.payload.signature}"
}
```

HTTP 400 - *Invalid request body*
```json
{
  "error": "request body did not pass validation"
}
```

HTTP 401 - *Invalid credentials*
```json
{
  "error": "authentication failed"
}
```


### Reset User password
**GET /user/reset-password**
Sets a new password for the specific User and returnes the updated User.

**HEADERS**

Content-Type: `json/application`
Authentication: `Bearer {encoded-JWT}`

**RESPONSE**

HTTP 200 - *User was created successfully*
```json
{
  "email": "user@some-domain.com"
}
```

HTTP 400 - *Invalid JWT*
```json
{
  "error": "request body did not pass validation"
}

```
HTTP 403 - *Invalid JWT*
```json
{
  "error": "jwt expired|invalid token"
}
```

## Development
### Prerequisites
To be able to get this project up and running, you'll need:
* Docker
* Docker Compose
* npm

### Setup
Follow these steps to get going:
* `git clone git@github.com:JoelRoxell/heimdall.git`
* `docker-compose up`

The service will now build and run in a Docker container. The codebase is
mounted into the container and the server will be restarted on save.

### Tools & Scripts

| **SCRIPT**            | **USAGE**                                           | **CAVEATS**
|----------------------:|-----------------------------------------------------|-------------
|**npm test**           |Runs all unit tests using mocha                      |The container must be running
|**npm run test:watch** |Runs all unit tests and watches for changes          |The container must be running
|**npm run test:debug** |Runs all unit tests and watches with node --inspect  |The container must be running
|**npm run cov**        |Runs all unit tests and generates coverage           |The container must be running
|**npm run open:cov**   |Opens the code coverage report in the default browser|The container must be running
|**npm run precommit**  |Runs eslint just like the git precommit hook does    |-
|**npm run bash**       |Enters the container with bash                       |The container must be running
|**npm run reinstall**  |Installs dependencies using yarn inside the container|The container must be running

## Environment

| **VARIABLE**         | **DESCRIPTION**                                                       |
|---------------------:|-----------------------------------------------------------------------|
|**NODE_ENV**          | Sets the application to either **production** or **development** mode |
|**SECRET**            | Secret wich is used to sign and verify JWTs                           |
|**SALT_ROUNDS**       | Sets the application to either **production** or **development** mode |
|**TOKEN_TTL**         | Minutes before a token is considered expired                          |

## Contributing
This service has the following standards & workflows:
* Master branch should always be ready to deploy to production
* Pull requests with failing tests will be closed.
* This document should be filled out and up to date.

### Testing
Tests should be easy to read. You can use this standard when writing tests.

```
describe <subject>
	it (the subject) should <act like this> when <this action is performed>
```

Real example:

```js
describe('Request handler', function() {
	it('should return false when receiving invalid payload', function() {
		// ...
	});
});
```
