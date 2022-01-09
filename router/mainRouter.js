import express from "express";
import { main, search } from "../controller/mainController.js";

export const mainRouter = express.Router();

mainRouter.get('/', main);
mainRouter.get('/search', search);