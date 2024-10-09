import { Router } from "express";
import { InfoSerivce } from "./info.service.js";

const router = Router()

const infoService = new InfoSerivce()

router.get('/', async (req, res) => {    
    const data = await infoService.getInfo(req.query.start_from_page)    
    res.json(data).status(200) 
})

export const infoRouter = router