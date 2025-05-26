import { Router } from "express";
import { verifyJWT } from "../middleware/authmiddleware.js";
import {
    registerUser,
    loginuser,
    logoutuser,
    refreshaccesstoken,
    changecurrectuserpassword,
    getcurrectuser,
    updateaccount
} from "../controllers/usercontroler.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT, logoutuser);
router.route("/refresh-token").post(refreshaccesstoken);
router.route("/change-password").post(verifyJWT, changecurrectuserpassword);
router.route("/current-user").get(verifyJWT, getcurrectuser);
router.route("/update-account").patch(verifyJWT, updateaccount);

export default router;
