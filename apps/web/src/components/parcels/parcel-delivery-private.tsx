import type { ParcelDeliveryDetails } from "@/lib/types";

export function ParcelDeliveryPrivate({
  details,
  originName,
  destinationName,
}: {
  details: ParcelDeliveryDetails;
  originName: string;
  destinationName: string;
}) {
  const pickup =
    details.origin_address?.trim() ||
    [originName, details.origin_unit ? `app. ${details.origin_unit}` : null]
      .filter(Boolean)
      .join(" · ");
  const dropoff =
    details.dest_address?.trim() ||
    [destinationName, details.dest_unit ? `app. ${details.dest_unit}` : null]
      .filter(Boolean)
      .join(" · ");
  const recipient = [details.recipient_first_name, details.recipient_last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-3 rounded-lg bg-[#F6F6F6] px-4 py-4 text-sm">
      <p className="uber-home-kicker m-0">Remise du colis</p>
      <p className="m-0 text-xs text-[#545454]">
        Visible uniquement par l’expéditeur et le conducteur retenu.
      </p>
      <div>
        <p className="uber-home-kicker m-0">Prise en charge</p>
        <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
          {pickup}
        </p>
      </div>
      <div>
        <p className="uber-home-kicker m-0">Destination</p>
        <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
          {dropoff}
        </p>
      </div>
      {recipient ? (
        <div>
          <p className="uber-home-kicker m-0">Destinataire</p>
          <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
            {recipient}
          </p>
        </div>
      ) : null}
      {details.recipient_phone ? (
        <div>
          <p className="uber-home-kicker m-0">Téléphone</p>
          <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
            {details.recipient_phone}
          </p>
        </div>
      ) : null}
      {details.meeting_point ? (
        <div>
          <p className="uber-home-kicker m-0">Point de rencontre</p>
          <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
            {details.meeting_point}
          </p>
        </div>
      ) : null}
    </div>
  );
}
