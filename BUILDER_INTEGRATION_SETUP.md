# Builder + Chef Integration Setup Guide

## Problem
The "Enhance with AI" button in the builder tries to call the Chef API at `http://localhost:5173/api/chat`, but gets a connection error (ECONNREFUSED). This is because the Chef backend requires proper authentication and setup.

## Solution Options

### Option 1: Run Chef Backend (Recommended for Full Integration)

To make the API integration work, you need to run the Chef backend with proper configuration:

1. **Start Chef Backend**:
   ```bash
   cd chatbot
   pnpm install
   pnpm run dev
   ```

2. **Start Convex** (required for Chef):
   ```bash
   cd chatbot
   npx convex dev
   ```

3. **Configure Environment Variables**:
   Create `chatbot/.env.local` with:
   ```env
   VITE_CONVEX_URL=<your-convex-url>
   ANTHROPIC_API_KEY=<your-anthropic-api-key>
   # Or one of: OPENAI_API_KEY, GOOGLE_API_KEY, XAI_API_KEY
   ```

4. **Start the Builder**:
   ```bash
   cd platform/client
   npm run dev
   ```

5. **Configure Builder API** (optional):
   Create `platform/client/.env.local` with:
   ```env
   NEXT_PUBLIC_CHEF_API_URL=http://localhost:5173/api/chat
   ```

### Option 2: Simplified Integration (No Authentication Required)

If the full Chef setup is too complex, here's a simpler approach:

**Create a direct AI integration** without using Chef's web API. Instead, call the AI provider directly from the builder API route.

## Current Issue

The current implementation in `platform/client/app/api/builder/enhance/route.ts` tries to call Chef's API but:
1. Chef requires authentication tokens from logged-in users
2. Chef checks usage quotas against Convex teams
3. The token validation will fail with empty tokens

## Quick Fix for Testing

To test the integration without full Chef authentication, you can:

1. **Modify the API route** to bypass Chef and call an AI provider directly
2. **Use a mock response** for testing the UI flow
3. **Open Chef in a new tab** with the enhancement prompt (user copies result back)

## Recommended Approach

For a production-ready integration, consider these options:

1. **Embedded Chef**: Embed Chef as an iframe within the builder
2. **Direct AI Integration**: Call Anthropic/OpenAI APIs directly from your builder backend
3. **Chef Webhook**: Have Chef call your builder API with results after processing
4. **Copy/Paste Flow**: User copies project JSON, pastes in Chef, then copies result back

## Files to Modify

If you want to create a direct AI integration:

- `platform/client/app/api/builder/enhance/route.ts` - Update to call AI provider directly
- Add API keys to `platform/client/.env.local`:
  ```env
  ANTHROPIC_API_KEY=<your-key>
  ```

Would you like me to implement one of these alternatives?

