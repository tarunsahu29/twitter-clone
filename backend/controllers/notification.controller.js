import Notification from '../models/notification.model.js'

export const getNotifications = async (req, res) => {
  const userId = req.user._id

  try {
    // Step 1: Get all notifications for the user
    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    })

    // Step 2: Count unread notifications using aggregate
    const unreadCountResult = await Notification.aggregate([
      { $match: { to: userId, read: false } }, // Find unread notifications for this user
      { $group: { _id: null, unreadCount: { $sum: 1 } } }, // Count unread notifications
    ])

    const unreadCount =
      unreadCountResult.length > 0 ? unreadCountResult[0].unreadCount : 0

    // Step 3: Mark all notifications as read
    await Notification.updateMany({ to: userId }, { read: true })

    // Step 4: Send the notifications and the unread count in the response
    res.status(200).json({
      unreadCount,
      notifications,
    })
  } catch (error) {
    console.log('Error in getNotifications controller', error.message)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    await Notification.deleteMany({ to: userId })
    res.status(200).json({
      message: 'Notifications deleted successfully',
    })
  } catch (error) {
    console.log('Error in deleteNotifications controller', error.message)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id
  const userId = req.user._id

  try {
    const notification = await Notification.findById(notificationId)
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
      })
    }
    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Your are not allowed to delete this notification',
      })
    }

    await Notification.findByIdAndDelete(notificationId)
    res.status(200).json({
      message: 'Notification deleted successfully',
    })
  } catch (error) {
    console.log('Error in deleteNotification controller', error.message)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}
