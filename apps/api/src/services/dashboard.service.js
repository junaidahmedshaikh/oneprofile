import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';
import { Appointment } from '../models/Appointment.js';
import { ProfileView } from '../models/ProfileView.js';
import { OnboardingDraft } from '../models/OnboardingDraft.js';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';

export async function getDashboardSummary(userId) {
  const user = await User.findById(userId);
  const profile = await Profile.findOne({ userId });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Quick Statistics
  const totalViews = await ProfileView.countDocuments({ userId });
  
  // Real Card Shares from Activity collection
  const totalShares = await Activity.countDocuments({ userId, type: 'card_shared' });
  
  // Daily views aggregation (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfDay.getTime() - i * 24 * 60 * 60 * 1000);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      timestamp: d,
      views: 0
    };
  }).reverse();

  const viewsData = await ProfileView.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    }
  ]);

  last7Days.forEach((day) => {
    const dateStr = day.timestamp.toISOString().split('T')[0];
    const match = viewsData.find((v) => v._id === dateStr);
    if (match) {
      day.views = match.count;
    }
    delete day.timestamp;
  });

  // 3. Business Health Score (0-100)
  const onboardingProgress = user?.onboardingProgress || 0;
  const healthScore = Math.min(100, Math.round(
    (onboardingProgress * 0.5) + // max 50
    (totalViews > 0 ? 50 : 0)    // max 50
  ));

  // 4. Subscription Tier (Directly from User roles check, no mock data)
  const isPremium = user?.roles?.includes('premium') || user?.roles?.includes('admin');
  const subscription = {
    tier: isPremium ? 'premium' : 'free',
    features: isPremium 
      ? ['Unlimited Profiles', 'Custom SEO Domains', 'Advanced Analytics', 'Unlimited AI Content']
      : ['1 Public Profile', 'Basic QR Code', 'Appointments & Booking'],
    quotaUsed: onboardingProgress >= 100 ? 1 : 0,
    quotaLimit: isPremium ? 999 : 1
  };

  // 5. Contextual AI Suggestions (Generated dynamically from real DB states)
  const aiSuggestions = [];
  if (onboardingProgress < 100) {
    aiSuggestions.push({
      id: 'onboarding_incomplete',
      title: 'Complete Profile Details',
      description: 'Your onboarding is incomplete. Finish setup to open digital booking widgets.',
      action: '/onboarding',
      urgency: 'high'
    });
  }
  if (profile) {
    const hasSocials = profile.socialLinks && Object.values(profile.socialLinks).some(Boolean);
    if (!hasSocials) {
      aiSuggestions.push({
        id: 'no_social_links',
        title: 'Connect Social Channels',
        description: 'Add social link connect buttons (LinkedIn, Twitter) to expand profile sharing handles.',
        action: '/identity',
        urgency: 'medium'
      });
    }
    if (!profile.bio && !profile.description) {
      aiSuggestions.push({
        id: 'no_bio_description',
        title: 'Add Biography Details',
        description: 'Your profile has no biography introduction. Write a short bio description to build trust.',
        action: '/identity',
        urgency: 'medium'
      });
    }
  }

  // 6. Dynamic Workspace Tasks Checklist
  const tasks = [
    { id: '1', title: 'Complete your onboarding setup', done: onboardingProgress >= 100 },
    { id: '2', title: 'Claim custom profile slug URL', done: !!profile?.slug },
    { id: '3', title: 'Connect professional contact details', done: !!profile?.contactDetails?.email || !!profile?.contactDetails?.phone },
    { id: '4', title: 'Receive first public profile view', done: totalViews > 0 }
  ];

  // 7. Popular Links (Aggregated from actual link clicked activities, no fallback)
  const popularLinksData = await Activity.aggregate([
    { $match: { userId, type: 'link_clicked' } },
    { $group: { _id: '$metadata.linkTitle', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  const popularLinks = popularLinksData.map((l) => ({
    title: l._id || 'Unknown Link',
    clicks: l.count,
    url: '#'
  }));

  // 8. Today's traffic insights summary
  const todayViews = await ProfileView.countDocuments({ userId, createdAt: { $gte: startOfDay } });
  const todayInsights = {
    viewsToday: todayViews,
    summaryText: todayViews > 0 
      ? `Your profile recorded ${todayViews} views today.`
      : 'Your profile has had no traffic views recorded today.'
  };

  return {
    user: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      onboardingStatus: user?.onboardingStatus || 'not_started',
      onboardingProgress,
      profileType: profile?.profileType || 'business'
    },
    statistics: {
      profileViews: totalViews,
      cardShares: totalShares,
      skillsCount: profile?.skills?.length || 0,
      experienceCount: profile?.experience?.length || 0,
      certificationsCount: profile?.certifications?.length || 0,
      servicesCount: profile?.services?.length || 0,
      productsCount: profile?.products?.length || 0,
      teamSize: profile?.teamSize || 0
    },
    viewsChart: last7Days,
    healthScore,
    subscription,
    aiSuggestions,
    tasks,
    popularLinks,
    todayInsights
  };
}

export async function getRecentActivities(userId) {
  return Activity.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);
}

export async function getRecentAppointments(userId) {
  return Appointment.find({ userId })
    .sort({ dateTime: 1 })
    .limit(10);
}

export async function getRecentNotifications(userId) {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(15);
}

export async function markNotificationAsRead(userId, notificationId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
}
