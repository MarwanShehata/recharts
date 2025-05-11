import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
  },
]

const calculateMean = (arr) => {
  const sum = arr.reduce((acc, val) => acc + val, 0)
  return sum / arr.length
}
const calculateStandardDeviation = (arr, mean) => {
  // https://www.geeksforgeeks.org/how-to-get-the-standard-deviation-of-an-array-of-numbers-using-javascript/
  const squaredDifferences = arr.map((val) => Math.pow(val - mean, 2))
  const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0)
  return Math.sqrt(sumSquaredDiff / arr.length)
}
const calculateZScore = (value, mean, stdDev) => {
  return (value - mean) / stdDev
}

// Pure function to check if absolute z-score is greater than threshold
// https://www.machinelearningplus.com/machine-learning/how-to-detect-outliers-with-z-score/
const isOutlier = (zScore, threshold = 1) => {
  return Math.abs(zScore) > threshold
}

export default function Recharts() {
  const uvValues = data.map((item) => item.uv)
  const pvValues = data.map((item) => item.pv)

  const uvMean = calculateMean(uvValues)
  const uvStdDev = calculateStandardDeviation(uvValues, uvMean)
  const pvMean = calculateMean(pvValues)
  const pvStdDev = calculateStandardDeviation(pvValues, pvMean)

  // Pure function to determine dot color based on z-score
  const getDotColor = (dataKey, value) => {
    let mean, stdDev

    if (dataKey === 'uv') {
      mean = uvMean
      stdDev = uvStdDev
    } else if (dataKey === 'pv') {
      mean = pvMean
      stdDev = pvStdDev
    } else {
      return '#000000' // Default color for unknown data keys - Simple error handling <<<<<< Unnecessary?
    }

    const zScore = calculateZScore(value, mean, stdDev)
    return isOutlier(zScore) ? '#ff0000' : '#000000'
  }

  // Pure function for dot props
  const getDotProps = (dataKey, entry) => {
    const value = entry[dataKey]
    return {
      r: 8,
      fill: getDotColor(dataKey, value),
      stroke: getDotColor(dataKey, value),
    }
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={500}
      minHeight={300}
    >
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          dot={(props) => {
            const { cx, cy, dataKey, payload } = props
            const dotProps = getDotProps(dataKey, payload)
            return <circle cx={cx} cy={cy} {...dotProps} />
          }}
          activeDot={(props) => {
            const { cx, cy, dataKey, payload } = props
            const dotProps = getDotProps(dataKey, payload)
            return <circle cx={cx} cy={cy} {...dotProps} />
          }}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="#82ca9d"
          dot={(props) => {
            const { cx, cy, dataKey, payload } = props
            const dotProps = getDotProps(dataKey, payload)
            return <circle cx={cx} cy={cy} {...dotProps} />
          }}
          activeDot={(props) => {
            const { cx, cy, dataKey, payload } = props
            const dotProps = getDotProps(dataKey, payload)
            return <circle cx={cx} cy={cy} {...dotProps} />
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
