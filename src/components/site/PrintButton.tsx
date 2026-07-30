"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-primary print:hidden" onClick={() => window.print()}>
      Print / Save PDF
    </button>
  );
}
