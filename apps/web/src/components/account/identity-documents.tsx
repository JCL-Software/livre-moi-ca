"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AccountFieldLabel } from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";

type LicenseFile = {
  name: string;
  created_at?: string | null;
};

export function IdentityDocuments({
  verified,
  files,
}: {
  verified: boolean;
  files: LicenseFile[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Reconnectez-vous pour envoyer un document.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${user.id}/${Date.now()}.${extension}`;
    setUploading(true);
    const { error } = await supabase.storage.from("licenses").upload(path, file, {
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Document envoyé. L’équipe validera votre identité.");
    router.refresh();
  }

  return (
    <UberCard>
      <div className="space-y-4">
        <div>
          <p className="m-0 font-medium text-black">Pièce d&apos;identité</p>
          <p className="mt-1 mb-0 text-sm text-[#545454]">
            Envoyez une photo de votre permis ou d&apos;une pièce d&apos;identité. Le fichier
            reste privé. La validation est effectuée par l&apos;équipe — elle n&apos;est pas
            automatique.
          </p>
        </div>

        <div>
          <AccountFieldLabel htmlFor="license">Ajouter un document</AccountFieldLabel>
          <input
            id="license"
            type="file"
            accept="image/*,.pdf"
            disabled={uploading || verified}
            className="block w-full text-sm text-[#545454] file:mr-3 file:h-11 file:rounded-lg file:border-0 file:bg-[#EEEEEE] file:px-4 file:font-medium file:text-black hover:file:bg-[#E4E4E4] disabled:opacity-50"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </div>

        {files.length === 0 ? (
          <p className="m-0 text-sm text-[#545454]">Aucun document envoyé pour le moment.</p>
        ) : (
          <ul className="m-0 space-y-2 p-0 text-sm">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between rounded-lg bg-[#F6F6F6] px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                {file.created_at ? (
                  <span className="ml-3 shrink-0 text-xs text-[#545454]">
                    {new Date(file.created_at).toLocaleDateString("fr-CA")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {verified ? (
          <p className="m-0 text-sm text-[#545454]">
            Identité déjà vérifiée. Aucun nouvel envoi n&apos;est nécessaire.
          </p>
        ) : uploading ? (
          <p className="m-0 text-sm text-[#545454]">Envoi du document…</p>
        ) : null}
      </div>
    </UberCard>
  );
}
