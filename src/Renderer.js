import BinaryWindow from './BinaryWindow';
import TableWindow from './TableWindow';
import StaticWindow from './StaticWindow';
import TipsWindow from './TipsWindow';
import LoginWindow from './LoginWindow';
import * as util from './util';

import endWonUrl from './media/endWon.wav';
import endWarningUrl from './media/endWarning.wav';
import endLostUrl from './media/endLost.wav';
import videoUrl from './media/escape.mp4';


const END_WON = new Audio(endWonUrl);
const END_WARNING = new Audio(endWarningUrl);
const END_LOST = new Audio(endLostUrl);
const BLINK_INTERVAL_FINISHED = 300;
const State = Object.freeze({
  INITIALIZING: 'initializing',
  RUNNING: 'running',
  FINISHED: 'finished',
});

const END_WARNING_TIMESTAMP = 75 * 60 * 1000;
const END_LOST_TIMESTAMP = 80 * 60 * 1000;


export default class Renderer {
  constructor(elem) {
    this._bind();

    this.elem = elem;
    this.elem.innerHTML = '';

    this.elemText = document.createElement('div');
    this.elemText.classList = 'text';
    this.elem.appendChild(this.elemText);

    this.state = State.INITIALIZING;
    this.renderMethods = {
      [State.INITIALIZING]: this.renderInitializing.bind(this),
      [State.RUNNING]: this.renderMain.bind(this),
      [State.FINISHED]: this.renderFinished.bind(this),
    };

    this.start = null;
    this.width = 0;
    this.height = 0;

    this.windows = {};

    this.blink = false;
    this.blinkInterval = null;


    this.elemVideoWrapper = document.createElement('div');
    this.elemVideoWrapper.classList = 'video-wrapper';

    this.elemVideo = document.createElement('video');
    this.elemVideo.src = videoUrl;
    this.elemVideo.loop = true;
    this.elemVideoWrapper.appendChild(this.elemVideo);


    window.addEventListener('resize', this.onResize);
    this.onResize();

    window.addEventListener('keypress', this.initialize);
  }

  _bind() {
    this.initialize = this.initialize.bind(this);
    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);
    this.onLoggedIn = this.onLoggedIn.bind(this);
    this.toggleBlink = this.toggleBlink.bind(this);
  }


  get finished() {
    return this.windows.login.isLoggedIn;
  }


  initialize() {
    window.removeEventListener('keypress', this.initialize);

    this.windows = {
      binair: new BinaryWindow(),
      legende: new TableWindow(),
      video: new StaticWindow(''),
      tips: new TipsWindow(),
      login: new LoginWindow(),
    };
    this.positions = {  // [row, column]
      binair: [0, 0],
      legende: [0, 1],
      video: [0, 2],
      tips: [1, 0],
      login: [1, 1],
    };

    Object.values(this.windows).forEach(window => {
      window.on('requestRender', this.render);
    });
    this.windows.login.on('loggedIn', this.onLoggedIn);

    this.elem.appendChild(this.elemVideoWrapper);
    this.elemVideo.play();

    this.state = State.RUNNING;
    setTimeout(() => this.playEndWarning(), END_WARNING_TIMESTAMP);
    setTimeout(() => this.playEndLost(), END_LOST_TIMESTAMP);

    this.render();
  }


  onResize() {
    [this.width, this.height] = util.getCharDimensions(document.body);
    this.render();
  }


  onLoggedIn() {
    if(this.state === State.FINISHED) {
      return;
    }

    this.elem.removeChild(this.elemVideoWrapper);
    this.elemVideo.pause();

    Object.values(this.windows).forEach(window => {
      window.destroy();
    });

    this.state = State.FINISHED;
    this.blinkInterval = setInterval(this.toggleBlink, BLINK_INTERVAL_FINISHED);
    END_WON.loop = true;
    END_WON.play();
  }


  playEndWarning() {
    if(this.state === State.RUNNING) {
      END_WARNING.play();
    }
  }

  playEndLost() {
    if(this.state === State.RUNNING) {
      END_LOST.play();
    }
  }


  toggleBlink() {
    this.blink = !this.blink;
    this.render();
  }


  render() {
    let text = this.renderMethods[this.state]();
    this.elemText.innerHTML = text.join('<br>');
  }


  renderInitializing() {
    return util.boxify(util.padText([
      'Screen locked.',
      'Press any key to unlock.'
    ]));
  }


  renderMain() {
    // Build the layout of the cells
    let cells = [];  // Two-dimensional array, first dimension is vertical
    Object.keys(this.windows).forEach(windowId => {
      let window = this.windows[windowId];
      let [row, column] = this.positions[windowId];
      if(cells[row] == null) {
        cells[row] = [];
      }
      cells[row][column] = {
        width: 0,
        height: 0,
        window,
        text: null,
      };
    });


    // Calculate the width and height of each cell
    let numRows = cells.length;
    for(let i = 0; i < numRows; i += 1) {
      let row = cells[i];
      let numColumns = row.length;
      for(let j = 0; j < numColumns; j += 1) {
        let cell = row[j];
        let baseWidth  = Math.floor((this.width  + 1) / numColumns - 1);
        let baseHeight = Math.floor((this.height + 1) / numRows    - 1);
        let numWideColumns = (this.width  + 1) % numColumns;
        let numWideRows    = (this.height + 1) % numRows;
        cell.width  = baseWidth  + (j < numWideColumns  ? 1 : 0);
        cell.height = baseHeight + (i < numWideRows     ? 1 : 0);
      }
    }


    // Render the text of each cell
    for(let i = 0; i < numRows; i += 1) {
      let row = cells[i];
      let numColumns = row.length;
      for(let j = 0; j < numColumns; j += 1) {
        let cell = row[j];
        let text = cell.window.render(cell.width, cell.height);
        cell.text = util.padText(text, cell.width, cell.height);
      }
    }


    // Stitch the cells together
    let text = [];
    for(let i = 0; i < numRows; i += 1) {
      let row = cells[i];
      if(i > 0) {
        let rowPrev = cells[i - 1];
        let line = new Array(this.width).fill('═');
        let intersectionsTop = this.getIntersections(rowPrev);
        let intersectionsBottom = this.getIntersections(row);

        intersectionsTop.forEach(x => {
          if(intersectionsBottom.has(x)) {
            intersectionsBottom.delete(x);
            line[x] = '╬';
          } else {
            line[x] = '╩';
          }
        });
        intersectionsBottom.forEach(x => {
          line[x] = '╦';
        });
        text.push(line.join(''));
      }

      for(let y = 0; y < cells[i][0].height; y += 1) {
        let cellLines = cells[i].map(cell => cell.text[y]);
        text.push(cellLines.join('║'));
      }
    }

    setTimeout(() => this.renderVideo(cells));

    return text;
  }


  getIntersections(row) {
    let intersections = new Set();
    let x = row[0].width;
    for(let i = 1; i < row.length; i += 1) {
      intersections.add(x);
      x += row[i].width + 1;
    }
    return intersections;
  }


  renderVideo(cells) {
    let [row, column] = this.positions.video;
    let left = column + 1;
    let top = row + 1;
    for(let i = 0; i < row; i += 1) {
      top += cells[i].height;
    }
    for(let i = 0; i < column; i += 1) {
      left += cells[row][i].width;
    }

    let width  = cells[row][column].width  - 2;
    let height = cells[row][column].height - 2;

    let charWidth  = this.elemText.clientWidth  / this.width;
    let charHeight = this.elemText.clientHeight / this.height;

    this.elemVideoWrapper.style.left   = Math.round(left   * charWidth ) + 'px';
    this.elemVideoWrapper.style.top    = Math.round(top    * charHeight) + 'px';
    this.elemVideoWrapper.style.width  = Math.round(width  * charWidth ) + 'px';
    this.elemVideoWrapper.style.height = Math.round(height * charHeight) + 'px';
  }


  renderFinished() {
    let text = 'UPDATE CANCELLED';
    if(!this.blink) {
      text = ' '.repeat(text.length);
    }

    return util.boxify([text]);
  }
}
