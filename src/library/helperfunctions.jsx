export const getInitials = (name) => {
  let names = name.split(" ");
  let firstLetter = names[0].charAt(0);
  let lastLetter = names[names.length - 1].charAt(0);
  return (firstLetter + lastLetter).toUpperCase();
} 