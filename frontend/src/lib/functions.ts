export function toUpOne(str: string) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    })
    .join(" ");
}