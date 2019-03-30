
Official repository of Xunbao, one of the pre-fest events organized at YMCAUST Faridabad before the annual fest 'Elements Culmyca'.

## Installation

You must have [Node.js](https://nodejs.org/) version 10.x installed in order to run this.

## For node version

```sh
node -v
```

Install the dependencies and devDependencies and start the server.

```sh
$ cd Xunbao-19
$ npm install
$ npm start
```

or
On Linux

```sh
$ chmod +x ./start.sh
$ ./start.sh
```
---
# Project Structure

## Frontend

```
├── frontend
│   ├── dist
│   │   └── index.html
│   ├── index.js
│   ├── package.json
│   ├── src
│   │   ├── components
│   │   ├── index.js
│   │   └── pages
│   └── webpack.config.js
├── gitignore
├── package.json
 ── README.md
```
---
## Backend

```
.── backend
    ├── app
    │   ├── controller
    │   │   ├── admin
    │   │   │   └── index.js
    │   │   ├── app
    │   │   │   └── index.js
    │   │   ├── home
    │   │   │   └── index.js
    │   │   ├── index.js
    │   │   ├── leadersboard
    │   │   │   └── index.js
    │   │   ├── questions
    │   │   │   └── index.js
    │   │   └── user
    │   │       └── index.js
    │   ├── helper
    │   └── models
    │       ├── answer.js
    │       ├── index.js
    │       ├── question.js
    │       └── user.js
    ├── index.js
    └── lib
        ├── admin
        │   └── index.js
        ├── home
        │   └── index.js
        ├── leaderboard
        │   └── index.js
        ├── questions
        │   └── index.js
        └── user
            └── index.js
```
---

# Postman Docs

The postman documentation can be found at [Postman Doc](https://documenter.getpostman.com/view/6565104/Rztpp7JS)

# Creating ADMIN

```sh
$ ADMIN_PASSWORD=i_hAte_woRld ADMIN_EMAIL=randomBytes@gmail.com node ./backend/scripts/createAdmin.js
```
---
