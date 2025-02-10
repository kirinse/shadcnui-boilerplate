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

export class DocumentCreator {
  public create(lotto: string, day: Date, data: any[]): Document {
    const title = `${day.toLocaleDateString()} ${lotto}彩直选报告`

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
              columnWidths: [1410, 1410, 1410, 5408],
              rows: [
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: `号码`, autoSpaceEastAsianText: true })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `次数`, autoSpaceEastAsianText: true })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `倍数`, autoSpaceEastAsianText: true })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "奖金", autoSpaceEastAsianText: true })],
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
                    new TableCell({
                      children: [new Paragraph({ text: `${risk.count}` })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${risk.times}` })],
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 20, bottom: 20, left: 20, right: 20 },

                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(risk.prize)}` })],
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
