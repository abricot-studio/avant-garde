import { Flex, Card, CircularProgress, CircularProgressLabel, Text } from './ui'
import { useEffect, useState } from 'react'
import moment, { Duration } from 'moment'
import config from '../config'

const launchDate = moment.utc(config.launchDate)
const startDate = moment.utc(config.startDate)

interface timeLeft {
  durationLaunch: Duration
  durationStart: Duration
  dayLaunch: number
  dayProgress: number
  hourProgress: number
  minutesProgress: number
  secondProgress: number

}
const calculateTimeLeft = (): timeLeft => {
  const now = moment.utc()
  const durationLaunch = moment.duration(launchDate.clone().diff(now))
  const durationStart = moment.duration(launchDate.clone().diff(startDate))

  const dayStart = durationStart.months() * 31 + durationStart.days()
  const dayLaunch = durationLaunch.months() * 31 + durationLaunch.days()

  const dayProgress = parseInt((dayLaunch / dayStart * 100).toString())
  const hourProgress = parseInt((durationLaunch.hours() / 24 * 100).toString())
  const minutesProgress = parseInt((durationLaunch.minutes() / 60 * 100).toString())
  const secondProgress = parseInt((durationLaunch.seconds() / 60 * 100).toString() )

  return {
    durationLaunch,
    durationStart,
    dayLaunch,
    dayProgress,
    hourProgress,
    minutesProgress,
    secondProgress,
  }
}

export default function Counter() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer= setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearTimeout(timer)
  })

  return (
    <Flex justifyContent="center" position="relative" flexDirection="column">
        <Text textAlign="center" fontWeight={700} pb={4}>Registration ends in</Text>
        <Flex>
          <Flex flexDirection="column" mr={4}>
            <CircularProgress value={timeLeft.dayProgress} size="50px" thickness="10px" color="reddy">
              <CircularProgressLabel fontWeight={600} color="reddy">{timeLeft.dayLaunch}</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize="0.8rem" textAlign="center">Days</Text>
          </Flex>
          <Flex flexDirection="column" mr={4}>
            <CircularProgress value={timeLeft.hourProgress} size="50px" thickness="10px" color="reddy">
              <CircularProgressLabel fontWeight={600} color="reddy">{timeLeft.durationLaunch.hours()}</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize="0.8rem" textAlign="center">Hours</Text>
          </Flex>
          <Flex flexDirection="column" mr={4}>
            <CircularProgress value={timeLeft.minutesProgress} size="50px" thickness="10px" color="reddy">
              <CircularProgressLabel fontWeight={600} color="reddy">{timeLeft.durationLaunch.minutes()}</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize="0.8rem" textAlign="center">Minutes</Text>
          </Flex>
          <Flex flexDirection="column">
            <CircularProgress value={timeLeft.secondProgress} size="50px" thickness="10px" color="reddy">
              <CircularProgressLabel fontWeight={600} color="reddy">{timeLeft.durationLaunch.seconds()}</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize="0.8rem" textAlign="center" >Seconds</Text>
          </Flex>
        </Flex>
    </Flex>
  )
}
