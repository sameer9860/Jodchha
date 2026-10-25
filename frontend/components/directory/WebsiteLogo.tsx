type WebsiteLogoProps = {
  name: string;
  logo?: string;
  fallback?: string;
  size?: "sm" | "lg";
};

export default function WebsiteLogo({
  name,
  logo,
  fallback = "🔗",
  size = "sm",
}: WebsiteLogoProps) {
  const boxClass =
    size === "lg"
      ? "h-16 w-16 text-3xl"
      : "h-12 w-12 text-2xl";

  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={`${name} logo`}
        className={`${boxClass} rounded-xl bg-slate-50 object-contain p-1.5`}
      />
    );
  }

  return (
    <span
      className={`flex ${boxClass} items-center justify-center rounded-xl bg-slate-50`}
      aria-hidden="true"
    >
      {fallback}
    </span>
  );
}
