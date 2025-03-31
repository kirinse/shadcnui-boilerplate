import {
  Document,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  VerticalAlign,
  WidthType,
} from "docx"

import type { IRisk } from "@/schema/number"

export class DocumentCreator {
  public create(lotto: string, day: Date, data: IRisk[], number?: string): Document {
    const title = `${day.toLocaleDateString()} ${lotto}彩直选${number ?? ""}报告`

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
            }),
            new Table({
              width: { size: 9638, type: WidthType.DXA },
              margins: { top: 20, bottom: 20, left: 20, right: 20 },
              layout: TableLayoutType.FIXED,
              columnWidths: [1410, 8228],
              rows: [
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: `号码`, autoSpaceEastAsianText: true })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    // new TableCell({
                    //   children: [new Paragraph({ text: "奖金", autoSpaceEastAsianText: true })],
                    //   verticalAlign: VerticalAlign.CENTER,
                    //   margins: { top: 20, bottom: 20, left: 20, right: 20 },
                    // }),
                    new TableCell({
                      children: [new Paragraph({ text: `直选注数`, autoSpaceEastAsianText: true })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                  ],
                }),
              ].concat(
                data.map((risk) => new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: risk.number })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    // new TableCell({
                    //   children: [new Paragraph({ text: `${new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(risk.prize)}` })],
                    //   verticalAlign: VerticalAlign.CENTER,
                    //   margins: { top: 20, bottom: 20, left: 20, right: 20 },
                    // }),
                    new TableCell({
                      children: [new Paragraph({ text: `${Math.ceil(risk.prize / 1800)}` })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                  ],
                })),
              ),
            }),
          ],
        },
      ],
    })
    return document
  }
}
