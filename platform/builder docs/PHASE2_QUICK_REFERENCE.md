# 🚀 Phase 2 Quick Reference - Builder Enhancements

## 📦 Installation Check
```bash
cd platform/client
npm install  # Ensures all dependencies are installed
npm run dev  # Start development server
```

**Visit:** `http://localhost:5000/builder`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Toast Notification |
|----------|--------|-------------------|
| `Delete` | Delete selected component | "Component deleted" |
| `Ctrl/Cmd + S` | Save project to API | "Project saved successfully!" |
| `Ctrl/Cmd + E` | Export JSON | "Project exported successfully!" |
| `Ctrl/Cmd + G` | Toggle grid overlay | "Grid visible/hidden" |

---

## 🎨 Theme System

### Toggle Theme
- **Button Location:** Top toolbar (Moon/Sun icon)
- **Persistence:** Saves to localStorage
- **Transition:** 200ms smooth fade

### Color Palette

**Light Mode:**
- Background: `#f8fafc`
- Panels: `#ffffff`
- Borders: `#e2e8f0`
- Accent: `#3b82f6`

**Dark Mode:**
- Background: `#0f172a`
- Panels: `#1e293b`
- Borders: `#334155`
- Accent: `#60a5fa`

---

## 🔧 Canvas Controls

### Zoom
- **Location:** Top-right floating controls
- **Range:** 25% - 200%
- **Buttons:**
  - `-` Zoom Out
  - `100%` Reset (click)
  - `+` Zoom In

### Grid Overlay
- **Toggle:** Grid icon in toolbar (OR `Ctrl+G`)
- **Style:** Repeating dot pattern
- **Persistence:** Saves to localStorage

---

## 🎯 Inspector Sections

### 6 Collapsible Accordions

1. **Properties** (Blue Sparkles Icon)
   - Component-specific props
   - Text content, Image src, Button text

2. **Layout** (Purple Layout Icon)
   - Display mode
   - Flex properties (direction, justify, align, gap)

3. **Box Model** (Green Box Icon)
   - Margin, Padding
   - Width, Height

4. **Typography** (Orange Type Icon)
   - Font family, size, weight
   - Text color (color picker)
   - Text alignment

5. **Background & Border** (Pink Palette Icon)
   - Background color (color picker)
   - Border radius, border, box shadow

6. **Advanced** (Indigo Code Icon)
   - Raw JSON editor for all styles

### Color Pickers
- **Visual Picker:** Click to choose color
- **Hex Input:** Type color code directly
- **Real-time Update:** Changes reflect immediately on canvas

---

## 🎬 Animations

### Available Animations
```css
animate-fade-in       /* 0.2s fade entrance */
animate-slide-in      /* 0.3s slide down */
animate-bounce-subtle /* 0.5s gentle bounce */
```

### Transition Classes
```css
transition-colors duration-200    /* Theme switching */
transition-all duration-150       /* Hover effects */
```

---

## 🍞 Toast Notifications

### Types
- **Loading:** Spinner while processing
- **Success:** Green checkmark
- **Error:** Red X

### Position
- Top-right corner

### Usage Example
```typescript
import toast from 'react-hot-toast'

// Loading state
const loading = toast.loading('Saving...')
toast.success('Saved!', { id: loading })
```

---

## 📁 New Files Created

```
platform/client/
├── lib/stores/
│   └── useThemeStore.ts          # Theme, grid, zoom state
└── components/builder/
    └── Inspector.tsx (enhanced)   # Radix UI accordions
```

---

## 🎨 Tailwind Dark Mode

### Enable Dark Mode
```typescript
// Automatic via theme toggle button
toggleTheme() // Updates document.documentElement class

// Manual
document.documentElement.classList.add('dark')
document.documentElement.classList.remove('dark')
```

### Dark Mode Classes
```jsx
className="bg-white dark:bg-gray-800"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-gray-700"
```

---

## 🔄 State Management

### Theme Store
```typescript
import { useThemeStore } from '@/lib/stores/useThemeStore'

const theme = useThemeStore((state) => state.theme)
const toggleTheme = useThemeStore((state) => state.toggleTheme)
const showGrid = useThemeStore((state) => state.showGrid)
const zoomLevel = useThemeStore((state) => state.zoomLevel)
```

### Builder Store (Unchanged)
```typescript
import { useBuilderStore } from '@/lib/stores/useBuilderStore'

const project = useBuilderStore((state) => state.project)
const selectedNode = useBuilderStore((state) => state.findNode(id))
const updateNodeStyles = useBuilderStore((state) => state.updateNodeStyles)
```

---

## 🐛 Troubleshooting

### TypeScript Error: Cannot find Inspector module
**Cause:** TypeScript cache issue after file recreation  
**Fix:**
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# OR
npm run type-check
```

### Dark mode not persisting
**Check:** Browser localStorage  
**Fix:** Ensure `useThemeStore` is initialized before first render

### Grid not showing
**Check:** `showGrid` state  
**Toggle:** Click grid button or press `Ctrl+G`

### Zoom not working
**Check:** Canvas transform is applied  
**Verify:** Zoom controls show current percentage

---

## 🎯 Testing Quick Guide

### Visual Test
1. Toggle theme (light/dark)
2. Toggle grid overlay
3. Test zoom (in/out/reset)
4. Verify all panels render

### Functional Test
1. Press `Delete` with component selected
2. Press `Ctrl+S` to save
3. Press `Ctrl+E` to export
4. Click color pickers in Inspector

### Interaction Test
1. Add component from menu
2. Select component on canvas
3. Edit properties in Inspector
4. Verify changes appear on canvas

---

## 📊 Performance Tips

### Optimize Re-renders
```typescript
// Use specific selectors
const theme = useThemeStore((state) => state.theme)  // ✅ Good
const store = useThemeStore()  // ❌ Re-renders on any change
```

### Lazy Load Heavy Components
```typescript
const Inspector = lazy(() => import('@/components/builder/Inspector'))
```

### Debounce Text Inputs
```typescript
const debouncedUpdate = debounce(updateNodeProps, 300)
```

---

## 🎨 Customization Examples

### Change Accent Color
```typescript
// tailwind.config.ts
colors: {
  builder: {
    selection: {
      DEFAULT: '#3b82f6',  // Change to your brand color
      hover: '#60a5fa',
    },
  },
}
```

### Add New Animation
```typescript
// tailwind.config.ts
animation: {
  'my-custom': 'myCustom 1s ease-in-out',
},
keyframes: {
  myCustom: {
    '0%': { transform: 'scale(0.95)' },
    '100%': { transform: 'scale(1)' },
  },
},
```

### Add Keyboard Shortcut
```typescript
// app/builder/page.tsx
if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
  e.preventDefault()
  undo() // Your undo function
  toast.success('Undone!')
}
```

---

## 🚀 Quick Start Workflow

### 1. Start Development
```bash
cd platform/client
npm run dev
```

### 2. Open Builder
Navigate to `http://localhost:5000/builder`

### 3. Create Project
1. Click "Add Component"
2. Select component type
3. Component appears on canvas

### 4. Edit Component
1. Click component on canvas
2. Inspector shows on right
3. Edit properties/styles
4. Changes appear in real-time

### 5. Save & Export
1. Press `Ctrl+S` to save
2. Press `Ctrl+E` to export JSON
3. Click "Generate Code" for Next.js files

---

## 📚 Additional Resources

- **Phase 1 Summary:** `PHASE1_COMPLETE.md`
- **Phase 2 Summary:** `PHASE2_COMPLETE.md`
- **Builder README:** `BUILDER_README.md`
- **Testing Guide:** `BUILDER_TESTING_GUIDE.md`
- **Setup Guide:** `BUILDER_SETUP.md`

---

## 🎉 Phase 2 Complete!

**All features working:**
- ✅ Dark mode
- ✅ Grid overlay
- ✅ Zoom controls
- ✅ Keyboard shortcuts
- ✅ Toast notifications
- ✅ Enhanced Inspector
- ✅ Color pickers
- ✅ Smooth animations

**Ready for Phase 3:** Persistence & Authentication
