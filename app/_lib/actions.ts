
"use server"
import { revalidatePath } from "next/cache"
import { auth, signIn, signOut } from "./auth"
import supabase from "./supabase"
import { getBookings } from "./data-service"
import { redirect } from "next/navigation"
import { UserI } from "./types"


export async function signInAction() {
    await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' })
}
// @ts-expect-error any type
export async function updateGuest(formData) {
    const session = await auth()
    if (!session) throw new Error("You must be logged in");
    const nationalID = formData.get("nationalID")
    const [nationality, countryFlag] = formData.get("nationality").split('%')

    if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID)) throw new Error("Please enter a valid National ID");

    const updateData = { nationality, countryFlag, nationalID };

    const User = session?.user as unknown as UserI

    const { error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', User?.guestId)

    if (error) {
        console.error(error);
        throw new Error('Guest could not be updated');
    }
    revalidatePath('/account/profile')
}


export async function deleteReservation(bookingId: string) {
    const session = await auth()
    if (!session) throw new Error("You must be logged in");
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    const User = session?.user as unknown as UserI

    const guestBookings = await getBookings(User?.guestId as string)
    const guestBookingIds = guestBookings.map((booking) => booking.id)

    if (guestBookingIds.includes(bookingId)) throw new Error('You are not allowed to delete this booking')

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }

    revalidatePath('/account/reservations')
}

// @ts-expect-error any type
export async function updateBooking(formData) {

    const bookingId = Number(formData.get('bookingId'))

    const session = await auth()
    if (!session) throw new Error("You must be logged in");
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    const User = session?.user as unknown as UserI

    const guestBookings = await getBookings(User?.guestId as string)
    const guestBookingIds = guestBookings.map((booking) => booking.id)

    if (guestBookingIds.includes(bookingId)) throw new Error('You are not allowed to update this booking')

    const updateData = {
        numGuests: Number(formData.get('numGuests')),
        observations: formData.get('observations').slice(0, 1000)
    }


    const { data, error: Errors } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

    if (Errors) {
        console.error(Errors);
        throw new Error('Booking could not be updated');
    }

    revalidatePath(`/account/reservations/edit/${bookingId}`)
    revalidatePath('/account/reservations')

    redirect('/account/reservations')
}

// @ts-expect-error any typeany type
export async function createBooking(bookingData, formData) {
    const session = await auth()
    if (!session) throw new Error("You must be logged in");
    const User = session?.user as unknown as UserI

    const newBooking = {
        ...bookingData,
        guestId: User?.guestId,
        numGuests: Number(formData.get('numGuests')),
        observations: formData.get('observations').slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: 'unconfirmed',
    };

    const { error } = await supabase
        .from('bookings')
        .insert([newBooking])

    if (error) {
        console.error(error);
        throw new Error('Booking could not be created');
    }

    revalidatePath(`/cabins/${bookingData.cabinId}`)

    redirect('/cabins/thankyou')
}