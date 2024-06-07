export const modes = ["stroke", "shapes"];

export enum themePallet {
  LIGHT = "#5A99E6",
  DARK = "#274989",
  BLACK = "#1B2B36",
  GREEN = "#44BCA1",
}

export function hexToOpacityAndHex(hex: string, opacity: number) {
  const opacityValue = Math.round(opacity * 255);
  const opacityHex = opacityValue.toString(16).padStart(2, "0");

  return hex + opacityHex;
}
