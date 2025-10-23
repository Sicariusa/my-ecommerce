# Quick Start Guide - Builder with AI Enhancement

## 🚀 Getting Started

Follow these steps to use the "Enhance with AI" feature in the website builder:

## Prerequisites

1. Node.js (v18 or higher)
2. A Google AI API key (free at https://aistudio.google.com/app/apikey)

## Step 1: Add Your Google API Key

Create `platform/client/.env.local` with your Google API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Get a free API key**: https://aistudio.google.com/app/apikey

## Step 2: Install Dependencies

```bash
cd platform/client
npm install @google/generative-ai
```

## Step 3: Start the Builder

```bash
cd platform/client
npm run dev
```

The builder will run on **http://localhost:3000**

## Step 4: Use the Enhancement Feature

1. Open **http://localhost:3000** in your browser
2. Navigate to the website builder
3. Create or open a project
4. Click the **"Enhance with AI"** button (gradient purple-pink, sparkles icon ✨)
5. Enter your enhancement request or select an example:
   - "Add a contact form section with name, email, and message fields"
   - "Make the design more modern with better spacing and colors"
   - "Add a features section with 3 columns showcasing key benefits"
   - "Improve the hero section with a better call-to-action"
   - "Add a testimonials section with customer reviews"
   - "Create a pricing section with 3 tiers"
6. Click **"Enhance Project"**
7. Wait 5-15 seconds for the AI to process
8. Your project will be updated automatically!

## ✅ What Works

- ✨ AI-powered enhancements to your website
- 📝 Natural language requests
- 🎨 Design improvements
- 🔧 Component additions
- ↩️ Undo/redo support
- 💾 Auto-save after enhancement

## 🔧 Configuration

If you need to change the AI model, edit `platform/client/app/api/builder/enhance/route.ts`:

```typescript
// Change this line:
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

// To use a different model:
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

## 🐛 Troubleshooting

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

Google Gemini 2.5 Pro pricing:
- **Free**: 15 requests per minute, 1500 per day
- **Paid**: $0.075 per 1M input tokens, $0.30 per 1M output tokens

For most users, the free tier is more than enough!

## Next Steps

- Try different enhancement prompts
- Use undo/redo to experiment
- Save your enhanced projects
- Deploy to staging when ready

Enjoy building with AI! 🚀