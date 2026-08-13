export const colors = {
  bg: "#0F0B1A",
  bgAlt: "#1A1330",
  card: "#211A3A",
  primary: "#B98CFF",
  primaryDark: "#7C5CFF",
  accent: "#FF8FB1",
  text: "#F5F2FF",
  textMuted: "#A79CC7",
  border: "#332957",
  success: "#7CE0B8",
  warning: "#FFC97C",
};

export const gradients = {
  hero: [colors.primaryDark, colors.accent] as const,
  card: [colors.card, colors.bgAlt] as const,
};

export const radii = { sm: 10, md: 16, lg: 24, pill: 999 };

export const spacing = (n: number) => n * 4;
