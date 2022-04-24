import { gameComponent, State, GameMap } from '../type'
import { createComponent } from '@arekrado/canvas-engine'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { SavedData } from '../utils/localDb'
import { small0 } from './maps/small0'
import { small1 } from './maps/small1'
import { small2 } from './maps/small2'
import { medium0 } from './maps/medium0'
import { medium1 } from './maps/medium1'
import { medium2 } from './maps/medium2'
import { huge1 } from './maps/huge1'
import { huge0 } from './maps/huge0'
import { huge2 } from './maps/huge2'
import { huge3 } from './maps/huge3'
import { huge4 } from './maps/huge4'
import { campaign0 } from './maps/campaign0'
import { campaign1 } from './maps/campaign1'
import { campaign2 } from './maps/campaign2'
import { campaign3 } from './maps/campaign3'
import { campaign4 } from './maps/campaign4'
import { campaign5 } from './maps/campaign5'
import { campaign6 } from './maps/campaign6'
import { campaign7 } from './maps/campaign7'
import { campaign8 } from './maps/campaign8'
import { campaign9 } from './maps/campaign9'
import { campaign10 } from './maps/campaign10'
import { campaign11 } from './maps/campaign11'
import { campaign12 } from './maps/campaign12'
import { campaign13 } from './maps/campaign13'
import { campaign14 } from './maps/campaign14'
import { campaign15 } from './maps/campaign15'
import { campaign16 } from './maps/campaign16'
import { campaign17 } from './maps/campaign17'
import { campaign18 } from './maps/campaign18'
import { campaign19 } from './maps/campaign19'
import { campaign20 } from './maps/campaign20'
import { campaign21 } from './maps/campaign21'
import { campaign22 } from './maps/campaign22'
import { campaign23 } from './maps/campaign23'
import { campaign24 } from './maps/campaign24'
import { campaign25 } from './maps/campaign25'
import { campaign26 } from './maps/campaign26'
import { campaign27 } from './maps/campaign27'
import { campaign28 } from './maps/campaign28'
import { campaign29 } from './maps/campaign29'
import { campaign30 } from './maps/campaign30'
import { campaign31 } from './maps/campaign31'
import { campaign32 } from './maps/campaign32'
import { campaign33 } from './maps/campaign33'
import { campaign34 } from './maps/campaign34'
import { campaign35 } from './maps/campaign35'
import { campaign36 } from './maps/campaign36'
import { campaign37 } from './maps/campaign37'
import { campaign38 } from './maps/campaign38'
import { campaign39 } from './maps/campaign39'
import { campaign40 } from './maps/campaign40'
import { campaign41 } from './maps/campaign41'

export const allMaps: Omit<GameMap, 'name'>[] = [
  small0,
  small1,
  small2,
  medium0,
  medium1,
  medium2,
  huge0,
  huge1,
  huge2,
  huge3,
  huge4,

  // Campaign tutorial
  campaign0,
  campaign1,
  campaign2,
  campaign3,

  // Campaign
  campaign4,
  campaign5,
  campaign6,
  campaign7,
  campaign8,
  campaign9,
  campaign10,
  campaign11,
  campaign12,
  campaign13,
  campaign14,
  campaign15,
  campaign16,
  campaign17,
  campaign18,
  campaign19,
  campaign20,
  campaign21,
  campaign22,
  campaign23,
  campaign24,
  campaign25,
  campaign26,
  campaign27,
  campaign28,
  campaign29,
  campaign30,
  campaign31,
  campaign32,
  campaign33,
  campaign34,
  campaign35,
  campaign36,
  campaign37,
  campaign38,
  campaign39,
  campaign40,
  campaign41,
]

export const gameMapsBlueprint = ({
  state,
  savedData,
}: {
  state: State
  savedData: SavedData
}): State => {
  allMaps.forEach((map) => {
    state = createEntity({ state, entity: map.entity })

    const locked = !savedData.unlockedCampaignMapEntities.find(
      (unlockedMapEntity) => unlockedMapEntity === map.entity,
    )

    state = createComponent<GameMap, State>({
      state,
      data: {
        name: gameComponent.gameMap,
        ...map,
        locked: map.locked === false ? false : locked,
      },
    })
  })

  return state
}

// ⚪
// 🔵
// 🔴
// 🟢
// 🟡
// 🟠
// 🌺
// 💿
// 🟣

// type GridElement =
//   | ['⚪', number]
//   | ['🔵', number]
//   | ['🔴', number]
//   | ['🟢', number]
//   | ['🟡', number]
//   | ['🟠', number]
//   | ['🌺', number]
//   | ['💿', number]
//   | ['🟣', number]

// const map = [

//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
//   // [['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['⚪',0]],
  
  
//   [undefined,undefined,['🟢',1],['🟢',1],['⚪',0],['🔵',1],['🔵',1],['⚪',0]],
//   [undefined,['⚪',0],['🟢',1],['🟢',1],['⚪',0],['🔵',1],['🔵',1],['⚪',0]],
//   [['🟣',1],['🟣',1],['⚪',0],['⚪',0],['⚪',0],['⚪',0],['🌺',1],['🌺',1]],
//   [['🟣',1],['🟣',1],undefined,['⚪',0],['🟡',1],['🟡',1],['🌺',1],['🌺',1]],
//   [['⚪',0],undefined,undefined,undefined,['🟡',1],['🟡',1],undefined,['⚪',0]],
//   [['⚪',0],['⚪',0],undefined,['⚪',0],['⚪',0],undefined,undefined,undefined],
//   [['🟠',1],['🟠',1],['🔴',1],['🔴',1],['💿',1],['💿',1],undefined,['⚪',0]],
//   [['🟠',1],['🟠',1],['🔴',1],['🔴',1],['💿',1],['💿',1],['⚪',0],['⚪',0]],

  


// ]

// (() => {
//   const map = [
//   [['🔵', 1],['🔵', 6],['🔵', 1],['🟢', 6],['🟢', 1],['🟢', 6]],
//   [['🔵', 6],['🔵', 1],['🔵', 6],['🟢', 1],['🟢', 6],['🟢', 6]],
//   [['🔵', 1],['🔵', 6],['🔵', 1],['🟢', 6],['🟢', 1],['🟢', 1]],
//   [['🔴', 6],['🔴', 1],['🔴', 6],['🟡', 1],['🟡', 6],['🟡', 1]],
//   [['🔴', 1],['🔴', 6],['🔴', 1],['🟡', 6],['🟡', 1],['🟡', 6]],
//   [['🔴', 6],['🔴', 1],['🔴', 6],['🟡', 1],['🟡', 6],['🟡', 1]],
// ]
  
//   const mapGenerator = (gird) => {
//   const list = []

//   gird.reverse().forEach((row) => {
//     const rowList = []
//     row.forEach((box) => {
//       if(box===undefined){
//         rowList.push(undefined)
//         return
//       }
//       switch (box[0]) {
//         case '⚪':
//           rowList.push({ player: -1, dots: box[1] })
//           break
//         case '🔵':
//           rowList.push({ player: 0, dots: box[1] })
//           break
//         case '🔴':
//           rowList.push({ player: 1, dots: box[1] })
//           break
//         case '🟢':
//           rowList.push({ player: 2, dots: box[1] })
//           break
//         case '🟡':
//           rowList.push({ player: 3, dots: box[1] })
//           break
//         case '🟠':
//           rowList.push({ player: 4, dots: box[1] })
//           break
//         case '🌺':
//           rowList.push({ player: 5, dots: box[1] })
//           break
//         case '💿':
//           rowList.push({ player: 6, dots: box[1] })
//           break
//         case '🟣':
//           rowList.push({ player: 7, dots: box[1] })
//           break
//       }
//     })

//     list.push(rowList)
//   })

//   return list
// }
// console.log(JSON.stringify(mapGenerator(map)))
// })()