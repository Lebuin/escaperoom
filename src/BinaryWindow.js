import StaticWindow from './StaticWindow';
import * as util from './util';


const TEXT = util.interleave([
  '01010111   01001000   01010110   01000111',
  '01000101   01001111   01010011   01001111',
  '01000101   01010101              01010101',
  '01000111   01010100              01000100',
], 0, 0);


export default class BinaryWindow extends StaticWindow {
  constructor() {
    super(TEXT);
  }
}
