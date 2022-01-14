import { scene } from '..';
import { State } from '../type';
import { logoGrid } from '../systems/logoSystem/logoGrid';
import { boxScaleFactor } from '../systems/logoSystem/updateLogoPosition';
import { boxBlueprint } from './boxBlueprint';

export const logoBlueprint = ({ state }: { state: State }) => {
  logoGrid.forEach((list, i) =>
    list.forEach((boxEntity, j) => {
      if (boxEntity === '') {
        return;
      }

      const boxNode = boxBlueprint({
        scene,
        name: 'logo box',
        uniqueId: parseFloat(boxEntity),
        position: [0, 0],
        color: [1, 1, 1],
        state,
        ai: undefined,
        dots: 0,
        isClickable: false,
        scaleFactor: boxScaleFactor,
      });

      // lol doesn't work!!!
      // boxNode.setParent(logoMesh);
      // boxNode.parent = logoMesh
    })
  );
};
