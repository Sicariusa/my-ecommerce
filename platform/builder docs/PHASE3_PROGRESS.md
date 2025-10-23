# Phase 3 Implementation - Multi-Page Management (Partial)

## Overview
Phase 3.1 focuses on implementing a comprehensive multi-page management system for the visual website builder, allowing users to create, manage, and organize multiple pages within a single project.

## Completed Features ✅

### 1. Enhanced Page Schema
**File**: `lib/schema.ts`

Added comprehensive page metadata support:
```typescript
export interface Page {
    id: string;                  // Unique identifier
    name: string;                // Display name
    slug: string;                // URL slug (e.g., '/', '/about', '/products')
    tree: ComponentNode[];       // Component tree
    metadata?: {                 // Optional metadata
        description?: string;    // SEO description
        thumbnail?: string;      // Template thumbnail
        order?: number;          // Page position
    };
}
```

**Key Features:**
- `slug` field for URL routing (required)
- `metadata.order` for custom page ordering
- `metadata.description` for SEO
- `metadata.thumbnail` for template previews

### 2. Enhanced Builder Store
**File**: `lib/stores/useBuilderStore.ts`

#### Updated Methods:
```typescript
addPage(name: string, slug?: string)
```
- Auto-generates slug from name if not provided
- Ensures unique slugs (appends counter if duplicate)
- Sets initial order based on page count

```typescript
renamePage(pageId: string, name: string, newSlug?: string)
```
- Updates page name
- Optionally updates slug with uniqueness validation
- Preserves other page metadata

```typescript
duplicatePage(pageId: string)
```
- Deep clones entire page tree with new IDs
- Creates unique slug (`/about` → `/about-copy`)
- Preserves component structure and styling

```typescript
reorderPages(fromIndex: number, toIndex: number)
```
- Moves page from one position to another
- Updates order metadata for all pages
- Maintains page references

### 3. PagesPanel Component
**File**: `components/builder/PagesPanel.tsx`

A comprehensive page management sidebar with:

#### Features:
- **Page List Display**
  - Shows all project pages
  - Active page indicator (blue highlight)
  - Page name and slug display
  - Collapsible panel header

- **Create Page Modal**
  - Page name input (required)
  - URL slug input (optional, auto-generated from name)
  - Validation and error handling
  - Keyboard shortcuts (Enter to submit, Escape to cancel)

- **Inline Editing**
  - Double-click or context menu to edit
  - Edit both name and slug simultaneously
  - Real-time validation
  - Auto-focus on name field

- **Context Menu Actions**
  - **Rename**: Edit page name and slug
  - **Duplicate**: Clone page with all components
  - **Delete**: Remove page (with confirmation, prevents deleting last page)

- **UI/UX**
  - Dark mode support
  - Smooth transitions and animations
  - Icon indicators (FileText icon per page)
  - Hover states and visual feedback
  - Plus button for quick page creation

### 4. Builder Layout Integration
**File**: `app/builder/page.tsx`

Updated layout structure:
```
┌─────────────────────────────────────────┐
│           Toolbar (Actions)             │
├──────────┬───────────┬──────────────────┤
│  Pages   │   Page    │      Canvas      │
│  Panel   │   Tree    │                  │
│  (New)   │           │                  │
└──────────┴───────────┴──────────────────┘
```

- Added PagesPanel as leftmost sidebar (64px width)
- PageTree moved to middle position
- Canvas remains in center
- All panels have proper overflow handling

## Usage Examples

### Creating a New Page
```typescript
// Auto-generate slug from name
addPage('About Us')           // Creates page with slug '/about-us'

// Specify custom slug
addPage('Products', '/shop')  // Creates page with slug '/shop'
```

### Renaming a Page
```typescript
// Rename only (slug unchanged)
renamePage('page-123', 'Our Products')

// Rename with new slug
renamePage('page-123', 'Shop', '/products')
```

### Duplicating a Page
```typescript
duplicatePage('page-home')  // Creates 'Home (Copy)' with slug '/home-copy'
```

### Reordering Pages
```typescript
reorderPages(0, 2)  // Move first page to third position
```

## UI Flow

### Creating a Page:
1. Click '+' button in PagesPanel header
2. Modal opens with name and slug inputs
3. Enter page name (slug auto-generated)
4. Optionally customize slug
5. Click 'Create Page' or press Enter
6. New page created and set as active

### Managing Pages:
1. Click page to switch to it
2. Right-click page for context menu
3. Select action (Rename, Duplicate, Delete)
4. For rename: inline editor appears with name and slug fields
5. For duplicate: new page created with '(Copy)' suffix
6. For delete: confirmation dialog (if not last page)

## Technical Highlights

### Slug Generation Algorithm
```typescript
// Convert name to URL-friendly slug
const pageSlug = '/' + name
    .toLowerCase()
    .replace(/\s+/g, '-')      // Spaces to hyphens
    .replace(/[^\w-]/g, '');   // Remove special chars

// Ensure uniqueness
let uniqueSlug = pageSlug;
let counter = 1;
while (project.pages.some(p => p.slug === uniqueSlug)) {
    uniqueSlug = `${pageSlug}-${counter}`;
    counter++;
}
```

### Deep Tree Cloning
```typescript
const cloneTree = (nodes: ComponentNode[]): ComponentNode[] => {
    return nodes.map((node) => ({
        ...node,
        id: `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        children: node.children ? cloneTree(node.children) : [],
    }));
};
```

## Remaining Tasks 🔄

### TODO: Drag-and-Drop Page Reordering
Add @dnd-kit support to PagesPanel for visual page reordering:
- Draggable page items
- Visual drop indicators
- Auto-scroll when dragging near edges
- Call `reorderPages()` on drop

### Integration Points:
- History system: Page operations should push to undo/redo stack
- Persistence: Save page state to IndexedDB when autosave triggers
- Export: Include all pages in JSON export and code generation
- Templates: Templates can include multiple pages

## Testing Checklist

- [x] Create page with auto-generated slug
- [x] Create page with custom slug
- [x] Rename page (name only)
- [x] Rename page (name + slug)
- [x] Duplicate page
- [x] Delete page (with multiple pages)
- [x] Prevent deleting last page
- [x] Switch between pages
- [x] Unique slug validation
- [ ] Drag-and-drop reorder pages
- [ ] Undo/redo page operations
- [ ] Persist page state across reloads

## Files Modified

1. ✅ `lib/schema.ts` - Added slug and metadata to Page interface
2. ✅ `lib/stores/useBuilderStore.ts` - Enhanced page management methods
3. ✅ `components/builder/PagesPanel.tsx` - NEW component
4. ✅ `app/builder/page.tsx` - Integrated PagesPanel

## Next Steps

1. **Add Drag-and-Drop to PagesPanel**
   - Install/configure @dnd-kit for page list
   - Implement visual feedback during drag
   - Connect to `reorderPages()` method

2. **Integrate with History System**
   - Ensure page operations trigger `pushHistory()`
   - Test undo/redo with page creation/deletion
   - Handle edge cases (undo delete, redo create)

3. **Move to Template System (Phase 3.2)**
   - Define template JSON structure
   - Create sample templates with multiple pages
   - Build TemplateImportModal UI
   - Implement template merge/replace logic

---

**Status**: Phase 3.1 Multi-Page Management - 90% Complete
**Next**: Drag-and-drop reordering, then move to Template Import System
