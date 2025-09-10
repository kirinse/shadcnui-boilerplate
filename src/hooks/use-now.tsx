import { useEffect, useState } from "react"

type UnitOfTime = "year" | "month" | "date" | "hour" | "minute" | "second" | "millisecond"

function getDatePart(date: Date, part: UnitOfTime) {
  switch (part) {
    case "year": {
      return date.getFullYear()
    }
    case "month": {
      return date.getMonth()
    }
    case "date": {
      return date.getDate()
    }
    case "hour": {
      return date.getHours()
    }
    case "minute": {
      return date.getMinutes()
    }
    case "second": {
      return date.getSeconds()
    }
    case "millisecond": {
      return date.getMilliseconds()
    }
  }
}

export function useNow(frequency: number, unit: UnitOfTime) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date()
      const diff = Math.abs(getDatePart(newNow, unit) - getDatePart(now, unit))
      if (diff >= frequency) {
        setNow(newNow)
      }
    }, 1000)

    return () => clearInterval(interval)
  })

  return now
}
