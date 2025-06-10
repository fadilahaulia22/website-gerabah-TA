// routes/visitRoutes.js
import express from "express";

import { authenticateToken } from "../middleware/authMiddleware.js"; // tambahkan middleware jika ingin membatasi akses
import { addVisitPayment, 
        createVisit, 
        getAllVisitPayments, 
        getAllVisits, 
        updatePaymentStatus } 
from "../controller/visitController.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";

const visitRoutes = express.Router();

// Kunjungan
visitRoutes.post("/", optionalAuthMiddleware, createVisit);
visitRoutes.get("/", authenticateToken, getAllVisits);
visitRoutes.put("/payment-status/:id", authenticateToken, updatePaymentStatus);

// Pembayaran kunjungan
visitRoutes.post("/payment", authenticateToken, addVisitPayment);
visitRoutes.get("/payment", authenticateToken, getAllVisitPayments);

export default visitRoutes;