// backend/routes/analyticsRoute.js
import express from "express";
import {
  newCustomers,
  repeatRate,
  dishRank,
  revenueByWeek,
  popularCombos,
  revenueTotal, 
  dishNameMap,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/new-customers", newCustomers);
router.get("/repeat-rate", repeatRate);
router.get("/top-dishes", (req, res, next) => { req.query.order = "desc"; next(); }, dishRank);
router.get("/least-dishes", (req, res, next) => { req.query.order = "asc"; next(); }, dishRank);
router.get("/revenue-month", revenueByWeek);
router.get("/popular-combos", popularCombos);
router.get("/revenue-total", revenueTotal);
router.get("/dish-name-map", dishNameMap);
export default router;
