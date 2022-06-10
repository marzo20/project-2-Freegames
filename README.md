### Find Game to Play for Free
---

Are you looking for a free game to play? 
Then I can help you find and search by title genre and platforms you use

---

## Link to deployment

- https://freetogame.herokuapp.com/

## Instruction

- Fork and clone repo.
- cd into the repo directory
- 'npm install' to install all packages
- create gitignore and env file 'touch .gitignore .env'
- Echo .env >> .gitignore & echo node_modules >> .gitignore
- migrate db 'sequelize db:migrate'
- 'Code .' to open the folder in VS Code
- Run 'nodemon' to render project
- Go to http://localhost:3000/

## API
 [Free to game](https://www.freetogame.com/api-doc)
 https://www.freetogame.com/api-doc


---

## ERD


![ERD](ERD.png)


---

## RESTful Routing Chart

| VERB | URL pattern | CRUD | Description |
| :--- | :--- | :--- | :--- |
| GET | / | READ | render homepage |
| POST | /users |CREATE | create new user database|
| GET | /users/new | READ | render sing up page|
| GET | /users/login | READ | render login page |
| POST | /users/login | READ | Checks user credentials against db
| GET | /users/logout| READ | logout by deleting cookies|
| GET | /users/profile| READ | Display user data|
| put | /users/profile| UPDATE | Updates data of user profile
| GET | /users/profile/edit | READ | Edit profile
| GET | /search | READ | display search form|
| GET | /search/results | READ | show search results page|
| GET | /genre/ | READ | renders all genres|
| GET | /genre/:id | READ | List games for selected genre
| GET | /platform/ | READ | renders all platforms |
| GET | /platform/:id |READ| list games for selected platform
| GET | /saved | READ | shows games saved for later
| POST | /saved | CREATE | Add game data to db
| DELETE | /saved/:id | DESTROY | Delete selected game from db

---

## User View Wireframe

![Wireframe](Untitled.png)
---

## User Stories
- As a user I want to search free games by title
- As a user I want to see games by category (platforms, genre)
- As a user I want to see each game infomation
- As a user I want to save list of games that I want to play later
- As a user I want to download games

---

## MVP
- Able to sign up
- Able to log in
- Encrypt UserID
- save hased password in DB
- search games by genre and platform
- Make Navigate bar for genre and platforms
- Make list for games saved for later

--- 

## Stretch
- Make a list of game that I already played
- Make a comment model and display
- Insert a rating.