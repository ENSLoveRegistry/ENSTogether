export const formatAddress = (address) => {
  const chars = address.split("");

  return `${chars.slice(0, 6).join("")}…${chars.slice(-4).join("")}`;
};
