import express from "express";
import { register, login, addtohistory, getuserhistory } from "../controllers/usercontroler.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addtohistory);
router.route("/get_all_activity").post(getuserhistory);

export default router;
