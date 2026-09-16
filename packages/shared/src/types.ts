export type BookingType = "PASSENGER" | "PARCEL";
export type ParcelSize = "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
export type ParcelCategory =
  | "DOCUMENTS"
  | "PARCEL"
  | "TOOLS"
  | "CLOTHING"
  | "FOOD"
  | "ELECTRONICS"
  | "OTHER";
export type TripStatus = "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type ParcelListingStatus = "OPEN" | "MATCHED" | "CANCELLED" | "EXPIRED";
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED"
  | "REJECTED";

export type GeoPoint = {
  lat: number;
  lng: number;
  name: string;
  unit?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

export type PlaceSuggestion = {
  name: string;
  mapboxId?: string;
  lat?: number;
  lng?: number;
};

export type IntermediateStop = {
  name: string;
  lat: number;
  lng: number;
  stop_order: number;
};

export type TripPreferences = {
  smoking: boolean;
  pets: boolean;
  luggage: "SMALL" | "MEDIUM" | "LARGE";
  note?: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_driver: boolean;
  vehicle_model: string | null;
  vehicle_plate: string | null;
  vehicle_color: string | null;
  bio: string | null;
  rating_avg: number;
  rating_count: number;
  identity_verified: boolean;
  accepts_parcels: boolean;
  created_at: string;
};

export type Trip = {
  id: string;
  driver_id: string;
  origin_name: string;
  destination_name: string;
  distance_km: number;
  estimated_duration_min: number;
  departure_time: string;
  arrival_time_est: string | null;
  total_seats: number;
  available_seats: number;
  price_per_seat: number;
  accepts_parcels: boolean;
  max_parcel_size: ParcelSize;
  parcel_base_price: number;
  parcel_price_per_kg: number;
  intermediate_stops: IntermediateStop[];
  preferences: TripPreferences;
  status: TripStatus;
  route_polyline: string | null;
  created_at: string;
  profiles?: Profile;
};

export type SearchTripResult = {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_avatar: string | null;
  driver_rating: number;
  driver_identity_verified: boolean;
  origin_name: string;
  destination_name: string;
  departure_time: string;
  arrival_time_est: string | null;
  distance_km: number;
  estimated_duration_min: number;
  available_seats: number;
  price_per_seat: number;
  accepts_parcels: boolean;
  max_parcel_size: ParcelSize;
  parcel_base_price: number;
  origin_distance_km: number;
  dest_distance_km: number;
  intermediate_stops: IntermediateStop[];
  preferences: TripPreferences;
  vehicle_model: string | null;
  vehicle_color: string | null;
};

export type Booking = {
  id: string;
  trip_id: string;
  user_id: string;
  booking_type: BookingType;
  status: BookingStatus;
  seats_booked: number;
  parcel_title: string | null;
  parcel_description: string | null;
  parcel_size: ParcelSize | null;
  parcel_weight_kg: number | null;
  parcel_photo_url: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  is_otp_verified: boolean;
  pickup_proof_url: string | null;
  delivery_proof_url: string | null;
  total_price: number;
  payment_status: string;
  created_at: string;
  trips?: Trip;
};

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type SearchTripsInput = {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  date: string;
  type: BookingType;
  size?: ParcelSize;
};

export type CreateBookingInput = {
  tripId: string;
  bookingType: BookingType;
  seatsBooked?: number;
  parcelTitle?: string;
  parcelDescription?: string;
  parcelSize?: ParcelSize;
  parcelWeightKg?: number;
  parcelPhotoUrl?: string;
  recipientName?: string;
  recipientPhone?: string;
};

export type PublishTripInput = {
  originName: string;
  originLat: number;
  originLng: number;
  destinationName: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  acceptsParcels: boolean;
  maxParcelSize: ParcelSize;
  parcelBasePrice: number;
  parcelPricePerKg: number;
  intermediateStops: IntermediateStop[];
  preferences: TripPreferences;
};

export type ParcelListing = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  origin_name: string;
  origin_lat?: number;
  origin_lng?: number;
  destination_name: string;
  dest_lat?: number;
  dest_lng?: number;
  parcel_size: ParcelSize;
  category?: ParcelCategory | null;
  category_detail?: string | null;
  weight_kg: number;
  is_fragile: boolean;
  estimated_price: number | null;
  distance_km: number | null;
  desired_date: string | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  photo_url?: string | null;
  status: ParcelListingStatus;
  matched_conversation_id?: string | null;
  agreed_price?: number | null;
  agreed_driver_payout?: number | null;
  agreed_commission?: number | null;
  created_at: string;
};

export type ParcelTransportOffer = {
  conversationId: string;
  listingId: string;
  listingTitle: string;
  listingRoute: string;
  listingStatus: ParcelListingStatus;
  matchedConversationId: string | null;
  initiatorId: string;
  counterpartId: string | null;
  counterpartName: string;
  counterpartAvatarUrl: string | null;
  counterpartVerified: boolean;
  createdAt: string;
  lastMessage: string | null;
  proposedPrice: number | null;
  proposedBy: string | null;
  suggestedPrice: number | null;
  agreedPrice: number | null;
};

export type ExistingParcelOffer = {
  conversationId: string;
  proposedPrice: number | null;
  proposedBy: string | null;
};

export type ListOpenParcelsFilters = {
  origin?: string;
  destination?: string;
  size?: ParcelSize;
};

export type PublishParcelInput = {
  originName: string;
  originLat: number;
  originLng: number;
  destinationName: string;
  destLat: number;
  destLng: number;
  parcelSize: ParcelSize;
  category?: ParcelCategory;
  categoryDetail?: string;
  weightKg: number;
  isFragile: boolean;
  title?: string;
  description?: string;
  estimatedPrice?: number;
  distanceKm?: number;
  desiredDate?: string;
  originUnit?: string;
  originAddress?: string;
  destUnit?: string;
  destAddress?: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  recipientName?: string;
  recipientPhone?: string;
  meetingPoint?: string;
  photoUrl?: string | null;
};

export type ParcelDeliveryDetails = {
  listing_id: string;
  origin_unit: string | null;
  origin_address: string | null;
  dest_unit: string | null;
  dest_address: string | null;
  recipient_first_name: string | null;
  recipient_last_name: string | null;
  recipient_phone: string | null;
  meeting_point: string | null;
};

export type UpdateProfileInput = {
  fullName: string;
  phone?: string;
  bio?: string;
  isDriver: boolean;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleColor?: string;
  avatarUrl?: string;
  acceptsParcels: boolean;
};

export type AppNotification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  parcel_listing_id: string | null;
  conversation_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type ConversationMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export type ConversationPreview = {
  id: string;
  parcel_listing_id: string | null;
  initiator_id: string | null;
  created_at: string;
  listing_title: string | null;
  listing_route: string | null;
  listing_owner_id: string | null;
  listing_status: string | null;
  matched_conversation_id: string | null;
  proposed_price: number | null;
  proposed_by: string | null;
  last_message: string | null;
  last_message_at: string | null;
  counterpart_id: string | null;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  counterpart_verified: boolean;
};

export type ReceivedReview = {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type ReviewableBooking = {
  booking_id: string;
  reviewee_id: string;
  reviewee_name: string;
  route: string;
  booking_type: BookingType;
  role: "customer" | "driver";
};

export type RouteGeoJson = {
  type: "LineString";
  coordinates: [number, number][];
};

export type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geojson: RouteGeoJson;
};
