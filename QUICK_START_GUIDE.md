# Quick Start Guide - Builder with AI Enhancement

## 🚀 Getting Started

Follow these steps to use the "Enhance with AI" feature in the website builder:

## Step 1: Start the Chef AI Backend

The Chef AI agent must be running for enhancement to work.

```bash
# Terminal 1 - Chef Backend
cd /workspace/chatbot
pnpm install  # Only needed first time
pnpm run dev
```

This starts the Chef AI agent on **http://localhost:5173**

## Step 2: Start Convex (Required for Chef)

```bash
# Terminal 2 - Convex Backend
cd /workspace/chatbot
npx convex dev
```

Note: You'll need to set up a Convex project first. Follow the prompts.

## Step 3: Start the Platform/Builder

```bash
# Terminal 3 - Website Builder
cd /workspace/platform/client
npm install  # Only needed first time
npm run dev
```

This starts the builder on **http://localhost:3000**

## Step 4: Use the Enhancement Feature

1. Open **http://localhost:3000** in your browser
2. Navigate to the website builder
3. Create or open a project
4. Click the **"Enhance with AI"** button (gradient purple-pink, sparkles icon ✨)
5. Enter your enhancement request or select an example:
   - "Add a contact form section with name, email, and message fields"
   - "Make the design more modern with better spacing and colors"
   - "Add a features section with 3 columns showcasing key benefits"
   - And more...
6. Click **"Enhance Project"**
7. Wait for the AI to process (usually 5-30 seconds)
8. Your project will be updated automatically!

## ✅ What Works

- ✨ AI-powered enhancements to your website
- 📝 Natural language requests
- 🎨 Design improvements
- 🔧 Component additions
- ↩️ Undo/redo support
- 💾 Auto-save after enhancement

## 🔧 Configuration (Optional)

If you need to change the Chef API URL:

```bash
# In /workspace/platform/client/.env.local
NEXT_PUBLIC_CHEF_API_URL=http://localhost:5173/api/chat
```

## 🐛 Troubleshooting

### Enhancement button doesn't respond
- **Check**: Is Chef backend running on port 5173?
- **Check**: Is Convex backend running?
- **Check**: Browser console for errors (F12)

### "Failed to enhance project" error
- **Check**: Chef backend logs in Terminal 1
- **Check**: API key is configured (ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.)
- **Check**: Your prompt is clear and specific

### API keys not working
Add API keys to `/workspace/chatbot/.env.local`:
```env
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
GOOGLE_API_KEY=<your-key>
```

## 📚 Example Enhancement Requests

### Add New Sections
- "Add a testimonials section with 3 customer reviews"
- "Create a pricing section with 3 tiers: Basic, Pro, Enterprise"
- "Add a FAQ section with 5 common questions"

### Improve Design
- "Make the hero section more modern with better typography"
- "Improve spacing and use a consistent color scheme"
- "Add smooth animations to the buttons"

### Add Interactive Elements
- "Add a contact form with name, email, phone, and message"
- "Create a newsletter signup form"
- "Add a search bar in the header"

## 🎯 Tips for Best Results

1. **Be Specific**: "Add a contact form with name, email, and message fields" is better than "improve the page"
2. **One Thing at a Time**: Make incremental changes rather than requesting everything at once
3. **Use Examples**: The 6 pre-configured examples are tested and work well
4. **Review Changes**: Always review what the AI added before saving
5. **Use Undo**: If you don't like a change, just press Ctrl+Z (or use the undo button)

## 🔒 Security Note

Your project data is sent to the Chef AI agent for processing. In this local setup:
- Data stays on your machine
- Chef runs locally (not in the cloud)
- API keys are stored in local environment variables

## 🚀 Next Steps

Once you're comfortable with the enhancement feature:
- Try combining multiple enhancements
- Export your projects as Next.js apps
- Deploy to staging/production environments

---

**Need help?** Check the browser console (F12) and terminal logs for error messages.
