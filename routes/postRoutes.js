import express from 'express';
import { createPost, deletePost, getPost, likeUnlikePost } from '../controllers/postController.js';
import protectRoute from './../middleware/protectRoute.js';
const router= express.Router();

router.post('/create',protectRoute,createPost)
router.get('/:id',getPost)
router.delete('/:id',protectRoute,deletePost)
router.post("/like/:id",protectRoute,likeUnlikePost)

export default router