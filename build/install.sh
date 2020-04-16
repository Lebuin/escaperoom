#!/bin/bash

# Install general dependencies
apt-get install -y libffi-dev libssl-dev

# Install rfid-reader.py dependencies
pip3 install mfrc522 pyautogui

# Don't show the setup and ssh warning
rm /etc/xdg/autostart/piwiz.desktop  # Hide the setup
apt-get purge -y libpam-chksshpwd

# Install docker and docker-compose
curl -sSL https://get.docker.com | sh
usermod -aG docker pi
pip3 install docker-compose


# Install our own files
cp escaperoom.desktop /etc/xdg/autostart

cp rfid-reader.service /lib/systemd/system
systemctl daemon-reload
systemctl enable rfid-reader
