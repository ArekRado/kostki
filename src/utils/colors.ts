import { Color } from '../ecs/type';
import { clamp } from './clamp';
import { hslToRgb } from './hslToRgb';
import { rgbToHsl } from './rgbToHsl';
import { shuffle } from './js/shuffle';

export const white: Color = [1, 1, 1];
export const black: Color = [0, 0, 0];
export const gray: Color = [0.6, 0.6, 0.6];
export const green: Color = [0.11, 0.79, 0.29];
export const teal: Color = [0.09, 0.84, 1];
export const orange: Color = [1, 0.73, 0.29];
export const yellow: Color = [0.99, 0.97, 0.32];
export const red: Color = [0.99, 0.42, 0.45];
export const pink: Color = [0.99, 0.47, 0.94];
export const purple: Color = [0.67, 0.23, 0.94];

export type ColorGradient = [
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color
];

const colorPercentage = 0.2;

export const getSimilarNumber = (value: number, percentage: number): number =>
  value + Math.random() * percentage - Math.random() * percentage;

export const getSimilarColor = (rgbColor: Color): Color => {
  const hslColor = rgbToHsl(rgbColor);
  const similarHslColor: Color = [
    hslColor[0],
    clamp({
      value: getSimilarNumber(hslColor[1], colorPercentage),
      min: 0,
      max: 1,
    }),
    clamp({
      value: getSimilarNumber(hslColor[2], colorPercentage),
      min: 0,
      max: 1,
    }),
  ];

  return hslToRgb([similarHslColor[0], similarHslColor[1], similarHslColor[2]]);
};

const createGradient = (mainColor: Color): ColorGradient => {
  const list = shuffle([
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
    getSimilarColor(mainColor),
  ]);

  return [
    list[0],
    list[1],
    list[2],
    list[3],
    list[4],
    list[5],
    list[6],
    list[7],
    list[8],
    list[9],
  ];
};

export const grayGradient: ColorGradient = createGradient(gray);
export const greenGradient: ColorGradient = createGradient(green);
export const tealGradient: ColorGradient = createGradient(teal);
export const orangeGradient: ColorGradient = createGradient(orange);
export const yellowGradient: ColorGradient = createGradient(yellow);
export const redGradient: ColorGradient = createGradient(red);
export const pinkGradient: ColorGradient = createGradient(pink);
export const purpleGradient: ColorGradient = createGradient(purple);

// [
//   [28, 99, 154],
//   [29, 203, 75],
//   [23, 216, 255],
//   [255, 187, 74],
//   [254, 249, 82],
//   [254, 109, 115],
//   [254, 122, 240],
//   [173, 60, 241],
//  ].map(([r,g,b]) => [
//    Math.floor(r*100 / 255)/100,
//    Math.floor(g*100 / 255)/100,
//    Math.floor(b*100 / 255)/100,
//  ])

// [ 0.13, 0.48, 0.75 ]
// [ 0.11, 0.79, 0.29 ]
// [ 0.09, 0.84, 1 ]
// [ 1, 0.73, 0.29 ]
// [ 0.99, 0.97, 0.32 ]
// [ 0.99, 0.42, 0.45 ]
// [ 0.99, 0.47, 0.94 ]
// [ 0.67, 0.23, 0.94 ]
