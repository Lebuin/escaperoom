export default class Window {
  constructor() {
    this._bind();

    this.callbacks = {};
    this.renderCache = {
      width: 0,
      height: 0,
      result: null,
    };
  }

  _bind() {}

  destroy() {}


  on(event, callback) {
    if(!this.callbacks[event]) {
      this.callbacks[event] = new Set();
    }
    this.callbacks[event].add(callback);
  }

  emit(event, ...args) {
    (this.callbacks[event] || []).forEach(callback => {
      callback(...args);
    });
  }


  requestRender() {
    this.renderCache.result = null;
    this.emit('requestRender');
  }


  render(width, height) {
    if(
      this.renderCache.width !== width
      || this.renderCache.height !== height
      || !this.renderCache.result
    ) {
      this.renderCache.width = width;
      this.renderCache.height = height;
      this.renderCache.result = this._render(width, height);
    }

    return this.renderCache.result;
  }


  _render() {
    // Arguments: width, height
    throw new Error('Not implemented');
  }
}
