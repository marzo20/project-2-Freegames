table:users

email: VARCHAR(255)
password: VARCHAR(255)


sequelize model:create --name game --attributes title:string,gameUrl:string,description:string
sequelize model:create --name category --attributes gameId:integer,genre:string,platform:string
sequelize model:create --name user --attributes loginId:string,password:string,nickname:string

sequelize model:create --name savedgame --attributes gameId:integer,userId:integer,title:string,game_url:string,thumbnail:string