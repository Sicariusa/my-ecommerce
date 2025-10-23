# Uploads Directory

This directory stores user-uploaded files (images, videos) organized by project ID.

Structure:
```
uploads/
  └── {projectId}/
      ├── image1.jpg
      ├── image2.png
      └── video1.mp4
```

**Note:** This directory should be added to `.gitignore` in production.
For production, use Supabase Storage, AWS S3, or similar cloud storage.
