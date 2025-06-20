import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getStaffProfitShareMonthly, getVisitForStaff } from "../controller/pokdarwisController.js";


const pokdarwisDashboardRoutes = express.Router();

pokdarwisDashboardRoutes.get("/visits", authenticateToken, getVisitForStaff);
pokdarwisDashboardRoutes.get("/bagihasil", authenticateToken, getStaffProfitShareMonthly);

export default pokdarwisDashboardRoutes;
