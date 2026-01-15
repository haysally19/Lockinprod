# Supabase Authentication Setup

## Disabling Email Confirmation

To allow users to sign up and log in immediately without email confirmation:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Settings** (or **Email Auth**)
4. Find the setting **"Enable email confirmations"**
5. **Disable/Turn OFF** this setting
6. Save changes

Once disabled, users will be able to sign up and immediately access the application without having to confirm their email address.

## Current Sign Up Flow

The application is configured to:
- Automatically create a user profile when someone signs up
- Store the user's full name and phone number (optional) in their profile
- Log users in immediately after signup (when email confirmation is disabled)
- Show a friendly message if email confirmation is required

## Security Note

While disabling email confirmation makes onboarding easier, consider enabling it for production environments to:
- Verify that users own the email addresses they sign up with
- Reduce spam and fake accounts
- Comply with email verification requirements
