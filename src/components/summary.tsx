import { map, orderBy } from "lodash-es"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useSummary } from "@/hooks/query/use-number"
import { cn } from "@/lib/utils"

const lotto: any = {
  福: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 331.000000 300.000000"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="size-24 text-red-500/50"
      >
        <g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M1579 2973 c-39 -103 -819 -2232 -819 -2237 0 -3 51 -6 113 -6 l114
        0 17 43 c9 23 177 468 373 989 l356 948 239 2 240 3 44 125 c24 69 47 133 50
        142 5 17 -16 18 -356 18 l-360 0 -11 -27z"
          />
          <path d="M1360 1543 c-227 -604 -415 -1104 -418 -1110 -3 -10 25 -13 120 -13
        l123 0 365 980 364 980 236 0 235 0 37 93 c20 50 43 109 52 130 l16 37 -358 0
        -358 0 -414 -1097z"
          />
          <path d="M1945 2308 c-167 -443 -854 -2292 -852 -2294 1 -1 161 -3 356 -5
        l354 -4 131 357 131 358 287 0 c278 0 290 1 351 24 321 121 522 352 582 671
        29 153 6 364 -54 500 -71 162 -225 302 -396 364 l-80 28 -403 7 c-327 6 -403
        5 -407 -6z m631 -628 c80 -34 109 -113 79 -216 -31 -110 -98 -184 -198 -218
        -54 -18 -197 -22 -197 -5 0 11 164 419 182 452 8 15 17 17 51 12 23 -4 60 -15
        83 -25z"
          />
          <path d="M855 2284 c-262 -41 -452 -125 -601 -267 -177 -168 -264 -381 -251
        -612 12 -204 72 -350 194 -472 60 -60 91 -81 175 -122 95 -46 189 -75 263 -83
        l30 -3 87 240 c48 132 88 241 88 241 0 1 -25 4 -55 6 -93 8 -143 62 -152 167
        -8 82 29 162 108 235 66 62 127 87 233 95 l68 6 98 271 c54 149 101 280 104
        292 7 22 7 22 -146 21 -84 -1 -193 -7 -243 -15z"
          />
        </g>
      </svg>
    ),
    bgColor: "bg-red-200/50",
    amountColor: "text-red-400",
  },
  体: {
    icon: (
      <svg
        viewBox="0 0 40 40"
        className="size-24 opacity-50"
      >
        <g>
          <polygon style={{ fill: "#231815" }} points="17.91,0.57 22.9,0.57 17.49,17.18 12.52,17.18 	" />
          <polygon style={{ fill: "#0080CB" }} points="0,17.24 1.53,12.51 15.67,22.77 14.13,27.5 	" />
          <polygon style={{ fill: "#F9BE00" }} points="10.34,39.43 6.31,36.5 20.43,26.24 24.47,29.17 	" />
          <polygon style={{ fill: "#009844" }} points="34.63,36.45 30.6,39.37 25.2,22.77 29.23,19.84 	" />
          <polygon style={{ fill: "#E50012" }} points="39.3,12.44 40.83,17.17 23.37,17.17 21.83,12.44 	" />
        </g>
      </svg>
    ),
    bgColor: "bg-[#0080CB]/50",
    amountColor: "text-blue-500",
  },
}

interface SummaryProps {
  summary?: Record<string, number>
  day?: Date
  userId?: string[]
}

export function Summary({
  // summary,
  day,
  userId,
}: SummaryProps) {
  const { data: summary } = useSummary(day, userId ? userId.map((n) => Number.parseInt(n)) : undefined)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {!!summary && orderBy(map(summary, (v, k) => [k, v]), (arr) => arr[1], "desc").map(([k, v]) => (
        // @ts-ignore
        <Card key={k} className={lotto[k].bgColor}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
            {/* @ts-ignore */}
            <CardTitle className={cn("text-3xl font-normal", lotto[k].amountColor)}>
              {new Intl.NumberFormat("zh-CN", {
                style: "currency",
                currency: "CNY",
                maximumFractionDigits: 2,
                // @ts-ignore
              }).format(v)}
            </CardTitle>
            {/* @ts-ignore */}
            {lotto[k].icon}
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
