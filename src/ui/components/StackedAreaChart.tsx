import { styled } from '@stitches/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { getGame } from '../../systems/gameSystem'
import { AI, Game } from '../../type'
import { useGameState } from '../hooks/useGameState'
import { getAiColors } from '../utils/getAiColors'

const Container = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  // overflow: 'hidden',
})

const SvgContent = styled('svg', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})

const sumPreviousAiBoxes = (
  turnData: Game['statistics'][0],
  aiIndex: number,
) => {
  const sum = turnData
    .slice(0, aiIndex)
    .reduce((acc, { boxesSum }) => acc + boxesSum, 0)

  return sum
}

const lineColor = 'rgb(17, 24, 39)'
const lineTicksAmount = 5
const tickStep = 1 / lineTicksAmount
const tickTextHeight = 21

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
  const graphHeight = height - tickTextHeight

  const totalBoxes = game?.grid.length ?? 0
  const totalTurns = game?.statistics.length ?? 0
  const totalPlayers = game?.statistics?.[0].length ?? 0
  const normalizedTotalTurns = totalTurns / totalPlayers

  const horizontalLineTicks = Array.from({ length: lineTicksAmount }).map(
    (_, i) => Math.floor(normalizedTotalTurns * tickStep * (i + 1)),
  )

  useEffect(() => {
    const colors = getAiColors(state)

    const newData = game?.statistics?.[0]?.map(({ aiEntity }, aiIndex) => {
      const color = colors[aiEntity] ?? [0, 0, 0]
      const points = game?.statistics.map((turnData, turnNumber) => {
        const { boxesSum } = turnData[aiIndex]

        const x = (turnNumber / (totalTurns - 1)) * width
        const y = (boxesSum / totalBoxes) * graphHeight
        const yOffset =
          (sumPreviousAiBoxes(turnData, aiIndex) / totalBoxes) * graphHeight

        return `${x},${graphHeight - y - yOffset}`
      })

      return {
        color,
        points: [
          `${0},${graphHeight}`,
          ...points,
          `${width},${graphHeight}`,
        ].join(' '),
        aiEntity,
      }
    })

    setData(newData ?? [])
  }, [
    totalBoxes,
    totalTurns,
    game?.statistics,
    game?.grid.length,
    state,
    width,
    graphHeight,
  ])

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

        {/* Vertical */}
        <text x="5" y="0" dominantBaseline="hanging">
          Dices (max {totalBoxes})
        </text>
        <line
          x1="0"
          y1={height - tickTextHeight}
          x2="0"
          y2="0"
          style={{
            stroke: lineColor,
            strokeWidth: '4',
          }}
        />

        {/* Horizontal */}
        <text x="0" y={height} dominantBaseline="ideographic">
          Turns
        </text>
        <line
          x1="0"
          y1={height - tickTextHeight}
          x2={width}
          y2={height - tickTextHeight}
          style={{
            stroke: lineColor,
            strokeWidth: '2',
          }}
        />

        {horizontalLineTicks.map((turn, i) => {
          const x = width * tickStep * (i + 1)
          const y = height
          const isLast = i === lineTicksAmount - 1

          return (
            <Fragment key={i}>
              <line
                x1={isLast ? x - 2 : x}
                y1={y - 4 - tickTextHeight}
                x2={x}
                y2={y - tickTextHeight}
                style={{
                  stroke: lineColor,
                  strokeWidth: '2',
                }}
              />

              <text
                x={x}
                y={y}
                dominantBaseline="ideographic"
                textAnchor={isLast ? 'end' : 'middle'}
              >
                {turn}
              </text>
            </Fragment>
          )
        })}
      </SvgContent>
    </Container>
  )
}
