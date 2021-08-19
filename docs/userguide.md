# Starting the escape room

* Do not plug the power adapter into a power socket yet. In general, try to avoid touching the Raspberry Pi while it is plugged in as much as possible.
* Plug in all the connections:
  * The power adapter into the USB-C port.
  * The monitor into one of the mini-HDMI ports (doesn't matter which).
  * The speakers, numeric keypad and mouse each into a USB port.
  * The speakers into the jack port.
* Check that all 7 wires between the RPI and the RFID reader are connected.
* Plug the power adapter into a power socket. You will see some stuff on the monitor about the RPI starting up. This usually takes around 30 seconds.
* When you see the cheeky monastery background, the RPI is fully booted up, and the escape room will start initializing. You will see a small black terminal indicating some stuff about the escape room starting up. This usually takes around 30 seconds.
* Finally, the entire screen turns black, with green letters in the center saying "Press any key to unlock.". As soon as you press any key on the keypad, the escape room will start.


# Shutting down

To avoid damaging the SD card in the RPI, try to avoid unplugging the Raspberry PI directly. Instead, take the following steps:

* Close the Chrome window with the escape room.
* Click the top left "Raspberry" menu and choose "Shutdown..."
* Click "Shutdown".
* Wait until the small green LED indicator on the RPI stops blinking. (The red LED indicator will stay on.)
* You can now unplug the RPI.


# Updating the escape room

If the RPI is connected to the internet, it will automatically update itself when starting up. However, this can fail if the internet connection is not ready yet immediately after booting, so take the following steps to be 100% sure that the escape room is up to date:

* Make sure the Raspberry Pi is connected to the internet.
* Close the Chrome window.
* Double click the `Escaperoom` file on the desktop and choose "Execute in terminal".
* Pay attention to the first line in the terminal.
  * If it says "fatal: unable to acess ..." then the update failed because the RPI is not connected to the internet. Check your connection and retry.
  * Otherwise, the update was successful.
* For most updates, this is all you need to do. For some updates, it may be necessary to fully restart the Raspberry Pi. Click the top left "Raspberry" menu -> "Shutdown..." -> "Reboot".


# Troubleshooting

* **The escaperoom keeps showing the "Screen locked" screen.** Your monitor may be too small. Try zooming out the Chrome window. (If a keyboard is connected: press `Ctrl+-` or scroll with the mouse while pressing `Ctrl`. If no keyboard is connected: exit fullscreen but make sure the window is maximized, open the Chrome menu with the three dots in the top right corner, and press the small `-` button next to `Zoom`.)
* **I don't hear any sound through the speakers.** Right click the sound icon in the top right corner of the RPI desktop, and make sure "AV jack" is selected. Left click the sound icon and make sure the volume is set to the maximum.
* **How can I restart the escaperoom?**. Right click anywhere except in the video -> click "Reload".
* **How do I exit the full screen escape room window?** Right click anywhere except in the video -> click "Exit full screen".
* **The escaperoom is no longer in fullscreen.** Click the three dots in the top right corner. There is a small full screen button next the "Zoom" buttons.
* **I closed Chrome / Chrome has crashed.** Double click the `Escaperoom` file on the desktop and choose "Execute in terminal". This should restart the escaperoom.
* **The tag reader doesn't work.** Make sure all the cables are wired correctly.
