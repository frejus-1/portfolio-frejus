function StatCard({
    label,
    value,
    description,
    icon,
    variant = "default",
}) {
    return (
        <article
            className={`admin-stat-card admin-stat-card-${variant}`}
        >
            <div className="admin-stat-card-top">

                <span className="admin-stat-card-icon">
                    {icon}
                </span>

                <span className="admin-stat-card-label">
                    {label}
                </span>

            </div>

            <div className="admin-stat-card-value">
                {value}
            </div>

            {description && (
                <p className="admin-stat-card-description">
                    {description}
                </p>
            )}
        </article>
    );
}

export default StatCard;