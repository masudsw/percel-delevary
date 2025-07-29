import { Router } from "express";

const router=Router()
router.post('/login',AuthController.login)