import { waLink } from "@/lib/utils";

export function FloatingActions({
  whatsappNumber,
  callNumber,
  whatsappPrefill,
  showWhatsapp,
  showCall,
}: {
  whatsappNumber: string;
  callNumber: string;
  whatsappPrefill: string;
  showWhatsapp: boolean;
  showCall: boolean;
}) {
  return (
    <div
      data-fixed-ui
      className="fixed bottom-[4.75rem] left-4 z-40 flex flex-col gap-3 sm:left-6"
    >
      {showCall && (
        <a
          href={`tel:${callNumber}`}
          className="float-soft flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-xl shadow-coral/35 transition hover:scale-105"
          aria-label="Call us"
        >
          <PhoneIcon />
        </a>
      )}
      {showWhatsapp && (
        <a
          href={waLink(whatsappNumber, whatsappPrefill)}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-105"
          aria-label="WhatsApp"
          style={{ animationDelay: "0.4s" }}
        >
          <WaIcon />
        </a>
      )}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9 3 3.4 3.4 3 4 3h3.5c.5 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.7 15l-1 3.7 3.8-1A10 10 0 1 0 12 2zm5.7 14.2c-.2.7-1.3 1.2-2.1 1.4-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.1-4.9-4.3-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.9-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .9 2.1.1.2.1.3 0 .5l-.4.7c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.6.4.1.3 0 1.3-.2 2z" />
    </svg>
  );
}
