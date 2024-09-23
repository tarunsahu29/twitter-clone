import express from 'express'
import { protectRoute } from '../middleware/protectedRoute.js'
import {
  deleteNotification,
  deleteNotifications,
  getNotifications,
} from '../controllers/notification.controller.js'

const router = express.Router()

router.get('/', protectRoute, getNotifications)
router.delete('/', protectRoute, deleteNotifications)
router.delete('/:id', protectRoute, deleteNotification)

export default router
