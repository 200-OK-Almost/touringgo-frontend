import './SwitchCard.css';

interface SwitchCardProps {
    icon: React.ReactNode;
    coloredIcon: boolean
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

function SwitchCard({ icon, coloredIcon = true, title, description, checked, onChange }: SwitchCardProps) {
    return (
        <label className="switch-card">
            <div className="switch-card__info">
                <span className="switch-card__title">
                    <span className={`switch-card__icon ${coloredIcon && "switch-card-colored-icon"}`}>{icon}</span>
                    <p>{title}</p>
                </span>
                <span className="switch-card__desc">
                    {description}
                </span>
            </div>
            <input
                type="checkbox"
                className="switch-input"
                checked={checked}
                onChange={onChange}
            />
            <span className="switch-control" />
        </label>
    );
}

export default SwitchCard;