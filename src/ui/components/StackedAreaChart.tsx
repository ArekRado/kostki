import { Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { styled } from '@stitches/react'
import React, { useEffect, useRef, useState } from 'react'
import { getGame } from '../../systems/gameSystem'
import { AI, Game, name, State } from '../../type'
import { useGameState } from '../hooks/useGameState'

const Container = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

const SvgContent = styled('svg', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})

const getColors = (state: State | undefined) =>
  state
    ? Object.values(
        getComponentsByName<AI>({ state, name: name.ai }) ?? {},
      ).reduce((acc, ai) => {
        acc[ai.entity] = ai.color
        return acc
      }, {} as Record<Entity, AI['color']>)
    : {}

const sumPreviousAiBoxes = (
  turnData: Game['statistics'][0],
  aiIndex: number,
) => {
  const sum = turnData
    .slice(0, aiIndex)
    .reduce((acc, { boxesSum }) => acc + boxesSum, 0)

  return sum
}

export const StackedAreaChart: React.FC = () => {
  const containerRef = useRef<null | HTMLDivElement>(null)
  const [data, setData] = useState<
    {
      color: AI['color']
      points: string
      aiEntity: string
    }[]
  >([])

  const state = useGameState()
  const game = state && getGame({ state })
  const containerRec = containerRef.current?.getBoundingClientRect()
  const height = containerRec?.height ?? 0
  const width = containerRec?.width ?? 0

  useEffect(() => {
    const totalBoxes = game?.grid.length ?? 0
    const totalTurns = game?.statistics.length ?? 0
    const colors = getColors(state)

    const newData = game?.statistics[0].map(({ aiEntity }, aiIndex) => {
      const color = colors[aiEntity]
      const points = game?.statistics.map((turnData, turnNumber) => {
        const { boxesSum } = turnData[aiIndex]

        const x = (turnNumber / (totalTurns-1)) * width
        const y = (boxesSum / totalBoxes) * height
        const yOffset =
          (sumPreviousAiBoxes(turnData, aiIndex) / totalBoxes) * height

        return `${x},${height - y - yOffset}`
      })

      return {
        color,
        points: [...points, `${width},${height}`].join(' '),
        aiEntity,
      }
    })

    setData(newData ?? [])
  }, [game?.statistics, game?.grid.length, state, height, width])

  console.log(game?.statistics)

  return (
    <Container ref={containerRef}>
      <SvgContent
        width="100%"
        height="100%"
        version="1.1"
        viewBox={`0 0 ${width ?? 0} ${height ?? 0}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {[...data].reverse().map(({ aiEntity, points, color }) => (
          <polygon
            key={aiEntity}
            points={points}
            fill={`rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`}
          />
        ))}
      </SvgContent>
    </Container>
  )
}