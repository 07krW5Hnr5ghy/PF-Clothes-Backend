const {server} = require("./app");
const { conn, profilesCreator } = require("./DataBase/db");
require("dotenv").config();
const {api} = require("./app");

const db = conn;

db.sync({ force: true }).then(() => {
  server.listen(process.env.PORT, async () => {
    console.log(api);
    try {
      //await profilesCreator();
      db.authenticate().then(() => console.log("database connected"));
      console.log("Server is up, at port ", process.env.PORT);
    } catch (error) {
      console.log(
        "Ocurrio un error durante el inicio del servidor: " + error.message
      );
    }
  });
});
