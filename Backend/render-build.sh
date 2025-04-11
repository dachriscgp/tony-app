#!/bin/bash

# Installer Chromium manuellement pour Puppeteer sur Render
apt-get update
apt-get install -y wget ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
  libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
  libxdamage1 libxrandr2 xdg-utils

# Télécharger Chrome headless
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# Installer Chrome
dpkg -i google-chrome-stable_current_amd64.deb || apt-get -f install -y
