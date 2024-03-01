import { Router } from 'express';
import wishController from '../Controllers/wish.controller.js'  
import upload from '../Functions/imageHelper.js';
import convertToWebp from '../Functions/imageComp.js';
const router = Router()

router
    .get("/wish", wishController.getAll)

    .get("/wish/:id", wishController.getOne)

    .get("/userwish/:username", wishController.getByUser)

    .post("/wish", upload.single('image'), convertToWebp, wishController.create)

    .put("/wish/:id", upload.single('image'), convertToWebp, wishController.update)

    .delete("/wish/:id", wishController.deleteOne);

export default router