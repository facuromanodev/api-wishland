import { Router } from "express";
import paymentController from "../Controllers/payment.controller.js";

const router = Router()

router
    .put('/payment/create-checkout-session', paymentController.createSession)
    .post('/payment/create-account', paymentController.createAccount)
    .get('/payment/success', (req, res) => res.send('success'))
    .get('/payment/cancel', (req, res) => res.send('cancel'))

export default router