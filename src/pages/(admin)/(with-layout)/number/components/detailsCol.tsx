import type { ColumnDef } from "@tanstack/react-table"

import { CURRENCY_FORMAT } from "@/constants"
import type { INumberDetails } from "@/schema/number"

export const detailsColumns: ColumnDef<INumberDetails>[] = [
  {
    accessorKey: "method",
    header: "玩法",
  },
  {
    accessorKey: "orders",
    header: "次数",
  },
  {
    accessorKey: "times",
    header: () => <div className="text-right">倍数</div>,
    cell: ({ row }) => { return <div className="text-right">{row.getValue("times")}</div> },
  },
  // {
  //     accessorKey: "price",
  //     header: () => <div className="text-right">总价</div>,
  //     cell: ({ row }) => {
  //         const amount = Number.parseFloat(row.getValue("price"))
  //         const formatted = CURRENCY_FORMAT.format(amount)

  //         return <div className="text-right">{formatted}</div>
  //     },
  // },
  {
    accessorKey: "prize",
    header: () => <div className="text-right">奖金</div>,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("prize"))
      const formatted = CURRENCY_FORMAT.format(amount)

      return <div className="text-right">{formatted}</div>
    },
  },
]
