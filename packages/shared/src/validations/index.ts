import { z } from "zod";

export const bookingTypeSchema = z.enum(["PASSENGER", "PARCEL"]);
export const parcelSizeSchema = z.enum([
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
]);
export const tripStatusSchema = z.enum([
  "SCHEDULED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);
export const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
]);

export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  name: z.string().min(1).max(200),
});

export const tripPreferencesSchema = z.object({
  smoking: z.boolean(),
  pets: z.boolean(),
  luggage: z.enum(["SMALL", "MEDIUM", "LARGE"]),
});

export const intermediateStopSchema = z.object({
  name: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  stop_order: z.number().int().min(1),
});

export const searchTripsSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  date: z.string().min(8),
  type: bookingTypeSchema,
  size: parcelSizeSchema.optional(),
});

export const createBookingSchema = z
  .object({
    tripId: z.string().uuid(),
    bookingType: bookingTypeSchema,
    seatsBooked: z.number().int().min(1).max(8).optional(),
    parcelTitle: z.string().max(120).optional(),
    parcelDescription: z.string().max(1000).optional(),
    parcelSize: parcelSizeSchema.optional(),
    parcelWeightKg: z.number().min(0.1).max(80).optional(),
    parcelPhotoUrl: z.string().url().optional(),
    recipientName: z.string().max(120).optional(),
    recipientPhone: z.string().max(30).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.bookingType === "PARCEL" && !value.parcelTitle) {
      ctx.addIssue({
        code: "custom",
        path: ["parcelTitle"],
        message: "Le titre du colis est requis.",
      });
    }
  });

export const publishTripSchema = z.object({
  originName: z.string().min(2).max(200),
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destinationName: z.string().min(2).max(200),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  departureTime: z.string().min(8),
  totalSeats: z.number().int().min(1).max(8),
  pricePerSeat: z.number().min(0).max(500),
  acceptsParcels: z.boolean(),
  maxParcelSize: parcelSizeSchema,
  parcelBasePrice: z.number().min(0).max(500),
  parcelPricePerKg: z.number().min(0).max(50),
  intermediateStops: z.array(intermediateStopSchema),
  preferences: tripPreferencesSchema,
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().max(30).optional(),
  bio: z.string().max(500).optional(),
  isDriver: z.boolean(),
  vehicleModel: z.string().max(80).optional(),
  vehiclePlate: z.string().max(20).optional(),
  vehicleColor: z.string().max(40).optional(),
  avatarUrl: z.string().url().optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2).max(120),
});

export const deliveryOtpSchema = z.object({
  bookingId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/, "Le code OTP doit contenir 6 chiffres."),
});
