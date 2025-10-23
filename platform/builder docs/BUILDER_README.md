# 🎨 Low-Code / No-Code Website Builder

A production-ready visual website builder built with Next.js 15, React, TypeScript, and Tailwind CSS. Create, edit, and export websites using a powerful drag-and-drop interface.

## ✨ Features

### Core Builder
- **Visual Canvas:** WYSIWYG editor with real-time preview
- **Component Library:** Pre-built components (Section, Text, Image, Button, Container, Div)
- **Inspector Panel:** Live property and style editing
- **Page Tree:** Hierarchical view of pages and components
- **Drag & Drop:** Intuitive component placement and reordering

### Component System
- **Extensible Registry:** Easy to add custom components
- **Style Editor:** Complete CSS control (layout, box model, typography, background)
- **Props Management:** Component-specific property editors
- **Nesting Support:** Build complex layouts with nested components

### Data Management
- **Project Structure:** JSON-based serializable format
- **Import/Export:** Full project backup and restore
- **API Persistence:** Save/load projects via REST API
- **LocalStorage Sync:** Auto-save to browser storage

### Code Generation
- **Next.js Export:** Generate production-ready Next.js pages
- **Clean Code:** Readable, idiomatic React/TypeScript output
- **File Structure:** Complete app structure with layout, pages, and styles
- **Documentation:** Auto-generated README for exported projects

---

## 🚀 Quick Start

### Installation

```bash
# Navigate to client directory
cd platform/client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Builder

Open http://localhost:3000/builder in your browser.

---

## 📁 Project Structure

```
platform/client/
├── app/
│   ├── builder/
│   │   └── page.tsx              # Main builder page
│   └── api/
│       └── projects/
│           ├── route.ts           # List/create projects
│           └── [id]/route.ts      # Get/delete project by ID
├── components/
│   └── builder/
│       ├── Canvas.tsx             # Visual editor canvas
│       ├── PageTree.tsx           # Hierarchical page/component tree
│       └── Inspector.tsx          # Property/style editor
├── lib/
│   ├── schema.ts                  # Type definitions and sample template
│   ├── componentRegistry.tsx      # Component registry and renderers
│   ├── stores/
│   │   └── useBuilderStore.ts    # Zustand state management
│   └── utils/
│       └── importExport.ts        # JSON and code generation utilities
└── data/
    └── projects/                  # Saved projects (JSON files)
```

---

## 🏗️ Architecture

### State Management

**Zustand Store** (`useBuilderStore`)
- Project state (pages, components, metadata)
- Active page selection
- Selected node tracking
- CRUD operations (add, update, delete, move nodes)
- LocalStorage persistence

### Component Registry

Components are registered with:
- **Type identifier:** String key (e.g., "Text", "Button")
- **React component:** Rendering function
- **Default props:** Initial property values
- **Default styles:** Initial CSS styles

### JSON Schema

```typescript
interface Project {
  id: string;
  name: string;
  pages: Page[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    description: string;
  };
}

interface Page {
  id: string;
  name: string;
  tree: ComponentNode[];
}

interface ComponentNode {
  id: string;
  type: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  children: ComponentNode[];
}
```

---

## 🎯 Usage Guide

### Adding Components

1. Click **"Add Component"** in toolbar
2. Select component type from dropdown
3. Component appears on canvas
4. Edit properties in Inspector panel

### Editing Components

1. **Select:** Click component on canvas or in PageTree
2. **Properties:** Edit in Inspector → Properties section
3. **Styles:** Modify in Inspector → Layout, Typography, etc.
4. **Delete:** Right-click → Delete (or use Inspector)

### Managing Pages

1. **Create:** Click "+" in PageTree header
2. **Switch:** Click page name in PageTree
3. **Rename:** Right-click page → Rename
4. **Delete:** Right-click page → Delete (requires >1 page)

### Saving & Loading

**Save to Server:**
```typescript
POST /api/projects
Body: { project JSON }
```

**Export JSON:**
```typescript
File → Export JSON
// Downloads: project-name.json
```

**Import JSON:**
```typescript
File → Import JSON
// Opens file picker
```

### Code Generation

**Generate Next.js App:**
```typescript
Generate Code button
// Downloads multiple files:
// - app_layout.tsx
// - app_index.tsx (or page-name.tsx)
// - app_globals.css
// - README.md
```

---

## 🔧 Extending the Builder

### Adding Custom Components

```typescript
// 1. Define component
function MyCustomComponent({ node, children, isSelected, onClick }: BuilderComponentProps) {
  return (
    <div
      data-node-id={node.id}
      style={{
        ...node.styles,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
      }}
      onClick={onClick}
    >
      {/* Your custom markup */}
      {children}
    </div>
  );
}

// 2. Register component
import { registerComponent } from '@/lib/componentRegistry';

registerComponent(
  'MyCustomComponent',
  MyCustomComponent,
  { customProp: 'default value' }, // Default props
  { padding: '16px', backgroundColor: '#fff' } // Default styles
);

// 3. Now available in "Add Component" menu
```

### Custom Property Editors

Add custom inputs in `Inspector.tsx`:

```typescript
{selectedNode.type === 'MyCustomComponent' && (
  <InputField
    label="Custom Property"
    value={localProps.customProp}
    onChange={(val) => handlePropChange('customProp', val)}
  />
)}
```

### Custom API Endpoints

Extend `/api/projects/` for:
- Template marketplace
- Version control
- Collaboration features
- Asset uploads

---

## 🧪 Testing

See [BUILDER_TESTING_GUIDE.md](../BUILDER_TESTING_GUIDE.md) for comprehensive test cases and manual testing playbook.

**Quick Test:**
```bash
npm run dev
# Open http://localhost:3000/builder
# Add a Section → inside add Text → edit text → export JSON
```

---

## 🎨 Built-in Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Section** | Semantic section element | `role` |
| **Div** | Generic container | - |
| **Container** | Flexbox container | - |
| **Text** | Text element with configurable tag | `text`, `tag` (p/h1/h2/etc) |
| **Image** | Image element | `src`, `alt` |
| **Button** | Button element | `text` |

### Style Properties

All components support:
- **Layout:** display, width, height, flexbox properties
- **Box Model:** margin, padding, border, border-radius
- **Typography:** font-size, font-weight, text-align, color, line-height
- **Background:** background-color, background-image, background-size
- **Advanced:** Raw CSS as JSON

---

## 🔑 Key Technologies

- **Next.js 15:** App Router, React Server Components, API Routes
- **React 18:** Functional components, hooks
- **TypeScript:** Full type safety
- **Tailwind CSS:** Utility-first styling
- **@dnd-kit:** Drag and drop library
- **Zustand:** State management
- **Lucide React:** Icon library

---

## 📊 Performance Considerations

- **Component Rendering:** Optimized with React.memo and selective re-renders
- **State Updates:** Minimal re-renders via Zustand selectors
- **Drag Operations:** Throttled sensor activation
- **Large Projects:** Tested with 50+ components
- **LocalStorage:** Partial persistence (project + active page only)

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # ESLint
npm run type-check       # TypeScript check
```

---

## 🐛 Troubleshooting

### TypeScript Errors on First Load
```bash
npm install
# Ensure @dnd-kit/core, zustand, lucide-react are installed
```

### Components Not Rendering
- Check browser console for React errors
- Verify component type matches registry key
- Check node.id is unique

### Drag & Drop Not Working
- Ensure @dnd-kit/core is installed
- Check DndContext wraps the builder page
- Verify draggable/droppable setup

### Save/Load Fails
- Check `data/projects/` directory exists
- Verify API routes return 200 status
- Check network tab for request/response

---

## 🚧 Roadmap

### v1.1
- [ ] Undo/Redo UI controls
- [ ] Keyboard shortcuts (Cmd+Z, Delete, Cmd+C/V)
- [ ] Responsive preview modes (mobile/tablet)
- [ ] Image upload widget

### v1.2
- [ ] Component library marketplace
- [ ] Pre-built templates gallery
- [ ] Advanced CSS (animations, transforms)
- [ ] Custom CSS classes

### v2.0
- [ ] Collaboration (real-time multi-user)
- [ ] Version control and history
- [ ] Asset management (images, fonts, files)
- [ ] SEO and meta tag editor
- [ ] Forms and interactivity

---

## 📄 License

This project is part of the LCNC E-commerce Platform.

---

## 🤝 Contributing

1. Follow Next.js and React best practices
2. Maintain TypeScript strict mode compliance
3. Add JSDoc comments for public APIs
4. Update BUILDER_TESTING_GUIDE.md for new features
5. Keep components modular and reusable

---

## 💡 Tips & Tricks

### Quick Component Addition
Use "Add Component" dropdown for fastest workflow.

### Precise Styling
Use Inspector → Advanced → Raw Styles (JSON) for exact CSS control.

### Backup Projects
Regularly export JSON for version control or backups.

### Code Review
Always review generated code before production deployment.

### Performance
Keep component trees < 100 nodes for optimal performance.

---

## 📞 Support

For issues or questions:
1. Check [BUILDER_TESTING_GUIDE.md](../BUILDER_TESTING_GUIDE.md)
2. Review browser console for errors
3. Verify all dependencies are installed
4. Check TypeScript compilation

---

**Built with ❤️ using Next.js, React, and modern web technologies.**
