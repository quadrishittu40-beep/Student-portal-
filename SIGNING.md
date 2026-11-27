# Release signing

The Android app is signed with a private key so it can be updated in place and
uploaded to the Play Store. **The key is the identity of the app** — if it is
lost you can never publish an update to an existing install again, and if it is
leaked someone else can publish as you. Treat it like a password.

## Where everything lives

| Thing | Location |
| --- | --- |
| Keystore file | `signing/lasu-release.p12` — **local only, git-ignored** |
| Keystore password | `signing/CREDENTIALS.txt` — **local only, git-ignored** |
| What CI uses | Four repository secrets in GitHub |
| Who signs the release | `.github/workflows/android-release.yml` |

Nothing secret is ever committed. `.gitignore` blocks `signing/`, `*.p12`,
`*.jks`, `*.keystore` and `keystore.properties`.

## One-time setup

1. Open `signing/CREDENTIALS.txt` and copy the four values.
2. Go to <https://github.com/quadrishittu40-beep/Student-portal-/settings/secrets/actions>.
3. Add these four **repository secrets**:

| Secret name | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | the whole contents of `signing/keystore.base64` (one long line) |
| `ANDROID_KEYSTORE_PASSWORD` | the password from `CREDENTIALS.txt` |
| `ANDROID_KEY_ALIAS` | `lasu-student` |
| `ANDROID_KEY_PASSWORD` | the same password |

4. Re-run the **Build signed release** workflow (Actions → the workflow → *Run workflow*).

The run restores the keystore from the secrets, verifies it with `keytool`,
builds `bundleRelease` and `assembleRelease`, checks the signature with
`apksigner`, and replaces the `app-latest` release with:

- `LASU-Student-Portal-signed-<n>.apk` — install on a phone
- `LASU-Student-Portal-<n>.aab` — upload to the Play Console

Every run bumps `versionCode` to the workflow run number, so the new build
installs as an update instead of a parallel copy.

## Back up the key

Copy `signing/lasu-release.p12` and `signing/CREDENTIALS.txt` somewhere private
and durable — a password manager, an encrypted drive, or a printed copy in a
safe. Do **not** put them in this repository, an issue, a gist, a chat message,
or a build artifact. This repository is public: workflow artifacts and logs are
readable by anyone.

## Why the keystore is not generated in CI

Generating it inside the workflow and handing it back as an artifact would
publish the private key to everyone who can see the repo. The key is therefore
generated once, offline, and delivered to GitHub only through Secrets.

## Building a signed release locally

```bash
export ANDROID_KEYSTORE_PATH="$PWD/signing/lasu-release.p12"
export ANDROID_KEYSTORE_PASSWORD='…'
export ANDROID_KEY_ALIAS='lasu-student'
export ANDROID_KEY_PASSWORD='…'

npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```

The APK lands in `android/app/build/outputs/apk/release/`. Verify it with:

```bash
$ANDROID_SDK_ROOT/build-tools/<version>/apksigner verify --print-certs app-release.apk
```

## Rotating the key

Android will not install a build signed with a different key over an existing
one; users must uninstall first. If you ever need to rotate, bump the
`applicationId`, or use Play App Signing so Google holds the distribution key.

## Unsigned builds still work

If the secrets are absent (a fork, a pull request from a fork, a fresh clone),
the workflow skips the release and prints a note in the run summary instead of
failing, and `assembleDebug` continues to produce the debug APK used by
`.github/workflows/android.yml`.
