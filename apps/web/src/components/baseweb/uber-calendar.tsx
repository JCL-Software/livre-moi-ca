"use client";

import { addDays, format, isSameDay, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import StatefulCalendar from "baseui/datepicker/stateful-calendar";
import { PLACEMENT, StatefulPopover } from "baseui/popover";
import { cn } from "@/lib/utils";

function parseValue(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatOutput(date: Date, withTime: boolean) {
  return withTime ? format(date, "yyyy-MM-dd'T'HH:mm") : format(date, "yyyy-MM-dd");
}

function formatTriggerLabel(value: string, withTime: boolean) {
  const date = parseValue(value);
  if (!date) return withTime ? "Date et heure" : "Date";

  const today = startOfDay(new Date());
  const dayLabel = isSameDay(date, today)
    ? "Aujourd'hui"
    : isSameDay(date, addDays(today, 1))
      ? "Demain"
      : format(date, "d MMM yyyy", { locale: fr });

  if (!withTime) return dayLabel;
  return `${dayLabel} · ${format(date, "HH:mm")}`;
}

export function UberCalendarField({
  id,
  value,
  onChange,
  minDate,
  withTime = true,
  triggerClassName,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  withTime?: boolean;
  triggerClassName?: string;
  "aria-label"?: string;
}) {
  const selected = parseValue(value);

  return (
    <StatefulPopover
      placement={PLACEMENT.bottomLeft}
      dismissOnClickOutside={false}
      dismissOnEsc
      content={({ close }) => (
        <StatefulCalendar
          locale={fr}
          timeSelectStart={withTime}
          minDate={minDate}
          initialState={{ value: selected }}
          onChange={({ date }) => {
            const picked = Array.isArray(date) ? date[0] : date;
            if (!picked) return;
            onChange(formatOutput(picked, withTime));
          }}
          overrides={
            withTime
              ? {
                  TimeSelect: {
                    props: {
                      format: "24",
                    },
                  },
                }
              : undefined
          }
          primaryButton={{
            label: "OK",
            onClick: close,
          }}
        />
      )}
    >
      <button
        type="button"
        id={id}
        aria-label={ariaLabel ?? (withTime ? "Date et heure" : "Date")}
        className={cn("text-left", triggerClassName)}
      >
        <span className="truncate">{formatTriggerLabel(value, withTime)}</span>
      </button>
    </StatefulPopover>
  );
}
