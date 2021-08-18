* Download RPI Imager from https://www.raspberrypi.org/downloads/.
* Install Raspbian to a blank SD card.
* Connect the RPI to a monitor, mouse and keyboard, and boot.
* Skip all the setup steps
* Connect to the internet and execute the following commands on the RPI:

```
# (Optional) Fix laggy wireless mouses: add usbhid.mousepoll=8 to the single line in /boot/cmdline.txt

# Enable the SPI interface
echo 'dtparam=spi=on' | sudo tee -a /boot/config.txt

# Install the escaperoom
cd /opt
sudo mkdir escaperoom
sudo chown pi:pi escaperoom
git clone https://github.com/Lebuin/escaperoom  # This repo is pretty huge because it contains some unoptimized video and audio files. We should probably clean up its history some time.
cd escaperoom/build
sudo ./install.sh
sudo reboot
```


Some final steps to make sure everything works:

* The escaperoom should now start automatically on every boot. The first startup will take a while because the Docker image still needs to be built.
* Make sure the badge scanner works.
* Make sure the audio output is set to "AV Jack" (right click the volume control in the top right corner)
