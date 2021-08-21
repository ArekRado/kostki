//stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
type Clapm = (params: { value: number; min: number; max: number }) => number;
export const clapm: Clapm = ({ value, min, max }) =>
  value <= min 
    ? min : value >= max 
      ? max : value;
