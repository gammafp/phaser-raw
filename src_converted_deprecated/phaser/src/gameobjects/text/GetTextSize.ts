/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns an object containing dimensions of the Text object.
 *
 * @function Phaser.GameObjects.GetTextSize
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object to calculate the size from.
 * @param {Phaser.Types.GameObjects.Text.TextMetrics} size - The Text metrics to use when calculating the size.
 * @param {string[]} lines - The lines of text to calculate the size from.
 *
 * @return {Phaser.Types.GameObjects.Text.GetTextSizeObject} An object containing dimensions of the Text object.
 */
export const GetTextSize = (text: any, size: any, lines: string[]): any => {
    const canvas = text.canvas;
    const context = text.context;
    const style = text.style;

    const lineWidths: number[] = [];
    let maxLineWidth = 0;
    let drawnLines = lines.length;

    if (style.maxLines > 0 && style.maxLines < lines.length)
    {
        drawnLines = style.maxLines;
    }

    style.syncFont(canvas, context);

    //  Text Width
    const letterSpacing = text.letterSpacing;

    for (let i = 0; i < drawnLines; i++)
    {
        let lineWidth = style.strokeThickness;

        if (letterSpacing === 0)
        {
            lineWidth += context.measureText(lines[i]).width;
        }
        else
        {
            const line = lines[i];
            
            for (let j = 0; j < line.length; j++)
            {
                lineWidth += context.measureText(line[j]).width;
            }

            if (line.length > 1)
            {
                lineWidth += letterSpacing * (line.length - 1);
            }
        }

        // Adjust for wrapped text
        if (style.wordWrap)
        {
            lineWidth -= context.measureText(' ').width;
        }

        lineWidths[i] = Math.ceil(lineWidth);
        maxLineWidth = Math.max(maxLineWidth, lineWidths[i]);
    }

    //  Text Height

    const lineHeight = size.fontSize + style.strokeThickness;
    let height = lineHeight * drawnLines;
    const lineSpacing = text.lineSpacing;

    //  Adjust for line spacing
    if (drawnLines > 1)
    {
        height += lineSpacing * (drawnLines - 1);
    }

    return {
        width: maxLineWidth,
        height: height,
        lines: drawnLines,
        lineWidths: lineWidths,
        lineSpacing: lineSpacing,
        lineHeight: lineHeight
    };
};
