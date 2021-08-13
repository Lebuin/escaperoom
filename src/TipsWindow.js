import audioUrl from './media/notification.wav';
import TIPS from './media/tips.csv';

import Window from './Window';
import * as util from './util';

/* eslint-disable no-param-reassign */
TIPS.forEach(tip => {
  tip.timestamp = tip.minute * 60 * 1000;
});
/* eslint-enable no-param-reassign */

const NOTIFICATION = new Audio(audioUrl);
const START_TIME = 23 * 60 * 60 * 1000;  // Miliseconds from midnight


const H_PADDING = 2;
const V_PADDING = 1;


export default class TipsWindow extends Window {
  constructor() {
    super();

    this.start = Date.now();
    this.index = -1;

    this.updateInterval = setInterval(this._updateTipIndex, 1000);
  }

  _bind() {
    super._bind();
    this._updateTipIndex = this._updateTipIndex.bind(this);
  }


  destroy() {
    clearInterval(this.updateInterval);
  }


  _updateTipIndex() {
    if(this.index === TIPS.length - 1) {
      return;
    }

    let now = Date.now();
    let nextTipTimestamp = this.start + TIPS[this.index + 1].timestamp;
    if(nextTipTimestamp < now) {
      this.index += 1;
      this.requestRender();
      NOTIFICATION.play();
    }
  }


  _render(argWidth, argHeight) {
    let width = argWidth - 2 * H_PADDING;
    let height = argHeight - 2 * V_PADDING;

    let textHeader = util.padText([
      'INCOMING MESSAGES',
      '─────────────────',
      '',
    ], width);
    let textTips = this._renderTips(width, height - textHeader.length);

    return [].concat(textHeader, textTips);
  }


  _renderTips(width, height) {
    let text = [];
    for(let i = 0; i <= this.index; i += 1) {
      if(i > 0) {
        text = text.concat([
          ''
        ]);
      }
      text = text.concat(this._renderTip(TIPS[i], width));
    }

    return util.padText(
      text.slice(-height),
      width,
      height,
      'left',
      'top'
    );
  }

  _renderTip(tip, width) {
    let textWidth = width - 7;
    let text = tip.message + ' ';
    let regexStr = '.{1,' + textWidth + '}(\\s|$)';
    let regex = new RegExp(regexStr, 'g');
    let lines = text.match(regex).map(line => line.slice(0, line.length - 1));
    lines = util.padText(lines, textWidth, null, 'left');
    lines = util.padText(lines, width, null, 'right');

    let time = START_TIME + tip.timestamp;
    let hour = util.padLine(
      Math.floor(time / (60 * 60 * 1000)).toString(),
      2, 'right', '0'
    );
    let minute = util.padLine(
      Math.floor(time % (60 * 60 * 1000) / (60 * 1000)).toString(),
      2, 'right', '0'
    );
    let timeStr = hour + ':' + minute;
    lines[0] = timeStr + lines[0].slice(5);

    return lines;
  }
}
