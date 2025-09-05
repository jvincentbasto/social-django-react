export const invertKeys = <T extends Record<string, string>>(obj: T) => {
  type Inverted = { [K in keyof T as T[K]]: K }

  const entries = Object.entries(obj).map(([k, v]) => [v, k])
  const inverted = Object.fromEntries(entries) as Inverted

  return inverted;
}

export const convertKeys = <
  P extends Record<string, any>,
  K extends Record<string, string>,
  I extends keyof K
>(
  payload: P,
  keys: K
): {
  [Key in keyof P as Key extends I
  ? K[Key] extends string
  ? K[Key]
  : Key
  : Key]: P[Key]
} | (Record<string, any>) => {
  if (payload.length <= 0) return {}

  let inverted = {} as any;

  for (let [key, value] of Object.entries(payload)) {
    const newKey = keys[key as I] ?? key;
    inverted[newKey] = value;
  }

  return inverted;
};
