import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    layout: "centered",

    /**
     * 사이드바 순서.
     *
     * storySort 는 **반드시 인라인**이어야 합니다. Storybook 이 이 파일을 정적으로
     * 분석해서 읽기 때문에, 상수로 빼서 참조하면 실행 시점에
     * "Unexpected 'storySort'" 로 Storybook 전체가 뜨지 않습니다.
     * 빌드는 통과하므로 터미널에서는 안 걸립니다 — 브라우저로 확인해야 합니다.
     *
     * 그룹은 알파벳순으로 두지 않습니다 — 그러면 Foundation 이 맨 끝으로 갑니다.
     * 읽어야 할 자료가 먼저 오고 컴포넌트가 뒤따라야 합니다.
     * 컴포넌트는 그룹 안에서 알파벳순입니다 (대소문자 무시).
     *
     * method: "alphabetical" 은 쓰지 마세요 — 컴포넌트 안의 스토리 이름까지
     * 가나다순으로 섞어서 기본 → 상태 → 전체 로 짜둔 읽기 순서가 무너집니다.
     * order 배열만 쓰면 스토리 순서는 파일에 쓴 그대로 유지됩니다.
     */
    options: {
      storySort: {
        order: [
          // Figma Guideline 페이지와 같은 읽기 순서 (Color → Typography → Layout → Icon)
          "Foundation",
          ["Tokens", "Typography", "Layout & Grid", "Icon"],
          "Controls",
          [
            "Button",
            "Checkbox",
            "CheckMark",
            "ChoiceGroup",
            "Input",
            "Radio",
            "Select",
            "Switch",
            "ToggleGroup",
          ],
          "Form",
          "Display",
          "Data",
        ],
      },
    },

    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    backgrounds: {
      default: "화면",
      values: [
        { name: "화면", value: "#f9fafb" },
        { name: "표면", value: "#ffffff" },
        { name: "반전", value: "#101828" },
      ],
    },
    // Figma Responsive 컬렉션과 같은 경계입니다.
    // 1024px 아래에서 컨트롤 높이가 모바일 값으로 바뀝니다.
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
