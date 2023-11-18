import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Up and Running...");
});

export default router;
