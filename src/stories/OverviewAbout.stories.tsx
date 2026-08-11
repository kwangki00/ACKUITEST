import type { Meta, StoryObj } from "@storybook/react";

/**
 * 컴포넌트를 만지기 전에 알아야 할 것들입니다.
 *
 * 개별 컴포넌트 문서에는 **그 컴포넌트의 근거**가 있습니다. 여기 모은 것은
 * **여러 컴포넌트를 가로지르는 규칙** — 하나만 알고 있으면 다른 데서 어긋나는 것들입니다.
 */
const meta = {
  title: "Overview/개요",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ 조각 */

function Section({
  n,
  title,
  lead,
  children,
}: {
  n: string;
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="flex items-baseline gap-2 text-base font-semibold text-text-basic">
          <span className="text-sm font-normal text-text-muted-foreground">{n}</span>
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-text-subtle">{lead}</p>
      </div>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-table-border">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="bg-table-header-surface">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-sm font-semibold text-table-header-text first:w-56"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-t border-table-border bg-background-white align-top hover:bg-table-row-hover"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "px-4 py-3 text-sm font-medium text-text-basic"
                      : "px-4 py-3 text-sm text-text-subtle"
                  }
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 되풀이해서 겪은 함정 — 화면은 멀쩡한데 틀린 것들입니다. */
function Trap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border-warning bg-badge-warning-soft-fill/40 p-3">
      <p className="text-sm font-medium text-text-basic">{title}</p>
      <p className="mt-1 text-sm text-text-subtle">{children}</p>
    </div>
  );
}

const C = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-xs bg-surface-gray-subtle px-1 py-0.5 text-2xs">{children}</code>
);
const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-text-basic">{children}</strong>
);

/* ------------------------------------------------------------------ 본문 */

function About() {
  return (
    <div className="flex flex-col gap-9">
      <header>
        <h1 className="text-2xl font-bold text-text-basic">개요</h1>
        <p className="mt-1.5 max-w-3xl text-sm text-text-subtle">
          ACK 결과조회 시스템의 디자인 시스템입니다. 개별 컴포넌트 문서에는 그 컴포넌트의 근거가
          있고, 여기 모은 것은 <B>여러 컴포넌트를 가로지르는 규칙</B>입니다 — 하나만 알고 있으면
          다른 데서 어긋나는 것들입니다. 각 절의 마지막 줄은 <B>실제로 겪은 함정</B>입니다.
        </p>
      </header>

      <Section
        n="01"
        title="토큰은 3계층 — 컴포넌트는 Semantic 만"
        lead={
          <>
            Primitive 나 Tailwind 색을 컴포넌트에서 직접 쓰면, 색을 바꿀 때 Semantic 한 곳만
            고치면 되는 구조가 깨집니다.
          </>
        }
      >
        <Table
          head={["계층", "무엇", "누가 씁니까"]}
          rows={[
            ["TailwindCSS/Colors", "gray · slate · red … 중립 회색은 여기서", "Semantic 이"],
            ["Primitive", "브랜드 8램프 × 10단계", "Semantic 이"],
            [
              <>
                Semantic <span className="text-text-muted-foreground">317</span>
              </>,
              <>
                <C>button-primary-fill</C> · <C>table-border</C> …
              </>,
              <B>컴포넌트가</B>,
            ],
            [
              "Responsive",
              <>
                <C>--h-input-default</C> 등 — PC · 모바일 2모드
              </>,
              <B>컴포넌트가</B>,
            ],
          ]}
        />
        <Trap title="회색은 Semantic 을 쓰세요">
          중립 회색은 Tailwind 기본 팔레트라 <C>@theme static</C> 밖입니다. <C>bg-gray-300</C> 은
          되지만 <C>var(--color-gray-300)</C> 은 <B>값이 비어 있습니다</B> — 클래스가 아닌 방식으로
          참조하면 조용히 색이 사라집니다.
        </Trap>
      </Section>

      <Section
        n="02"
        title="반응형은 한 기준이 아닙니다"
        lead={
          <>
            무엇을 재느냐가 <B>세 갈래</B>입니다. 전부 창 폭으로 풀면 셋 다 틀립니다.
          </>
        }
      >
        <Table
          head={["무엇이 바뀌나", "기준", "왜"]}
          rows={[
            [
              "팝오버 ↔ 시트",
              <>
                <B>포인터</B> — <C>PointerModeProvider</C>
              </>,
              "시트가 아래에서 올라오는 건 엄지가 닿는 곳이라서입니다. 좁은 데스크톱 창은 팝오버, 넓은 태블릿은 시트",
            ],
            [
              "조건 가로 ↔ 세로",
              <>
                <B>자기 폭</B> — 컨테이너 쿼리 <C>--container-pc</C> 880
              </>,
              "사이드바가 열려 작업 영역이 좁아졌으면 창이 넓어도 접힌 배치가 옳습니다",
            ],
            [
              "컨트롤 · 행 높이",
              <>
                <B>창 폭</B> — <C>--h-*</C> 1024px
              </>,
              "손가락으로 누르는 크기라 화면 자체의 성격입니다",
            ],
            [
              "칩이 옆 ↔ 다음 줄",
              <>
                <B>남는 자리</B> — <C>flex-wrap</C>
              </>,
              "폭을 부모에서 받지 않아도 되는 유일한 방법입니다",
            ],
          ]}
        />
        <Trap title="컨테이너 쿼리 두 가지">
          컨테이너 쿼리는 <B>컨테이너 자신에게 걸리지 않습니다</B> — 같은 요소에{" "}
          <C>@container/x</C> 와 <C>@pc/x:px-6</C> 을 함께 주면 그 여백은 조용히 죽습니다. 그리고{" "}
          <C>container-type: inline-size</C> 는 <B>폭을 부모에서 받아야</B> 성립합니다 — 내용만큼
          넓어지는 flex 항목에 걸면 0 으로 무너집니다.
        </Trap>
      </Section>

      <Section
        n="03"
        title="라벨은 전부 FormField 가 답니다"
        lead={
          <>
            <C>{`<FormField label="…"><Input /></FormField>`}</C> 가 전부입니다.{" "}
            <C>htmlFor</C> 도 <C>id</C> 도 넘기지 마세요.
          </>
        }
      >
        <Table
          head={["컨트롤", "무엇으로 묶이나"]}
          rows={[
            [
              <>
                <C>Input</C> · <C>Textarea</C> · <C>NativeSelect</C>
              </>,
              <>
                필드가 만든 <C>controlId</C> 를 자기 <C>id</C> 로 — <C>{`<label for>`}</C> 의 짝
              </>,
            ],
            [
              <>
                <C>Select</C> · <C>Combobox</C> · <C>Lookup</C> · <C>MobileSelect</C>
              </>,
              <>
                <C>{`<div role="combobox">`}</C> 라 <C>for</C> 가 안 통합니다 —{" "}
                <B>aria-labelledby</B>
              </>,
            ],
            [
              <>
                <C>Checkbox</C> · <C>Radio</C> · <C>Switch</C>
              </>,
              "자기 라벨을 스스로 답니다 (박스 옆 글자) — 이 컨텍스트를 읽지 않습니다",
            ],
          ]}
        />
        <Trap title="연결을 호출부에 시키면 반드시 빠집니다">
          자동으로 바꾸기 전, <C>FormField</C> 60곳 중 <B>26곳만</B> 넘기고 있었고 그중 넷은{" "}
          <C>div</C> 를 겨눠 헛돌았습니다. 스크린리더로 가면 무엇을 입력하는 칸인지 안 읽히는데,{" "}
          <B>화면은 멀쩡해서 알아챌 방법이 없습니다.</B>
        </Trap>
      </Section>

      <Section
        n="04"
        title="폭은 누가 정하나 — 날짜만 반대입니다"
        lead={<>자릿수가 정해져 있느냐로 갈립니다.</>}
      >
        <Table
          head={["컨트롤", "기본", "바꾸려면"]}
          rows={[
            [
              <>
                <C>Input</C> · <C>Select</C> · <C>Combobox</C> · <C>Textarea</C>
              </>,
              <>
                <B>w-full</B> — 부모를 채웁니다
              </>,
              <>
                좁히려면 <C>FormField</C> 에 폭
              </>,
            ],
            [
              <>
                <C>DatePicker</C> · <C>DateRangePicker</C>
              </>,
              <>
                <B>값에 맞는 폭</B> (148 · 248 …)
              </>,
              <>
                채우려면 컨트롤에 <C>w-full</C>
              </>,
            ],
          ]}
        />
        <p className="text-sm text-text-subtle">
          <C>2026-08-11</C> 은 언제나 같은 길이라 컴포넌트가 계산할 수 있지만, 검사 항목 목록은
          얼마나 긴 이름이 올지 컴포넌트가 알 수 없습니다. 가로로 나열할 때는{" "}
          <C>FormField</C> 에 <C>w-fit</C> — 기본이 <C>w-full</C> 이라 그냥 두면 한 줄에 하나씩
          떨어집니다.
        </p>
      </Section>

      <Section
        n="05"
        title="PC · 모바일 — 한 벌인 것과 갈리는 것"
        lead={
          <>
            조회 조건은 <B>한 벌</B>입니다. 앱 루트에 <C>PointerModeProvider</C> 하나만 두면
            호출부에 모바일용 코드를 더할 게 없습니다.
          </>
        }
      >
        <Table
          head={["", "PC", "모바일"]}
          rows={[
            [
              <B>한 벌</B>,
              <>
                <C>DateRangePicker</C> · <C>Select</C> · <C>Combobox</C> · <C>FilterBar</C>
              </>,
              "같은 호출부 — 시트로 열지 팝오버로 열지만 갈립니다",
            ],
            [
              <B>갈립니다</B>,
              <>
                <C>Sidebar</C> + MDI 탭바 · <C>Table</C> · <C>Pagination</C>
              </>,
              <>
                <C>MobileTop</C> + <C>MBottomTabBar</C> · <C>MobileListCard</C> · 더 보기
              </>,
            ],
          ]}
        />
        <Trap title="Mobile* 를 직접 부를 자리는 없습니다">
          <C>MobileSelect</C> · <C>MobileDateRangePicker</C> 는 지운 것이 아니라{" "}
          <B>시트 쪽 구현</B>입니다. 호출부는 <C>{`<Select/>`}</C> 만 쓰고 시트인지 팝오버인지
          모릅니다.
        </Trap>
      </Section>

      <Section
        n="06"
        title="같은 사실이 네 곳에 있습니다"
        lead={<>하나만 고치면 나머지 셋이 조용히 어긋납니다.</>}
      >
        <Table
          head={["어디", "무엇이 적혀 있나"]}
          rows={[
            ["Figma 컴포넌트 description", "변형 축의 의미, 쓰지 말아야 할 경우"],
            ["Figma Documentation 프레임", "프로퍼티 표 · 판단 기준표 · 코드 대응 표"],
            ["Figma About 섹션", "페이지 성격, 언제 뭘 쓰나"],
            ["코드 — 컴포넌트 주석 · 스토리", "위 셋의 근거 + 코드에만 있는 사정"],
          ]}
        />
        <Trap title="컴포넌트가 문서보다 사실에 가깝습니다">
          어긋나면 <B>변형을 먼저 믿고</B>, 그다음 어느 쪽이 의도인지 물어보세요. 문장에 토큰
          이름·수치를 함께 적으면(<C>Toggle/Surface-Selected</C>) 값이 바뀔 때 어디를 볼지
          드러납니다. 방침을 바꾸면 <B>날짜와 이전 방침</B>을 남기세요 — 근거 없이 되돌아가는 걸
          막습니다.
        </Trap>
      </Section>
    </div>
  );
}

/**
 * 컴포넌트를 만지기 전에 읽는 장입니다.
 *
 * 여섯 절이고, 각 절의 마지막은 **실제로 겪은 함정**입니다 — 전부 화면은 멀쩡한데 틀린
 * 것들이라 눈으로는 안 걸립니다.
 *
 * 컴포넌트별 근거는 `Overview/컴포넌트 목록` 에서 이름을 눌러 들어가세요.
 */
export const 개요: Story = {
  name: "개요",
  render: () => (
    <div className="min-h-screen bg-surface-gray-subtle p-6">
      <About />
    </div>
  ),
};
