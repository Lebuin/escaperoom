import Window from './Window';

export default class StaticWindow extends Window {
  constructor(text) {
    super();

    this.text = text;
  }


  get minWidth() {
    return Math.max(...this.text.map(line => line.length)) + 2;
  }

  get minHeight() {
    return this.text.length + 2;
  }


  _render() {
    return this.text;
  }
}
