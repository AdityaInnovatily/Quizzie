const { saveResults } = require("./resultService");
const router = require("express").Router();

router.post("/saveResult", saveResults);

module.exports = router;
