"use client";

import { useMemo, useState } from "react";
import { PersonaCard } from "@/components/personas/PersonaCard";
import type { Persona } from "@/lib/types";

type SortKey = "newest" | "oldest" | "name" | "speech";

function sortPersonas(personas: Persona[], sortBy: SortKey) {
  const next = [...personas];

  switch (sortBy) {
    case "oldest":
      return next.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    case "name":
      return next.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    case "speech":
      return next.sort((a, b) => a.speech_style.localeCompare(b.speech_style));
    case "newest":
    default:
      return next.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
}

export function DashboardGrid({ personas }: { personas: Persona[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const filteredPersonas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = normalizedQuery
      ? personas.filter((persona) => {
          const haystack = [
            persona.name,
            persona.personality,
            persona.speech_style,
            persona.slug,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        })
      : personas;

    return sortPersonas(filtered, sortBy);
  }, [personas, query, sortBy]);

  return (
    <section className="mt-6">
      <div className="surface-card mb-5 flex flex-col gap-5 rounded-[28px] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold tracking-tight text-[rgb(var(--text))]">Persona Library</div>
          <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
            검색과 정렬 기능으로 원하는 캐릭터를 빠르게 찾을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 성격, 말투로 검색"
            className="input-control h-12 min-w-[240px] rounded-full px-5 text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="select-control h-12 rounded-full px-5 text-sm"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="name">이름순</option>
            <option value="speech">말투순</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="soft-pill">Results {filteredPersonas.length}</div>
        {query ? (
          <button type="button" onClick={() => setQuery("")} className="btn-secondary px-4 py-2 text-xs">
            검색 초기화
          </button>
        ) : null}
      </div>

      {filteredPersonas.length === 0 ? (
        <div className="surface-card rounded-[28px] p-8 text-sm leading-7 text-[rgb(var(--muted))]">
          검색 조건에 맞는 페르소나가 없습니다. 다른 키워드로 다시 검색해 보시기 바랍니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPersonas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      )}
    </section>
  );
}
