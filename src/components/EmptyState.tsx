import Link from "next/link";

export default function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-10 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-lg text-sm"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-lg text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}