import { Lead } from '../models/Lead.js';
import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';
import { Appointment } from '../models/Appointment.js';
import { ProfileView } from '../models/ProfileView.js';
import { OnboardingDraft } from '../models/OnboardingDraft.js';
import { User } from '../models/User.js';

/**
 * Seed mock data for a clean first-time dashboard experience.
 */
async function ensureDashboardDataSeeded(userId) {
  const activityCount = await Activity.countDocuments({ userId });
  if (activityCount > 0) return;

  const now = new Date();
  
  // 1. Seed Profile Views spread over last 7 days
  const views = [];
  const referrers = ['linkedin.com', 'google.com', 'direct', 'twitter.com', 'github.com'];
  for (let i = 0; i < 48; i++) {
    const date = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    views.push({
      userId,
      visitorIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      createdAt: date,
      updatedAt: date
    });
  }
  await ProfileView.insertMany(views);

  // 2. Seed Leads
  const leads = [
    {
      userId,
      name: 'Michael Scott',
      email: 'michael@dundermifflin.com',
      phone: '+1 (555) 901-2099',
      company: 'Dunder Mifflin Paper Co.',
      message: 'Looking for a digital card and mini-site template for our Scranton sales team.',
      status: 'new',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      userId,
      name: 'Dwight Schrute',
      email: 'dwight@schrutebeetfarms.com',
      phone: '+1 (555) 302-8822',
      company: 'Schrute Farms',
      message: 'Need to organize booking calendars for farm tourism and group events.',
      status: 'contacted',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      userId,
      name: 'Pam Beesly',
      email: 'pam.art@designhub.co',
      phone: '+1 (555) 440-1122',
      company: 'Beesly Design Studio',
      message: 'Looking for an elegant portfolio presentation landing page.',
      status: 'converted',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      userId,
      name: 'Jim Halpert',
      email: 'jim@athlainsports.com',
      phone: '+1 (555) 880-9900',
      company: 'Athlean Sports Marketing',
      message: 'Need a fast QR code sharing setup for our field representatives.',
      status: 'qualified',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    }
  ];
  await Lead.insertMany(leads);

  // 3. Seed Appointments
  const appointments = [
    {
      userId,
      clientName: 'Michael Scott',
      clientEmail: 'michael@dundermifflin.com',
      clientPhone: '+1 (555) 901-2099',
      dateTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // tomorrow + 4 hrs
      duration: 45,
      notes: 'Scranton team presentation onboarding details check.',
      status: 'scheduled'
    },
    {
      userId,
      clientName: 'Dwight Schrute',
      clientEmail: 'dwight@schrutebeetfarms.com',
      clientPhone: '+1 (555) 302-8822',
      dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 3 days + time
      duration: 30,
      notes: 'Scheduling booking integrations on profile pages.',
      status: 'scheduled'
    }
  ];
  await Appointment.insertMany(appointments);

  // 4. Seed Notifications
  const notifications = [
    {
      userId,
      title: 'Profile Published! 🚀',
      message: 'Your OneProfile digital business workspace is now public. Share it with your network.',
      type: 'success',
      isRead: false,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
    },
    {
      userId,
      title: 'New Lead Captured ⚡',
      message: 'Michael Scott submitted a request through your digital contact form.',
      type: 'info',
      isRead: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      userId,
      title: 'MFA Recommended 🔒',
      message: 'Enable multi-factor verification in security settings to lock down authentication.',
      type: 'warning',
      isRead: true,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    }
  ];
  await Notification.insertMany(notifications);

  // 5. Seed Activities
  const activities = [
    {
      userId,
      type: 'onboarding_published',
      description: 'Published public profile on domain workspace.',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
    },
    {
      userId,
      type: 'lead_captured',
      description: 'Captured client lead from Michael Scott.',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      userId,
      type: 'onboarding_step',
      description: 'Completed theme selection and generated AI copy content.',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000)
    },
    {
      userId,
      type: 'onboarding_step',
      description: 'Added core company details and business description.',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
  await Activity.insertMany(activities);
}

export async function getDashboardSummary(userId) {
  // Ensure default data exists
  await ensureDashboardDataSeeded(userId);

  const user = await User.findById(userId);
  const draft = await OnboardingDraft.findOne({ userId });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Quick Statistics
  const totalViews = await ProfileView.countDocuments({ userId });
  const totalLeads = await Lead.countDocuments({ userId });
  const convertedLeads = await Lead.countDocuments({ userId, status: 'converted' });
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  // Shares (simulated shares based on share activities)
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

  // 2. Lead Conversion Summary
  const leadStatuses = await Lead.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const leadDistribution = {
    new: leadStatuses.find((l) => l._id === 'new')?.count || 0,
    contacted: leadStatuses.find((l) => l._id === 'contacted')?.count || 0,
    qualified: leadStatuses.find((l) => l._id === 'qualified')?.count || 0,
    converted: leadStatuses.find((l) => l._id === 'converted')?.count || 0
  };

  // 3. Business Health Score (0-100)
  const onboardingProgress = user.onboardingProgress || 0;
  const healthScore = Math.min(100, Math.round(
    (onboardingProgress * 0.4) + // max 40
    (totalLeads > 0 ? 30 : 10) + // max 30
    (totalViews > 0 ? 30 : 10)   // max 30
  ));

  // 4. Subscription Widget Data
  const subscription = {
    tier: 'free',
    renewalDate: null,
    features: ['1 Public Profile', 'Basic QR Code', 'Basic Lead Contact Form'],
    quotaUsed: onboardingProgress >= 100 ? 1 : 0,
    quotaLimit: 1
  };

  // 5. Contextual AI Suggestions
  const aiSuggestions = [];
  if (onboardingProgress < 100) {
    aiSuggestions.push({
      id: 'onboarding_incomplete',
      title: 'Complete Profile Details',
      description: 'Your onboarding is incomplete. Finish setup to open digital booking widgets.',
      action: '/onboarding',
      urgency: 'high'
    });
  } else {
    aiSuggestions.push({
      id: 'seo_suggestion',
      title: 'Optimize Tagline SEO',
      description: 'Add keywords to your tagline description like "Consultant" or "Agency" to lift index ranking.',
      action: '/onboarding',
      urgency: 'medium'
    });
  }
  if (totalViews > 10 && totalLeads === 0) {
    aiSuggestions.push({
      id: 'cta_suggestion',
      title: 'Optimize Profile CTA',
      description: 'Visitors view your profile but submit few cards. Revise CTA wording to "Schedule Consult Now".',
      action: '/onboarding',
      urgency: 'medium'
    });
  }

  // 6. Upcoming Tasks Checklist
  const tasks = [
    { id: '1', title: 'Complete your industry onboarding', done: onboardingProgress >= 30 },
    { id: '2', title: 'Upload logo & pick theme template', done: onboardingProgress >= 80 },
    { id: '3', title: 'Generate headline and publish profile', done: onboardingProgress >= 100 },
    { id: '4', title: 'Review your traffic views analytics chart', done: totalViews > 0 },
    { id: '5', title: 'Sync social handle connect buttons', done: totalShares > 0 || onboardingProgress >= 90 }
  ];

  // 7. Popular Links Mockup (Since link collection not created yet, we pull from category)
  const popularLinks = [
    { title: 'Digital Contact Card', clicks: totalViews > 10 ? Math.floor(totalViews * 0.35) : 8, url: '#' },
    { title: 'Portfolio Website', clicks: totalViews > 10 ? Math.floor(totalViews * 0.22) : 5, url: '#' },
    { title: 'Appointment Booking Page', clicks: totalViews > 10 ? Math.floor(totalViews * 0.12) : 2, url: '#' }
  ];

  // 8. Today's insights summary
  const todayViews = await ProfileView.countDocuments({ userId, createdAt: { $gte: startOfDay } });
  const todayLeads = await Lead.countDocuments({ userId, createdAt: { $gte: startOfDay } });
  const todayInsights = {
    viewsToday: todayViews,
    leadsToday: todayLeads,
    summaryText: todayViews > 0 
      ? `Your profile recorded ${todayViews} views and ${todayLeads} leads today. Keep sharing your link!`
      : 'Your profile has had no traffic views today. Try posting your profile QR card on social handles.'
  };

  return {
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      onboardingStatus: user.onboardingStatus,
      onboardingProgress: user.onboardingProgress
    },
    statistics: {
      profileViews: totalViews,
      cardShares: totalShares || 14, // default fallback
      leadConversions: totalLeads,
      conversionRate
    },
    viewsChart: last7Days,
    leadDistribution,
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

export async function getRecentLeads(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const items = await Lead.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Lead.countDocuments({ userId });
  
  return { items, total, page, limit };
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
