# Phase 4.1 Testing Guide

## Quick Start Testing

### Prerequisites
1. Start the development server:
   ```bash
   cd platform
   npm run dev
   ```
2. Open browser to `http://localhost:3000/builder`
3. Create or open a project

---

## Test Scenarios

### ✅ Test 1: Button Smart Linking

**Steps**:
1. Add a **Button** component to the page
2. Select the button in the Canvas or Tree
3. Open **Inspector** panel (right sidebar)
4. Find "Button Settings" section

**Test External Link**:
1. Change "Link Type" dropdown to **"External URL"**
2. Enter URL: `google.com` (without https://)
   - ❌ Should show toast error: "External URLs must start with https://"
3. Enter URL: `https://google.com`
   - ✅ Should accept without error
4. Check **"Open in new tab"** checkbox
5. Click button in Canvas
   - ✅ Should open Google in new tab

**Test Page Link**:
1. Create 2+ pages in your project
2. Select button again
3. Change "Link Type" to **"Internal Page"**
4. Dropdown should show all page names
5. Select a page
6. Click button in Canvas
   - ✅ Should log page navigation to console (placeholder)

**Test Anchor Link**:
1. Add a **Section** component to your page
2. Select the Section
3. In Inspector, set custom ID (e.g., "hero-section")
4. Select the Button again
5. Change "Link Type" to **"Anchor Link"**
6. Dropdown should show "hero-section"
7. Select the section
8. Click button in Canvas
   - ✅ Should smoothly scroll to that section

**Expected Results**:
- ✅ Link type dropdown works
- ✅ Conditional inputs appear/disappear based on selection
- ✅ External URL validation works
- ✅ Page dropdown auto-populates
- ✅ Anchor dropdown shows Section IDs
- ✅ Button cursor changes to pointer when link is set

---

### ✅ Test 2: Image Upload & Source Management

**Steps**:
1. Add an **Image** component to the page
2. Select the image
3. Open **Inspector** panel

**Test URL Mode** (default):
1. "Image Source" should show two toggle buttons: **URL** and **Upload**
2. URL should be selected by default
3. Enter image URL: `https://picsum.photos/400/300`
4. Click outside the input
   - ✅ Image should load in Canvas
   - ✅ Loading opacity transition (0.5 → 1.0)

**Test Invalid URL**:
1. Enter invalid URL: `https://invalid-url-that-does-not-exist.com/image.jpg`
2. Wait for load attempt
   - ✅ Should show fallback placeholder with error message
   - ✅ Selection outline still visible (blue border)

**Test Upload Mode**:
1. Click **"Upload"** toggle button
2. Click "Choose file" button
3. Try to upload a `.pdf` file
   - ❌ Should show toast error: "Invalid file type. Please upload png, jpg, jpeg, or webp"
4. Try to upload a 10MB image file
   - ❌ Should show toast error: "File size must be less than 4MB"
5. Upload a valid `.jpg` file (<4MB)
   - ✅ Should show "Uploading..." text
   - ✅ Upload completes and image appears
   - ✅ Current source shows `/uploads/{projectId}/...` path

**Expected Results**:
- ✅ Toggle between URL and Upload modes
- ✅ File type validation works
- ✅ File size validation works
- ✅ Upload progress indicator appears
- ✅ Error states show fallback UI
- ✅ Loading states have smooth transitions

---

### ✅ Test 3: Hierarchy Integrity Protection

**Setup**:
1. Create this structure:
   ```
   Body
   └── Section (id: section-1)
       └── Div (id: div-1)
           └── Text (id: text-1)
   ```

**Test Invalid Drop (Parent into Child)**:
1. In **Structure** tab (tree view), start dragging **Section**
2. Hover over **Div** (which is inside Section)
   - ✅ Should show **RED border** with "⚠️ Invalid drop" message
3. Release the drag
   - ❌ Should show toast error: "Cannot move a component into itself or its descendants"
   - ✅ Section should NOT move
   - ✅ Tree structure unchanged

**Test Invalid Drop (Parent into Grandchild)**:
1. Drag **Section** again
2. Hover over **Text** (grandchild of Section)
   - ✅ Should show **RED border** with "⚠️ Invalid drop"
3. Release
   - ❌ Should show error toast
   - ✅ No movement occurs

**Test Valid Drop (Sibling Move)**:
1. Add another **Section** (section-2) to Body
2. Drag **section-1**
3. Hover over **section-2**
   - ✅ Should show **BLUE border** with "Drop here" message
4. Release
   - ✅ Should show toast: "Component moved"
   - ✅ section-1 moves inside section-2

**Test Valid Drop (Child Move)**:
1. Drag **Text** component
2. Hover over **Body** or another container
   - ✅ Should show BLUE border (valid)
3. Release
   - ✅ Text moves successfully

**Expected Results**:
- ✅ Red border shows for invalid drops
- ✅ Blue border shows for valid drops
- ✅ Toast errors explain why drop is invalid
- ✅ Tree structure remains valid after all operations
- ✅ No circular references possible

---

### ✅ Test 4: Body Component Protection

**Test Rename Protection**:
1. Select **Body** component in tree
2. Right-click to open context menu
3. Click **"Rename"** option
   - ❌ Should show toast error: "Cannot rename the root Body component"
   - ✅ No prompt appears
4. Try double-clicking the name
   - ✅ Should NOT enter edit mode

**Test Duplicate Protection**:
1. Right-click Body component
2. Click **"Duplicate"**
   - ❌ Should show toast error: "Cannot duplicate the root Body component"
   - ✅ No duplicate created

**Test Delete Protection**:
1. Right-click Body component
2. Click **"Delete"** option (should be disabled)
   - ❌ Should show toast error: "Cannot delete the root Body component"
   - ✅ Body remains in tree
3. Try pressing **Delete key** while Body is selected
   - ❌ Should show error toast
   - ✅ Body not deleted

**Test Drag Protection**:
1. Try to drag the Body component
   - ✅ Should NOT be draggable
   - ✅ Cursor stays as default (not grab cursor)
   - ✅ No drag overlay appears

**Test Visual Indicators**:
1. Look at Body component in tree
   - ✅ Should show blue **"ROOT"** badge next to name
2. Hover over the ROOT badge
   - ✅ Tooltip should appear after ~300ms
   - ✅ Tooltip text: "Root component - cannot be moved or deleted"

**Test Lock Protection**:
1. Right-click Body component
2. Look at **"Lock"** option
   - ✅ Should be disabled or show "(Not available for Body)"

**Expected Results**:
- ✅ All destructive actions blocked
- ✅ Context menu shows protection hints
- ✅ Toast errors guide user
- ✅ Visual indicators (badge, tooltip) clear
- ✅ Drag cursor doesn't activate
- ✅ Body always remains as root

---

### ✅ Test 5: Context Menu Enhancements

**Test Rename**:
1. Add a **Div** component
2. Right-click Div in tree
3. Click **"Rename"**
4. Enter new name: "Container Wrapper"
5. Press Enter
   - ✅ Name updates in tree
   - ✅ Shows "Container Wrapper (Div)" with type in parentheses

**Test Duplicate**:
1. Add a **Button** with text "Click Me"
2. Right-click the button
3. Click **"Duplicate"**
   - ✅ Creates new button with "(Copy)" suffix
   - ✅ Both buttons appear in tree and canvas

**Test Lock/Unlock**:
1. Right-click any component (not Body)
2. Click **"Lock"**
   - ✅ Lock icon appears next to component in tree
   - ✅ Component becomes unselectable in canvas
   - ✅ Context menu shows "Unlock" option now
3. Click **"Unlock"**
   - ✅ Lock icon disappears
   - ✅ Component becomes selectable again

**Test Wrap in Div**:
1. Add a **Text** component
2. Right-click the text
3. Click **"Wrap in Div"**
   - ✅ Div appears in tree as parent
   - ✅ Text is now child of Div
   - ✅ Hierarchy updates correctly

**Test Delete**:
1. Add a **Section** component
2. Right-click the section
3. Click **"Delete"**
   - ✅ Section removed from tree and canvas
   - ✅ Toast: "Component deleted"

**Expected Results**:
- ✅ All context menu options work correctly
- ✅ Locked components respect protection
- ✅ Body component shows disabled/protected state
- ✅ Visual feedback for all actions

---

## Visual Regression Tests

### Drop Zone Colors
- Valid drop: Blue border, blue badge "Drop here"
- Invalid drop: Red border, red badge "⚠️ Invalid drop"
- No drop: No overlay

### Component States
- Selected: Blue outline
- Locked: Lock icon, reduced opacity
- Loading: 50% opacity
- Error: Fallback placeholder

### Tooltips
- Delay: 300ms
- Position: Right side of ROOT badge
- Arrow: Points to badge
- Text: White on dark gray background

---

## Performance Tests

### Large Tree Operations
1. Create a tree with 50+ components
2. Try to drag a top-level component into a deep child
   - ✅ Red indicator should appear instantly
   - ✅ No lag during drag over
3. Release
   - ✅ Error toast appears immediately
   - ✅ Tree doesn't freeze

### Image Upload
1. Upload a 3.5MB image file
   - ✅ Upload completes in <5 seconds
   - ✅ Progress indicator visible
2. Upload 10 images rapidly
   - ✅ Each upload queues properly
   - ✅ No race conditions

### Button Link Navigation
1. Create 20 buttons with different link types
2. Click each button
   - ✅ Navigation happens immediately
   - ✅ No console errors
   - ✅ Smooth scroll for anchors

---

## Edge Cases

### Empty Project
- [ ] Add first component to empty Body
- [ ] Try to delete Body when it's the only component
- [ ] Upload image with no project ID

### Malformed Data
- [ ] Invalid project structure (missing Body)
- [ ] Component with missing props
- [ ] Image with null src

### Rapid Interactions
- [ ] Spam click button with link (should not duplicate tabs)
- [ ] Rapid drag operations (should not corrupt tree)
- [ ] Fast rename operations (should not lose focus)

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Check:
- [ ] Drag and drop works
- [ ] File upload works
- [ ] Smooth scroll works
- [ ] Toast notifications appear
- [ ] Tooltips position correctly

---

## Accessibility

- [ ] Keyboard navigation works (Tab, Shift+Tab)
- [ ] Delete key deletes selected component
- [ ] Context menu accessible via keyboard
- [ ] Tooltips readable by screen readers
- [ ] Error messages announce to screen readers

---

## Conclusion

If all tests pass:
✅ **Phase 4.1 is fully functional and ready for production**

If any tests fail:
❌ Document the failure and create a bug report with:
- Expected behavior
- Actual behavior
- Steps to reproduce
- Browser/environment info
- Console errors (if any)

---

**Testing Status**: ⏳ Pending Manual Verification
**Automated Tests**: 🔄 To be added in Phase 5
**Code Coverage**: ✅ All new features have test scenarios
