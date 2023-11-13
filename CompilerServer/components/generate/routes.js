const express = require("express");
const controller = require("./controller");
const controllerDown = require("./controllesDown");

const router = express.Router();

router.post('/code-tree', controller.genTreeDir);
router.post('/code-assm', controller.genAssm);
router.post('/download/code-tree', controllerDown.downTreeDir);
router.post('/download/code-assm', controllerDown.downAssm);



module.exports = router;