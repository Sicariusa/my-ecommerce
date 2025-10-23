# Builder AI Enhancement - Setup Guide

## Overview
The builder now has direct AI integration using Google Gemini (no Chef backend required).

## Quick Setup

### 1. Add Your Google API Key

Create or update `platform/client/.env.local`:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Get a free API key**: https://aistudio.google.com/app/apikey

### 2. Install Dependencies (Already Done)

```bash
cd platform/client
npm install @google/generative-ai
```

### 3. Start the Builder

```bash
cd platform/client
npm run dev
```

The builder will run on **http://localhost:3000**

## How to Use

1. Open the builder and create or open a project
2. Click the **"Enhance with AI"** button (purple gradient, sparkles icon ✨)
3. Enter your enhancement request, for example:
   - "Add a contact form section with name, email, and message fields"
   - "Make the design more modern with better spacing and colors"
   - "Add a features section with 3 columns showcasing key benefits"
4. Click **"Enhance Project"**
5. Wait 5-15 seconds for the AI to process
6. Your project will be updated automatically!

## Features

✅ Direct AI integration (no Chef backend needed)
✅ Uses Google Gemini 2.0 Flash (fast and free)
✅ Natural language enhancement requests
✅ Preserves existing project structure
✅ Automatic undo/redo support
✅ Real-time feedback with loading states

## Troubleshooting

### "AI service not configured" error
- Make sure you added `GOOGLE_API_KEY` to `.env.local`
- Restart the dev server after adding the key

### "Rate limit exceeded" error
- Wait a moment and try again
- Consider using a paid Google AI account for higher limits

### "Failed to parse AI response" error
- Try a simpler enhancement request
- The AI might have returned invalid JSON
- Check the browser console for more details

### Port 3000 already in use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## API Details

- **Endpoint**: `/api/builder/enhance`
- **Method**: POST
- **Body**: `{ project, enhancementPrompt }`
- **Response**: `{ success: true, project: enhancedProject }`

## Files Modified

1. `platform/client/app/api/builder/enhance/route.ts` - Direct Google AI integration
2. `platform/client/components/builder/EnhanceWithAI.tsx` - UI component
3. `platform/client/components/builder/BuilderTopBar.tsx` - Added button with loading state

## Cost

Google Gemini 2.0 Flash has a generous free tier:
- **Free**: 15 requests per minute, 1500 per day
- **Paid**: $0.075 per 1M input tokens, $0.30 per 1M output tokens

For most users, the free tier is more than enough!

## Next Steps

- Try different enhancement prompts
- Use undo/redo to experiment
- Save your enhanced projects
- Deploy to staging when ready

Enjoy building with AI! 🚀

