// Liste des couleurs simples
const colors = [
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "pink",
  "gray",
  "brown",
];

// Génère une couleur simple en fonction d'une chaîne de caractères
export const getColor = (categoryName: string) => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash += categoryName.charCodeAt(i);
  }
  // Utiliser le modulo pour obtenir un index valide
  const index = hash % colors.length;
  return colors[index];
};

export function toUpOne(str: string) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    })
    .join(" ");
}