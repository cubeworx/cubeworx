/*
* Generate a random signed 32-bit integer.
*/
export default function randomSigned32() {
  return Math.floor((Math.random() - 0.5) * (2 ** 32));
}
