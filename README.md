# ACK UI — 컴포넌트 테스트 프로젝트

ACK DesignSystem(Figma) 컴포넌트가 코드에서 같은 모양으로 나오는지 확인합니다.

## 시작하기

```bash
npm install
npm run storybook   # 케이스별 확인 — 주로 여기서 봅니다
npm run dev         # 갤러리 한 장 — 전체 훑기
```

Storybook 은 `http://localhost:6006`, 갤러리는 `http://localhost:5173`.

## Storybook 에서 할 수 있는 것

| 기능 | 쓰임 |
|---|---|
| **Controls** | 프로퍼티를 UI 에서 바꿉니다 — Figma 인스턴스 패널과 같은 경험 |
| **Design 탭** | 각 스토리에 Figma 링크가 붙어 있어 나란히 대조됩니다 |
| **Viewport** | Mobile 390 · Tablet 1024 · Desktop 1440 전환 |
| **Docs** | 컴포넌트 주석이 문서가 됩니다 |
| **A11y** | 대비·라벨 문제를 자동으로 잡아냅니다 |

## 스토리 구성

```
Foundation/Tokens     Primitive 램프 · Semantic 색 · Responsive 높이
Controls/Button       Variant 7 · Size 8 · Shape 2 · loading
Controls/Input        Size 4 · State 4 · 아이콘·단위·클리어
Controls/Select       Render=Text
Controls/Checkbox     Size 2 · Checked 3 · indeterminate
Display/Badge         Tone 6 × Style 3 × Size 3
Form/FormField        라벨 · 설명 · 에러 · Control 축
Data/Table            기본 · 툴바 · 빈 결과 · 결과조회 화면
```

`Data/Table > 결과조회화면` 이 실제 화면 한 벌입니다. 조회 조건부터 표까지 위 컴포넌트만으로 조립했습니다.

## 토큰 구조

Figma 와 같은 2계층입니다.

```
Primitive   color-primary-500 · color-danger-500 …
Semantic    color-button-primary-fill · color-table-border …
```

**컴포넌트는 Semantic 만 참조합니다.** 색을 바꿔야 하면 `src/styles/ack-theme.css` 의 Semantic 한 곳만 고치면 전체가 따라옵니다.

Tailwind 4 의 `@theme` 에 넣었으므로 유틸리티가 자동 생성됩니다.

```tsx
<div className="bg-button-primary-fill text-text-basic-inverse" />
```

## 반응형 — PC / Mobile

Figma 의 Responsive 컬렉션(2모드)을 CSS 변수 + 미디어쿼리로 옮겼습니다.
**1024px 에서 갈립니다.**

| 변수 | Mobile | PC |
|---|---|---|
| `--h-input-default` | 40 | 36 |
| `--h-datagrid` | 36 | 34 |
| `--h-list-item` | 48 | 32 |
| `--h-calendar-cell` | 44 | 36 |

컴포넌트에서는 `h-[var(--h-input-default)]` 로 씁니다.
Storybook 의 Viewport 를 Mobile 로 바꾸면 컨트롤이 커지는 걸 볼 수 있습니다 —
`Foundation/Tokens > Responsive` 에서 가장 잘 보입니다.

## 아직 없는 것

Popover 를 쓰는 컴포넌트는 Radix 의존이 필요해 제외했습니다.

```
Combobox · Lookup · DatePicker · Dialog · Toast · Tooltip · DropdownMenu
Tabs · Sidebar · Accordion · Pagination
```

필요해지면 `npx shadcn@latest add popover dialog` 로 받아
`ack-theme.css` 의 토큰으로 색만 바꾸면 됩니다.

## 확인할 것

1. **폰트** — Pretendard 가 CDN 으로 들어갑니다. 사내망이면 로컬로 바꾸세요.
2. **높이** — Viewport 를 Mobile 로 바꿔 컨트롤이 커지는지
3. **색** — Figma 와 다르면 토큰 이름을 찾아 비교하세요. `Foundation/Tokens` 에 이름이 다 있습니다.
