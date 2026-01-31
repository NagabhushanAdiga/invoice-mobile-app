/**
 * Polyfill for Array.prototype.toReversed() - required for Node 18 compatibility.
 * toReversed() was added in ES2023 / Node 20.
 */
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return [...this].reverse();
  };
}
