# oneprofile Module 3 - Authentication & Identity

## Business Analysis

- Auth is the trust gate for the entire platform.
- The system must support low-friction onboarding and high-security account protection.
- The experience needs to cover password login, OTP login, Google login, email verification, phone verification, and recovery flows.
- Sessions, device tracking, and role-based access are required from the foundation stage.

## User Journey

1. Visitor lands on login or signup.
2. User creates an account or signs in with email/password, OTP, or Google.
3. The backend creates or rotates a session and issues access and refresh tokens.
4. User verifies email or phone if required.
5. User can recover access through forgot/reset password.
6. User can review and revoke sessions from the authenticated workspace.

## User Stories

- As a new user, I want to sign up quickly and securely.
- As a returning user, I want to log in with password or OTP.
- As a user, I want to use Google login for faster access.
- As a user, I want to verify my email and phone.
- As a user, I want to reset my password if I lose access.
- As a user, I want to see and manage my active sessions.

## Database Design

### Collections

- `users`
- `sessions`
- `devices`
- `otp_challenges`
- `password_reset_tokens`
- `oauth_accounts`
- `roles`
- `permissions`
- `tenants`
- `memberships`

### Data Rules

- Store secrets as hashes, never plaintext.
- Store tokens with expiration and revoke metadata.
- Scope all identity data to the authenticated user and tenant where relevant.

## API Design

### Core Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/verify-email/request`
- `POST /api/v1/auth/verify-email/confirm`
- `POST /api/v1/auth/verify-phone/request`
- `POST /api/v1/auth/verify-phone/confirm`
- `GET /api/v1/auth/google`
- `POST /api/v1/auth/google/callback`

## JWT Flow

- Access token is short-lived and used for API authorization.
- Refresh token is long-lived and stored in an `httpOnly` cookie.
- Refresh token rotation occurs on every refresh call.
- Reuse detection is supported through session hash tracking.

## Session Management

- Each login creates a session record.
- Each session tracks device metadata, IP, user agent, and expiry.
- Users can list and revoke active sessions.
- Logout invalidates the current session.
- Logout-all revokes all other sessions for the user.

## Device Management

- Devices are tracked by fingerprint and user.
- Device metadata includes name, browser, OS, and type.
- Device records support trust and audit workflows in later modules.

## Role Management

- Platform roles: `user`, `admin`, `moderator`.
- Role definitions are persisted and extensible.
- Permissions are assigned at role or user level.

## Permissions

- Permission checks are enforced in middleware.
- Authorization is deny-by-default.
- Routes may require roles, permissions, or both.

## Middleware

- `authenticate` for token verification.
- `authorizeRoles` for role gating.
- `authorizePermissions` for capability checks.
- `validate` for schema validation.
- `errorHandler` for normalized failures.

## Express Routes

- Routes are organized under `/api/v1/auth`.
- Auth routes are separated from future user, tenant, and admin routes.
- Cookie and bearer-token support are both enabled.

## Controllers

- Controllers are thin and delegate business logic to services.
- Controllers transform results into stable API responses.
- Controllers own cookie setting and clearing.

## MongoDB Models

- Models are domain-focused and reusable.
- Token collections include `otp_challenges` and `password_reset_tokens`.
- Session and device collections support device-level auditing.

## Frontend Pages

- Login page
- Signup page
- Forgot password page
- Reset password page
- OTP screen
- Verification screen
- Sessions page
- Protected dashboard shell

## State Management

- Redux Toolkit stores auth identity and session access token.
- TanStack Query handles server state and session fetching.
- React Hook Form owns form state.

## Validation

- Email must be valid.
- Password must be at least 8 characters.
- OTP codes must match expected length.
- Reset tokens must be present and non-empty.

## Error Handling

- API errors return `success`, `message`, `code`, and optional `details`.
- Frontend surfaces user-friendly inline and banner errors.
- Authentication failures never expose sensitive internals.

## Loading States

- Buttons show inline spinners.
- Forms preserve layout during async operations.
- Query states show skeleton or loading cards.

## Success States

- Success banners confirm actions like signup, verification, and reset.
- Redirects occur after successful auth transitions.
- State updates keep UI consistent after mutation success.

## Animations

- Use subtle fade and upward motion for auth surfaces.
- Keep transitions under 350ms for responsiveness.
- Motion should support orientation and feedback.

## Responsive UI

- Mobile-first layout.
- Auth cards stack on small screens and split on desktop.
- Inputs and touch targets remain large enough for mobile use.

## Accessibility

- Keyboard support for every interactive control.
- Clear labels, helper text, and error messaging.
- Focus visibility and contrast-safe colors.
- Reduced motion respected in future accessibility settings.

## Testing Strategy

- Unit tests for token hashing and OTP validation.
- Integration tests for register, login, refresh, and reset flows.
- E2E tests for signup, login, verification, and session management.

## Acceptance Criteria

- Users can register, login, logout, and refresh sessions.
- Users can request and verify OTP login.
- Users can request email and phone verification.
- Users can initiate and complete password reset.
- Users can sign in with Google OAuth.
- Sessions are tracked and revocable.
- Frontend auth screens are responsive and accessible.

## Implementation Plan

1. Foundation models, token utilities, and validation.
2. Auth services, controllers, and route wiring.
3. Frontend pages, forms, and session restoration.
4. Verification, device management, and session dashboard.
5. Test coverage and hardening.

## Production Notes

- Refresh tokens should be rotated and stored hashed.
- Secrets must remain environment-managed.
- Mail and Google OAuth must be configured per environment.
- OTP and reset operations should be rate-limited in later hardening work.
