#!/bin/bash

# Install rfid-reader.py dependencies
sudo pip3 install mfrc522 pyautogui

# Don't show the setup and ssh warning
sudo rm /etc/xdg/autostart/piwiz.desktop  # Hide the setup
sudo apt purge libpam-chksshpwd

# Install docker and docker-compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker pi
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

cp escaperoom.desktop /etc/xdg/autostart
cp rfid-reader.service /lib/systemd/system
