An escaperoom built for BOS+.


# Get started

To install the escaperoom on a new Raspberry Pi, follow the [installation steps](docs/install%20rpi.md).

For usage instructions, see the [userguide](docs/userguide.md).


# Development

To run the escaperoom on your local machine:

* Install [Docker Compose](https://docs.docker.com/compose/install/).
* Clone this repository.
* Run `docker-compose up -d` in the top-level folder of this repository.
* Open [localhost:8081](http://localhost:8081) in a web browser.

The Raspberry Pi's have a RFID reader and modified keypad.

* Use the keyboard shortcuts `Alt+L` and `Alt+K` to emulate scanning a valid/invalid RFID tag respectively.
* See `src/LoginWindow.js` for the mapping between the keypad keys and the characters that will be written. If you don't have a keypad, you can also uncomment the code in `_onKeyDown` to use the escaperoom with the regular character keys on a keyboard.


# Architecture

The escaperoom is a simple HTML+JS page, that is served by a [Webpack DevServer](https://webpack.js.org/configuration/dev-server/). It is designed to be run locally on a Raspberry Pi, so that you don't need internet access while playing the escape room. It can also be run on a regular pc (see [Development](#development)).

* `src` contains the source code for the escape room.
* `bin` and `build` contain some files to configure a Raspberry PI: install dependencies, automatically start the escaperoom on boot, setup communication with the RFID reader.
