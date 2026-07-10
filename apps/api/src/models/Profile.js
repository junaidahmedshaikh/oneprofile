import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, trim: true, default: '' }
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  price: { type: String, trim: true, default: '' }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  price: { type: String, trim: true, default: '' },
  imageUrl: { type: String, default: '' }
});

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    profileType: { type: String, enum: ['business', 'professional'], default: 'business', index: true },
    industry: { type: String, default: '' },
    businessCategory: { type: String, default: '' },
    professionalCategory: { type: String, default: '' },
    employmentType: { type: String, enum: ['self_employed', 'employed'], default: 'self_employed' },
    designation: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: null },
    practiceName: { type: String, default: '' },
    department: { type: String, default: '' },
    workLocation: { type: String, default: '' },
    
    // Personal Details
    title: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },
    languages: [{ type: String, trim: true }],

    // Business Details
    companyName: { type: String, trim: true, default: '' },
    tagline: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    logoUrl: { type: String, default: '' },
    gstNumber: { type: String, trim: true, default: '' },
    registrationDetails: { type: String, trim: true, default: '' },
    serviceArea: { type: String, trim: true, default: '' },
    foundedYear: { type: Number, default: null },
    teamSize: { type: Number, default: null },

    // Professional details arrays
    experience: [experienceSchema],
    skills: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    
    // Offerings
    services: [serviceSchema],
    products: [productSchema],

    // Contacts & Socials
    socialLinks: {
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
      customLinks: [{
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true }
      }]
    },
    contactDetails: {
      email: { type: String, trim: true, lowercase: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      whatsAppNumber: { type: String, trim: true, default: '' }
    },
    workingHours: {
      monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: true } },
      tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: true } },
      wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: true } },
      thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: true } },
      friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: true } },
      saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: false } },
      sunday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, enabled: { type: Boolean, default: false } }
    },
    location: {
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: '' },
      mapsEmbedUrl: { type: String, trim: true, default: '' }
    },

    // Privacy & SEO Settings
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public', index: true },
    seo: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
      keywords: [{ type: String, trim: true }]
    },
    theme: {
      key: { type: String, default: 'aurora' },
      name: { type: String, default: 'Aurora' },
      primary: { type: String, default: '#4F8CFF' },
      accent: { type: String, default: '#22D3EE' },
      mode: { type: String, enum: ['light', 'dark'], default: 'dark' }
    }
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema, process.env.PROFILE_COLLECTION || 'profiles');
