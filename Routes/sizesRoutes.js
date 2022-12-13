const { Router } = require("express");
const router = Router();
const { getSizes } = require("./Controllers/getSizes");

// rutas sizes
router.get("/", getSizes);

module.exports = router;
