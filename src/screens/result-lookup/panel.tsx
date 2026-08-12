import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * 화면을 나누는 **판**입니다. 좌우 두 덩어리가 같은 대접을 씁니다.
 *
 * ### `Card` 가 아닙니다
 *
 * `Card` 는 **제목과 내용을 묶는 표면**이고, 이건 **섹션 여러 개를 담는 자리**입니다.
 * `Card` 는 여백을 갖는 표면(`p-4`~`p-6`)이라 표를 넣으면 헤더 행 배경이 모서리까지
 * 안 닿고 툴바 여백이 두 겹이 됩니다. Figma 화면 파일도 이 두 판은 `Card` 인스턴스가
 * 아니라 그냥 프레임입니다.
 *
 * 안에 들어가는 **요약 카드 3장은 진짜 `Card`** 입니다 — 그건 내용 블록입니다.
 *
 * ### 좌우가 같은 대접이어야 합니다
 *
 * 같은 층위인데 다른 테두리를 쓰면 하나가 더 진해 보여 위계가 있는 것처럼 읽힙니다.
 */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-2.5 rounded-lg border border-table-border",
        "bg-background-white px-5 py-2.5",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 섹션 제목줄 — 높이 40. **밑줄을 긋지 않습니다.**
 *
 * `TableToolbar` 를 쓰지 않은 이유입니다. 그건 표에 **딱 붙는 줄**이라 아래 테두리가
 * 있고 좌우 여백을 스스로 갖습니다. 여기서는 표가 **자기 테두리를 따로** 가지므로
 * 제목줄이 그 밖에 있고, 밑줄을 그으면 선이 두 겹이 됩니다.
 *
 * 표에 붙는 구성(판 없이 표만)에서는 `TableToolbar` 가 맞습니다.
 */
export function SectionTitle({
  title,
  count,
  children,
}: {
  title: string;
  /** 건수. 배지로 나옵니다 — 회색 글자로 두면 부제처럼 읽혀 세는 값이라는 게 흐려집니다. */
  count?: string;
  /** 오른쪽에 붙는 것 — 범례 · 버튼 등. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-base font-semibold text-table-text">{title}</span>
      {/* 톤은 늘 neutral 입니다. 건수에 색을 주면 상태처럼 읽힙니다 */}
      {count && (
        <Badge tone="neutral" size="sm">
          {count}
        </Badge>
      )}
      {children}
    </div>
  );
}

/**
 * 표를 담는 자리 — **자기 테두리를 갖습니다.**
 *
 * 판 안에 섹션이 여럿이라, 표가 어디서 시작하고 끝나는지 스스로 말해야 합니다.
 * 판에 붙여 그리면 제목줄·페이지네이션과 경계가 흐려집니다.
 */
export function TableFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-y-auto rounded-md border border-table-border", className)}>
      {children}
    </div>
  );
}
