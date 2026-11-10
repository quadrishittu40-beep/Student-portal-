# LASU Islamic Studies Education – Personal Student App

This is a personal student learning companion for SHITTU QUADRI ADESHINA. It is not an official LASU portal and is not connected to LASU systems.

## Included
- Student profile with the supplied portrait and details
- 100L–400L sample course catalogue; add/remove courses
- Five-question Islamic Studies CBT practice quiz with marking and explanations
- Local results entry and GPA calculator using a 5-point scale (A=5 through F=0)
- Browser offline cache and local-device storage
- Capacitor project configuration for Android packaging

## Run as a web app
1. Install Node.js (LTS).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local address shown.

## Build an Android APK
You need Android Studio, Android SDK, Java (as required by your installed Android Gradle Plugin), and Node.js.
1. Run `npm install`.
2. Run `npx cap add android` (one-time Android project generation).
3. Run `npm run android:sync`.
4. Run `npx cap open android`.
5. In Android Studio choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
6. For a signed release, use **Build > Generate Signed Bundle / APK** and protect the signing key.

The source project is prepared for Capacitor 6. The Android platform folder is generated locally by `npx cap add android`; this archive does not contain a signed APK.

## Important data notes
- The listed courses are illustrative examples, not a verified LASU curriculum or approved registration.
- No official grades, GPA, CGPA, academic session, or semester results have been invented.
- Course and result entries are stored in browser/app local storage on this device. They are not uploaded to a server and will not automatically sync between devices.
- This is a single-user personal app, not a secure university records system. Do not treat locally entered grades as official transcripts.
- The profile photo is the image supplied in this conversation.

## Display update
The app shell now expands edge-to-edge to the full available viewport instead of being capped at a narrow centered width. If your Android browser still shows side margins, turn off its 'Desktop site' option and reload.

## Theme update
The interface theme has been changed to light blue with complementary deeper blue accents and pale blue backgrounds.
