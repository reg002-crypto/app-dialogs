import * as colors from '@mui/material/colors';
import { getRandomInt } from './utils';
export default class {
  static randomColor(id?: number) {
    let colorList: string[] = [];
    let colorKeyList: string[] = [];

    for (let i = 0; i < Object.keys(colors).length; i++) {
      const colorKey = Object.keys(colors)[i];
      if (colorKey == 'grey' || colorKey == 'common') {
        continue;
      }
      //@ts-ignore
      const colors1 = colors[colorKey];
      //@ts-ignore
      const l = Object.keys(colors1).length;
      for (let j = 0; j < l; j++) {
        const colorKey1 = Object.keys(colors1)[l - 1 - j];
        if (colorKey1.indexOf('A') === 0 || parseInt(colorKey1) >= 500) {
          //@ts-ignore
          colorKeyList.push(colorKey1);
        }
      }
      break;
    }
    if (colorKeyList.length > 0) {
      const l = colorKeyList.length;
      for (let j = 0; j < l; j++) {
        const colorKey1 = colorKeyList[j];
        for (let i = 0; i < Object.keys(colors).length; i++) {
          const colorKey = Object.keys(colors)[i];
          if (colorKey == 'grey' || colorKey == 'common') {
            continue;
          }
          //@ts-ignore
          const colors1 = colors[colorKey];
          //@ts-ignore
          colorList.push(colors1[colorKey1]);
        }
      }
    }
    if (id !== undefined) {
      return colorList[id % colorList.length];
    } else {
      return colorList[getRandomInt(colorList.length)];
    }
  }
}
