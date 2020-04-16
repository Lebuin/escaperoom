* Download RPI Imager from https://www.raspberrypi.org/downloads/.
* Install Raspbian to a blank SD card.

---

* Edit some files on the boot partition of the SD card so that we can ssh into the RPI:


```
touch /media/seppe/boot/ssh
echo 'dtparam=spi=on' >> /media/seppe/boot/config.txt

sudo tee /media/seppe/boot/wpa_supplicant.conf <<EOF
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=BE

network={
    ssid="Jos2"
    psk="2kilotomaten"
}
EOF
```

---

* Boot the RPI.
* Run `sudo nmap -sn 192.168.0.0/24` to find the IP address of the RPI (the IP address is 2 lines *above* the device name).
* Run `ssh pi@192.168.0.x` with password `raspberry`.
* Run the following commands in the RPI:

```
# Install the escaperoom
sudo mkdir escaperoom
sudo chown -R pi:pi escaperoom
git clone git@github.com:Lebuin/escaperoom.git escaperoom
cd escaperoom/build
sudo ./install.sh
```