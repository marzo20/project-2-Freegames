### Find Game to Play for Free
---

Are you looking for a free game to play? 
Then I can help you find and search by title genre and platforms you use

---

## API
 [Free to game](https://www.freetogame.com/api-doc)
 https://www.freetogame.com/api-doc


---

## ERD


![ERD](ERD.png)


---

## RESTful Routing Chart

| VERB | URL pattern | Action \(CRUD\) | Description |
| :--- | :--- | :--- | :--- |
| GET | / | Show \(Read\) | render homepage |
| GET | /login | Show \(Read\) | render login page |
| GET | /signup | New \(Read\) | render sing up page|
| POST | /signup |Create \(Create\) | create new user database|
| GET | /games | Show \(Read\) | show search page|
| GET | /logout| Show \(Read\) | delete cookies|
| GET | /platform/ | Show \(Read\) | renders all platforms |
| GET | /genre/ | Show \(Read\) | renders all genres|
| GET | /platform/:id |show \(Read\)| shows all the games within selected platform
| GET | /genre/:id | show \(Read\) | shows all the games with selected genre
| GET | /games/:id | show \(Read\) | shows profiles of selected game
| GET | /Saved | show \(Read\) | shows games saved for later
| POST | /saved | create \(create\) | shows profiles of selected game
| GET | /edit/:id | Edit \(Read\) | Edit profile
| put | /Edit/:id| Update \(Update\) | Updates data of user profile
| DELETE | /saved/:id | Destroy \(DELETE\) | Deletes selected game from Saved games for later

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
- Search games by title
- Make Navigate bar for genre and platforms
- Make list for games saved for later

--- 

## Stretch
- Make a list of game that I already played
- Make a comment model and display
- Insert a rating.