import { camera, scene } from '../..';
import { boxWithGap } from '../../blueprints/gridBlueprint';
import { State } from '../../ecs/type';
import { percentageToValue } from '../../utils/percentageToValue';
import { getCamera } from '../cameraSystem';
import { getCameraSizes } from '../cameraSystem/getCameraSizes';
import { logoEntity } from '../logoSystem';
import { logoGrid } from './logoGrid';

export const boxScaleFactor = 3.2;

export const updateLogoPosition = ({ state }: { state: State }) => {
  const logoNode = scene.getTransformNodeByUniqueId(parseFloat(logoEntity));
  const camera = getCamera({ state });

  if (!logoNode || !camera) {
    return;
  }

  const { topEdge, boxSize, screenSize } = getCameraSizes({
    state,
    boxScaleFactor,
  });

  const logoSize = [logoGrid[0].length * boxSize, logoGrid.length * boxSize];
  const logoPosition = [
    camera.position[0] - logoSize[0] / 2,
    topEdge - percentageToValue({ total: screenSize[1], percentage: 0.1 }),
  ];

  logoGrid.forEach((list, i) =>
    list.forEach((boxEntity, j) => {
      if (boxEntity === '') {
        return;
      }

      const boxNode = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));
      if (!boxNode) {
        return;
      }
      
      const boxPosition: [number, number] = [
        logoPosition[0] + j * boxSize,
        logoPosition[1] + -i * boxSize,
      ];

      boxNode.position.x = logoNode.position.x + boxPosition[0];
      boxNode.position.y = logoNode.position.y + boxPosition[1];

      // boxNode.scaling.x = 1 / boxScaleFactor;
      // boxNode.scaling.y = 1 / boxScaleFactor;
    })
  );
};