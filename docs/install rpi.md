* Download RPI Imager from https://www.raspberrypi.org/downloads/.
* Install Raspbian to a blank SD card.

---

* Edit some files on the boot partition of the SD card so that we can ssh into the RPI:


```
touch /media/seppe/boot/ssh
echo 'dtparam=spi=on' >> /media/seppe/boot/config.txt

echo 'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=BE

network={
    ssid="Jos2"
    psk="2kilotomaten"
}' > /media/seppe/boot/wpa_supplicant.conf
```

---

* Boot the RPI.
* Run `sudo nmap -sn 192.168.0.0/24` to find the IP address of the RPI (the IP address is 2 lines *above* the device name).
* Run `ssh pi@192.168.0.x` with password `raspberry`.
* Run the following commands in the RPI to install the escaperoom and all its dependencies:

```
cd /opt
sudo mkdir escaperoom
sudo chown -R pi:pi escaperoom
git clone https://github.com/Lebuin/escaperoom.git escaperoom
cd escaperoom/build
sudo ./install.sh
sudo reboot
```

---

* SSH back into the RPI.
* The escape room should now start automatically on boot every time. If it crashes, it can be restarted by double clicking the `Escaperoom` file on the desktop.
* The first run may fail during the building of the Docker image, so it may be necessary to retry a few times.
