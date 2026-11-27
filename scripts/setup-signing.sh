#!/usr/bin/env bash
#
# Create the release signing keystore for the LASU Student Portal.
#
# Run this ONCE, on a trusted machine, in the repository root:
#
#     ./scripts/setup-signing.sh
#
# It writes three files into signing/ (all git-ignored):
#   lasu-release.p12  the keystore
#   keystore.base64   the same file, base64 encoded, for the GitHub secret
#   CREDENTIALS.txt   the passwords, alias and copy-paste instructions
#
# It refuses to overwrite an existing keystore: losing the original means you
# can never update an already-installed app.
#
# Requires: openssl.

set -euo pipefail

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/signing"
KEYSTORE="$OUT_DIR/lasu-release.p12"
ALIAS="lasu-student"
VALIDITY_DAYS=10950   # 30 years

if ! command -v openssl >/dev/null 2>&1; then
  echo "error: openssl is required but was not found." >&2
  exit 1
fi

if [ -e "$KEYSTORE" ]; then
  echo "error: $KEYSTORE already exists." >&2
  echo "Refusing to overwrite the signing key. Move it aside first if you really mean to rotate it." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
umask 077

# 28 characters from an unambiguous alphabet, so it is easy to copy by hand.
# Read a fixed number of bytes first: piping /dev/urandom into `head` makes
# tr die of SIGPIPE, which `set -o pipefail` would turn into a failure.
PASS="$(LC_ALL=C head -c 512 /dev/urandom | LC_ALL=C tr -dc 'A-Za-z0-9' | cut -c1-28)"

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "Generating a 4096-bit RSA signing key (this takes a few seconds)…"

openssl req -x509 -newkey rsa:4096 -nodes -days "$VALIDITY_DAYS" \
  -keyout "$TMPDIR/release.key" -out "$TMPDIR/release.crt" \
  -subj "/CN=SHITTU QUADRI ADESHINA/OU=Student/O=Lagos State University/L=Ojo/ST=Lagos/C=NG" \
  2>/dev/null

# PBE-SHA1-3DES keeps the container readable by every JDK and by apksigner.
# OpenSSL 3 defaults to AES-256-CBC, which older toolchains reject.
openssl pkcs12 -export \
  -in "$TMPDIR/release.crt" -inkey "$TMPDIR/release.key" \
  -name "$ALIAS" \
  -keypbe PBE-SHA1-3DES -certpbe PBE-SHA1-3DES -macalg sha1 \
  -out "$KEYSTORE" -passout "pass:$PASS" 2>/dev/null

base64 -w0 "$KEYSTORE" > "$OUT_DIR/keystore.base64"

cat > "$OUT_DIR/CREDENTIALS.txt" <<EOF
LASU Student Portal — release signing credentials
=================================================
Generated $(date -u '+%Y-%m-%d %H:%M UTC')

KEEP THIS FILE PRIVATE. Do not commit it, paste it in chat, or attach it to an
issue. If it is lost, you can no longer update an already-installed app.
Back it up in a password manager or on an encrypted drive.

Add these as repository secrets at
https://github.com/quadrishittu40-beep/Student-portal-/settings/secrets/actions

  ANDROID_KEYSTORE_BASE64
      The entire contents of signing/keystore.base64 (one long line).

  ANDROID_KEYSTORE_PASSWORD
      $PASS

  ANDROID_KEY_ALIAS
      $ALIAS

  ANDROID_KEY_PASSWORD
      $PASS

Keystore file : signing/lasu-release.p12
Container     : PKCS#12, RSA 4096, valid $VALIDITY_DAYS days
Distinguished name:
  CN=SHITTU QUADRI ADESHINA, OU=Student, O=Lagos State University,
  L=Ojo, ST=Lagos, C=NG

After adding the secrets, re-run the "Build signed release" workflow.
EOF

chmod 600 "$KEYSTORE" "$OUT_DIR/CREDENTIALS.txt" "$OUT_DIR/keystore.base64"

echo
echo "Done."
echo "  keystore        $KEYSTORE"
echo "  base64 for CI   $OUT_DIR/keystore.base64"
echo "  credentials     $OUT_DIR/CREDENTIALS.txt"
echo
echo "Next: open CREDENTIALS.txt and add the four secrets to GitHub."
