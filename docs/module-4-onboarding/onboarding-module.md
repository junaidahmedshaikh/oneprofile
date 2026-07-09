# oneprofile Module 4 - User Onboarding

## Business Analysis

- The onboarding experience must help a user publish a usable public profile within five minutes.
- The flow should reduce friction, autosave continuously, and allow users to pause and resume without losing work.
- Optional steps should be skippable so the user can reach publish as quickly as possible.

## User Flow

1. User enters onboarding after signup or login.
2. User selects industry and business category.
3. User adds company details and uploads a logo.
4. User chooses a theme.
5. User generates AI-assisted content.
6. User reviews progress, resumes later if needed, and publishes.

## Screen Flow

- Industry selection
- Business category selection
- Company details form
- Logo upload
- Theme selection
- AI content generation
- Final review and publish

## Database

- `onboarding_drafts`
- `onboarding_resume_tokens`
- `tenants`
- `memberships`
- `users`

## API

- `GET /api/v1/onboarding/lookups`
- `GET /api/v1/onboarding/me`
- `PUT /api/v1/onboarding/me`
- `POST /api/v1/onboarding/step`
- `POST /api/v1/onboarding/skip`
- `POST /api/v1/onboarding/logo`
- `POST /api/v1/onboarding/content/ai`
- `POST /api/v1/onboarding/resume-later`
- `POST /api/v1/onboarding/publish`

## Frontend

- Full-screen onboarding wizard
- Stepper and progress indicator
- Autosaving forms
- Optional step skip controls
- Resume later action
- Publish action

## Acceptance Criteria

- Users can complete onboarding and publish a profile quickly.
- Drafts autosave.
- Steps can be skipped.
- Users can resume later.
- Logo upload stores media through Cloudinary when configured.
- Published users are redirected to the dashboard.

## Testing

- Unit tests for lookup contract and helper logic.
- Integration tests for save, skip, publish, and resume flows.
- UI tests for step progression and form validation.
