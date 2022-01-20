import { generateId } from '../../utils/generateId';

export const logoGrid: string[][] = [
  // [1],
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
].reduce((acc1, list, i) => {
  acc1[i] = list.reduce((acc2, shouldCreateBox, j) => {
    if (shouldCreateBox === 0) {
      acc2[j] = '';
    } else {
      const boxEntity = generateId().toString();
      acc2[j] = boxEntity;
    }

    return acc2;
  }, [] as string[]);

  return acc1;
}, [] as string[][]);
