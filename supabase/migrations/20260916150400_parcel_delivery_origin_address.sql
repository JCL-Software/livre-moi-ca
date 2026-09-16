-- Adresse d'origine exacte (privée), comme dest_address.
-- Visible uniquement via les politiques existantes de parcel_delivery_details.

ALTER TABLE public.parcel_delivery_details
  ADD COLUMN IF NOT EXISTS origin_address TEXT;
