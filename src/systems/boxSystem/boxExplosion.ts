import { AI, Box, State } from "../../type";
import { safeGet } from "../aiSystem/calculateLocalStrategy";
import { getDataGrid } from "../aiSystem/getDataGrid";
import { onClickBox } from "./onClickBox";
import { pushBoxToRotationQueue } from "./pushBoxToRotationQueue";

type BoxExplosion = (params: { state: State; box: Box; ai: AI }) => State;
export const boxExplosion: BoxExplosion = ({ state, ai, box }) => {
  const {
    gridPosition: [x, y],
  } = box;

  const dataGrid = getDataGrid({ state });

  state = [
    safeGet(dataGrid, y, x - 1),
    safeGet(dataGrid, y, x + 1),
    safeGet(dataGrid, y - 1, x),
    safeGet(dataGrid, y + 1, x),
  ]
    .filter((box) => box !== undefined)
    .reduce((acc, box, i) => {
      acc = onClickBox({
        ai,
        box,
        state: acc,
      });

      return pushBoxToRotationQueue({ entity: box.entity, state: acc });
    }, state);

  return state;
};