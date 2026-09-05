export default function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="font-heading text-lg font-semibold text-textPrimary dark:text-dark-text">{title}</h2>
        {subtitle && <p className="text-sm text-textSecondary dark:text-dark-textMuted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
