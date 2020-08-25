import Window from './Window';
import * as util from './util';


const PROGRESS_START = 6;
const PROGRESS_END = 99;
const PROGRESS_DURATION = 60 * 60 * 1000;

const KEY_MAP = {
  NumLock: 'K',
  NumpadDivide: 'S',
  NumpadMultiply: 'M',
  NumpadSubtract: 'U',
  Numpad7: 'E',
  Numpad8: 'Y',
  Numpad9: 'P',
  NumpadAdd: 'A',
  Numpad4: 'Z',
  Numpad5: 'D',
  Numpad6: 'G',
  Numpad1: 'X',
  Numpad2: 'W',
  Numpad3: 'L',
  Numpad0: 'N',
  NumpadDecimal: 'T',
  Backspace: 'Backspace',
}
const CREDENTIALS = {
  username: 'EWASTE',
  password: 'NXMDPK',
};
const LABELS = {
  username: 'Username',
  password: 'Password',
};
const BOX_WIDTH = 46;
const RETRY_TIMEOUT = 2 * 60 * 1000;

const CURSOR_BLINK_INTERVAL = 1000;
const PROGRESS_BLINK_INTERVAL = 200;
const PROGRESS_BLINK_START = 80;


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
    this.blinkCursor = false;
    this.blinkProgress = false;

    window.addEventListener('keydown', this._onKeyDown);
    this.blinkCursorInterval = setInterval(this._toggleBlinkCursor, CURSOR_BLINK_INTERVAL);
    this.blinkProgressInterval = setInterval(this._toggleBlinkProgress, PROGRESS_BLINK_INTERVAL);
  }

  _bind() {
    super._bind();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._toggleBlinkCursor = this._toggleBlinkCursor.bind(this);
    this._toggleBlinkProgress = this._toggleBlinkProgress.bind(this);
  }


  get progress() {
    let duration = Date.now() - this.start;
    return Math.min(
      PROGRESS_END,
      PROGRESS_START + duration / PROGRESS_DURATION * (PROGRESS_END - PROGRESS_START)
    );
  }

  get disabled() {
    return this.disabledUntil > Date.now();
  }

  get shouldBlinkProgress() {
    return this.progress >= PROGRESS_BLINK_START;
  }


  _onKeyDown(event) {
    if(this.disabledUntil > Date.now()) {
      return;
    }

    let focus = this.focus;
    let value = this[focus];
    let input = KEY_MAP[event.code];

    if(input === 'Backspace') {
      value = value.substring(0, value.length - 1);
    } else if(input) {
      value += input;
    }

    let correctValue = CREDENTIALS[this.focus];
    if(value === correctValue) {
      this.errorMessage = '';
      if(this.focus === 'username') {
        focus = 'password';
        this.successMessage = 'Correct username. Enter your password:';
      } else {
        focus = null;
        window.removeEventListener('keydown', this._onKeyDown);
        clearInterval(this.blinkCursorInterval);
        clearInterval(this.blinkProgressInterval);
        this.emit('loggedIn');
      }

    } else if(value.length === correctValue.length) {
      if(util.arePermutations(value, correctValue)) {
        this.errorMessage = LABELS[this.focus] + ' entered in an incorrect order.';
      } else {
        this.errorMessage =
          'Incorrect ' + LABELS[this.focus].toLowerCase()
          + ' (' + value + ').';
      }
      this.disabledUntil = Date.now() + RETRY_TIMEOUT;
      this.blinkCursor = false;
      value = '';
    }

    this[this.focus] = value;
    this.focus = focus;
    this.requestRender();
  }


  _toggleBlinkCursor() {
    this.blinkCursor = !this.disabled && !this.blinkCursor;
    this.requestRender();
  }


  _toggleBlinkProgress() {
    if(!this.shouldBlinkProgress) {
      return;
    }
    this.blinkProgress = !this.blinkProgress;
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
    let progressBarWidth = width - 14;
    let progressWidth = Math.floor(progressBarWidth * this.progress / 100);
    let progressStr = Math.floor(this.progress);
    if(progressStr < 10) {
      progressStr = '0' + progressStr;
    }

    text.push(
      '    '
      + (this.blinkProgress ? '░' : '█').repeat(progressWidth)
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
          (this.focus === credential && this.blinkCursor ? '█' : '░')
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
      + (focus && this.blinkCursor ? '█' : '░')
      + '░'.repeat(fieldWidth - value.length - 1)
    );
  }
}
