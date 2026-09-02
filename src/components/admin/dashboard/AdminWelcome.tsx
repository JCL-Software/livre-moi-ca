type Props = {
  fullName: string;
};

export default function AdminWelcome({ fullName }: Props) {
  return (
    <div className="relative flex items-center justify-between rounded-lg bg-lightsecondary p-6">
      <div className="flex flex-col gap-0.5">
        <h5 className="text-lg font-semibold">Bon retour, {fullName} 👋</h5>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de l&apos;activité Livre-moi.ca en Abitibi.
        </p>
      </div>
    </div>
  );
}
