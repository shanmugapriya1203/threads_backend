import express from 'express';
import { createPost, deletePost, getPost, likeUnlikePost, replyPost } from '../controllers/postController.js';
import protectRoute from './../middleware/protectRoute.js';
const router= express.Router();

router.post('/create',protectRoute,createPost)
router.get('/:id',getPost)
router.delete('/:id',protectRoute,deletePost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/reply/:id",protectRoute,replyPost)

export default router