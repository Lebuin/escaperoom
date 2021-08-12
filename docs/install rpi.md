* Download RPI Imager from https://www.raspberrypi.org/downloads/.
* Install Raspbian to a blank SD card.
* Connect the RPI to a monitor, mouse and keyboard, and boot.
* Connect to the internet and execute the following commands on the RPI:

```
# Fix laggy wireless mouses: add usbhid.mousepoll=0 to the single line in /boot/comdline.txt

# Enable the SPI interface
echo 'dtparam=spi=on' >> /media/seppe/boot/config.txt

# Install the escaperoom
cd /opt
sudo mkdir escaperoom
sudo chown pi:pi escaperoom
git clone https://github.com/Lebuin/escaperoom.git escaperoom  # This repo is pretty huge because it contains some unoptimized video and audio files. We should probably clean up its history some time.
cd escaperoom/build
sudo ./install.sh
sudo reboot
```

* Reboot the RPI. The escaperoom should now start automatically on every boot.
