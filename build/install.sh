#!/bin/bash
cd /opt/escaperoom/build


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
mkdir /home/pi/.config/autostart
cp escaperoom.desktop /home/pi/.config/autostart
chown -R pi:pi /home/pi/.config/autostart

cp escaperoom.desktop /home/pi/Desktop
chown pi:pi /home/pi/Desktop/escaperoom.desktop

cp rfid-reader.service /lib/systemd/system
systemctl daemon-reload
systemctl enable rfid-reader
