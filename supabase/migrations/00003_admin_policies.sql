-- Accès lecture/écriture admin sur les tables métier (complément 00001 / 00002)

DROP POLICY IF EXISTS "trips_select_admin" ON public.trips;
CREATE POLICY "trips_select_admin" ON public.trips
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "bookings_select_admin" ON public.bookings;
CREATE POLICY "bookings_select_admin" ON public.bookings
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "bookings_update_admin" ON public.bookings;
CREATE POLICY "bookings_update_admin" ON public.bookings
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin());
