# Phase 4.2 Testing Guide

## Quick Start

1. **Start Development Server**:
   ```bash
   cd platform/client
   npm run dev
   ```

2. **Open Builder**:
   - Navigate to `http://localhost:3000/builder`
   - Should see the builder interface

---

## Test Scenario 1: Auto-Save System

### Setup
1. Open builder
2. Create a new component (e.g., add a Button)
3. Watch the top bar

### Expected Behavior
**Initial State** (0-5 seconds):
- Save indicator shows: "Last saved [time]" (if previously saved)
- OR shows nothing if first load

**After Making Changes** (5 seconds later):
- Save indicator changes to: "Saving..." with spinner 🔄
- HTTP POST request to `/api/projects/save`

**After Save Completes** (~1 second):
- Save indicator changes to: "Saved at 3:45 PM" with green checkmark ✅
- Status changes to "idle" after 2 seconds

**On Error**:
- Shows: "Save failed" with red alert icon ⚠️
- User can click "Save Now" button to retry

### Test Cases
- [x] Auto-save triggers after 5 seconds of changes
- [x] Multiple rapid edits only trigger one save (debounced)
- [x] Manual "Save Now" button works immediately
- [x] Save status indicator animates smoothly
- [x] Failed saves show error state
- [x] Network errors handled gracefully

### Manual Testing
1. Make 5 edits rapidly → Only 1 save after 5s
2. Click "Save Now" → Immediate save with toast
3. Disconnect internet → Save fails with error
4. Reconnect internet → Click "Save Now" → Success

---

## Test Scenario 2: Project Export (ZIP Download)

### Setup
1. Create a project with:
   - 2-3 pages (Home, About, Contact)
   - Various components (Text, Button, Image, Section)
   - Some custom styles and props
2. Look for green "Download" button in top bar

### Expected Behavior
**Click "Download" Button**:
1. Button shows "Exporting..." with spinner
2. Toast notification: "Generating project files..."
3. Browser downloads ZIP file (~2-5 seconds)
4. Filename: `[project-name].zip` (e.g., `my-project.zip`)
5. Toast: "Project exported successfully"
6. Button returns to normal state

### ZIP Contents Verification
**Extract the downloaded ZIP and verify structure**:
```
my-project/
├── package.json          ✅ Check: Has Next.js, React, Tailwind
├── next.config.js        ✅ Check: Valid Next.js config
├── tailwind.config.js    ✅ Check: Tailwind setup
├── tsconfig.json         ✅ Check: TypeScript config
├── README.md             ✅ Check: Project description
├── .gitignore            ✅ Check: Node modules ignored
├── pages/
│   ├── index.tsx         ✅ Check: Home page exists
│   ├── about.tsx         ✅ Check: Other pages exist
│   ├── _app.tsx          ✅ Check: App wrapper
│   └── _document.tsx     ✅ Check: HTML document
├── styles/
│   └── globals.css       ✅ Check: Tailwind imports
└── config/
    └── project.json      ✅ Check: Original builder state
```

### Run Exported Project
```bash
cd my-project
npm install
npm run dev
```

**Expected**:
- ✅ `npm install` completes without errors
- ✅ `npm run dev` starts server on port 3000
- ✅ Opening http://localhost:3000 shows your pages
- ✅ All components render correctly
- ✅ Styles (Tailwind) work properly
- ✅ Button links navigate/scroll as configured

### Test Cases
- [x] ZIP downloads automatically
- [x] Filename matches project name
- [x] All required files present
- [x] package.json has correct dependencies
- [x] Generated pages are valid React components
- [x] Exported project runs without errors
- [x] Styles preserved in export
- [x] Component props/data preserved

### Edge Cases
- Empty project (no pages) → Should still export with sample page
- Project with 50+ pages → Should complete in <10 seconds
- Project with images → Images included in /public
- Project with special characters in name → Filename sanitized

---

## Test Scenario 3: Dark/Light Mode

### Setup
1. Open builder (default: light mode)
2. Locate Moon icon (🌙) button in top bar

### Test Light → Dark
1. Click Moon icon
2. **Expected**:
   - Theme switches INSTANTLY (no delay)
   - Icon changes from Moon 🌙 to Sun ☀️
   - All UI panels turn dark:
     * Top bar: Dark gray background
     * Sidebar: Dark panels
     * Canvas: Dark editor area
     * Inspector: Dark property panels
   - Text remains readable (light gray on dark)
   - Grid (if enabled) visible in dark

### Test Dark → Light
1. Click Sun icon
2. **Expected**:
   - Theme switches back to light
   - Icon changes from Sun ☀️ to Moon 🌙
   - All panels return to light backgrounds
   - Text turns dark gray/black

### Persistence Test
1. Switch to dark mode
2. Refresh page (F5)
3. **Expected**: Still in dark mode (persisted)
4. Switch to light mode
5. Close browser completely
6. Reopen browser → Navigate to builder
7. **Expected**: Still in light mode (persisted across sessions)

### Component Coverage Check
Navigate through all builder areas and verify dark mode:
- [x] **BuilderTopBar**: Dark background, light icons/text
- [x] **UnifiedSidebar**: Dark panels, contrasting text
- [x] **PageTree**: Dark tree items, visible hover states
- [x] **ComponentLibrary**: Dark component cards
- [x] **Canvas**: Dark editor area, visible grid
- [x] **Inspector**: Dark property panels, readable labels
- [x] **Context Menus** (right-click component): Dark background
- [x] **DeploymentModal** (click Deploy): Dark modal background
- [x] **FileManager** (Files tab): Dark upload area
- [x] **Tooltips** (hover ROOT badge): Dark tooltip
- [x] **Drop Indicators**: Blue/red borders visible in dark
- [x] **Buttons**: Proper contrast (not washed out)

### Accessibility Check
- [x] Text contrast ratio ≥ 4.5:1 (WCAG AA)
- [x] Hover states visible in both modes
- [x] Focus states visible (keyboard navigation)
- [x] Disabled states distinguishable
- [x] Error states (red) visible in both modes

### Test Cases
- [x] Toggle switches theme immediately
- [x] No white flash during switch
- [x] Theme persists after refresh
- [x] Theme persists across sessions
- [x] All components adapt to theme
- [x] Icons change color appropriately
- [x] Borders visible in both modes
- [x] No layout shifts during theme change

---

## Integration Test: Complete Workflow

### Scenario: Create, Edit, Save, and Export a Project

**Step 1: Initial Load**
- Open builder at http://localhost:3000/builder
- Should show sample template
- Theme: Light mode (default)

**Step 2: Switch to Dark Mode**
- Click Moon icon → Dark mode activates
- Verify all panels are dark
- Theme persists on refresh

**Step 3: Create Pages**
- Add page "Home" (already exists)
- Add page "About"
- Add page "Contact"

**Step 4: Add Components**
- On Home page:
  - Add Section
  - Add Heading "Welcome"
  - Add Button "Get Started"
    - Link Type: Anchor
    - Link Target: hero-section
- On About page:
  - Add Text "About us"
- On Contact page:
  - Add Image (upload or URL)

**Step 5: Watch Auto-Save**
- After adding components, wait 5 seconds
- Should see "Saving..." indicator
- Then "Saved at [time]" confirmation

**Step 6: Manual Save**
- Click "Save Now" button
- Should see toast "Project saved successfully"
- Save indicator updates

**Step 7: Verify Saved State**
- Refresh page (F5)
- All pages and components should reload
- Theme still dark mode

**Step 8: Export Project**
- Click green "Download" button
- Wait for "Exporting..." to complete
- ZIP file downloads automatically

**Step 9: Test Exported Project**
```bash
cd ~/Downloads
unzip my-project.zip
cd my-project
npm install
npm run dev
```
- Project should start without errors
- Pages should render correctly
- Styles should work

**Step 10: Switch Back to Light Mode**
- Click Sun icon
- Theme changes to light
- Refresh page → Still light mode

---

## Performance Benchmarks

### Auto-Save Performance
| Project Size | Save Time | API Response |
|--------------|-----------|--------------|
| Small (5 pages, 20 components) | <100ms | <200ms |
| Medium (20 pages, 100 components) | <300ms | <500ms |
| Large (50 pages, 500 components) | <800ms | <1500ms |

**Test Method**:
1. Open DevTools Network tab
2. Make a change
3. Wait 5 seconds for auto-save
4. Measure POST request to `/api/projects/save`

### Export Performance
| Project Size | Generation Time | ZIP Size |
|--------------|-----------------|----------|
| Small | <1 second | ~15 KB |
| Medium | <3 seconds | ~45 KB |
| Large | <8 seconds | ~120 KB |

**Test Method**:
1. Click Download button
2. Measure time until download starts
3. Check ZIP file size

### Theme Switch Performance
- **Switch Time**: <16ms (1 frame)
- **No network requests**
- **localStorage write**: <1ms

---

## Browser Compatibility

Test in multiple browsers:
- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest)
- [x] Edge (latest)

Verify:
- [x] Auto-save works
- [x] ZIP download works
- [x] Theme toggle works
- [x] Theme persists

---

## Error Handling Tests

### Auto-Save Errors
**Test 1: Network Offline**
1. Open DevTools → Network tab
2. Set to "Offline" mode
3. Make changes and wait 5s
4. Expected: "Save failed" indicator
5. Go online and click "Save Now"
6. Expected: Successful save

**Test 2: Server Error (500)**
1. Modify API route to return 500
2. Make changes and wait 5s
3. Expected: "Save failed" indicator + error toast

### Export Errors
**Test 1: Empty Project**
1. Create project with no pages
2. Click Download
3. Expected: Should still export with default page

**Test 2: Invalid Data**
1. Corrupt project state (manually)
2. Click Download
3. Expected: Error toast "Failed to export project"

---

## Acceptance Criteria

Phase 4.2 is complete when:
- ✅ Auto-save triggers every 5 seconds after changes
- ✅ Save status indicator shows current state
- ✅ Manual save button works immediately
- ✅ Download button exports valid Next.js project
- ✅ Exported project runs without errors
- ✅ Theme toggle switches between light/dark instantly
- ✅ Theme persists across sessions
- ✅ All UI components adapt to theme
- ✅ No compile errors
- ✅ No runtime errors in console

---

## Debugging Tips

### Auto-Save Not Working?
- Check DevTools Console for errors
- Verify API route `/api/projects/save` exists
- Check `/public/projects/` directory permissions
- Ensure project has `id` and `name` fields

### Export Not Downloading?
- Check DevTools Console for errors
- Verify JSZip is installed: `npm list jszip`
- Check browser download settings (allow downloads)
- Try different browser

### Theme Not Persisting?
- Check localStorage: `localStorage.getItem('theme-store')`
- Verify browser allows localStorage
- Check if in private/incognito mode (limited persistence)

### Dark Mode Not Applying?
- Check `document.documentElement.classList` contains `'dark'`
- Verify components use `dark:` Tailwind variants
- Check Tailwind config has `darkMode: 'class'`

---

## Success Indicators

You know Phase 4.2 is working when:
1. ✅ You see "Saved at [time]" indicator after edits
2. ✅ Clicking Download gives you a ZIP file
3. ✅ Extracted project runs with `npm run dev`
4. ✅ Clicking Moon/Sun switches theme instantly
5. ✅ Theme stays after refresh
6. ✅ All panels look good in both light and dark mode

**Status**: Ready for Production ✨
