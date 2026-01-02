# Firebase Setup Guide

Follow these steps to ensure Firestore is properly configured for the chat app.

## Complete Setup Instructions

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a Project"** (or select existing)
3. Enter project name (e.g., "chat-room-firebase")
4. Click **Create Project**
5. Wait for setup to complete

### 2. Set Up Firestore Database

1. In Firebase Console, click **Firestore Database** (left sidebar)
2. Click **"Create Database"**
3. Choose **Start in Test Mode** (for development)
4. Select region closest to you
5. Click **Create**
6. Wait for database to initialize

### 3. Create Messages Collection

1. In Firestore Database, click **"Start Collection"**
2. Collection ID: `messages`
3. Click **Next**
4. Click **Auto ID** to create first document
5. Add a test document with these fields:
   ```
   room: "test"
   text: "Hello"
   user: "Test User"
   createdAt: (Server timestamp)
   ```
6. Click **Save**

### 4. Set Up Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### 5. Enable Google Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Click **Google** provider
4. Toggle **Enable** to ON
5. Select your email from "Project Support Email"
6. Click **Save**

### 6. Update Firebase Config in App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Find your web app (should show `</>`)
4. Copy the Firebase config
5. Update `src/firebase-config.jsx`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
```

6. Save and rebuild: `npm run build`

### 7. Create Firestore Index (if needed)

When you query with multiple fields, you might need an index:

1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index** if prompted
3. Configuration:
   - Collection ID: `messages`
   - Field 1: `room` - Ascending
   - Field 2: `createdAt` - Ascending
4. Click **Create**
5. Wait for index to build (usually 2-5 minutes)

### 8. Test the App

1. Run locally: `npm run dev`
2. Or visit: https://react-chat-app-8c28e.web.app
3. Sign in with Google
4. Create a room and send a message
5. Check Firestore Console → Data → messages collection
6. Verify message appears in database

## Verify Configuration

Check these in Firebase Console:

✅ **Firestore Database**
- Status: Green checkmark
- Mode: Production mode (after testing)

✅ **Messages Collection**
- Visible in Data tab
- Contains documents with:
  - `room` (string)
  - `text` (string)
  - `user` (string)
  - `createdAt` (timestamp)

✅ **Security Rules**
- Published successfully
- Allow auth users to read/write

✅ **Google Auth**
- Enabled
- Your domain whitelisted

✅ **Indexes**
- `messages` index created (if using orderBy)

## Local Development vs Production

### Development (Test Mode)
- Anyone can read/write
- Good for testing
- NOT secure for production

### Production Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.user == request.auth.token.name;
      allow update, delete: if request.auth != null && 
                               resource.data.user == request.auth.token.name;
    }
  }
}
```

## Deployment Checklist

Before deploying to production:

- [ ] Security rules are set to production level
- [ ] Firestore indexes created
- [ ] Google Authentication enabled
- [ ] Firebase config updated in code
- [ ] Environment variables set in `.env`
- [ ] App tested locally with `npm run dev`
- [ ] Built with `npm run build`
- [ ] Deployed with Firebase Hosting

## Environment Variables (.env)

Create `.env` file in project root:

```env
FIREBASE_TOKEN=your_firebase_token
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
npm run build && firebase deploy --token $FIREBASE_TOKEN

# Deploy with script
./deploy.sh (Mac/Linux)
.\deploy.bat (Windows)
```

## Troubleshooting

See `TROUBLESHOOTING.md` for common issues and solutions.

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)
