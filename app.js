const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./Routes/index");
const { logger } = require("./Routes/Utils/logger");
const { errorHandler } = require("./Routes/Utils/errorHandler");
const passport = require("passport");
const mercadopago = require("mercadopago");
const { payment, merchant_orders } = require("mercadopago");

require("dotenv").config();

const cookieParser = require("cookie-parser");
const session = require("express-session");

require("./Auth/verify-token");
require("./Auth/GoogleSSO");

const server = express();

server.name = "API";

server.use(morgan("dev"));

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
console.log(process.env.FRONTEND);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://spring-bud-giraffe-fez.cyclic.app"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,Set-Cookie"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,OPTIONS, PUT, DELETE"
  );
  next();
});

/*server.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);*/

server.get("/", (req, res, next) => {
  //console.log(req.session);
  //console.log(req.sessionID);
  res.send(process.env.FRONTEND);
});

//Ruta que dirige a la pestaña de mercadopago para pagar
server.post("/generar/:id", (req, res, next) => {
  const data = req.body;
  const { id } = req.params;

  const arreglo = [];
  for (let i = 0; i < data.length; i++) {
    arreglo.push({
      id: data[i].variantID,
      title: data[i].name,
      unit_price: data[i].price,
      quantity: 1,
    });
  }

  let preference = {
    items: arreglo,
    back_urls: {
      success: `${process.env.FRONTEND}/home`,
      pending: `${process.env.FRONTEND}/home`,
      failure: `${process.env.FRONTEND}/home`,
    },
    //Cuando el usuario aprieta el boton de comprar se acciona este link
    notification_url: `https://77be-190-31-34-143.sa.ngrok.io/payment/notificar/${id}`,
  };

  //Enviamos al front la url donde tiene que redirigir al usuario cuando clickea comprar en el carrito
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.send(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//Ruta para redirigir el usuario luego de que la compra fue exitosa
server.get("/success", (req, res, next) => {
  res.send("TODO SALIO BIEN");
});

//Ruta para traerme la data que quiero cuando el usuario aprieta comprar
// server.post("/notificar", async (req, res, next) => {
//   const query = req.query;
//   const topic = query.topic;

//   switch (topic) {
//     case "payment":
//       const paymentId = query.id;
//       const payment = await mercadopago.payment.findById(paymentId);
//       console.log(payment.body.additional_info.items);
//       res.send(payment);
//       break;
//     default:
//       break;
//   }
// });

//Token del usuario de prueba vendedor de mercadopago
mercadopago.configure({
  access_token:
    "APP_USR-3893474685008819-102513-18f45e4330eab9e0b1cbfc72f531cf92-1224963305",
});

server.use(passport.initialize());
//server.use(passport.session());

server.use("/", routes);
server.use(logger);

// Error catching endware.
server.use(errorHandler);

module.exports = server;
