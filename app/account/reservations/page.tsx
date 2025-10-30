import { getBookings } from "@/app/_lib/data-service";
import { auth } from "@/app/_lib/auth";
import ReservationList from "@/app/_components/ReservationList";
import Link from "next/link";
import { UserI } from "@/app/_lib/types";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = await auth();
  const User = session?.user as unknown as UserI;

  const bookings = await getBookings(User.guestId as string);

  console.log(bookings);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        // @ts-expect-error any
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
