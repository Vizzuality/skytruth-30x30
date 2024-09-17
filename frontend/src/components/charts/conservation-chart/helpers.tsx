/**
 * Render a multiline text in SVG
 * @param content String to render
 * @param maxLineCharacters Maximum number of characters per line
 */
export const getMultilineRenderer = (content: string, maxLineCharacters: number) => {
  const MultiLinetext = ({
    viewBox,
    offset,
  }: {
    viewBox: { x: number; y: number; width: number; height: number };
    offset: number;
  }) => {
    const { x, y } = viewBox;

    const words = content.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0, j = words.length; i < j; i++) {
      const word = words[i];
      const potentialLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;

      if (potentialLine.length <= maxLineCharacters) {
        currentLine = potentialLine;
      } else {
        // If `potentialLine.length === 0`, then `potentialLine === word`
        lines.push(currentLine.length > 0 ? currentLine : potentialLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return (
      <text x={x + offset} y={y}>
        {lines.map((line) => (
          <tspan key={line} x={x + offset} dy={15}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  return MultiLinetext;
};
