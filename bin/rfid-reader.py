#!/usr/bin/env python3

import time
from .mfrc522 import SimpleMFRC522
from RPi import GPIO
import pyautogui

reader = SimpleMFRC522()

tag_id = None
timestamp = 0.0

correct_tag_ids = (456534201530,)

try:
    while True:
        new_tag_id = reader.read()[0]

        now = time.time()
        if now - timestamp > 1:
            tag_id = None
        timestamp = now

        if new_tag_id != tag_id:
            tag_id = new_tag_id

            if tag_id in correct_tag_ids:
                print('Correct id:', id)
                pyautogui.hotkey('alt', 'l')
            else:
                print('Incorrect id:', id)
                pyautogui.hotkey('alt', 'k')

except KeyboardInterrupt:
    GPIO.cleanup()
    raise
