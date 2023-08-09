import React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { LIMITS } from './constants'

interface KutControlsProps {
  numKuts: number
  setNumKuts: (num: number) => void
  maxMoveDistance: number
  setMaxMoveDistance: (dist: number) => void
  interactionRadius: number
  setInteractionRadius: (radius: number) => void
  radius: number
  setRadius: (radius: number) => void
  maxX: number
  setMaxX: (x: number) => void
  maxY: number
  setMaxY: (y: number) => void
}

const KutControls: React.FC<KutControlsProps> = ({
  numKuts,
  setNumKuts,
  maxMoveDistance,
  setMaxMoveDistance,
  interactionRadius,
  setInteractionRadius,
  radius,
  setRadius,
  maxX,
  setMaxX,
  maxY,
  setMaxY,
}) => {
  return (
    <form noValidate autoComplete="off">
      <Stack spacing={2}>
        <TextField
          label="Number of Kuts"
          type="number"
          value={numKuts}
          inputProps={{
            min: LIMITS.numKuts.min,
            max: LIMITS.numKuts.max,
          }}
          onChange={(e) => setNumKuts(Number(e.target.value))}
        />
        <TextField
          label="Max Move Distance"
          type="number"
          value={maxMoveDistance}
          inputProps={{
            min: LIMITS.maxMoveDistance.min,
            max: LIMITS.maxMoveDistance.max,
          }}
          onChange={(e) => setMaxMoveDistance(Number(e.target.value))}
        />
        <TextField
          label="Radius"
          type="number"
          value={radius}
          inputProps={{
            min: LIMITS.radius.min,
            max: LIMITS.radius.max,
          }}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <TextField
          label="Interaction Radius"
          type="number"
          value={interactionRadius}
          inputProps={{
            min: LIMITS.interactionRadius.min,
            max: LIMITS.interactionRadius.max,
          }}
          onChange={(e) => setInteractionRadius(Number(e.target.value))}
        />
        <TextField
          label="Max X"
          type="number"
          value={maxX}
          inputProps={{
            min: LIMITS.maxX.min,
            max: LIMITS.maxX.max,
          }}
          onChange={(e) => setMaxX(Number(e.target.value))}
        />
        <TextField
          label="Max Y"
          type="number"
          value={maxY}
          inputProps={{
            min: LIMITS.maxY.min,
            max: LIMITS.maxY.max,
          }}
          onChange={(e) => setMaxY(Number(e.target.value))}
        />
      </Stack>
    </form>
  )
}

export default KutControls
