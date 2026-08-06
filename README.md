# Amar Radio 📻

A modern web radio application built with Next.js, specialized for Indian radio stations with a focus on ease of use and high-quality streaming.

## Features

- **Public Stations**: Listen to AIR Kolkata, Vividh Bharati, and AIR News 24/7 without an account.
- **Premium Access**: Sign in with Google to unlock 100+ premium stations, including Radio Mirchi, Big FM, and specialized Bhakti/Artist channels.
- **Cross-Device Sync**: Your favorites and recently played stations are synced to your account using Firebase.
- **Sleep Timer**: Fall asleep to your favorite music with an automated shut-off.
- **Multi-language Support**: Available in English, Hindi, and Bengali.

## GitHub Connection Guide

If you encounter authentication errors when pushing to GitHub from this workstation, follow these steps:

1. **Generate SSH Key**: 
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. **Add to GitHub**:
   Copy the output of `cat ~/.ssh/id_ed25519.pub` and add it to your [GitHub SSH Keys](https://github.com/settings/keys).
3. **Switch to SSH Remote**:
   ```bash
   git remote set-url origin git@github.com:arthurki2047/amarnewradio.git
   ```
4. **Test**:
   ```bash
   ssh -T git@github.com
   ```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Backend**: Firebase (Auth & Firestore)
- **AI**: Genkit (for future smart features)
# Amar-Radio-Web
# Amar-Radio-Web
