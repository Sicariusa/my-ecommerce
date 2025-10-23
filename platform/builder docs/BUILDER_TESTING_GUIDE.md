# Website Builder - Testing Guide & Playbook

## 🧪 Manual Acceptance Testing Playbook

### Prerequisites
1. Install dependencies:
   ```bash
   cd platform/client
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to: `http://localhost:3000/builder`

---

## Test Cases

### Test 1: Initial Load & Sample Template
**Objective:** Verify the builder loads with the sample template

**Steps:**
1. Navigate to `/builder`
2. Verify the three-panel layout is visible:
   - Left: PageTree with "Home" page
   - Center: Canvas with header, hero, and footer
   - Right: Inspector (no selection)
3. Verify the toolbar displays project name "Sample Landing Page"

**Expected Result:**
✅ Builder loads successfully with sample template rendered
✅ All three panels are visible and properly laid out
✅ Sample content is visible in the canvas

---

### Test 2: Component Selection
**Objective:** Verify clicking components selects them

**Steps:**
1. In the Canvas, click on the header section
2. Observe the Inspector panel on the right
3. Observe the PageTree on the left

**Expected Result:**
✅ Clicked component gets blue outline
✅ Inspector shows component properties and styles
✅ Component is highlighted in PageTree
✅ Selection indicator appears at bottom of canvas

---

### Test 3: Add New Component
**Objective:** Add a component to the canvas

**Steps:**
1. Click "Add Component" button in toolbar
2. Select "Text" from dropdown
3. Verify new text component appears on canvas
4. Click on the new component
5. Edit text in Inspector → Properties → Text Content
6. Change to "Hello World"

**Expected Result:**
✅ Component dropdown menu appears
✅ New text component is added to canvas
✅ New component appears in PageTree
✅ Text content updates in real-time when edited
✅ Changes persist on canvas

---

### Test 4: Edit Component Styles
**Objective:** Modify component appearance using Inspector

**Steps:**
1. Select the hero section (light blue background)
2. In Inspector, expand "Typography" section
3. Change Font Size to "20px"
4. Expand "Background" section
5. Change Background Color to "#e0f2fe"
6. Verify canvas updates immediately

**Expected Result:**
✅ Inspector shows all style sections (Layout, Box Model, Typography, Background, Advanced)
✅ Style changes apply immediately to canvas
✅ Visual feedback is instant (no lag)

---

### Test 5: Component Nesting
**Objective:** Create nested component structure

**Steps:**
1. Click "Add Component" → "Section"
2. Select the new Section on canvas
3. Click "Add Component" → "Text"
4. Verify text is added inside the section (check PageTree)
5. In PageTree, verify the Text appears nested under Section

**Expected Result:**
✅ Components can contain other components
✅ PageTree shows proper nesting hierarchy
✅ Nested components render correctly on canvas

---

### Test 6: Delete Component
**Objective:** Remove a component from the page

**Steps:**
1. Select any component in canvas or PageTree
2. Right-click on the component in PageTree
3. Click "Delete" from context menu
4. Verify component disappears from canvas and PageTree

**Expected Result:**
✅ Context menu appears on right-click
✅ Component is removed from both canvas and tree
✅ Selection is cleared after deletion

---

### Test 7: Duplicate Component
**Objective:** Copy a component

**Steps:**
1. Select a text component
2. Right-click in PageTree
3. Click "Duplicate"
4. Verify a copy appears below the original
5. Edit the duplicate to confirm it's independent

**Expected Result:**
✅ Duplicate appears with new ID
✅ Duplicate has same styles as original
✅ Changes to duplicate don't affect original

---

### Test 8: Page Management
**Objective:** Create and switch between pages

**Steps:**
1. In PageTree, click the "+" button next to "Pages & Layers"
2. Enter "About" as page name
3. Verify new page appears in PageTree
4. Verify canvas is now empty (new page)
5. Add a Text component to the new page
6. Click on "Home" page in PageTree
7. Verify original content is restored

**Expected Result:**
✅ New page is created successfully
✅ Switching pages shows correct content
✅ Each page maintains its own component tree
✅ Page names display correctly

---

### Test 9: Export Project as JSON
**Objective:** Export the project structure

**Steps:**
1. Click "File" → "Export JSON"
2. Verify download starts
3. Open the downloaded JSON file
4. Verify it contains:
   - Project name and ID
   - All pages
   - Complete component tree
   - All props and styles

**Expected Result:**
✅ JSON file downloads successfully
✅ JSON is valid and well-formatted
✅ All project data is preserved

---

### Test 10: Import Project from JSON
**Objective:** Import a previously exported project

**Steps:**
1. Export current project (Test 9)
2. Make some changes to the project
3. Click "File" → "Import JSON"
4. Select the exported JSON file
5. Confirm the import dialog
6. Verify project is restored to exported state

**Expected Result:**
✅ File picker opens
✅ JSON is parsed successfully
✅ Project is completely restored
✅ Canvas shows imported content
✅ PageTree shows all imported pages

---

### Test 11: Generate Next.js Code
**Objective:** Generate static Next.js pages

**Steps:**
1. Click "Generate Code" button
2. Verify download notification
3. Check downloaded files
4. Open generated TypeScript files
5. Verify they contain:
   - Valid React/JSX code
   - Component structure
   - Styles as inline styles

**Expected Result:**
✅ Code generation completes without errors
✅ Files include: page files, layout.tsx, globals.css, README.md
✅ Generated code is valid React/Next.js
✅ Component hierarchy is preserved

---

### Test 12: Save Project to Server
**Objective:** Persist project to backend

**Steps:**
1. Make changes to the project
2. Click "Save" button
3. Verify success alert appears
4. Check `data/projects/` directory
5. Verify JSON file exists with project ID

**Expected Result:**
✅ Save operation succeeds
✅ Success message displays
✅ Project file is created in data/projects/
✅ File contains complete project data

---

### Test 13: Drag & Drop (Basic)
**Objective:** Reorder components via drag & drop

**Steps:**
1. In PageTree, click and hold a component
2. Drag it to a different position
3. Release mouse
4. Verify component moves in both tree and canvas

**Expected Result:**
✅ Drag operation shows visual feedback
✅ Component reorders successfully
✅ Canvas updates to match new order
✅ No errors in console

---

### Test 14: Inspector Real-Time Updates
**Objective:** Verify live editing with Inspector

**Steps:**
1. Select a text component
2. In Inspector → Typography, change Font Size
3. While typing, observe canvas
4. Try values: "12px", "24px", "48px"
5. Try Layout → Display → "flex"

**Expected Result:**
✅ Canvas updates as you type (real-time)
✅ Changes are immediately visible
✅ No delays or lag
✅ Invalid values don't crash the app

---

### Test 15: Box Model Editor
**Objective:** Test margin/padding controls

**Steps:**
1. Select a section component
2. In Inspector → Box Model, expand section
3. Set Padding to "32px"
4. Verify component gets padding
5. Click "🔓 Unlinked" button
6. Set different values for top, right, bottom, left
7. Verify each side applies correctly

**Expected Result:**
✅ Linked mode applies same value to all sides
✅ Unlinked mode allows individual side control
✅ Visual changes are immediate
✅ Toggle between linked/unlinked works smoothly

---

## 🐛 Known Issues / Limitations

1. **Drag & Drop:** Currently basic implementation - some edge cases may not be handled
2. **Undo/Redo:** History is tracked but undo/redo UI not exposed in toolbar
3. **Responsive Preview:** No mobile/tablet preview modes yet
4. **Image Uploads:** Must use URLs, no upload widget
5. **Code Generation:** Basic implementation - may need manual refinement for production

---

## 🚀 Performance Checklist

- [ ] Builder loads in < 2 seconds
- [ ] Component selection is instant
- [ ] Inspector updates are real-time (< 100ms delay)
- [ ] Adding components doesn't cause lag
- [ ] Large projects (50+ components) remain responsive
- [ ] No memory leaks after 15 minutes of use

---

## ✅ Acceptance Criteria

### Core Functionality
- [x] Component selection works
- [x] Inspector edits apply in real-time
- [x] Add/delete components works
- [x] PageTree shows accurate hierarchy
- [x] Canvas renders all component types correctly

### Data Persistence
- [x] Export JSON creates valid file
- [x] Import JSON restores project completely
- [x] Save to server stores project
- [x] LocalStorage persists active project

### Code Generation
- [x] Generates valid Next.js code
- [x] Output includes all necessary files
- [x] Generated code compiles without errors

### User Experience
- [x] Three-panel layout is responsive
- [x] Toolbar actions are discoverable
- [x] Context menus are accessible
- [x] Error messages are helpful

---

## 🔧 Troubleshooting

### Builder doesn't load
- Check console for errors
- Verify dependencies are installed
- Clear browser localStorage: `localStorage.clear()`

### TypeScript errors
- Run: `npm install` in `platform/client`
- Packages should include: `@dnd-kit/core`, `zustand`, `lucide-react`

### Save fails
- Check `data/projects/` directory exists
- Verify API routes are working: `GET http://localhost:3000/api/projects`

### Components don't render
- Check browser console for React errors
- Verify component registry has all types
- Check node.type matches registry keys

---

## 📝 Test Report Template

```
Date: ____________________
Tester: __________________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Initial Load | ✅ / ❌ | |
| 2 | Selection | ✅ / ❌ | |
| 3 | Add Component | ✅ / ❌ | |
| 4 | Edit Styles | ✅ / ❌ | |
| 5 | Nesting | ✅ / ❌ | |
| 6 | Delete | ✅ / ❌ | |
| 7 | Duplicate | ✅ / ❌ | |
| 8 | Pages | ✅ / ❌ | |
| 9 | Export | ✅ / ❌ | |
| 10 | Import | ✅ / ❌ | |
| 11 | Generate Code | ✅ / ❌ | |
| 12 | Save | ✅ / ❌ | |
| 13 | Drag & Drop | ✅ / ❌ | |
| 14 | Real-Time Updates | ✅ / ❌ | |
| 15 | Box Model | ✅ / ❌ | |

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🎯 Next Steps After Testing

1. **Fix Critical Bugs:** Address any blocking issues found
2. **Enhance Drag & Drop:** Improve visual feedback and edge cases
3. **Add Undo/Redo UI:** Expose history controls in toolbar
4. **Responsive Preview:** Add mobile/tablet preview modes
5. **Component Library:** Expand built-in components
6. **Keyboard Shortcuts:** Add Cmd/Ctrl+Z, Delete key, etc.
7. **Accessibility:** ARIA labels, keyboard navigation
8. **Advanced Styling:** CSS custom properties, animations
9. **Asset Management:** Image upload and media library
10. **Templates Gallery:** Pre-built page templates
