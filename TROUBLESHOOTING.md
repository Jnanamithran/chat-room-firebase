# Chat Messages Not Showing - Troubleshooting Guide

If messages are not appearing when you send them, follow these steps:

## Step 1: Check Firestore Security Rules

The most common issue is restrictive security rules. 

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Firestore Database** → **Rules**
3. Replace with these rules:

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

4. Click **Publish**

## Step 2: Create Firestore Index (if needed)

If you see an error about a missing index:

1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index** if prompted
3. Set up index for:
   - Collection: `messages`
   - Fields: `room` (Ascending) and `createdAt` (Ascending)
4. Click **Create**

Wait a few minutes for the index to build.

## Step 3: Verify Messages Collection

1. Go to **Firestore Database** → **Data**
2. Check if `messages` collection exists
3. If not, create it:
   - Click **Create Collection**
   - Name: `messages`
   - Add any document with: `room`, `text`, `user`, `createdAt`

## Step 4: Check Browser Console for Errors

1. Open the chat app: https://react-chat-app-8c28e.web.app
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try sending a message
5. Look for red error messages
6. Share the error with debugging info

## Step 5: Test Manually

1. Sign in to the app with Google
2. Create/select a chat room
3. Type a message and click Send
4. Check Firebase Console → Firestore → Data → messages collection
5. You should see your new message document

## Common Issues & Solutions

### Issue: "Could not load messages" Error
**Solution**: Missing Firestore index
- Follow Step 2 above to create the index

### Issue: Messages sent but not visible
**Solution**: Security rules too restrictive
- Update rules in Step 1

### Issue: App won't let me send messages
**Solution**: Authentication or write permission issue
- Check if you're signed in
- Verify security rules allow authenticated writes

### Issue: Messages appear for sender but not receiver
**Solution**: Real-time listener issue
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache and cookies
- Try incognito mode

## Network Debugging

To see what's happening in Firestore:

1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Filter by "firebase"
4. Send a message
5. Look for requests to see if data is being sent

## Firebase Console Checklist

- [ ] Project exists and is selected
- [ ] Firestore Database created (not Realtime Database)
- [ ] Messages collection exists
- [ ] Security rules allow reads/writes for authenticated users
- [ ] Index created for `room` + `createdAt` (if needed)
- [ ] Google Sign-In provider is enabled

## Still Having Issues?

Try these troubleshooting steps:

1. **Clear Cache**: Settings → Clear Browsing Data (Cookies & Cache)
2. **Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Try Incognito**: Open in Private/Incognito mode to test
4. **Check Network**: F12 → Network tab, look for failed requests
5. **Read Console**: F12 → Console tab, check for error messages

## Contact Firebase Support

If still stuck:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **? (Help)** → **Send Feedback**
3. Include error messages and screenshots
