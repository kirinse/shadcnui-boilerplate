import {
  Document,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
} from "docx"

export class DocumentCreator {
  public create(lotto: string, day: Date, data: any[]): Document {
    const document = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: `${day.toLocaleDateString()} ${lotto}彩直选报告`,
              heading: HeadingLevel.TITLE,
              autoSpaceEastAsianText: true,
            }),
            new Table({
              width: { size: `100%` },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: `号码` })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `次数` })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `倍数` })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "奖金" })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ],
                }),
              ].concat(
                data.map((risk) => new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: risk.number })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${risk.count}` })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${risk.times}` })],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${risk.prize}` })],
                      verticalAlign: VerticalAlign.CENTER,
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
