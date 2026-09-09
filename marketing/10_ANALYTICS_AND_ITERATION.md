# 📊 OneProfile - Analytics, KPIs & Growth Iteration System

## Executive Summary
A world-class SaaS growth engine relies on continuous data feedback loops. This document outlines the key metrics dashboards, event tracking schema, A/B testing roadmap, and weekly growth sprint framework for OneProfile.

---

## 1. Core Analytics Metrics & Tracking Schema

### North Star Metric (NSM)
> **Weekly Active Profile Sharers (WAPS)**: The number of users whose profile received at least 3 unique profile views, 1 vCard download, or 1 lead submission in a 7-day period.

---

### Key Metric Dashboards & Targets

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                NORTH STAR METRIC                                       │
│                Weekly Active Profile Sharers (WAPS): Target = 1,000 in M1               │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   ACQUISITION METRICS   │     │   ACTIVATION METRICS    │     │   MONETIZATION METRICS  │
├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
│ • Monthly Visitors      │     │ • Signup to Publish %   │     │ • Trial to Paid Conv %  │
│ • Signup Conversion %   │     │ • Time to Publish (<3m) │     │ • MRR / ARR             │
│ • Blended CAC ($7.14)   │     │ • First vCard Download  │     │ • ARPU ($9.50/mo)       │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 2. Event Tracking Schema (PostHog / Mixpanel / GA4)

```javascript
// Sample Event Schema Specification for Frontend Integration
posthog.capture('user_signed_up', {
  method: 'email' | 'google',
  source_campaign: 'product_hunt' | 'meta_ads' | 'organic_search',
  ref_code: 'viral_badge' | null
});

posthog.capture('profile_published', {
  profile_id: 'prof_12345',
  theme_selected: 'aurora',
  time_to_publish_seconds: 145,
  is_ai_generated: true
});

posthog.capture('public_vcard_downloaded', {
  profile_slug: 'alexsmith',
  device_type: 'mobile_ios' | 'mobile_android' | 'desktop'
});

posthog.capture('lead_form_submitted', {
  profile_slug: 'alexsmith',
  has_phone: true
});
```

---

## 3. Prioritized A/B Testing Roadmap

| Priority | Test Hypothesis | Control Version (A) | Variant Version (B) | Success Metric |
| :--- | :--- | :--- | :--- | :--- |
| **High** | Showing a live interactive profile builder on the homepage increases signups. | Static hero image & headline. | Interactive embedded wizard preview where visitors can type their name & see a card live. | Landing Page Signup Rate (+25% expected) |
| **High** | Removing credit card requirement on Pro Trial increases trial starts. | Requires credit card up front. | 14-day cardless trial with soft email paywall on Day 12. | Pro Trial Activation Rate (+40% expected) |
| **Medium**| Dark Mode vs Light Mode default theme for Onboarding Wizard. | Standard Light theme. | Sleek Dark Glassmorphic theme. | Onboarding Completion Rate (+10% expected) |

---

## 4. Weekly Growth Sprint Cadence (Agile Growth)

```
 Monday: Data Review & Prioritization (Review PostHog Funnels & Set Sprint Experiments)
   │
 Tuesday – Thursday: Execution Sprint (Ship 2 A/B Tests, Dispatch Cold Email Batches, Run Ads)
   │
 Friday: Growth Review & Winner Rollout (Analyze AB Test Results, Double Down on Winning Channels)
```

### Weekly Growth Checklist
- [ ] Review CAC, CPA, and LTV trends across channels.
- [ ] Inspect onboarding funnel bottlenecks; fix top drop-off step.
- [ ] Evaluate cold outreach reply rates and update email copy.
- [ ] Publish 1 winning case study or user milestone on social media.
