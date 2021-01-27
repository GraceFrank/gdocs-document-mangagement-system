# Gdocs Document Management System

A document management system where users can create documents and define who and how documents can be accessed

## Getting Started

you should have the following already
Docker Installed on your computer or have the following:
nodejs, Redis and MongoDb

### Installing/ StartUp

Clone the App

```
git clone https://github.com/GraceFrank/gdocs-document-mangagement-system
```

Before running the app, you have to set environment variables defined in the .env_sample in a .env file

####Starting the App With Docker
All you have to do is run `docker-compose up`

####With Node

```
cd app-directory
npm install
npm start
```

## Running the tests

```
npm test
```

## API endpoints.

| End-Points                    | Functionality                                       |
| :---------------------------- | :-------------------------------------------------- |
| POST /api/login               | Logs a user in.                                     |
| GET /api/users/{id}/documents | Logs a user out.                                    |
| POST /api/users/              | Creates a new user.                                 |
| GET /api/users/               | Find matching instances of user.                    |
| GET /api/users/{id}/documents | Find matching instances of user's unique documents. |
| GET /api/users/me             | Find user.                                          |
| PUT /api/users/{id}           | Update user attributes.                             |
| DELETE /api/users/{id}        | Delete user.                                        |
| POST /api/documents/          | Creates a new document instance.                    |
| GET /api/documents/           | Find matching instances of document.                |
| GET /api/documents/{id}       | Find document.                                      |
| PUT /api/documents/{id}       | Update document attributes.                         |
| DELETE /api/documents/{id}    | Delete document.                                    |
| POST /api/roles/              | Creates a new role instance.                        |
| GET /api/roles/               | returns all roles.                                  |
| GET /api/roles/{id }          | Find role.                                          |
| PUT /api/roles/{id }          | Update document attributes.                         |
| Get /api-docs                 | Api Documentation                                   |

## Built With

- [Express](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
- [Mongoose](https://maven.apache.org/) - ODM

## Authors

- **Grace Frank** - _Initial work_ - [Author](https://github.com/GraceFrank/gdocs-document-mangagement-system)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
