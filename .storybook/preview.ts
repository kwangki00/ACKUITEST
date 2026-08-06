import type { Preview } from "@storybook/react";
import "../src/index.css";

/**
 * Figma Responsive 컬렉션과 같은 경계입니다.
 * 1024px 아래에서 컨트롤 높이가 모바일 값으로 바뀝니다.
 */
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    backgrounds: {
      default: "화면",
      values: [
        { name: "화면", value: "#f9fafb" },
        { name: "표면", value: "#ffffff" },
        { name: "반전", value: "#101828" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile 390", styles: { width: "390px", height: "844px" } },
        tablet: { name: "Tablet 1024", styles: { width: "1024px", height: "768px" } },
        desktop: { name: "Desktop 1440", styles: { width: "1440px", height: "900px" } },
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
