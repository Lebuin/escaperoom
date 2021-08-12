import successUrl from './media/success.wav';
import errorUrl from './media/error.wav';
import Window from './Window';
import * as util from './util';


const SUCCESS = new Audio(successUrl);
const ERROR = new Audio(errorUrl);
const RETRY_TIMEOUT = 2 * 60 * 1000;

const TABLE = {
  Γ: '957280',
  Δ: '507928',
  Θ: '857092',
  Ξ: '802759',
  Σ: '297508',
  Ψ: '597802',
};
const TEXT_LOCKED = [
  'DECODING',
  'TABLE',
  'LOCKED',
];
const TABLE_WIDTH = 10;


export default class TableWindow extends Window {
  constructor() {
    super();

    this.locked = true;

    this.disabledUntil = Date.now();
    this.countdownInterval = null;

    window.addEventListener('keydown', this._onKeyDown);
  }

  _bind() {
    this._onKeyDown = this._onKeyDown.bind(this);
    this._countdown = this._countdown.bind(this);
  }


  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
  }


  get disabled() {
    return this.disabledUntil > Date.now();
  }


  _onKeyDown(event) {
    if(this.disabled) {
      return;
    }

    if(event.altKey && event.key === 'l') {
      SUCCESS.play();
      this.locked = false;
      window.removeEventListener('keydown', this._onKeyDown);
      this.requestRender();

    } else if(event.altKey && event.key === 'k') {
      ERROR.play();
      this.disabledUntil = Date.now() + RETRY_TIMEOUT;
      if(!this.countdownInterval) {
        this.countdownInterval = setInterval(this._countdown, 1000);
      }
      this.requestRender();
    }
  }


  _countdown() {
    if(!this.disabled) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.requestRender();
  }


  _render() {
    let textKeysInterleaved = util.interleave(Object.keys(TABLE), 0, 1);
    let textKeys = util.padText(textKeysInterleaved, 1);

    let textValuesRaw = this.locked ? TEXT_LOCKED : Object.values(TABLE);
    let textValuesInterleaved = util.interleave(textValuesRaw, 0, 1);
    let textValues = util.padText(textValuesInterleaved, TABLE_WIDTH, textKeys.length, 'left');

    let textTable = textKeys.map((key, i) => {
      let value = textValues[i];
      return '│  ' + key + '  │  ' + value + '  │';
    });

    let message = [];
    if(!this.locked) {
      message = ['', ''];
    } else if(!this.disabled) {
      message = [
        'Scan your badge to unlock.',
        ''
      ];
    } else {
      message = [
        'Unauthorized badge detected.',
        'Badge scanner disabled for '
        + Math.floor((this.disabledUntil - Date.now()) / 1000) + 's...'
      ];
    }


    let text = [
      '┌─────┬──' + '─'.repeat(TABLE_WIDTH) + '──┐',
      '│     │  ' + ' '.repeat(TABLE_WIDTH) + '  │',
    ].concat(textTable, [
      '│     │  ' + ' '.repeat(TABLE_WIDTH) + '  │',
      '└─────┴──' + '─'.repeat(TABLE_WIDTH) + '──┘',
      '',
    ].concat(message));

    return text;
  }
}
