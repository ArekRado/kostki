import { Color } from '../ecs/type';
import { clamp } from './clamp';
import { hslToRgb } from './hslToRgb';
import { rgbToHsl } from './rgbToHsl';

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

const colorPercentage = 0.2 / 100;

export const getSimilarNumber = (value: number, percentage: number): number =>
  value + Math.random() * percentage - Math.random() * percentage;

export const getSimilarColor = (rgbColor: Color): Color => {
  const hslColor = rgbToHsl(rgbColor);
  const similarHslColor: Color = [
    // hslColor[0],
    clamp({
      value: getSimilarNumber(hslColor[0], colorPercentage * 10),
      min: 0,
      max: 1,
    }),
    hslColor[1],
    clamp({
      value: getSimilarNumber(hslColor[2], colorPercentage),
      min: 0.25 / 100,
      max: 0.8 / 100,
    }),
  ];

  return hslToRgb(similarHslColor);
};

export const grayGradient: ColorGradient = [
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
  getSimilarColor(gray),
];
export const greenGradient: ColorGradient = [
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
  getSimilarColor(green),
];
export const tealGradient: ColorGradient = [
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
  getSimilarColor(teal),
];
export const orangeGradient: ColorGradient = [
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
  getSimilarColor(orange),
];
export const yellowGradient: ColorGradient = [
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
  getSimilarColor(yellow),
];
export const redGradient: ColorGradient = [
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
  getSimilarColor(red),
];
export const pinkGradient: ColorGradient = [
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
  getSimilarColor(pink),
];
export const purpleGradient: ColorGradient = [
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
  getSimilarColor(purple),
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
