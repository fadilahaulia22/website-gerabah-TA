import express from "express";
import { createPayment } from "../controller/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/", createPayment);

export default paymentRoutes;
