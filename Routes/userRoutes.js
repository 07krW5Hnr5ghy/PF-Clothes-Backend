const { Router } = require("express");
var bcrypt = require("bcryptjs");
const { profile } = require("../DataBase/db");
const router = Router();
const jwt = require("jsonwebtoken");
//utils
const url = require("./Utils/imageUploader");
//Controladores
const addProductsToLists = require("./Controllers/addProductsToLists");
const deleteProductsOfList = require("./Controllers/deleteProductsOfList");
const addReview = require("./Controllers/addReview");
const getReview = require("./Controllers/getReviews");
const getAvrg = require("./Controllers/avrgScore");
const { getToken } = require("./Utils/getToken");
const getShoppingcart = require("./Controllers/getShoppingcart");
const getFavoritesList = require("./Controllers/getFavoritesList");
const patchProfile = require("./Controllers/patchProfile");
const postMarketedProducts = require("./Controllers/postMarketedProducts");
const getSelledProducts = require("./Controllers/getSelledProducts");
const onSell = require("./Controllers/getOnSell");
const passport = require("passport");
const nodemailer = require("nodemailer");
const cloudinary = require("../Routes/Utils/cloudinary");
const modifyProfile = require("./Controllers/ModifyProfile");
// crear usuario
router.post("/", async (req, res) => {
  let {
    name,
    mail,
    username,
    password,
    phone,
    storeName,
    banner,
    profilePicture,
    location,
    favorites,
    shoppingCart,
  } = req.body;
  //Image uploaders
  try {
    profilePicture = await url(req.files["profilePicture"][0].path);
  } catch (error) {
    profilePicture =
      "https://res.cloudinary.com/pfclothhenry2022/image/upload/v1666385099/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture_rgmldn.webp";
  }
  try {
    banner = await url(req.files["banner"][0].path);
  } catch (error) {
    banner = null;
  }
  //
  let passwordHash = await bcrypt.hash(password, 8);

  if (!favorites) favorites = [];
  if (!shoppingCart) shoppingCart = [];

  try {
    try {
      let [user, created] = await profile.findOrCreate({
        where: {
          name,
          mail,
          password: passwordHash,
          phone,
          username,
          storeName,
          banner,
          profilePicture,
          location,
          favorites,
          shoppingCart,
        },
      });
      if (user) {
        // token and link
        const secret = process.env.SECRET + user.password;
        const token = jwt.sign({ email: user.mail, id: user.id }, secret, {
          expiresIn: 60 * 60 * 24,
        });
        const link = `${
          process.env.BACKEND || "http://localhost:3001"
        }/auth/verify/${user.id}/${token}`;
        // mail
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        console.log("email :",process.env.EMAIL);
        console.log("pass: ",process.env.EMAIL_PASSWORD);
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.mail,
          subject: "Verificacion de usuario",
          text: `Bienvenido ${user.name}, gracias por registrarte para terminar el proceso
            de registro ingresa en el siguiente link para verificar tu cuenta ${link} el link
            tendra un tiempo de expiracion de un dia.
            Atentamente equipo de express clothes`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.send("Usuario creado");
      }
    } catch (error) {
      throw Error(error.message);
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
});
//Modify profile
router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const response = await patchProfile(req, res);
      res.send(response);
    } catch (error) {
      res.send(error);
    }
  }
);
router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const response = await modifyProfile(req, res);
      res.send(response);
    } catch (error) {
      res.send(error);
    }
  }
);

router.post("/image", async (req, res) => {
  //console.log(req.body);
  const { image } = req.body;
  const uploadedImage = await cloudinary.uploader.upload(
    image,
    {
      upload_preset: "yvjjtrzu",
      public_id: `algo`,
      allowed_formats: ["png", "jpg", "jpeg"],
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    }
  );

  try {
    res.status(200).json(uploadedImage);
  } catch (err) {
    res.send(err.message);
  }
});
//add elements to favorites
router.put(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productID, profileID } = req.query;
    try {
      const response = await addProductsToLists(productID, profileID, "fav");
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

//add elements to shoppingcart
router.put(
  "/shoppingcart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productID, profileID } = req.query;
    try {
      const response = await addProductsToLists(productID, profileID, "shop");
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);
//remove elements of favorites
router.delete(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productID, profileID } = req.query;
    try {
      const response = await deleteProductsOfList(productID, profileID, "fav");
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);
//remove elements of the shopping card
router.delete(
  "/shoppingcart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productID, profileID } = req.query;
    try {
      const response = await deleteProductsOfList(productID, profileID, "shop");
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);
//get all elements of the shopping card
router.get(
  "/shoppingcart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { profileID } = req.query;
    try {
      const response = await getShoppingcart(profileID);
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

//get all elements of the favorites list
router.get(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { profileID } = req.query;
    try {
      const response = await getFavoritesList(profileID);
      res.status(200).send(response);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

//Request data from user
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { secret_token } = req.query;
    const decodedToken = jwt.verify(secret_token, process.env.SECRET);
    try {
      let user = await profile.findByPk(decodedToken.id);
      return res.send(user);
    } catch (err) {
      res.send(err.message);
    }
  }
);
router.get("/getProfile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let user = await profile.findByPk(id);
    return res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});

//Trae las reviews al usuario
router.get("/review/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await getReview(id, "profile");
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
//Trae el promedio de puntaje del usuario
router.get("/review/avrg/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await getAvrg(id, "profile");
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//Traer reviews de un usuario
router.post("/review/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await addReview(id, req.body, "profile");
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/purchase", async (req, res) => {
  const id = req.query.id;
  try {
    const response = await postMarketedProducts(id, req.body);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//trae todos los productos vendidos
router.get("/sells/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await getSelledProducts(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
//trae todos los productos vendidos
router.get("/onSell/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await onSell(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
