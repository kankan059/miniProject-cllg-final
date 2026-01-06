"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentControllers_1 = require("../controllers/paymentControllers");
const router = (0, express_1.Router)();
router.post("/create-order", paymentControllers_1.createOrder);
router.post("/verify", paymentControllers_1.verifyPayment);
exports.default = router;
