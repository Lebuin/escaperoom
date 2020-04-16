#!/bin/bash

# Install rfid-reader.py dependencies
pip3 install mfrc522 pyautogui

# Don't show the setup and ssh warning
rm /etc/xdg/autostart/piwiz.desktop  # Hide the setup
apt purge libpam-chksshpwd

# Install docker and docker-compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker pi
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose


# Install our own files
cp escaperoom.desktop /etc/xdg/autostart
cp rfid-reader.service /lib/systemd/system
