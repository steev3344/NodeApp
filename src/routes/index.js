const express = require("express");
const router = express.Router();

const userRouter = require("../../src/user");
const productRouter = require("../../src/product");


router.use("/user", userRouter);
router.use("/product", productRouter);


module.exports = router;
