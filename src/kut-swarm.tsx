import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Kut } from './entities/kut'
import { Typography } from '@mui/material'
import { LIMITS } from './constants'

interface KutSwarmProps {
  numKuts: number
  maxX: number
  maxY: number
  maxMoveDistance: number
  interactionRadius: number
  radius: number
}

function createKuts(
  n: number,
  screenWidth: number,
  screenHeight: number,
  interactionRadius: number,
  radius: number,
): Kut[] {
  const kuts: Kut[] = []

  for (let i = 0; i < n; i++) {
    let x: number, y: number

    // Keep generating random positions until we find one that doesn't overlap with any existing kut
    do {
      x = Math.random() * screenWidth
      y = Math.random() * screenHeight
    } while (
      kuts.some((kut) => Math.hypot(kut.x - x, kut.y - y) < kut.radius * 2)
    )

    const kut = new Kut(x, y, interactionRadius, radius)
    kuts.push(kut)
  }

  return kuts
}

const KutSwarm: React.FC<KutSwarmProps> = ({
  numKuts,
  maxX,
  maxY,
  maxMoveDistance,
  interactionRadius,
  radius,
}) => {
  const [kuts, setKuts] = useState<Kut[]>([])
  const ref = useRef<SVGSVGElement>(null)

  // Create an array of random Kuts when the component mounts
  useEffect(() => {
    if (
      maxX < LIMITS.maxX.min ||
      maxY < LIMITS.maxY.min ||
      maxX > LIMITS.maxX.max ||
      maxY > LIMITS.maxY.max ||
      numKuts < LIMITS.numKuts.min ||
      numKuts > LIMITS.numKuts.max ||
      maxMoveDistance < LIMITS.maxMoveDistance.min ||
      maxMoveDistance > LIMITS.maxMoveDistance.max ||
      interactionRadius < LIMITS.interactionRadius.min ||
      interactionRadius > LIMITS.interactionRadius.max ||
      radius < LIMITS.radius.min ||
      radius > LIMITS.radius.max
    ) {
      return
    }

    const newKuts = createKuts(numKuts, maxX, maxY, interactionRadius, radius)
    setKuts(newKuts)
  }, [numKuts, maxX, maxY, interactionRadius, maxMoveDistance, radius])

  useEffect(() => {
    const interval = setInterval(() => {
      setKuts((kuts) => {
        // Create a new array to store the new directions
        const newDirections = kuts.map((kut) => ({
          dx: kut.direction.x,
          dy: kut.direction.y,
        }))

        kuts.forEach((kut1, i) => {
          for (let j = i + 1; j < kuts.length; j++) {
            const kut2 = kuts[j]
            if (kut1.touches(kut2)) {
              kut1.transferBitTo(kut2)
              const newDirection1 =
                kut1.calculateNewDirectionAfterCollisionWith(kut2)
              const newDirection2 =
                kut2.calculateNewDirectionAfterCollisionWith(kut1)

              // Store the new directions
              newDirections[i] = newDirection1
              newDirections[j] = newDirection2
            }
          }
        })

        // Create a new array of kuts with updated directions
        const newKuts = kuts.map((kut, i) => {
          kut.direction.x = newDirections[i].dx
          kut.direction.y = newDirections[i].dy
          kut.move(maxMoveDistance, maxX, maxY)
          return kut
        })

        // Return the new array of kuts
        return newKuts
      })
    }, 100) // Adjust the interval as needed

    return () => clearInterval(interval)
  }, [maxMoveDistance, maxX, maxY])

  // Use D3 to update the visualization whenever the Kuts move
  useEffect(() => {
    if (!kuts.length) return

    const svg = d3.select(ref.current)
    svg
      .selectAll('circle')
      .data(kuts)
      .join('circle')
      .transition() // Start a transition
      .duration(100)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', kuts[0].radius)
      .attr('fill', (d) => {
        if (d.bit) {
          return 'yellow' // color when kut carries a bit
        } else if (kuts.some((other) => d !== other && d.touches(other))) {
          return 'red' // color when kuts touch
        } else if (kuts.some((other) => d !== other && d.isNear(other))) {
          return 'blue' // color when kuts are near
        } else {
          return 'black' // default color
        }
      })
  }, [kuts])

  return (
    <>
      <svg
        ref={ref}
        width={maxX}
        height={maxY}
        style={{ background: 'black' }}
      />
      <Typography>{kuts.filter((kut) => kut.bit === 1).length}</Typography>
    </>
  )
}

export default KutSwarm
