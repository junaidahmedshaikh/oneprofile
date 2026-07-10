import { Profile } from '../models/Profile.js';
import { OnboardingDraft } from '../models/OnboardingDraft.js';
import { User } from '../models/User.js';
import { ProfileView } from '../models/ProfileView.js';
import { Activity } from '../models/Activity.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Generate a unique slug based on a user's name or company name
 */
async function generateUniqueSlug(baseName, userId) {
  let slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  if (!slug) slug = 'profile';

  let exists = await Profile.findOne({ slug, userId: { $ne: userId } });
  let attempt = 1;
  let uniqueSlug = slug;

  while (exists) {
    uniqueSlug = `${slug}-${attempt}`;
    exists = await Profile.findOne({ slug: uniqueSlug, userId: { $ne: userId } });
    attempt++;
  }

  return uniqueSlug;
}

/**
 * Get or create profile for the authenticated user.
 * Imports defaults from onboarding draft if no profile exists.
 */
export async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ userId });
  if (profile) {
    if (!profile.profileType) {
      if (profile.professionalCategory || (profile.skills && profile.skills.length > 0) || (profile.experience && profile.experience.length > 0)) {
        profile.profileType = 'professional';
      } else {
        profile.profileType = 'business';
      }
      await profile.save();
    }
    return profile;
  }

  // No profile found, check onboarding draft to carry over settings
  const draft = await OnboardingDraft.findOne({ userId });
  const user = await User.findById(userId);

  const baseName = draft?.profileType === 'professional'
    ? draft?.personalDetails?.title || user.name
    : draft?.companyDetails?.companyName || user.name;
  const slug = await generateUniqueSlug(baseName, userId);

  profile = await Profile.create({
    userId,
    slug,
    profileType: draft?.profileType || 'business',
    industry: draft?.industry?.label || '',
    businessCategory: draft?.businessCategory?.label || '',
    professionalCategory: draft?.professionalCategory?.label || '',
    employmentType: draft?.personalDetails?.employmentType || 'self_employed',
    designation: draft?.personalDetails?.designation || '',
    yearsOfExperience: draft?.personalDetails?.yearsOfExperience || null,
    practiceName: draft?.personalDetails?.practiceName || '',
    department: draft?.personalDetails?.department || '',
    workLocation: draft?.personalDetails?.workLocation || '',

    title: draft?.personalDetails?.title || (user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.name),
    bio: draft?.profileType === 'professional' ? draft?.personalDetails?.bio || '' : draft?.companyDetails?.description || '',
    avatarUrl: draft?.profileType === 'professional' ? draft?.personalDetails?.avatarUrl || user.avatarUrl || '' : user.avatarUrl || '',
    coverImageUrl: draft?.profileType === 'professional' ? draft?.personalDetails?.coverImageUrl || '' : '',
    languages: draft?.personalDetails?.languages || [],
    skills: draft?.personalDetails?.skills || [],
    certifications: draft?.personalDetails?.certifications || [],
    experience: draft?.experience || [],

    companyName: draft?.companyDetails?.companyName || '',
    tagline: draft?.companyDetails?.tagline || '',
    description: draft?.companyDetails?.description || '',
    logoUrl: draft?.logo?.url || '',
    gstNumber: draft?.companyDetails?.gstNumber || '',
    registrationDetails: draft?.companyDetails?.registrationDetails || '',
    serviceArea: draft?.companyDetails?.serviceArea || '',
    foundedYear: draft?.companyDetails?.foundedYear || null,
    teamSize: draft?.companyDetails?.teamSize || null,

    theme: draft?.theme || { key: 'aurora', name: 'Aurora', primary: '#4F8CFF', accent: '#22D3EE', mode: 'dark' },
    contactDetails: {
      email: draft?.contactDetails?.email || user.email || '',
      phone: draft?.contactDetails?.phone || user.phone || '',
      whatsAppNumber: draft?.contactDetails?.whatsAppNumber || ''
    },
    socialLinks: draft?.socialLinks || {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      instagram: '',
      facebook: '',
      youtube: '',
      customLinks: []
    },
    location: {
      address: '',
      city: draft?.companyDetails?.city || '',
      country: draft?.companyDetails?.country || '',
      mapsEmbedUrl: ''
    }
  });

  // Update user model published slug reference
  user.publishedProfileSlug = slug;
  await user.save();

  return profile;
}

/**
 * Save/update the user's profile details.
 */
export async function updateProfile(userId, updateData) {
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = await getOrCreateProfile(userId);
  }

  // If slug is empty or missing, delete it so it doesn't overwrite with an empty string
  if (!updateData.slug) {
    delete updateData.slug;
  } else if (updateData.slug !== profile.slug) {
    const slug = updateData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Profile.findOne({ slug, userId: { $ne: userId } });
    if (exists) {
      throw new ApiError(400, 'Profile slug is already claimed by another user');
    }
    updateData.slug = slug;
    
    // Sync to user collection
    await User.findByIdAndUpdate(userId, { publishedProfileSlug: slug });
  }

  // Update profile fields
  Object.assign(profile, updateData);
  await profile.save();

  return profile;
}

/**
 * Fetch a public profile by its slug.
 * Records a page view and visitor activity in the background.
 */
export async function getPublicProfile(slug, visitorIp, userAgent, referrer) {
  const profile = await Profile.findOne({ slug });
  if (!profile) {
    throw new ApiError(404, 'Profile page not found');
  }

  if (profile.visibility === 'private') {
    throw new ApiError(403, 'This profile is set to private');
  }

  // Log view statistics in background (non-blocking)
  (async () => {
    try {
      await ProfileView.create({
        userId: profile.userId,
        visitorIp,
        userAgent,
        referrer: referrer || 'direct'
      });

      await Activity.create({
        userId: profile.userId,
        type: 'profile_view',
        description: `Profile viewed by visitor from ${referrer || 'direct'}`,
        metadata: { referrer, userAgent }
      });
    } catch (e) {
      // Sliently fail stats background log
    }
  })();

  return profile;
}


