import {ColorValue} from 'react-native';

export function whiteRgba(opacity: number) {
  return `rgba(255,255,255,${opacity.toString()})`;
}

export function blackRgba(opacity: number) {
  return `rgba(0,0,0,${opacity.toString()})`;
}

export function redRgba(opacity: number) {
  return `rgba(255,0,0,${opacity.toString()})`;
}

export function yellowRgba(opacity: number) {
  return `rgba(255,255,0,${opacity.toString()})`;
}

const colorsShortCuts = {
  w125: whiteRgba(0.125),
  w25: whiteRgba(0.25),
  w5: whiteRgba(0.5),
  w75: whiteRgba(0.75),
  w100: whiteRgba(1.0),

  b125: blackRgba(0.125),
  b25: blackRgba(0.25),
  b5: blackRgba(0.5),
  b75: blackRgba(0.75),
  b100: blackRgba(1.0),

  r125: redRgba(0.125),
  r25: redRgba(0.25),
  r5: redRgba(0.5),
  r75: redRgba(0.75),
  r100: redRgba(1.0),

  y125: yellowRgba(0.125),
  y25: yellowRgba(0.25),
  y5: yellowRgba(0.5),
  y75: yellowRgba(0.75),
  y100: yellowRgba(1.0),
};

type AppThemeType = {
  // reference colors annotated
  baseColor0: ColorValue; // blue
  baseColor1: ColorValue; // blue
  baseColor2: ColorValue; // yellow
  baseColor3: ColorValue; // red
  baseColor4: ColorValue; // black
  baseColor5: ColorValue; // white
  baseColor6: ColorValue; // grey
  baseColor7: ColorValue; // green
};

const lisdTheme: AppThemeType = {
  baseColor0: 'transparent',
  baseColor1: 'blue',
  baseColor2: 'white',
  baseColor3: 'red',
  baseColor4: 'black',
  baseColor5: 'white',
  baseColor6: 'lightgrey',
  baseColor7: 'green',
};

export default {
  statusBarHeight: 24,
  footerHeight: 70,
  colors: {...lisdTheme, ...colorsShortCuts},
};
