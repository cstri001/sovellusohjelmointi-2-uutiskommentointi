import express from "express";
import { Prisma, PrismaClient, uutinen } from "@prisma/client";

const prisma : PrismaClient = new PrismaClient();
const apiUutisetRouter : express.Router = express.Router();

apiUutisetRouter.get('/', async (req : express.Request, res : express.Response) : Promise<void> => {
  res.json(await prisma.uutinen.findMany())
})

export default apiUutisetRouter;