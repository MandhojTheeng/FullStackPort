# Blog Feature Implementation Plan

## Tasks:
1. [x] Install bcryptjs for password hashing
2. [x] Create blog data storage (JSON file)
3. [x] Create API routes for blog posts (GET, POST)
4. [x] Create API route for admin authentication
5. [x] Create Blog page (frontend)
6. [x] Create Admin Login page
7. [x] Create Admin Dashboard page (create/delete posts)
8. [x] Update Navbar with Blog link and Admin icon

## Files created:
- src/app/blog/page.tsx - Blog listing page
- src/app/admin/login/page.tsx - Admin login page
- src/app/admin/page.tsx - Admin dashboard
- src/app/api/blog/route.ts - Blog API
- src/app/api/admin/login/route.ts - Admin auth API
- data/blogs.json - Blog data storage
- scripts/setup-admin.js - Admin password setup script

## Files updated:
- src/components/Navbar.tsx - Added Blog link and Admin icon
- data/blogs.json - Updated admin password hash

## Admin Credentials:
- Username: admin
- Password: admin123

## How to change admin password:
1. Edit scripts/setup-admin.js and change the password
2. Run: node scripts/setup-admin.js
3. Copy the new hash to data/blogs.json

