import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const { isDark } = JSON.parse(localStorage.getItem("recoil-persist") as string);
console.log(isDark);

const baseStyle = definePartsStyle({
  container: {
    bg: isDark ? "#2F2F2F" : "#fff",
    color: isDark ? "#fff" : "#2F2F2F",
    borderRadius: "10px",
  },
});

export const accordionTheme = defineMultiStyleConfig({ baseStyle });
