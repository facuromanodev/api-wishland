import { Router } from "express";
import userController from "../Controllers/user.controller.js"  
import upload from '../Functions/imageHelper.js';
import convertToWebp from "../Functions/imageComp.js";

const router = Router()

router
    .get("/users", userController.getAll)

    .get("/users/:username", userController.getOne)

    .post("/users/login", userController.login)

    .post("/users", upload.single('image'), convertToWebp, userController.create)

    .put("/users/:username",  userController.update)

    .put("/users/:username/bannerimage", upload.single('bannerImage'), convertToWebp, userController.updateBannerPhoto)
    .put("/users/:username/profileimage", upload.single('profileImage'), convertToWebp, userController.updateProfilePhoto)

    .put("/users/changePassword/:username", userController.updatePassword)

    .delete("/users/:username", userController.deleteOne);

export default router