import BinaryWindow from './BinaryWindow';
import TableWindow from './TableWindow';
import StaticWindow from './StaticWindow';
import TipsWindow from './TipsWindow';
import LoginWindow from './LoginWindow';
import * as util from './util';


const BLINK_INTERVAL_FINISHED = 300;
const State = Object.freeze({
  INITIALIZING: 'initializing',
  RUNNING: 'running',
  FINISHED: 'finished',
});


export default class Renderer {
  constructor(elem) {
    this._bind();

    this.elem = elem;
    this.state = State.INITIALIZING;
    this.renderMethods = {
      [State.INITIALIZING]: this.renderInitializing.bind(this),
      [State.RUNNING]: this.renderMain.bind(this),
      [State.FINISHED]: this.renderFinished.bind(this),
    };

    this.width = 0;
    this.height = 0;

    this.windows = {};

    this.blink = false;
    this.blinkInterval = null;


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

    this.state = State.RUNNING;

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

    this.state = State.FINISHED;
    this.blinkInterval = setInterval(this.toggleBlink, BLINK_INTERVAL_FINISHED);
  }


  toggleBlink() {
    this.blink = !this.blink;
    this.render();
  }


  render() {
    let text = this.renderMethods[this.state]();
    this.elem.innerHTML = text.join('<br>');
  }


  renderInitializing() {
    return util.boxify(util.padText([
      'All systems ready.',
      'Press any key to start.'
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
      for(let j = 0; j < row.numColumns; j += 1) {
        let cell = row[j];
        let averageWidth = (this.width   + 1) / numColumns - 1;
        let averageHeight = (this.height + 1) / numRows    - 1;
        cell.width  = Math.floor(averageWidth)  + ((i / numColumns) < averageWidth  ? 1 : 0);
        cell.height = Math.floor(averageHeight) + ((i / numRows   ) < averageHeight ? 1 : 0);
      }
    }


    // Render the text of each cell
    for(let i = 0; i < numRows; i += 1) {
      let row = cells[i];
      for(let j = 0; j < row.numColumns; j += 1) {
        let cell = row[j];
        let text = cell.window.render(cell.width, row.height);
        cell.text = util.padText(text, cell.width, row.height);
      }
    }


    // Stitch the cells together
    let text = [];
    for(let i = 0; i < numRows; i += 1) {
      let row = cells[i];
      if(i > 0) {
        let rowPrev = cells[i - 1];
        let line = '═'.repeat(this.width);
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
      }
    }
    for(let y = 0; y < heightTop; y += 1) {
      text.push(texts.binair[y] + '║' + texts.legende[y]);
    }
    text.push('═'.repeat(widthLeft) + '╬' + '═'.repeat(widthRight));
    for(let y = 0; y < heightBottom; y += 1) {
      text.push(texts.tips[y] + '║' + texts.login[y]);
    }

    return text;
  }


  getIntersections(row) {
    let intersections = new Set();
    let x = row[0].width + 1;
    for(let i = 1; i < row.length; i += 1) {
      intersections.add(x);
      x += row[i].width;
    }
    return intersections;
  }


  renderFinished() {
    let text = 'UPDATE CANCELLED';
    if(!this.blink) {
      text = ' '.repeat(text.length);
    }

    return util.boxify([text]);
  }
}
