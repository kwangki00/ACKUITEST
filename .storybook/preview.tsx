import type { Preview } from "@storybook/react";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { ToastProvider } from "../src/components/ui/toast";
import { PointerModeProvider } from "../src/components/ui/pointer-mode";
import "../src/index.css";

const preview: Preview = {
  // Radix Tooltip 은 Provider 없이 쓰면 던집니다. 앱 루트와 같은 자리입니다.
  // JSX 를 쓰려고 이 파일만 .tsx 입니다 — .ts 로 되돌리지 마세요.
  //
  // PointerMode 는 문서에서 **mouse 로 고정**합니다. auto 로 두면 보는 기기에 따라
  // 같은 스토리가 다르게 나와서 문서가 설명이 안 됩니다. 손가락 화면을 보여주는
  // 스토리는 390 틀 안에서 mode="touch" 로 다시 감쌉니다.
  decorators: [
    (Story) => (
      <PointerModeProvider mode="mouse">
        <TooltipProvider>
          <ToastProvider>
            <Story />
          </ToastProvider>
        </TooltipProvider>
      </PointerModeProvider>
    ),
  ],

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
          // 무엇이 있는지 한 장에 모은 카탈로그 — 맨 앞입니다
          "Overview",
          // Figma Guideline 페이지와 같은 읽기 순서 (Color → Typography → Layout → Icon)
          "Foundation",
          ["Tokens", "Typography", "Layout & Grid", "Icon"],
          "Controls",
          [
            "Button",
            "Checkbox",
            "CheckMark",
            "ChoiceGroup",
            "Combobox",
            "DateField",
            "Input",
            "InputGroup",
            "NativeSelect",
            "Radio",
            "Select",
            "Switch",
            "Textarea",
            "ToggleGroup",
          ],
          "Form",
          "Display",
          "Data",
          "Feedback",
          ["Alert", "Dialog", "EmptyState", "Loading & Divider", "Toast"],
          // 조립 부품만 남깁니다 — 완성형 컨트롤(Combobox · Select)은 Controls 로 갑니다
          "Overlay",
          ["ListItem", "Lookup", "Popover", "Tooltip"],
          // Figma 의 Navigation 페이지와 같은 이름입니다
          "Navigation",
          ["Sidebar", "SidebarItem", "Tabs"],
          // 화면 골격 — 부품이 아니라 자리를 정하는 것들. PC·모바일 한 벌입니다
          "Layouts",
          ["FilterBar"],
          // 모바일 전용은 마지막에 모읍니다 — 그룹은 "무엇인가" 로 나누지만
          // 모바일은 "어디서 쓰나" 라는 다른 축이라 섞이면 찾기 어렵습니다
          "Mobile",
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

    /**
     * **Show code 는 렌더 결과가 아니라 스토리 소스를 보여줍니다.**
     *
     * 기본값(`dynamic`)은 그려진 JSX 를 되돌려 적는 방식인데, 이 저장소는 스토리
     * 48개 중 47개가 `render` 함수입니다 — 상태를 쥐고 여러 컴포넌트를 조립하는
     * 스토리라 되돌려 적을 수가 없어 코드 패널이 거의 비어 나옵니다.
     *
     * `code` 는 파일에 쓴 그대로를 보여줍니다. 조립 방법을 읽으러 오는 문서라
     * 이쪽이 맞습니다 — 어차피 복사해 가는 것은 그 코드입니다.
     *
     * **다만 `render` 없이 args 만 있는 스토리는 원문이 `{}` 라 빈칸이 나옵니다.**
     * 그 14개는 `argsSource`(`src/stories/figma.ts`)로 `dynamic` 을 되돌려 답니다 —
     * 그려진 결과가 곧 예제 코드인 경우입니다. `기본` 스토리들이 대부분 여기 해당합니다.
     */
    docs: { source: { type: "code" } },
  },
  tags: ["autodocs"],
};

export default preview;
