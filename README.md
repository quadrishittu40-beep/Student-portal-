# LASU Islamic Studies Education – Personal Student App

This is a personal student learning companion for SHITTU QUADRI ADESHINA. It is not an official LASU portal and is not connected to LASU systems.

## Included
- Lagos State University crest in the portal header, browser tab and installed-app icon
- Student profile with the supplied portrait and details
- Course structure and results taken from the official LASU statement of result for 230125013: all six semesters (100L–300L, 2023/2024–2025/2026), every course code, unit, status letter and grade, plus each semester's official TNU, TCP, GPA and CGPA
- CGPA 4.30 recomputed live from the 123 recorded credit units and 529 grade points, matching the printed CGPA
- Outstanding courses panel (ENT 302, FAC 201, GNS 301, ISL 208) and the academic standing notes from the statement
- Add your own 400L/future courses per level and semester; entries without a grade stay "pending" and do not affect the GPA
- Five-question Islamic Studies CBT practice quiz with marking and explanations
- GPA calculator using the LASU 5-point scale (A=5 through F=0)
- Browser offline cache and local-device storage
- Capacitor project configuration for Android packaging

## Run as a web app
1. Install Node.js (LTS).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local address shown.

## Download the Android app (APK)
Every push to `main` builds an installable APK automatically.

1. Open the **Releases** page: <https://github.com/quadrishittu40-beep/Student-portal-/releases>
2. Download the newest `LASU-Student-Portal-signed-<n>.apk` (signed release).
   The `debug-latest` release also carries an unsigned debug APK if you just want to try it.
3. Open the file on the phone and allow installation from that source when prompted.
4. The app runs fully offline: courses, results, CGPA and practice tests are bundled, and your edits stay on the device.

App identity: `ng.edu.lasu.islamicstudies.personal`, name **LASU Student**, icon and splash generated from the university crest by `npm run icons`.

## Release signing
Signed builds are produced by `.github/workflows/android-release.yml` using a
private keystore held in GitHub Actions secrets. The signing identity is the
app's permanent identity — see **[SIGNING.md](SIGNING.md)** for setup, what CI
does, and how to back the key up. Keystores and passwords are git-ignored and
must never be committed to this (public) repository.

## Build the APK yourself
You need Android Studio (or the Android SDK) with Java 17, plus Node.js.
1. Run `npm install`.
2. Run `npm run android:apk` — this builds the web assets, syncs Capacitor and runs Gradle.
3. The APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`.
4. For Play Store distribution, open `android/` in Android Studio and use **Build > Generate Signed Bundle / APK**, then protect the signing key.

## Important data notes
- Course codes, units, status letters, grades, semester GPA figures and the CGPA are transcribed from the LASU statement of result for matriculation number 230125013, printed 31 July 2026. The statement lists course codes only, so the app shows codes and does not invent course titles.
- Grade letters are derived from the statement's GP column on the 5-point scale (5=A, 4=B, 3=C, 2=D, 1=E, 0=F); every semester recomputes to the exact printed TNU, TCP, GPA and CGPA.
- Any course, unit or grade you add yourself is your own entry, is labelled as such, and is stored on this device only.
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
