// import 'regenerator-runtime/runtime'
// import { BasicBox, gridBlueprint } from '../blueprints/gridBlueprint'
// import { aiBlueprint } from '../blueprints/aiBlueprint'
// import { AI, Box, name } from '../type'
// import { Entity, getComponent, runOneFrame } from '@arekrado/canvas-engine'
// import { AIDifficulty } from '../systems/aiSystem'
// import { getGame } from '../systems/gameSystem'
// import { getState } from '../getState'
// import { getDataGrid } from '../systems/aiSystem/getDataGrid'
// import { onClickBox } from '../systems/boxSystem/onClickBox'

// const basicAI = (entity: Entity): AI => ({
//   entity,
//   name: name.ai,
//   human: false,
//   level: AIDifficulty.hard,
//   color: [0, 0, 1],
//   textureSet: ['', '', '', '', '', '', ''],
//   active: true,
// })

// const basicBox: BasicBox = {
//   player: undefined,
//   dots: 0,
// }

// const basicGrid2x2 = [
//   [basicBox, basicBox, basicBox],
//   [basicBox, basicBox, basicBox],
//   [basicBox, basicBox, basicBox],
// ]

// describe('game', () => {
//   it.skip('clicking on 6 dots box should expand player color', () => {
//     let state = gridBlueprint({
//       dataGrid: basicGrid2x2,
//       state: getState({}),
//     })

//     const game = getGame({ state })
//     if (!game) {
//       return
//     }

//     const ai = basicAI('1')
//     state = aiBlueprint({ state, ai: [ai] })

//     const middleBoxEntity = getDataGrid({ state })[1][1].entity
//     const middleBox = getComponent<Box>({
//       state,
//       name: name.box,
//       entity: middleBoxEntity,
//     })

//     if (!middleBox) {
//       throw new Error("middleBox doesn't exist")
//     }

//     expect(getDataGrid({ state })[1][1].dots).toBe(0)

//     // click on a box until has less than 6 dots
//     ;[1, 2, 3, 4, 5, 6].forEach((x) => {
//       state = onClickBox({
//         state,
//         box: middleBox,
//         ai,
//       })

//       // state = runOneFrame({ state });
//       // state = runOneFrame({ state });
//       // state = runOneFrame({ state });
//       // state = runOneFrame({ state });
//       // state = runOneFrame({ state });

//       expect(getDataGrid({ state })[1][1].dots).toBe(x)
//     })

//     // Other boxes should be untouched
//     getDataGrid({ state })
//       .flat()
//       .forEach((box) => {
//         if (box.entity !== middleBoxEntity) {
//           expect(box.dots).toBe(0)
//           expect(box.player).toBeUndefined()
//         }
//       })

//     // "explode"
//     state = onClickBox({
//       state,
//       box: middleBox,
//       ai,
//     })

//     state = runOneFrame({ state })
//     state = runOneFrame({ state })
//     state = runOneFrame({ state })
//     state = runOneFrame({ state })

//     // now grid should contains cubes with 1 and 0
//     const gridAfterExplosion = getDataGrid({ state })
//     // console.log(gridAfterExplosion)
//     expect(gridAfterExplosion[0][0].dots).toBe(0)
//     expect(gridAfterExplosion[0][1].dots).toBe(1)
//     expect(gridAfterExplosion[0][2].dots).toBe(0)
//     expect(gridAfterExplosion[1][0].dots).toBe(1)
//     expect(gridAfterExplosion[1][1].dots).toBe(1)
//     expect(gridAfterExplosion[1][2].dots).toBe(1)
//     expect(gridAfterExplosion[2][0].dots).toBe(0)
//     expect(gridAfterExplosion[2][1].dots).toBe(1)
//     expect(gridAfterExplosion[2][2].dots).toBe(0)
//   })

//   // it('game 1 vs 1', () => {
//   //   const emptyGrid = Array.from({ length: 5 }).map(() =>
//   //     Array.from({ length: 5 }).map(() => ({
//   //       player: undefined,
//   //       dots: 0,
//   //     }))
//   //   );

//   //   let state = createGrid({
//   //     dataGrid: emptyGrid,
//   //     scene,
//   //     camera,
//   //     state: getGameInitialState(),
//   //   });

//   //   const game = getGame({ state });
//   //   if (!game) {
//   //     return;
//   //   }

//   //   const ai1 = basicAI('1');
//   //   const ai2 = basicAI('2');
//   //   state = createPlayers({ state, ai: [ai1, ai2] });
//   //   state = setComponent<Game>({
//   //     state,
//   //     data: {
//   //       ...game,
//   //       gameStarted: true,
//   //     },
//   //   });

//   //   Array.from({ length: 10 }).forEach(() => {
//   //     state = runOneFrame({ state });
//   //   });

//   //   const game2 = getGame({ state });

//   //   // console.log(getDataGrid({ state }))

//   //   expect(game2?.gameStarted).toBe(false);
//   // });
// })
