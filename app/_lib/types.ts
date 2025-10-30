export interface CabinI {
    id?: string, name?: string, maxCapacity?: number, regularPrice?: number, discount?: number, image?: string, description?: string
}

export interface BookingI {
    id: string,
    guestId: string,
    startDate: string,
    endDate: string,
    numNights: number,
    totalPrice: number,
    numGuests: number,
    status?: string,
    created_at: string,
    cabins: CabinI,
}


export interface UserI {
    id?: string | undefined;
    name?: string | undefined;
    image?: string;
    guestId?: string
    email?: string
}

export interface GuestI {
    fullName?: string, email?: string, nationality?: string, nationalID?: string, countryFlag?: string
}

export interface CountryI {
    name: string;
    flag: string;
}


export interface FormDataI {
    nationalID?: string;
    guestId?: string
}