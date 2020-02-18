import Window from './Window';
import * as util from './util';


const PROGRESS_START = 73;
const PROGRESS_END = 99;
const PROGRESS_DURATION = 60 * 60 * 1000;

const CREDENTIALS = {
  username: 'NXMDPK',
  password: 'HALKIDIKI',
};
const LABELS = {
  username: 'Username',
  password: 'Password',
};
const BOX_WIDTH = 46;
const RETRY_TIMEOUT = 5 * 60 * 1000;

const CURSOR_BLINK_INTERVAL = 1000;


export default class LoginWindow extends Window {
  constructor() {
    super();

    this.start = Date.now();
    this.isLoggedIn = false;

    this.username = '';
    this.password = '';

    this.successMessage = '';
    this.errorMessage = '';
    this.disabledUntil = Date.now();

    this.focus = 'username';
    this.blink = false;

    window.addEventListener('keypress', this._onKeyPress);
    this.blinkInterval = setInterval(this._toggleBlink, CURSOR_BLINK_INTERVAL);
  }

  _bind() {
    super._bind();
    this._onKeyPress = this._onKeyPress.bind(this);
    this._toggleBlink = this._toggleBlink.bind(this);
  }

  get minWidth() {
    return 25;
  }

  get minHeight() {
    return 20;
  }


  get disabled() {
    return this.disabledUntil > Date.now();
  }


  _onKeyPress(event) {
    if(this.disabledUntil > Date.now()) {
      return;
    }

    let key = event.key.toUpperCase();
    if(key.length !== 1) {
      return;
    }

    let focus = this.focus;
    let value = this[focus];
    value += key;
    let correctValue = CREDENTIALS[this.focus];

    if(value === correctValue) {
      this.errorMessage = '';
      if(this.focus === 'username') {
        focus = 'password';
        this.successMessage = 'Correct username. Enter your password:';
      } else {
        focus = null;
        window.removeEventListener('keypress', this._onKeyPress);
        clearInterval(this.blinkInterval);
        this.emit('loggedIn');
      }

    } else if(value.length === correctValue.length) {
      if(util.arePermutations(value, correctValue)) {
        this.errorMessage = LABELS[this.focus] + ' entered in an incorrect order.';
      } else {
        this.errorMessage = 'Incorrect ' + LABELS[this.focus].toLowerCase() + '.';
      }
      this.disabledUntil = Date.now() + RETRY_TIMEOUT;
      this.blink = false;
      value = '';
    }

    this[this.focus] = value;
    this.focus = focus;
    this.requestRender();
  }


  _toggleBlink() {
    this.blink = !this.disabled && !this.blink;
    this.requestRender();
  }


  _render(width) {
    return [].concat(
      this._renderProgress(width),
      '',
      '',
      '',
      '',
      this._renderLogin(),
    );
  }


  _renderProgress(width) {
    let text = [
      'UPDATING SYSTEM...',
      '──────────────────',
      '',
    ];

    // Progress bar
    let duration = Date.now() - this.start;
    let progress = Math.min(
      PROGRESS_END,
      PROGRESS_START + duration / PROGRESS_DURATION * (PROGRESS_END - PROGRESS_START)
    );
    let progressBarWidth = width - 14;
    let progressWidth = Math.floor(progressBarWidth * progress / 100);
    let progressStr = Math.floor(progress);
    if(progressStr < 10) {
      progressStr = '0' + progressStr;
    }

    text.push(
      '    '
      + '█'.repeat(progressWidth)
      + '░'.repeat(progressBarWidth - progressWidth)
      + ' ' + progressStr + '%'
    );

    return text;
  }


  _renderLogin() {
    let maxLabelWidth = Math.max(...Object.values(LABELS).map(value => value.length));
    let boxText = [];

    Object.keys(CREDENTIALS).forEach(credential => {
      let label = util.padLine(LABELS[credential], maxLabelWidth, 'right');
      let value = this[credential];
      let renderValue = credential === 'password' ? '*'.repeat(value.length) : value;
      let fieldWidth = CREDENTIALS[credential].length;

      let fieldLine = label + ': ' + renderValue;
      if(value.length < fieldWidth) {
        fieldLine += (
          (this.focus === credential && this.blink ? '█' : '░')
          + '░'.repeat(fieldWidth - value.length - 1)
        );
      }

      let errorLines = ['', ''];
      if(this.focus === credential && this.errorMessage) {
        errorLines[0] = this.errorMessage;
        errorLines[1] = this.disabled ?
          'Login disabled for ' + Math.floor((this.disabledUntil - Date.now()) / 1000) + 's...' :
          'Try again.';
      } else if(credential === 'username' && this.successMessage) {
        errorLines[0] = this.successMessage;
      }

      boxText = boxText.concat([fieldLine], errorLines, ['']);
    });

    boxText.splice(boxText.length - 1, 1);
    boxText = util.padText(boxText, BOX_WIDTH, null, 'left');

    return [].concat([
      'Enter credentials to cancel update:',
      '',
    ], util.boxify(boxText));
  }


  _renderFieldLine(label, value, fieldWidth, focus) {
    return (
      label + ': '
      + value
      + (focus && this.blink ? '█' : '░')
      + '░'.repeat(fieldWidth - value.length - 1)
    );
  }
}
