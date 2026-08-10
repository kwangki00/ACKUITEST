import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
  ],
  // robots.txt 를 빌드 결과 루트로 그대로 복사합니다
  staticDirs: ["./public"],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: "tag" },
};

export default config;
