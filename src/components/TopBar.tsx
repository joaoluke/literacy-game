import { Heart } from 'lucide-react';

type TopBarProps = {
  progress: number; // 0 to 5
  lives: number;
};

export function TopBar({ progress, lives }: TopBarProps) {
  return (
    <div className="top-bar">
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${(progress / 5) * 100}%` }}></div>
      </div>
      <div className="hearts">
        <Heart size={24} fill="#ff4b4b" color="#ff4b4b" className={lives < 5 ? "animate-shake" : ""} />
        <span>{lives}</span>
      </div>
    </div>
  );
}
