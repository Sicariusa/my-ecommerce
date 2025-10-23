# 🚀 Website Builder - Quick Reference

## Access
```
http://localhost:3000/builder
```

## Quick Actions

### Add Component
1. Click "Add Component" button (top toolbar)
2. Select component type
3. Component appears on canvas

### Edit Component
1. Click component on canvas
2. Edit in Inspector (right panel)
3. Changes apply instantly

### Manage Pages
1. Click "+" in PageTree (left panel)
2. Enter page name
3. Switch pages by clicking page name

### Save Project
```
Click "Save" button → Saves to data/projects/
```

### Export/Import
```
File → Export JSON → Downloads .json file
File → Import JSON → Upload .json file
```

### Generate Code
```
Click "Generate Code" → Downloads Next.js files
```

## Keyboard Shortcuts (Planned)
- `Cmd/Ctrl + Z` - Undo (not yet exposed in UI)
- `Cmd/Ctrl + Shift + Z` - Redo (not yet exposed in UI)
- `Delete` - Delete selected (use context menu for now)
- `Cmd/Ctrl + C` - Copy (not yet exposed in UI)
- `Cmd/Ctrl + V` - Paste (not yet exposed in UI)

## Component Types
- Section
- Div
- Container
- Text
- Image
- Button

## Inspector Sections
1. **Properties** - Component-specific props
2. **Layout** - Display, width, height, flexbox
3. **Box Model** - Margin, padding, border
4. **Typography** - Font size, weight, color
5. **Background** - Color, image
6. **Advanced** - Raw JSON styles

## File Locations

### Source Code
```
platform/client/
├── app/builder/page.tsx              # Main UI
├── components/builder/               # UI components
├── lib/schema.ts                     # Types
├── lib/componentRegistry.tsx         # Components
├── lib/stores/useBuilderStore.ts    # State
└── lib/utils/importExport.ts        # Import/export
```

### Saved Projects
```
platform/client/data/projects/*.json
```

### API Routes
```
/api/projects       - List/create
/api/projects/:id   - Get/delete
```

## Documentation
- [BUILDER_README.md](BUILDER_README.md) - Full guide
- [BUILDER_TESTING_GUIDE.md](BUILDER_TESTING_GUIDE.md) - Test cases
- [BUILDER_SETUP.md](BUILDER_SETUP.md) - Installation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

## Troubleshooting

### Builder won't load
```bash
npm install
npm run dev
# Clear cache: localStorage.clear() in console
```

### TypeScript errors
Already installed and configured. If you see warnings about implicit `any` types, they're non-blocking.

### Save fails
```bash
mkdir -p platform/client/data/projects
```

### Drag & drop issues
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

## Development Commands
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Run production
npm run lint          # Lint code
npm run type-check    # Check types
```

## Quick Test
1. ✅ Load builder
2. ✅ Click on hero section
3. ✅ Change background color
4. ✅ Add new Text component
5. ✅ Export JSON

## Support
Check console (F12) for errors and refer to documentation files.

---

**Built with Next.js 15 + React 18 + TypeScript + Tailwind CSS**
