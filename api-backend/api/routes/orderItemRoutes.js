import express from "express";
import { createOrderItem, getOrderItemsByOrderId } from "../controller/orderItemController.js";


const orderItemRoutes = express.Router();
orderItemRoutes.post("/", createOrderItem);
orderItemRoutes.get("/order/:orderId", getOrderItemsByOrderId); 

export default orderItemRoutes;