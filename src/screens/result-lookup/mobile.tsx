import * as React from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChartColumn,
  ClipboardList,
  Download,
  EllipsisVertical,
  History,
  Mail,
  Printer,
  Search,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardRow } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import type { MBottomTabItem } from "@/components/ui/m-bottom-tab-bar";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MobileListHeader } from "@/components/ui/mobile-list-header";
import { MobileMenuScreen } from "@/components/ui/mobile-menu";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { Button } from "@/components/ui/button";
import { QueryFilter, type Query } from "./query-bar";
import { DONE, PATIENTS, RESULTS, STATE_TONE, TOTAL_PATIENTS } from "./data";
import type { Patient } from "./data";

/**
 * 좁은 화면의 결과조회입니다. **부품은 하나도 새로 만들지 않았습니다** — 이미 있는
 * 모바일 부품을 그대로 조립합니다.
 *
 * ### 왜 CSS 가 아니라 다른 컴포넌트인가
 *
 * 「아직 갈리는 것 — 구조가 다른 것들」 그대로입니다. 사이드바 ↔ 탭바, 표 ↔ 카드,
 * 좌우 분할 ↔ 전체 화면, 페이지네이션 ↔ 더 보기는 **마크업 자체가 다릅니다.**
 * 둘 다 그려놓고 하나를 숨기면 안 보이는 쪽의 상태·포커스·스크롤이 살아 있어서,
 * 창을 줄였다 늘리면 엉뚱한 자리로 돌아옵니다.
 *
 * | PC | 여기 |
 * |---|---|
 * | `Sidebar` + MDI 탭 | `MBottomTabBar` + `MobileMenuScreen`(전체 화면) |
 * | `DataTable` | `MobileListCard` — 행 하나가 카드 하나 |
 * | 판 제목줄 + 범례 | `MobileListHeader` |
 * | 좌우 분할 | **전체 화면 전환** — 「다른 화면으로 떠남」 |
 * | 상세의 검사목록 표 | `Accordion` — 좁은 폭에 표를 넣으면 가로로 밀립니다 |
 * | 툴바 아이콘 넷 | `⋯` `DropdownMenu` 하나 |
 *
 * ### 조회 조건은 한 벌입니다
 *
 * `QueryBar` 를 **그대로** 씁니다. 안의 `DateRangePicker` · `Select` 는
 * `PointerModeProvider` 가 시트로 열어 주므로 여기서 판단할 것이 없습니다.
 */

/**
 * 탭바 넷 — **다섯째 자리는 컴포넌트가 전체메뉴로** 채웁니다.
 *
 * 튜플로 못박습니다 — `items` 가 4개까지만 받는 타입이라 다섯 번째를 넣으면
 * 컴파일이 안 됩니다. 390 폭에서 5칸이면 한 칸이 78 이고, 여섯이 되면 10px 라벨이
 * 잘립니다.
 *
 * **아이콘을 전부 다르게** 둡니다. 라벨이 있어도 아이콘이 같으면 훑을 때 구분이
 * 안 됩니다 — 통계조회와 검사이력이 특히 그렇습니다.
 */
const TABS: [MBottomTabItem, MBottomTabItem, MBottomTabItem, MBottomTabItem] = [
  { value: "검사결과", label: "결과조회", icon: <ClipboardList /> },
  { value: "검사이력", label: "검사이력", icon: <History /> },
  { value: "기간별 통계", label: "통계조회", icon: <ChartColumn /> },
  { value: "SMS 발송", label: "SMS", icon: <Mail /> },
];

export interface MobileResultLookupProps {
  query: Query;
  onQueryChange: (q: Query) => void;
  onSearch: () => void;
  onReset: () => void;
  /** 접힘 상태는 **위에서** 옵니다 — 여기 두면 창 폭이 바뀔 때 도로 펼쳐집니다. */
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  /** 고른 환자. 없으면 목록을 보여줍니다 — 상세는 전체 화면입니다. */
  chart: string | null;
  onSelect: (chart: string | null) => void;
  /** 상세에서 환자를 옮겨 다닙니다. 끝이면 넘기지 마세요 — 버튼이 비활성됩니다. */
  onPrev?: () => void;
  onNext?: () => void;
  /** 사이드바와 **같은 메뉴 구조**입니다 — PC 로 익힌 위치를 다시 배우지 않아도 됩니다. */
  menu: { name: string; icon: React.ReactNode; items: string[] }[];
  page: string;
  onOpenScreen: (name: string) => void;
}

export function MobileResultLookup({
  query,
  onQueryChange,
  onSearch,
  onReset,
  filterOpen,
  onFilterOpenChange,
  chart,
  onSelect,
  onPrev,
  onNext,
  menu,
  page,
  onOpenScreen,
}: MobileResultLookupProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const patient = PATIENTS.find((p) => p.chart === chart);

  /* 탭바 값은 지금 화면입니다. 메뉴에 있는 화면이 아니면 아무 탭도 켜지 않습니다 */
  const tabValue = TABS.some((t) => t.value === page) ? page : "";

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-surface-gray-subtle">
      {patient ? (
        <PatientDetailScreen
          patient={patient}
          onBack={() => onSelect(null)}
          onPrev={onPrev}
          onNext={onNext}
        />
      ) : (
        <>
          {/*
            상단 바는 스크롤 영역 밖입니다 — 안에 넣으면 목록과 함께 밀려 올라갑니다
            (탭바 · 표 헤더와 같은 이유)
          */}
          <MobileTop
            variant="title"
            title={page}
            actions={
              <>
                <MobileTopAction label="검색" onClick={() => onFilterOpenChange(true)}>
                  <Search />
                </MobileTopAction>
                <MobileTopAction label="알림" dot>
                  <Bell />
                </MobileTopAction>
              </>
            }
          />

          {/*
            **PC 와 같은 컴포넌트**입니다 (2026-08-12 통합). 접힌 채로 늘 보이고,
            조회하면 다시 접힙니다 — 배치는 `FilterBar` 가 자기 폭을 재서 정하므로
            여기서 판단하는 것이 없습니다.
          */}
          <QueryFilter
            value={query}
            onChange={onQueryChange}
            onSearch={onSearch}
            onReset={onReset}
            open={filterOpen}
            onOpenChange={onFilterOpenChange}
            count={TOTAL_PATIENTS}
          />

          {/*
            **라인형** 입니다 (Figma 「List Style 비교」의 오른쪽).
            회색 바탕 위에 흰 패널을 한 겹 두고, 그 안에서 카드를 간격 0 으로 쌓아
            구분선이 이어지게 합니다 — 사이를 띄우면 낱개로 흩어져 보이고 표를 옮긴
            것이라는 감각이 사라집니다.

            바깥 여백 16 · 패널 여백 16 은 Figma 그대로이고, 반경만 10 → 8(Radius/lg)
            입니다. 10 은 토큰에 없는 값이라 PC 판을 8 로 맞춘 것과 같은 판단입니다.
          */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2.5 rounded-lg bg-background-white p-4">
              {/* 표 헤더가 없어서 이 줄이 무엇의 목록인지·몇 건인지를 대신합니다 */}
              <MobileListHeader
                title="환자 목록"
                count={TOTAL_PATIENTS}
                onFilter={() => onFilterOpenChange(!filterOpen)}
              />

              {PATIENTS.length === 0 ? (
                <EmptyState type="no-result" size="sm" onAction={onReset} />
              ) : (
                <>
                  {/* 반경 안쪽으로 잘라내야 첫·마지막 카드의 모서리가 판을 넘지 않습니다 */}
                  <div className="overflow-hidden rounded-lg">
                    {PATIENTS.map((p) => (
                      <MobileListCard
                        key={p.chart}
                        title={p.name}
                        /* 접수일·접수번호는 훑는 값이 아니라 확인하는 값이라 메타 줄로 */
                        meta={`${p.date} · 접수 ${p.receipt}`}
                        count={`${p.tests}건`}
                        /* 완료여부는 4종이라 점이 아니라 배지입니다 — 카드는 행이 적습니다 */
                        badge={<Badge tone={doneTone(p)}>{DONE[p.done].label}</Badge>}
                        /*
                          값 자리는 **찾는 기준과 눈에 걸려야 하는 것** 둘입니다 —
                          차트번호로 환자를 찾고, 이상결과가 있으면 먼저 열어 봅니다.
                          `values` 는 타입이 둘까지만 받습니다.
                        */
                        values={[
                          { label: "차트번호", value: p.chart },
                          {
                            label: "이상결과",
                            value: p.flags.length ? (
                              // L·H 는 낮음·높음입니다. 색만으로 구분하지 않고 글자를 함께 씁니다
                              <span className="flex items-center gap-1">
                                {p.flags.map((f) => (
                                  <Badge key={f} tone={f === "H" ? "danger" : "info"} size="sm">
                                    {f}
                                  </Badge>
                                ))}
                              </span>
                            ) : (
                              // 값이 없으면 하이픈 — 빈칸이면 조회가 덜 된 건지 없는 건지 모릅니다
                              "-"
                            ),
                          },
                        ]}
                        onClick={() => onSelect(p.chart)}
                      />
                    ))}
                  </div>
                  {/*
                    페이지네이션이 아니라 **더 보기**입니다 — 손가락으로 쪽 번호를 짚는
                    것보다 이어 붙이는 편이 낫습니다
                  */}
                  <Button variant="outline" className="w-full">
                    더 보기
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* 탭바는 상세에서도 남습니다 — 화면이 바뀌어도 있는 것이라 껍데기가 들고 있습니다 */}
      <MBottomTabBar
        items={TABS}
        value={tabValue}
        onValueChange={onOpenScreen}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        homeIndicator
      />

      {/*
        전체메뉴는 **시트가 아니라 전체 화면**입니다 — 메뉴는 다른 화면으로 떠나는
        동작이라 뒤를 남겨둘 이유가 없습니다. 뒤를 보면서 고르는 날짜·필터만 시트입니다
      */}
      <MobileMenuScreen
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="전체메뉴"
        user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
      >
        {menu.map((g) =>
          g.items.length === 0 ? (
            <SidebarItem
              key={g.name}
              icon={g.icon}
              label={g.name}
              active={page === g.name}
              chevron={false}
              onClick={() => {
                onOpenScreen(g.name);
                setMenuOpen(false);
              }}
            />
          ) : (
            <React.Fragment key={g.name}>
              <SidebarItem icon={g.icon} label={g.name} chevron={false} />
              {g.items.map((it) => (
                <SidebarItem
                  key={it}
                  level={2}
                  label={it}
                  active={page === it}
                  onClick={() => {
                    onOpenScreen(it);
                    setMenuOpen(false);
                  }}
                />
              ))}
            </React.Fragment>
          )
        )}
      </MobileMenuScreen>
    </div>
  );
}

/** 완료여부 넷을 배지 톤으로 옮깁니다 — 점의 색과 같은 뜻을 갖게 합니다. */
function doneTone(p: Patient) {
  return (
    { all: "success", part: "warning", few: "info", none: "danger" } as const
  )[p.done];
}

/**
 * 상세 — **전체 화면**입니다 (「다른 화면으로 떠남 → 전체 화면」).
 *
 * 항목별 결과는 표가 아니라 `Accordion` 입니다. 좁은 폭에 8열 표를 넣으면 가로로
 * 밀려서 무엇을 보는지 알 수 없습니다.
 */
function PatientDetailScreen({
  patient,
  onBack,
  onPrev,
  onNext,
}: {
  patient: Patient;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  /*
    **세부정보는 접혀 있습니다.** 늘 보는 것은 접수일·접수번호·차트번호 셋이고,
    나머지(개인정보 · 검사정보)는 가끔 확인합니다 — 좁은 화면에서 전부 펼쳐두면
    정작 보러 온 검사목록이 한참 아래로 밀립니다.
  */
  const [detailOpen, setDetailOpen] = React.useState(false);

  return (
    <>
      {/* back 변형만 타이틀이 절대 배치로 가운데입니다 — 오른쪽 아이콘이 늘어도 안 밀립니다 */}
      <MobileTop
        variant="back"
        title={patient.name}
        onBack={onBack}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* 액션이 2개를 넘으면 ⋯ 로 묶습니다 — 58 안에 44 짜리가 셋이면 타이틀이 사라집니다 */}
              <MobileTopAction label="더 보기">
                <EllipsisVertical />
              </MobileTopAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem leadingIcon={<Printer />}>인쇄</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Share2 />}>공유</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/*
        여백은 Figma `Mobile-Detail` 그대로입니다 — 바깥 16 · 블록 사이 12 ·
        흰 카드 안 20. 반경만 10 → 8(`Radius/lg`)로, 토큰에 없는 값을 안 쓰는
        이 저장소 규칙을 따릅니다.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4">
          {/* ── 기본정보 ─────────────────────────────────────── */}
          <div className="flex flex-col gap-3 rounded-lg bg-background-white p-5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="text-base font-semibold text-text-basic">{patient.name}</h2>
              <span className="text-sm text-text-subtle">
                {patient.sex} · {patient.age}세
              </span>
              {/* 톤은 자료에서 옵니다 — 완료여부 넷이 각자 색을 갖습니다 */}
              <Badge tone={doneTone(patient)} styleVariant="outline" className="ml-auto">
                {DONE[patient.done].label}
              </Badge>
            </div>

            {/* 늘 보는 셋 */}
            <CardBody>
              <CardRow label="접수일">{patient.date}</CardRow>
              <CardRow label="접수번호">{patient.receipt}</CardRow>
              <CardRow label="차트번호">{patient.chart}</CardRow>
            </CardBody>

            {/* 펼치면 PC 와 **같은 세 카드**가 나옵니다 — 같은 값을 다시 정의하지 않습니다 */}
            {detailOpen && (
              <div className="flex flex-col gap-3">
                <Card variant="filled" size="sm">
                  <CardHeader title="접수정보" />
                  <CardBody>
                    <CardRow label="접수일">{patient.date}</CardRow>
                    <CardRow label="접수번호">{patient.receipt}</CardRow>
                    <CardRow label="성명">{patient.name}</CardRow>
                    <CardRow label="차트번호">{patient.chart}</CardRow>
                  </CardBody>
                </Card>
                <Card variant="filled" size="sm">
                  <CardHeader title="개인정보" />
                  <CardBody>
                    <CardRow label="주민등록번호">950203-2******</CardRow>
                    <CardRow label="성별">{patient.sex}</CardRow>
                    <CardRow label="나이">{patient.age}</CardRow>
                  </CardBody>
                </Card>
                <Card variant="filled" size="sm">
                  <CardHeader title="검사정보" />
                  <CardBody>
                    <CardRow label="검사명">Vaginal</CardRow>
                    <CardRow label="출고장">-</CardRow>
                    <CardRow label="기타">J97810208892</CardRow>
                    <CardRow label="검사일">{patient.date}</CardRow>
                  </CardBody>
                </Card>
              </div>
            )}

            {/*
              **알약 버튼**입니다 (Figma 40 · r30 · `#f3f4f6`). 화살표는 지금 상태를
              말합니다 — 펼쳐져 있으면 위 (`Accordion` · `Sidebar` 와 같은 규칙).
              `Button` 을 쓰지 않은 이유는 폭을 꽉 채우는 알약이 variant 에 없어서입니다.
            */}
            <button
              type="button"
              aria-expanded={detailOpen}
              onClick={() => setDetailOpen((v) => !v)}
              className={cn(
                "flex h-[var(--h-input-default)] cursor-pointer items-center justify-center gap-2.5 rounded-full",
                "bg-surface-gray-subtler text-sm font-medium text-text-basic",
                "outline-hidden transition-colors hover:bg-action-accent",
                "focus-visible:ring-2 focus-visible:ring-action-focus-ring"
              )}
            >
              <ChevronDown
                aria-hidden
                className={cn("size-5 transition-transform", detailOpen && "rotate-180")}
              />
              세부정보 {detailOpen ? "접기" : "더보기"}
            </button>
          </div>

          {/* ── 검사목록 ─────────────────────────────────────── */}
          <div className="flex flex-col gap-3 rounded-lg bg-background-white p-5">
            <h3 className="text-base font-semibold text-text-basic">검사목록</h3>

            {/*
              결과는 지금 모양을 그대로 둡니다 — 좁은 폭에 표를 넣으면 가로로 밀리는데
              항목마다 접었다 펴는 쪽이 읽힙니다.
              트리거·내용의 좌우 여백만 뺍니다 — 카드가 이미 20 을 갖고 있어 겹칩니다.
            */}
            <Accordion type="multiple" size="sm" defaultValue={["r0"]}>
              {RESULTS.map((r, i) => (
                <AccordionItem key={r.barcode} value={`r${i}`}>
                  <AccordionTrigger className="px-0">
                    <span className="flex w-full items-center gap-2">
                      <span className="min-w-0 flex-1 truncate">{r.name}</span>
                      <Badge tone={STATE_TONE[r.state]} size="sm">
                        {r.state}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <CardBody>
                      <CardRow label="결과">{`${r.value} ${r.unit}`}</CardRow>
                      <CardRow label="바코드">{r.barcode}</CardRow>
                      <CardRow label="보고예정일">{r.due}</CardRow>
                    </CardBody>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/*
        **스크롤 영역 밖**입니다 (Figma `Mobile-Detail` 의 `Frame 25`) — 결과를 훑는
        내내 손 닿는 곳에 있어야 합니다. 목록으로 돌아갔다 다음 환자를 다시 고르는
        것보다 훨씬 짧습니다. PC 의 「이전환자 · 다음환자」와 같은 흐름입니다.

        높이 40 · 반경 8 · 좌우 16 · 아래 20 · 사이 10. **글자를 남깁니다** —
        PC 는 툴바가 빽빽해서 아이콘만 남겼지만 여기는 자리가 넉넉하고,
        화살표만 있으면 페이지 넘김으로 읽힙니다.

        **위에도 여백을 둡니다** — 목록이 길면 스크롤 중간에 잘린 카드가 버튼 바로
        위에 맞닿아 한 덩어리로 보입니다. 바탕이 회색이라 이 여백이 띠가 되어
        「여기서부터는 스크롤되지 않는 자리」라고 알립니다. Figma 는 맨 아래까지
        내려간 그림이라 이 자리가 안 보입니다.
      */}
      <div className="flex shrink-0 gap-2.5 bg-surface-gray-subtle px-4 pt-3 pb-5">
        {/* 높이는 주지 않습니다 — Button 의 default 가 --h-input-default 라 모바일에서 40 입니다 */}
        <Button variant="outline" className="flex-1" disabled={!onPrev} onClick={onPrev}>
          <ChevronLeft />
          이전환자
        </Button>
        <Button variant="outline" className="flex-1" disabled={!onNext} onClick={onNext}>
          다음환자
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
