import React from "react";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { auth } from "../_lib/auth";
import LoginMessage from "./LoginMessage";
import { CabinI, UserI } from "../_lib/types";

async function Reservation({ cabin }: { cabin: CabinI }) {
  const [_, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin?.id as string),
  ]);

  console.log(_);

  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        // settings={settings}
        bookedDates={bookedDates as unknown as string[]}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user as UserI} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
