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


## GitHub support

The project is ready to place in a GitHub repository. It includes a GitHub Actions workflow at `.github/workflows/build.yml` that installs dependencies and verifies the production build on pushes and pull requests to `main` or `master`.

1. Create a **private** repository on GitHub (recommended because the app contains a personal photograph, date of birth and matriculation number).
2. Extract this project ZIP on your computer.
3. Open a terminal in the `lasu_islamic_studies_app` folder and run:

   ```bash
   git init
   git add .
   git commit -m "Add LASU Islamic Studies student app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

4. Replace the example GitHub remote URL with your own repository URL. GitHub will run the build workflow after the push.

## Vercel deployment

The project includes `vercel.json` and a Vite configuration. Vite uses `www/` as the source directory and writes the production site to `dist/`.

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep the detected Vite settings, or use these settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Choose **Deploy**. Vercel will provide a hosted URL.
5. Future pushes to the connected production branch trigger new deployments automatically.

No GitHub token, Vercel token, or environment variable is needed for this static demo app. Do not commit access tokens or passwords to GitHub.

## Privacy before publishing

**Important:** The current app embeds the student photograph and displays the student's full name, date of birth and matriculation number. A Vercel deployment is normally accessible to anyone who has its URL, and a public GitHub repository exposes the source and embedded photo. Use a private GitHub repository and do not publish the live website publicly until private access protection or a proper authentication system has been added. A private GitHub repository alone does not make the deployed Vercel website private.

The app stores course and result entries in browser local storage. It has no server-side account system, encrypted database, or multi-device synchronisation.

## Android packaging

The same Vite build output (`dist/`) is used by Capacitor. After installing dependencies and creating the Android platform once with `npx cap add android`, run `npm run android:sync` and open the project in Android Studio to build the APK.
