"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { CabinI } from "../_lib/types";

function isAlreadyBooked(
  range: { from: string; to: string },
  datesArr: string[]
) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({
  bookedDates,
  cabin,
}: {
  bookedDates: string[] | undefined;
  cabin: CabinI;
}) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(
    range as unknown as { from: string; to: string },
    bookedDates as string[]
  )
    ? undefined
    : range;
  const { regularPrice, discount } = cabin;
  const numNights =
    displayRange && displayRange.from && displayRange?.to
      ? differenceInDays(displayRange?.to as Date, displayRange?.from as Date)
      : 0;

  const cabinPrice =
    numNights * ((regularPrice as number) - (discount as number));

  // SETTINGS
  const minBookingLength = 1;
  const maxBookingLength = 23;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        onSelect={setRange}
        selected={displayRange}
        disabled={(curDate) =>
          isPast(curDate) ||
          (bookedDates !== undefined &&
            bookedDates.some((date) => isSameDay(date, curDate)))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {(discount as number) > 0 ? (
              <>
                <span className="text-2xl">
                  ${(regularPrice as number) - (discount as number)}
                </span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range && (range.from || range.to) ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
