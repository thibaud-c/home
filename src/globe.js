// Inverse orthographic projection onto a unit sphere; the back hemisphere is hidden.
export function surfaceAt(x, y, rotation = 0) {
  const squared = x * x + y * y;
  if (squared > 1) return null;
  const depth = Math.sqrt(1 - squared);
  const latitude = Math.asin(-y);
  const longitude = Math.atan2(x, depth) - rotation;
  return {
    depth,
    latitude,
    longitude,
    u: (((longitude / (2 * Math.PI) + 0.5) % 1) + 1) % 1,
    v: 0.5 - latitude / Math.PI,
  };
}
