interface TerminalProps {
  /** Transcription brute du CLI (symboles @clack/prompts conservés) */
  transcript: string;
  command: string;
}

const SYMBOL = /^([┌│◇▲●└├◆■])/;

/** Affiche une vraie transcription du CLI, symboles de clack colorés. */
export default function Terminal({transcript, command}: TerminalProps) {
  const lines = transcript.split('\n');
  return (
    <figure className="overflow-hidden rounded-[10px] border border-line bg-[#0F0F0E]">
      <figcaption className="border-b border-line px-4 py-2 font-mono text-[0.8125rem] text-muted">
        <span className="select-none">$ </span>
        <span className="text-text">{command}</span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-[1.6] text-[#D6D3CC]">
        {lines.map((line, index) => {
          const match = line.match(SYMBOL);
          const symbol = match?.[1];
          const rest = symbol ? line.slice(symbol.length) : line;
          const isTitle = symbol === '┌' || symbol === '└';
          return (
            <span key={index} className="block whitespace-pre-wrap break-words">
              {symbol && (
                <span className={symbol === '▲' ? 'text-accent' : symbol === '│' || symbol === '├' ? 'text-[#4A4844]' : 'text-accent-soft'}>
                  {symbol}
                </span>
              )}
              <span className={isTitle ? 'text-text' : undefined}>{rest || ' '}</span>
            </span>
          );
        })}
      </pre>
    </figure>
  );
}
