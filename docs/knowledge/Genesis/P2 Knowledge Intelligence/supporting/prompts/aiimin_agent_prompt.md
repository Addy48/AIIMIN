# AI Agent Context: aiimin Development

You are joining the development team for **aiimin**, an AI-powered application. This document provides complete context on our current architecture, recent implementations, known issues, and future roadmap. Your role is to help us resolve our current blockers and build out our planned features.

## 1. Project Overview & Tech Stack
**aiimin** is currently being built using modern web technologies.
- **Frontend & Hosting**: **Vercel** (Next.js/React). We use Vercel for our frontend deployments, routing, and serverless edge functions.
- **Backend & Database**: **Supabase**. We use Supabase for our PostgreSQL database, background backend data storage, and user management.
- **Third-Party Integrations**: **Google Auth** (for login) and **Google Calendar API** (for event management and scheduling).

## 2. What We Have Built & Recently Implemented
We have established the foundational infrastructure for aiimin. Recently implemented features include:
- Initial project scaffolding and deployment pipeline on Vercel.
- Database schema and project initialization in Supabase.
- Basic frontend UI structure for user login and onboarding.
- Initial setup for Google OAuth authentication on the frontend.
- Preliminary integration code for interacting with the Google Calendar API.
- Core UI elements and the backbone of the application layout, which we plan to keep.

## 3. Critical Issues We Are Constantly Facing (Blockers)
We are currently failing on several core flows. When suggesting code or fixes, prioritize resolving these specific issues:

1. **Frontend Login & Google Auth Issues**: The frontend Google authentication flow is breaking or failing to complete successfully.
2. **User Creation Failures**: Following a login attempt, user profiles and accounts are not being properly created or synced in our database.
3. **No Data Access**: We are facing permission and data access issues (likely related to Supabase Row Level Security (RLS) or missing auth tokens), preventing authenticated users from fetching their own data.
4. **Background Backend Data Storage Issues**: Background processes or serverless functions are failing to correctly store, retrieve, or update data in the Supabase backend.
5. **Google Calendar Issues**: Connecting to and interacting with the Google Calendar API is unstable (issues may involve token refresh, permissions, data retrieval, or webhook syncing). 

## 4. What We Are Keeping
We are keeping our current tech stack (Vercel + Supabase) and our core vision. The UI components that have already been built will remain, but the underlying data fetching, authentication logic, and API routes need to be completely fixed, refactored, and stabilized.

## 5. Future Roadmap & In-Depth Planned Features
Once the core authentication and backend storage issues are resolved, we plan to develop the following in-depth features:
- **Advanced AI Integrations**: Deeper AI capabilities that autonomously interact with user data, interpret requests, and manage schedules.
- **Seamless Calendar Management**: Two-way real-time syncing with Google Calendar, including automated event creation, conflict resolution, and intelligent scheduling algorithms.
- **Robust Background Processing**: Reliable background workers for analyzing data, managing reminders, and executing delayed tasks without user intervention.
- **Enhanced User Dashboards**: Rich data visualization for users to track the AI's actions, review upcoming schedules, and manage their preferences.

## Instructions for You (The AI Agent)
1. **Analyze before coding**: Whenever tackling one of the issues above (like Google Auth or Supabase data access), ask for the specific code files involved before blindly suggesting rewrites.
2. **Focus on stability**: Do not introduce new libraries unless strictly necessary. Fix the existing Supabase and Vercel implementations.
3. **Step-by-step Execution**: Tackle the auth and user creation issues first. We cannot fix background data storage or Google Calendar syncing until users are properly authenticated and have database access.

Please acknowledge that you have read this context and ask me to provide the code for the Frontend Login and Google Auth so we can begin fixing the user creation pipeline.
