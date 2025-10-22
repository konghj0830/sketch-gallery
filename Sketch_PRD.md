# Sketch Gallery - Product Requirement Document (PRD)

## 1. Overview
**Sketch Gallery** is a client-side web service that allows users to upload, display, and manage their drawings (sketches) using only HTML, CSS, and JavaScript.  
All data is stored locally in the browser using the LocalStorage API — no backend or external database is used.

## 2. Objectives
- Provide a simple interface to upload, view, edit, and delete drawings.
- Enable users to react (like) and comment on drawings.
- Offer notification, filtering, and sorting features to enhance usability.
- Operate entirely offline using local data persistence.

## 3. Key Features

### 3.1 Create
- Upload a new sketch with the following fields:
  - Title
  - Description
  - Tags
  - Image (Base64-encoded)
- Display a success notification upon upload.

### 3.2 Read
- Display all sketches in a responsive grid layout.
- Each card shows:
  - Thumbnail image
  - Title
  - Upload date
  - Like count
- Clicking a card opens a modal with full details.

### 3.3 Update
- Users can edit their own sketches:
  - Modify title, description, tags, and image.
- Show a success alert when saving changes.

### 3.4 Delete
- Allow deletion of a sketch with confirmation.
- Remove entry from LocalStorage.
- Display a deletion notification.

### 3.5 Reactions (Likes)
- Each sketch includes a “Like” button.
- Increment like count on click.
- Display a toast notification (e.g., “You liked ‘My Sketch’”).

### 3.6 Notifications
- Trigger toast-style notifications for:
  - New upload
  - Edit or delete
  - Likes or comments
- Notifications disappear automatically after 3 seconds.

### 3.7 Filter & Sort
- **Filter options:**
  - By tag
  - By author
- **Sort options:**
  - Latest
  - Most liked
  - Alphabetical (by title)

### 3.8 Comments (Optional)
- Simple text comments stored in LocalStorage.
- Display under each sketch in detail view.

## 4. Data Model

```json
{
  "id": "uuid-1234",
  "title": "My Sketch",
  "description": "First digital drawing",
  "image": "base64EncodedString",
  "tags": ["portrait", "digital"],
  "createdAt": "2025-10-22T15:30:00Z",
  "likes": 0,
  "comments": [
    {
      "user": "guest",
      "text": "Nice work!",
      "date": "2025-10-22T15:35:00Z"
    }
  ]
}
```

**LocalStorage Keys**
- `sketchGallery_posts` → Array of sketches  
- `sketchGallery_notifications` → Notification queue

## 5. Tech Stack

| Component | Technology |
|------------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Storage | LocalStorage API |
| Image Handling | FileReader + Base64 Encoding |
| UI | Toast Notifications, Modal Windows, Card Grid Layout |
| Sorting/Filtering | Array methods (sort, filter, map) |

## 6. UI/UX Requirements

### 6.1 Pages / Sections
1. **Gallery View**
   - Displays all sketches in card form.
   - Filter/sort toolbar at top.
   - “New Sketch” button for upload.

2. **Detail Modal**
   - Enlarged image preview.
   - Title, description, tags, date.
   - Like and comment sections.

3. **Upload/Edit Form**
   - Input for title, description, tags.
   - Image preview before upload.

4. **Notifications**
   - Slide-in toast in top-right corner.
   - Disappears after 3 seconds.

## 7. User Flow

```
[User] → Upload Sketch → Save to LocalStorage → Show Notification
↓
View in Gallery Grid
↓
Click Like → Increment Count → Show Toast
↓
Filter/Sort → Update View
↓
Edit/Delete → Update LocalStorage → Show Notification
```

## 8. Non-Functional Requirements
- Works fully offline.
- Data persistence via LocalStorage.
- Responsive design (mobile & desktop).
- Lightweight performance (<2s load time).

## 9. Future Enhancements
- IndexedDB support for larger data.
- PWA version for installable use.
- Drag & drop image upload.
- Optional cloud sync (e.g., Firebase).

## 10. Success Metrics
- All CRUD functions operate correctly.
- Notifications display on all key actions.
- Sorting, filtering, and reactions function as intended.
- Fully usable offline with persistent data.
