export interface Tagged {
  tag: string;
}

// Order-sensitive equality check for arrays of tagged objects (Verb,
// Pronoun, Option, ...), used to avoid producing a new state reference
// from a reducer when a selection action's payload is semantically
// identical to the current state.
export const sameTagged = (a: Tagged[] = [], b: Tagged[] = []): boolean =>
  a.length === b.length &&
  a.every((item, index) => item?.tag === b[index]?.tag);
