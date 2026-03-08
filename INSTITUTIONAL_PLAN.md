# Institutional Website Transformation Plan

## Project Overview
- **Goal**: Transform personal 3D portfolio into institutional website similar to iertqa.com
- **Type**: Educational Institution Website
- **Design**: Professional, clean, institutional style (not 3D)

## Information Gathered from Current Files

### Current Structure:
- Current: 3D nature-themed personal portfolio
- Sections: Hero (3D), About, Projects, Contact, Footer
- Tech: Next.js, React, Three.js, Framer Motion, Tailwind
- Color: Green/nature theme (forest, moss, night colors)

### Target Structure (like iertqa.com):
- Professional institutional design
- Standard educational institution sections
- Clean, corporate color scheme

## Implementation Plan

### 1. Color Scheme Change
- **Current**: Green/nature theme (forest-500, moss-400)
- **New**: Professional blue/orange institutional theme
  - Primary: Blue (#1e40af - blue-800)
  - Secondary: Orange (#f97316 - orange-500)
  - Neutral: Slate colors for backgrounds

### 2. Component Updates Required

| Component | Current | New |
|-----------|---------|-----|
| Navbar3D | Glassmorphism green | Clean institutional nav with logo |
| Hero3D | 3D floating shapes | Hero with institute name, tagline, CTA |
| About3D | Skill spheres, 3D | Institute history, mission, vision |
| ProjectCard3D | 3D project cards | Course cards (no projects) |
| Contact3D | 3D form | Contact info + inquiry form |
| Footer3D | Social links | Quick links, contact info, social |

### 3. New Section Structure

```
├── Navbar (Institutional)
├── Hero (Institute welcome)
├── About (History, Mission, Vision)
├── Courses (Course cards)
├── Placements (Statistics, recruiters)
├── Faculty (Team cards)
├── Infrastructure (Facilities)
├── Contact (Form + Info)
└── Footer
```

### 4. Files to Modify/Create

1. `tailwind.config.js` - Add blue/orange colors
2. `src/app/globals.css` - Remove green styles, add institutional styles
3. `src/app/page.tsx` - New section structure
4. `src/components/Navbar.tsx` - Use existing non-3D version
5. Create new components:
   - `InstituteHero.tsx` - Hero section
   - `InstituteAbout.tsx` - About section  
   - `Courses.tsx` - Courses section
   - `Placements.tsx` - Placements section
   - `Facilities.tsx` - Infrastructure section

### 5. Design Principles
- Clean, professional appearance
- Easy to update content
- Mobile responsive
- Fast loading (remove 3D for performance)
- Placeholder text for customization

## Follow-up Steps
1. Update Tailwind config with new colors
2. Update globals.css with institutional styles
3. Create new components
4. Update page.tsx with new structure
5. Test and verify

