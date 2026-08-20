"use client"

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateLabel, formatMonthLabel, getEndOfMonth, getStartOfMonth, isPastDay, isWeekend, toDateKey } from '@/lib/booking-utils'

type BookingCalendarProps = {
  value?: string
  onChange: (date: string) => void
}

const weekdayLabels = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

export default function BookingCalendar({ value, onChange }: BookingCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const days = useMemo(() => {
    const start = getStartOfMonth(visibleMonth)
    const end = getEndOfMonth(visibleMonth)
    const mondayBasedOffset = (start.getDay() + 6) % 7
    const total = end.getDate()
    const cells = [] as Array<Date | null>

    for (let index = 0; index < mondayBasedOffset; index += 1) {
      cells.push(null)
    }

    for (let day = 1; day <= total; day += 1) {
      cells.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day))
    }

    while (cells.length % 7 !== 0) {
      cells.push(null)
    }

    return cells
  }, [visibleMonth])

  const canGoBack = useMemo(() => {
    const today = new Date()
    return visibleMonth.getFullYear() > today.getFullYear() || visibleMonth.getMonth() > today.getMonth()
  }, [visibleMonth])

  return (
    <div className="rounded-[22px] border border-border bg-background/92 p-4 shadow-[0_10px_24px_rgba(47,33,27,0.05)] md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => canGoBack && setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors',
            canGoBack ? 'hover:bg-card' : 'cursor-not-allowed opacity-40'
          )}
          aria-label="Forrige måned"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-[24px] text-foreground">{formatMonthLabel(visibleMonth)}</p>
        <button
          type="button"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-card"
          aria-label="Næste måned"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {weekdayLabels.map((label) => (
          <div key={label} className="pb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:text-[11px]">
            {label}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const key = toDateKey(day)
          const disabled = isPastDay(day) || isWeekend(day)
          const selected = value === key

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-label={formatDateLabel(key)}
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={cn(
                'aspect-square rounded-[14px] border text-[13px] font-medium transition-all md:text-[14px]',
                selected
                  ? 'border-primary bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(168,116,59,0.24)]'
                  : 'border-border bg-background text-foreground hover:border-primary/60 hover:bg-background',
                disabled && 'cursor-not-allowed border-border/50 bg-card/60 text-muted-foreground/60 hover:border-border/50 hover:bg-card/60'
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">Søndage er ikke tilgængelige for booking.</p>
    </div>
  )
}
