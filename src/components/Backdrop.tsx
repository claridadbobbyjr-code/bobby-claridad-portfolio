/**
 * Static page backdrop: soft red light pooling at the edges, as on the reference.
 * Deliberately still — no moving pattern behind the content.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      data-testid="backdrop"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(60% 55% at 100% 30%, var(--backdrop-1), transparent 70%), radial-gradient(45% 45% at 0% 100%, var(--backdrop-2), transparent 70%)',
      }}
    />
  );
}
