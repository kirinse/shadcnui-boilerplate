import {
  Document,
  HeadingLevel,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  WidthType,
} from "docx"
import { chunk } from "lodash-es"

import type { IRisk } from "@/schema/number"

export class DocumentCreator {
  public create(lotto: string, day: Date, data: [string, IRisk[]][], number?: string): Document {
    const data_ = chunk(data, 4)
    const title = `${day.toLocaleDateString("zh-CN")} ${lotto}彩直选${number ?? ""}报告`
    const rows = []
    for (const ck of data_) {
      rows.push(new TableRow({
        children: ck.map((cell) => {
          return new TableCell({
            children: [new Paragraph({ text: `直选 ${cell[0]} 单` })],
            shading: { fill: "F2EDD1", type: ShadingType.CLEAR, color: "auto" },
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
        }),
      }), new TableRow({
        children: ck.map((cell) => {
          return new TableCell({
            children: [new Paragraph({ text: `${cell[1].map((r) => r.number).join(" ")}` })],
            margins: { top: 20, bottom: 20, left: 20, right: 20 },
          })
        }),
      }))
    }

    const document = new Document({
      title,
      creator: `wc.e8bet.net`,
      sections: [
        {
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.TITLE,
              autoSpaceEastAsianText: true,
              alignment: "center",
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              margins: { top: 20, bottom: 20, left: 20, right: 20 },
              layout: TableLayoutType.FIXED,
              // columnWidths: [1410, 8228],
              rows,
            }),
          ],
        },
      ],
    })
    return document
  }
}
