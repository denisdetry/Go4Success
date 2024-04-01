import { Dimensions } from "react-native";

export const width = Dimensions.get("screen").width;
export const isMobile = width <= 360;
export const isTabletMini = width > 360 && width <= 600;
export const isTablet = width > 600 && width <= 992;
