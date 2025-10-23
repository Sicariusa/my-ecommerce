# 🚀 Website Builder - Setup & Installation Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git (optional, for version control)

---

## 📦 Installation Steps

### 1. Navigate to Client Directory

```bash
cd platform/client
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15 and React 18
- TypeScript
- Tailwind CSS
- **New builder dependencies:**
  - `@dnd-kit/core` - Drag and drop functionality
  - `@dnd-kit/sortable` - Sortable lists
  - `@dnd-kit/utilities` - Utility helpers
  - `zustand` - State management
  - `lucide-react` - Icons (already installed)

### 3. Create Data Directory

The builder stores projects as JSON files. Create the directory:

```bash
# On Windows (PowerShell)
mkdir -p data\projects

# On macOS/Linux
mkdir -p data/projects
```

Alternatively, the API will create this automatically on first save.

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Builder

Open your browser and navigate to:
```
http://localhost:3000/builder
```

You should see the builder interface with a sample landing page template loaded.

---

## ✅ Verify Installation

### Check 1: Builder Loads
- Three-panel layout is visible
- Left: PageTree with "Home" page
- Center: Canvas with header, hero, footer
- Right: Inspector panel

### Check 2: No Console Errors
Open browser DevTools (F12) and check Console tab:
- Should see no red errors
- TypeScript type warnings are normal (will fix on first interaction)

### Check 3: Interactions Work
- Click on a component in the canvas
- Verify blue outline appears
- Verify Inspector shows component properties

### Check 4: Components Can Be Added
- Click "Add Component" in toolbar
- Select "Text" from dropdown
- Verify new text component appears on canvas

---

## 🔧 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
cd platform/client
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: TypeScript errors about 'any' types

**Expected:** These are lint warnings, not blocking errors. The app will still run.

**To fix (optional):**
Add explicit types in the store selectors:

```typescript
// Before (has warning)
const project = useBuilderStore((state) => state.project);

// After (no warning)
const project = useBuilderStore((state: any) => state.project);
```

Or configure TypeScript to be less strict temporarily.

### Issue: Builder page shows blank screen

**Check:**
1. Open browser console (F12) for errors
2. Verify URL is exactly `http://localhost:3000/builder`
3. Check network tab for failed API requests
4. Try clearing localStorage: `localStorage.clear()` in console

**Solution:**
```bash
# Restart the dev server
npm run dev
```

### Issue: Drag & drop not working

**Verify:**
- `@dnd-kit/core` is installed: `npm list @dnd-kit/core`
- No React errors in console
- You're dragging items in the PageTree (not yet fully implemented in Canvas)

**Solution:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities --save
```

### Issue: Save button doesn't work

**Check:**
1. API route is accessible: `http://localhost:3000/api/projects`
2. `data/projects/` directory exists
3. Check browser network tab for 500 errors

**Solution:**
```bash
# Create data directory manually
mkdir -p data/projects

# Or check API route file exists
ls app/api/projects/route.ts
```

---

## 📂 File Structure Verification

After installation, verify these files exist:

```
platform/client/
├── app/
│   ├── builder/
│   │   └── page.tsx                    ✅ Main builder page
│   └── api/
│       └── projects/
│           ├── route.ts                ✅ Projects API
│           └── [id]/route.ts           ✅ Single project API
├── components/
│   └── builder/
│       ├── Canvas.tsx                  ✅ Canvas component
│       ├── PageTree.tsx                ✅ Page tree component
│       └── Inspector.tsx               ✅ Inspector component
├── lib/
│   ├── schema.ts                       ✅ Type definitions
│   ├── componentRegistry.tsx           ✅ Component registry
│   ├── stores/
│   │   └── useBuilderStore.ts         ✅ Zustand store
│   └── utils/
│       └── importExport.ts             ✅ Import/export utilities
├── data/
│   └── projects/                       ✅ Saved projects directory
├── package.json                        ✅ Dependencies
└── node_modules/                       ✅ Installed packages
```

---

## 🧪 Quick Test

Run this quick test to ensure everything works:

```bash
# 1. Start the server
npm run dev

# 2. Open browser to http://localhost:3000/builder

# 3. In the builder:
#    - Click on the hero section (blue background)
#    - Verify Inspector shows "Section" properties
#    - Change Background Color to "#e0f2fe"
#    - Verify canvas updates immediately

# 4. Add a new component:
#    - Click "Add Component" → "Text"
#    - Edit text content in Inspector
#    - Verify changes appear on canvas

# 5. Export the project:
#    - Click "File" → "Export JSON"
#    - Verify a .json file downloads

# ✅ If all steps work, installation is successful!
```

---

## 📚 Next Steps

1. **Read Documentation:**
   - [BUILDER_README.md](BUILDER_README.md) - Comprehensive guide
   - [BUILDER_TESTING_GUIDE.md](BUILDER_TESTING_GUIDE.md) - Test cases

2. **Explore the Builder:**
   - Try all 15 test cases in the testing guide
   - Experiment with different components
   - Test import/export functionality

3. **Customize:**
   - Add custom components (see BUILDER_README.md)
   - Modify default styles in componentRegistry.tsx
   - Extend the Inspector with custom property editors

4. **Deploy:**
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or your preferred host

---

## 🔑 Environment Variables

The builder currently uses file-based storage and doesn't require environment variables.

**Optional (for future enhancements):**

```bash
# .env.local
DATABASE_URL=your_database_url        # For database storage
STORAGE_BUCKET=your_bucket_url        # For cloud file storage
NEXT_PUBLIC_API_URL=your_api_url      # For external API
```

---

## 📊 Performance Tips

### Development
- Use `npm run dev` for hot reload
- Keep browser DevTools open to monitor performance
- Clear localStorage if experiencing issues: `localStorage.clear()`

### Production
- Build optimized bundle: `npm run build`
- Use Next.js image optimization for uploaded images
- Enable gzip compression on server
- Consider CDN for static assets

---

## 🎯 Success Criteria

After completing setup, you should be able to:

- ✅ Access the builder at `/builder`
- ✅ See sample template loaded
- ✅ Click and select components
- ✅ Edit properties in Inspector
- ✅ Add new components
- ✅ Save projects
- ✅ Export/import JSON
- ✅ Generate Next.js code

---

## 📞 Getting Help

If you encounter issues:

1. **Check browser console** for detailed error messages
2. **Review this guide** for troubleshooting steps
3. **Check package versions** match requirements
4. **Verify file structure** matches the checklist above
5. **Try clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🎉 You're All Set!

The website builder is now installed and ready to use. Happy building!

**Quick Links:**
- Builder: http://localhost:3000/builder
- Dashboard: http://localhost:3000/dashboard
- API: http://localhost:3000/api/projects

**Documentation:**
- [BUILDER_README.md](BUILDER_README.md)
- [BUILDER_TESTING_GUIDE.md](BUILDER_TESTING_GUIDE.md)

---

**Last Updated:** October 18, 2025
**Version:** 1.0.0
