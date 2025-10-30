import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
// @ts-expect-error akjsd
export async function GET(_: unknown, { params }) {
    const { cabinId } = params;
    try {
        const [cabin, bookedDates] = await Promise.all([getCabin(cabinId), getBookedDatesByCabinId(cabinId)])
        return Response.json({ cabin, bookedDates })
    } catch {
        return Response.json({ message: "Cabin not found" })
    }
}