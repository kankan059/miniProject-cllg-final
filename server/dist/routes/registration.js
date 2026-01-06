"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const regitstrationControllers_1 = require("../controllers/regitstrationControllers");
const router = express_1.default.Router();
router.post("/", regitstrationControllers_1.createRegistration);
router.get("/event/:eventId", regitstrationControllers_1.getRegistrationsByEvent);
router.get("/myRe", regitstrationControllers_1.getMyRegistrations);
exports.default = router;
