import { Dimensions,Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#24C16B", // green
    secondary: "#0C381F",   // dark green

    green: "#66D59A",
    lightGreen: "#E6FEF0",

    lime: "#512DA8",
    emerald: "#673AB7",

    red: "#FF4134",
    lightRed: "#FFF1F0",

    blue: "#6245ff",

    purple: "#6B3CE9",
   
    lightpurple: "#F3EFFF",

    yellow: "#FFC664",
    lightyellow: "#FFF9EC",

    black: "#1E1F20",
    white: "#FFFFFF",

    lightGray: "#D3D3D3",
    gray: "#C1C3C5",
    darkgray: "#C3C6C7",

    transparent: "transparent",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding:  10,
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: 25,
    h2: 22,
    h3: 20,
    h4: 16,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,
    body6: 11,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Roboto-regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
    body5: { fontFamily: "Roboto-Regular", fontSize: SIZES.body5, lineHeight: 22 },
};

export const fontFamily = {
    roboto_regular: { fontFamily: "Roboto-regular"},
    roboto_black:  { fontFamily: "Roboto-Black"},
    roboto_bold: { fontFamily: "Roboto-Bold"},
};

const appTheme = { COLORS, SIZES, FONTS,fontFamily };

export default appTheme;