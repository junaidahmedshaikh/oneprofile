import * as profileService from '../services/profile.service.js';
import { ApiError } from '../utils/apiError.js';

export async function getMe(req, res, next) {
  try {
    const userId = req.auth.userId;
    const profile = await profileService.getOrCreateProfile(userId);

    res.json({
      success: true,
      message: 'Profile details retrieved successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const userId = req.auth.userId;
    const profile = await profileService.updateProfile(userId, req.body);

    res.json({
      success: true,
      message: 'Profile details updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublic(req, res, next) {
  try {
    const { slug } = req.params;
    const visitorIp = req.ip || req.headers['x-forwarded-for'] || '';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || '';

    if (!slug) {
      throw new ApiError(400, 'Profile slug is required');
    }

    const profile = await profileService.getPublicProfile(slug, visitorIp, userAgent, referrer);

    res.json({
      success: true,
      message: 'Public profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
}


