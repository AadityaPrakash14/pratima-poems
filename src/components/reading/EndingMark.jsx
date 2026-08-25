/**
 * EndingMark - Decorative mark at the end of literary content
 * Uses the traditional fleuron (❦) as a literary ending symbol
 * Subtle and understated - signals completion without demanding attention
 */
export default function EndingMark() {
  return (
    <div 
      className="ending-mark"
      aria-hidden="true"
    >
      <span className="ending-mark__symbol">❦</span>
    </div>
  );
}
