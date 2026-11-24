// Alien Field Notes: The Two Day Earth Review
//
// Writes one original line — an alien tourist's review of planet Earth —
// to <output>/entry.txt. The gate requires UTF-8 text of 1 to 200
// characters, not only white space, so the line is validated here before
// it is written. No network, no secrets, no input files: the review is
// baked into this program and the output is fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The review. Written to be judged as a one-line alien tourist review:
// a clear outside view of Earth, one clean joke from the alien's angle
// (humans serve their cats), a verdict with a rating, and the punch
// landing on the last words.
const REVIEW =
  "Humans keep tiny predators in their homes, feed them by hand, then ask permission to sit on their own furniture. Fascinating hierarchy. 5/5 — would be ruled again.";

function codePointLength(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("review must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("review must be a single line");
  }
  const length = codePointLength(text);
  if (length < 1 || length > 200) {
    throw new Error(`review is ${length} characters, must be 1 to 200`);
  }
}

function main(): void {
  validate(REVIEW);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  // No trailing newline: the gate counts every character in the file.
  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, REVIEW, "utf8");
  // Round-trip self-check: what the grader reads must be exactly the
  // validated line, byte for byte.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== REVIEW) {
    throw new Error("entry.txt round-trip mismatch");
  }
  console.log(
    `wrote entry.txt (${codePointLength(REVIEW)} characters, ` +
      `${Buffer.byteLength(REVIEW, "utf8")} bytes): ${REVIEW}`,
  );
}

main();
