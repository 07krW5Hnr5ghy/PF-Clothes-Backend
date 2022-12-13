const { Router } = require("express");
const router = Router();
//Controllers
const getVariant = require("./Controllers/getVariant");
const putVariant = require("./Controllers/putVariant");
const deleteVariant = require("./Controllers/deleteVariant");
const { reduceStock, addStock } = require("./Controllers/variantsStock");
const { route } = require("./activateRoutes");

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await getVariant(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.patch("/stock/:id", async (req, res) => {
  const id = req.params.id;
  let cant = req.query.cant;
  const order = req.query.order;
  cant = parseInt(cant);
  try {
    if (order === "add") {
      const response = await addStock(id, cant);
      res.status(200).send(response);
    } else if (order === "reduce") {
      const response = await reduceStock(id, cant);
      res.status(200).send(response);
    } else {
      res.status(404).send("Orden incorrecta");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await putVariant(id, req.body);
    console.log("response = ", response);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await deleteVariant(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
