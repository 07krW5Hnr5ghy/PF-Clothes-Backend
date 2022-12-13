const { Router } = require("express");
const router = Router();
const getReviewById = require("./Controllers/getReviewById");
const putReview = require("./Controllers/putReview");
const deleteReview = require("./Controllers/deleteReview");

//Trae review por id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await getReviewById(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const review = req.body;
  try {
    const response = await putReview(id, review);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await deleteReview(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
