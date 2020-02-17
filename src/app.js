import './app.css';

import Renderer from './Renderer';


let elem = document.querySelector('#root');
let renderer = new Renderer(elem);


function updateFlickerDuration() {
  let duration = Math.round(300 + 1500 * Math.random());
  document.body.style.setProperty('--flicker-duration', duration + 'ms');
  setTimeout(updateFlickerDuration, duration);
}
updateFlickerDuration();
