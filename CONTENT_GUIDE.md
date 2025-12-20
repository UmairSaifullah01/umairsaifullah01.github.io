# Portfolio Content Management Guide

## Overview
Your portfolio website now uses a **JSON-based content management system**. This allows you to update all content on your website by simply editing the `assets/json/content.json` file, without touching any HTML code.

## File Location
📁 **Content File:** `assets/json/content.json`

## How to Update Content

### 1. **Sidebar Information**
Update your personal information, contacts, and social media links:

```json
"sidebar": {
  "name": "Your Name",
  "title": "Your Job Title",
  "avatar": "./assets/images/your-photo.jpg",
  "contacts": [...],
  "social": [...]
}
```

**To update:**
- Change `name` to update your display name
- Change `title` to update your job title
- Update contact information in the `contacts` array
- Update social media links in the `social` array

### 2. **About Section**
Update your introduction, services, testimonials, and clients:

```json
"about": {
  "title": "About me",
  "description": ["Paragraph 1", "Paragraph 2"],
  "services": [...],
  "testimonials": [...],
  "clients": [...]
}
```

**To add a new service:**
```json
{
  "icon": "./assets/images/icon-name.svg",
  "title": "Service Name",
  "description": "Service description"
}
```

**To add a new testimonial:**
```json
{
  "name": "Person Name",
  "avatar": "./assets/images/testimonial-photo.jpg",
  "role": "Their Job Title",
  "text": "\"Their testimonial quote\""
}
```

**To add a new client:**
```json
{
  "name": "Client Name",
  "logo": "./assets/images/client-logo.png",
  "link": "https://client-website.com"
}
```

### 3. **Resume Section**
Update your work experience, education, tools, and skills:

```json
"resume": {
  "title": "Resume",
  "experience": [...],
  "education": [...],
  "tools": [...],
  "skills": [...]
}
```

**To add a new job experience:**
```json
{
  "position": "Job Title at Company",
  "period": "YYYY-MM — YYYY-MM",
  "description": [
    "• Responsibility 1",
    "• Responsibility 2",
    "• Responsibility 3"
  ]
}
```

**To add a new skill:**
```json
{
  "name": "Skill Name",
  "percentage": 85
}
```

**To add a new tool:**
```json
{
  "name": "Tool Name",
  "logo": "./assets/images/tool-logo.png",
  "link": "https://tool-website.com"
}
```

## Important Notes

### ⚠️ JSON Syntax Rules
1. **Always use double quotes** (`"`) for strings, never single quotes (`'`)
2. **No trailing commas** - Remove the comma after the last item in an array or object
3. **Escape special characters** - Use `\"` for quotes inside strings
4. **Validate your JSON** - Use a JSON validator (like jsonlint.com) before saving

### 🖼️ Adding Images
1. Place your image in the appropriate folder:
   - Profile photos: `assets/images/`
   - Testimonial photos: `assets/images/`
   - Client logos: `assets/images/`
   - Tool logos: `assets/images/`
2. Reference the image in JSON using the relative path: `"./assets/images/filename.png"`

### 🌐 Testing Locally
Due to browser security (CORS), you need to run a local web server to test changes:

**Option 1: Python (Recommended)**
```bash
cd d:\Website\umairsaifullah01.github.io
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Option 2: Node.js**
```bash
npx http-server -p 8000
```

**Option 3: VS Code**
Install the "Live Server" extension and click "Go Live"

### 🚀 Deploying Changes
Since your website is hosted on GitHub Pages:
1. Edit `assets/json/content.json`
2. Commit and push to GitHub:
   ```bash
   git add assets/json/content.json
   git commit -m "Updated portfolio content"
   git push
   ```
3. GitHub Pages will automatically update your live site

## Quick Edit Examples

### Example 1: Update Your Job Title
Find this line in `content.json`:
```json
"title": "Senior Game Developer",
```
Change to:
```json
"title": "Lead Game Developer",
```

### Example 2: Add a New Experience
Find the `"experience"` array and add a new entry at the beginning:
```json
"experience": [
  {
    "position": "New Position at New Company",
    "period": "2025-03 — Present",
    "description": [
      "• New responsibility 1",
      "• New responsibility 2"
    ]
  },
  // ... existing experiences
]
```

### Example 3: Update Email
Find the email contact object:
```json
{
  "type": "email",
  "icon": "mail-outline",
  "title": "Email",
  "value": "newemail@example.com",
  "link": "mailto:newemail@example.com"
}
```

## Troubleshooting

### Content Not Updating?
1. **Check JSON syntax** - Use jsonlint.com to validate
2. **Clear browser cache** - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. **Check console for errors** - Press `F12` and look at the Console tab
4. **Verify file path** - Make sure image paths are correct

### Common Errors
- **"Unexpected token"** - Missing comma or extra comma
- **"Unexpected end of JSON"** - Missing closing bracket `}` or `]`
- **Content not loading** - CORS issue, use a local server (see Testing Locally section)

## File Structure
```
umairsaifullah01.github.io/
├── assets/
│   ├── json/
│   │   └── content.json          ← Edit this file
│   ├── js/
│   │   └── content-loader.js     ← Loads the JSON (don't edit)
│   └── images/                   ← Add your images here
└── index.html                    ← Main HTML (don't edit)
```

## Support
If you encounter any issues or need help updating content, refer to this guide or check the browser console for error messages.

---
**Last Updated:** December 2025
