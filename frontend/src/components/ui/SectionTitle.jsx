export default function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
