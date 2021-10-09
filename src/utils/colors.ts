import { Color } from '../ecs/type';
import { clamp } from './clamp';

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

const colorPercentage = 0.3;

const getSimilarNumber = (value: number, percentage: number): number =>
  value + Math.random() * percentage - Math.random() * percentage;

const getSimilarColor = (color: Color): Color => [
  clamp({
    value: getSimilarNumber(color[0], colorPercentage),
    min: 0,
    max: 1,
  }),
  clamp({
    value: getSimilarNumber(color[1], colorPercentage),
    min: 0,
    max: 1,
  }),
  clamp({
    value: getSimilarNumber(color[2], colorPercentage),
    min: 0,
    max: 1,
  }),
];

export const grayGradient: ColorGradient = [
  gray,
  getSimilarColor(gray),
  getSimilarColor(gray),
  gray,
  getSimilarColor(gray),
  getSimilarColor(gray),
  gray,
  getSimilarColor(gray),
  getSimilarColor(gray),
  gray,
];
export const greenGradient: ColorGradient = [
  green,
  getSimilarColor(green),
  getSimilarColor(green),
  green,
  getSimilarColor(green),
  getSimilarColor(green),
  green,
  getSimilarColor(green),
  getSimilarColor(green),
  green,
];
export const tealGradient: ColorGradient = [
  teal,
  getSimilarColor(teal),
  getSimilarColor(teal),
  teal,
  getSimilarColor(teal),
  getSimilarColor(teal),
  teal,
  getSimilarColor(teal),
  getSimilarColor(teal),
  teal,
];
export const orangeGradient: ColorGradient = [
  orange,
  getSimilarColor(orange),
  getSimilarColor(orange),
  orange,
  getSimilarColor(orange),
  getSimilarColor(orange),
  orange,
  getSimilarColor(orange),
  getSimilarColor(orange),
  orange,
];
export const yellowGradient: ColorGradient = [
  yellow,
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  yellow,
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  yellow,
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  yellow,
];
export const redGradient: ColorGradient = [
  red,
  getSimilarColor(red),
  getSimilarColor(red),
  red,
  getSimilarColor(red),
  getSimilarColor(red),
  red,
  getSimilarColor(red),
  getSimilarColor(red),
  red,
];
export const pinkGradient: ColorGradient = [
  pink,
  getSimilarColor(pink),
  getSimilarColor(pink),
  pink,
  getSimilarColor(pink),
  getSimilarColor(pink),
  pink,
  getSimilarColor(pink),
  getSimilarColor(pink),
  pink,
];
export const purpleGradient: ColorGradient = [
  purple,
  getSimilarColor(purple),
  getSimilarColor(purple),
  purple,
  getSimilarColor(purple),
  getSimilarColor(purple),
  purple,
  getSimilarColor(purple),
  getSimilarColor(purple),
  purple,
];

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
