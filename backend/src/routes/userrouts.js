const express=require("express");
const router=express.Router();

router.route("/login");
router.route("/register");
router.route("/add_to_activity");
router.route("/get_all_activity");


module.exports =router;

