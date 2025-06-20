import express from "express";
import { createCustomOrder, getOrderCustomRoutes, jumlahCustomOrder, updateCustomOrderStatus} from "../controller/orderCustom.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const orderCustomRoutes = express.Router();

orderCustomRoutes.post("/custom-orders",authenticateToken, upload.single("customImage"), createCustomOrder);
orderCustomRoutes.put("/custom-orders/:id/status", authenticateToken, updateCustomOrderStatus);
orderCustomRoutes.get("/getCustom-orders",authenticateToken, getOrderCustomRoutes);
orderCustomRoutes.get("/jumlah-custom-order",jumlahCustomOrder);
export default orderCustomRoutes;
