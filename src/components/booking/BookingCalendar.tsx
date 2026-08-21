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
    <div className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-md md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => canGoBack && setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors',
            canGoBack ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-40'
          )}
          aria-label="Forrige måned"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-[24px] text-gray-900">{formatMonthLabel(visibleMonth)}</p>
        <button
          type="button"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Næste måned"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {weekdayLabels.map((label) => (
          <div key={label} className="pb-1 text-[10px] uppercase tracking-[0.14em] text-gray-500 md:text-[11px]">
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
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'border-emerald-200 bg-emerald-50/50 text-emerald-900 hover:border-emerald-500 hover:bg-emerald-100',
                disabled && 'cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300 hover:border-gray-100 hover:bg-gray-100'
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-[12px] text-gray-500">Søndage er ikke tilgængelige for booking.</p>
    </div>
  )
}
