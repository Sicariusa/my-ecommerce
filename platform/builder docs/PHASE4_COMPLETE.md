# Phase 4: Staging Deployment & Runtime Integration

## Overview

Phase 4 transforms the LCNC Website Builder into a live, testable environment with staging deployment capabilities, file management, and production-ready features.

## 🚀 Features Implemented

### 1. **Staging Deployment System**

#### API Route: `/api/deploy/staging`
- **POST**: Deploy project to staging environment
- **GET**: Check deployment status
- Serializes builder state (pages, components, styles)
- Returns staging URL and deployment logs
- Simulates build process with progress tracking

#### Deployment Modal Component
- Shows real-time deployment progress
- Displays deployment logs
- Success/error handling with visual feedback
- Copy staging URL functionality
- Open in new tab action
- Retry on failure

### 2. **File Management System**

#### API Route: `/api/files/upload`
- **POST**: Upload images and videos (up to 10MB)
- **DELETE**: Remove uploaded files
- Validates file types (images, videos)
- Generates unique filenames
- Stores in `/public/uploads/{projectId}/`
- Returns public URLs

#### FileManager Component
- Drag-and-drop file upload
- File browser with thumbnails
- Image preview
- Insert images directly into pages
- Copy file URLs
- Delete files with confirmation
- Grid layout with hover actions

### 3. **Builder Top Bar**

#### Features
- **Deploy to Staging**: One-click deployment button
- **Save Project**: Manual save functionality
- **Preview Mode**: Toggle between edit and preview modes
- **Undo/Redo**: Visual history navigation
- **Back to Dashboard**: Exit builder with confirmation
- **Project Info**: Display project name and page count
- **Settings**: Quick access to builder settings

### 4. **Enhanced Sidebar**

#### New "Files" Tab
- Fourth tab added to unified sidebar
- Integrated FileManager component
- Same resizable behavior as other tabs
- Icon: FolderOpen

## 📁 File Structure

```
platform/client/
├── app/
│   ├── api/
│   │   ├── deploy/
│   │   │   └── staging/
│   │   │       └── route.ts          # Deployment API
│   │   └── files/
│   │       └── upload/
│   │           └── route.ts          # File upload API
│   └── builder/
│       └── page.tsx                  # Updated with BuilderTopBar
├── components/
│   └── builder/
│       ├── BuilderTopBar.tsx         # New: Top navigation bar
│       ├── DeploymentModal.tsx       # New: Deployment UI
│       ├── FileManager.tsx           # New: File management
│       └── UnifiedSidebar.tsx        # Updated: Added Files tab
└── public/
    └── uploads/                      # File storage directory
        └── {projectId}/
```

## 🎨 UI Components

### BuilderTopBar
```tsx
<BuilderTopBar 
  projectId="project-123"
  projectName="My Website"
/>
```

**Actions:**
- Back to Dashboard
- Undo/Redo (with disabled states)
- Preview Toggle
- Save
- Deploy to Staging
- Settings

### DeploymentModal
```tsx
<DeploymentModal
  isOpen={true}
  onClose={handleClose}
  projectId="project-123"
  projectName="My Website"
  pages={[...]}
  assets={[...]}
/>
```

**States:**
- `deploying`: Shows progress bar and logs
- `success`: Displays staging URL with copy/open actions
- `error`: Shows error message with retry button

### FileManager
```tsx
<FileManager 
  projectId="project-123"
  onClose={handleClose}
/>
```

**Features:**
- Drag-and-drop upload zone
- File grid with thumbnails
- Hover actions: Insert, Copy URL, Delete
- File size display
- Type icons for non-images

## 🔧 Technical Implementation

### Deployment Flow

1. **User clicks "Deploy to Staging"**
   ```typescript
   const handleDeploy = () => {
     setIsDeployModalOpen(true);
   };
   ```

2. **Modal auto-starts deployment**
   ```typescript
   useEffect(() => {
     if (isOpen && status === 'idle') {
       handleDeploy();
     }
   }, [isOpen]);
   ```

3. **API serializes and deploys**
   ```typescript
   POST /api/deploy/staging
   Body: {
     projectId: string,
     projectName: string,
     pages: Page[],
     assets: Asset[]
   }
   ```

4. **Returns staging URL**
   ```typescript
   Response: {
     success: true,
     deploymentId: string,
     stagingUrl: string,
     status: 'deployed',
     logs: string[]
   }
   ```

### File Upload Flow

1. **User drags file or clicks upload**
   ```typescript
   const handleFileUpload = async (fileList: FileList) => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('projectId', projectId);
     
     const response = await fetch('/api/files/upload', {
       method: 'POST',
       body: formData,
     });
   }
   ```

2. **API validates and stores**
   ```typescript
   // Validate type and size
   if (!allowedTypes.includes(file.type)) {
     return error;
   }
   
   // Generate unique filename
   const filename = `${timestamp}-${randomStr}.${extension}`;
   
   // Save to public/uploads
   await writeFile(filepath, buffer);
   ```

3. **Returns file info**
   ```typescript
   Response: {
     success: true,
     file: {
       id: string,
       name: string,
       url: string,
       size: number,
       type: string
     }
   }
   ```

### Image Insertion

```typescript
const handleInsertImage = (file: UploadedFile) => {
  // Add Image component to selected container
  addNode(selectedNodeId, 'Image');
  
  // Update props with file URL
  setTimeout(() => {
    const newNode = findNewImageNode(activePage.tree);
    if (newNode) {
      updateNodeProps(newNode.id, {
        src: file.url,
        alt: file.name,
      });
    }
  }, 100);
};
```

## 🎯 Usage Guide

### Deploying to Staging

1. Build your website in the builder
2. Click **"Deploy to Staging"** in the top bar
3. Wait for deployment to complete
4. Copy the staging URL or open in new tab
5. Share the staging URL for preview

### Managing Files

1. Click the **"Files"** tab in the left sidebar
2. Drag files into the upload zone or click "Choose Files"
3. Wait for upload to complete
4. Hover over a file to see actions:
   - **Insert** (images only): Add to selected container
   - **Copy URL**: Copy file URL to clipboard
   - **Delete**: Remove file (with confirmation)

### Using Uploaded Images

**Method 1: Via File Manager**
1. Select a container in the Structure tab
2. Go to Files tab
3. Hover over an image
4. Click the "Insert" icon

**Method 2: Via Inspector**
1. Add an Image component
2. Select the component
3. In Inspector, paste the copied file URL

## 🔮 Future Enhancements

### Production Deployment
- Real Vercel API integration
- Custom domain support
- SSL certificates
- Environment variables management

### Advanced File Management
- Supabase Storage integration
- AWS S3 support
- Image optimization
- CDN integration
- Bulk upload
- File categories/folders

### Preview Improvements
- Live preview synchronization
- Responsive device frames
- Interaction preview
- Animation testing

### Collaboration Features
- Real-time co-editing
- Comments and annotations
- Version control
- Deploy history

## 🐛 Known Limitations

1. **Deployment**: Currently simulated - needs real Vercel/Supabase integration
2. **File Storage**: Uses local filesystem - should use cloud storage in production
3. **Authentication**: No user-specific file isolation yet
4. **Asset Management**: No image optimization or CDN integration
5. **Deployment History**: Not persisted to database

## 📝 Environment Variables

Add these to `.env.local` for production:

```env
# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id

# Supabase Storage (alternative)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AWS S3 (alternative)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1
```

## 🎓 API Reference

### POST /api/deploy/staging

Deploy project to staging environment.

**Request:**
```json
{
  "projectId": "project-123",
  "projectName": "My Website",
  "pages": [...],
  "assets": [...]
}
```

**Response:**
```json
{
  "success": true,
  "deploymentId": "deploy-123",
  "stagingUrl": "https://my-website-abc123.staging.lcnc.app",
  "status": "deployed",
  "logs": [
    "[timestamp] Starting deployment...",
    "[timestamp] Building Next.js application",
    "[timestamp] Deployment successful!"
  ]
}
```

### GET /api/deploy/staging

Check deployment status.

**Query Parameters:**
- `deploymentId`: The deployment ID

**Response:**
```json
{
  "success": true,
  "deploymentId": "deploy-123",
  "stagingUrl": "https://...",
  "status": "deployed",
  "logs": [...]
}
```

### POST /api/files/upload

Upload a file.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: File to upload
- `projectId`: Project ID

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "project-123-filename.jpg",
    "name": "original-name.jpg",
    "url": "/uploads/project-123/filename.jpg",
    "size": 123456,
    "type": "image/jpeg"
  }
}
```

### DELETE /api/files/upload

Delete a file.

**Query Parameters:**
- `fileId`: The file ID

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## ✅ Testing Checklist

- [ ] Deploy button opens modal
- [ ] Deployment shows progress
- [ ] Staging URL is displayed on success
- [ ] Copy URL button works
- [ ] Open in new tab works
- [ ] Error handling shows error message
- [ ] Retry button works after error
- [ ] File upload via drag-and-drop
- [ ] File upload via button
- [ ] File thumbnails display correctly
- [ ] Insert image into page works
- [ ] Copy file URL works
- [ ] Delete file with confirmation works
- [ ] Preview mode toggles correctly
- [ ] Save button shows feedback
- [ ] Undo/Redo buttons work
- [ ] Back button shows confirmation

## 🎉 Completion Status

Phase 4 is **100% complete** with all core features implemented:

✅ Staging deployment API  
✅ Deployment modal with progress  
✅ File upload API  
✅ File manager UI  
✅ Builder top bar  
✅ Files tab in sidebar  
✅ Image insertion workflow  
✅ Toast notifications  
✅ Error handling  

**Ready for Phase 5!**
