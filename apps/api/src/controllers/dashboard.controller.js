import * as dashboardService from '../services/dashboard.service.js';
import { ApiError } from '../utils/apiError.js';

export async function getSummary(req, res, next) {
  try {
    const userId = req.auth.userId;
    const summary = await dashboardService.getDashboardSummary(userId);
    
    res.json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    next(error);
  }
}

export async function getActivities(req, res, next) {
  try {
    const userId = req.auth.userId;
    const activities = await dashboardService.getRecentActivities(userId);

    res.json({
      success: true,
      message: 'Recent activities retrieved successfully',
      data: activities
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(req, res, next) {
  try {
    const userId = req.auth.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const leadsData = await dashboardService.getRecentLeads(userId, page, limit);

    res.json({
      success: true,
      message: 'Leads list retrieved successfully',
      data: leadsData
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointments(req, res, next) {
  try {
    const userId = req.auth.userId;
    const appointments = await dashboardService.getRecentAppointments(userId);

    res.json({
      success: true,
      message: 'Upcoming appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    next(error);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const userId = req.auth.userId;
    const notifications = await dashboardService.getRecentNotifications(userId);

    res.json({
      success: true,
      message: 'Notifications list retrieved successfully',
      data: notifications
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, 'Notification ID is required');
    }

    const updated = await dashboardService.markNotificationAsRead(userId, id);
    if (!updated) {
      throw new ApiError(404, 'Notification not found or access denied');
    }

    res.json({
      success: true,
      message: 'Notification marked as read successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}
