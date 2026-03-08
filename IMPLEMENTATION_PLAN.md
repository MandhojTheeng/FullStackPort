# Full Backend CMS Implementation Plan

## Information Gathered

### Current State:
1. **Admin Dashboard** (`src/app/admin/page.tsx`): Basic blog management only (create, delete posts)
2. **Data Storage**: Uses `data/blogs.json` for blog posts with admin credentials
3. **API Routes**:
   - `/api/blog` - GET, POST, DELETE blog posts
   - `/api/admin/login` - Admin authentication
   - `/api/contact` - POST contact messages (in-memory, lost on restart)
4. **Frontend Components**: All data is hardcoded:
   - `Hero.tsx` - Hardcoded "Santosh", "Full Stack Developer", stats
   - `About.tsx` - Hardcoded bio, skills, stats
   - `Projects.tsx` - Hardcoded project list
   - `Contact.tsx` - Hardcoded contact info, form not connected to backend
   - `Footer.tsx` - Hardcoded links and info
   - `Navbar.tsx` - Hardcoded navigation

### Required Changes:
1. Create comprehensive data store for all sections
2. Create API routes for all content management
3. Build improved admin dashboard with all sections management
4. Connect contact form to backend with database storage
5. Make all frontend sections fetch data from backend

---

## Plan

### Phase 1: Data Structure & API Routes

#### 1.1 Create unified data store (`data/site.json`)
```json
{
  "hero": { "title": "", "subtitle": "", "description": "", "cta": "", "image": "" },
  "about": { "title": "", "bio": "", "skills": [], "stats": [] },
  "projects": [],
  "contact": { "email": "", "phone": "", "location": "", "social": {} },
  "footer": { "copyright": "", "quickLinks": [] },
  "messages": []
}
```

#### 1.2 Create API Routes
- `GET /api/content` - Get all site content
- `PUT /api/content` - Update any section
- `GET /api/messages` - Get all contact messages (admin only)
- `DELETE /api/messages/:id` - Delete message (admin only)
- `POST /api/contact` - Save contact messages to file

### Phase 2: Improved Admin Dashboard

#### 2.1 New Admin Dashboard Features
- **Dashboard Home**: Overview stats (total posts, messages, projects)
- **Hero Section Editor**: Edit title, subtitle, description, image URL, CTA buttons
- **About Section Editor**: Edit bio, skills (add/remove), stats
- **Projects Editor**: CRUD operations for projects with image upload
- **Contact Section Editor**: Edit email, phone, location, social links
- **Footer Editor**: Edit quick links, copyright text
- **Messages View**: View/delete contact form submissions

#### 2.2 UI Improvements
- Modern dark/light theme with sidebar navigation
- Tab-based section management
- Real-time preview
- Image URL inputs with preview
- Rich text editor for bio/description
- Toast notifications for actions

### Phase 3: Frontend Integration

#### 3.1 Update Components to Fetch from API
- `Hero.tsx` - Fetch from `/api/content` → hero section
- `About.tsx` - Fetch from `/api/content` → about section
- `Projects.tsx` - Fetch from `/api/content` → projects
- `Contact.tsx` - Fetch contact info from API, submit to `/api/contact`
- `Footer.tsx` - Fetch from `/api/content` → footer

---

## Dependent Files to be Edited

### New Files to Create:
1. `data/site.json` - New unified data store
2. `src/app/api/content/route.ts` - Content management API
3. `src/app/api/messages/route.ts` - Contact messages API

### Files to Edit:
1. `src/app/admin/page.tsx` - Complete rewrite with all features
2. `src/components/Hero.tsx` - Fetch from API
3. `src/components/About.tsx` - Fetch from API
4. `src/components/Projects.tsx` - Fetch from API
5. `src/components/Contact.tsx` - Connect to backend
6. `src/components/Footer.tsx` - Fetch from API
7. `src/components/Navbar.tsx` - Fetch nav items from API (optional)

---

## Followup Steps

1. Create the data structure and API routes
2. Build the new admin dashboard with all sections
3. Update frontend components to fetch from API
4. Test the complete flow
5. Deploy and verify

