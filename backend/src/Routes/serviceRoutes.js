import express from "express"
import { getAllServices,getServiceById,createService, updateService ,deleteService} from "../Controllers/serviceController.js";

const router=express.Router();

router.get("/",getAllServices);
router.get("/:id",getServiceById);
router.post("/",createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
