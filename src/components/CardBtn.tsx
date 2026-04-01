import { type OptionItem } from '../types/game';

type CardBtnProps = {
  opt: OptionItem;
  isSelected: boolean;
  isChecked: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onClick: () => void;
};

export function CardBtn({ opt, isSelected, isChecked, isCorrect, isWrong, onClick }: CardBtnProps) {
  return (
    <button
      disabled={isChecked}
      className={`card-btn 
        ${isSelected ? 'selected' : ''} 
        ${isCorrect ? 'correct' : ''} 
        ${isWrong ? 'wrong' : ''}
      `}
      style={opt.isText ? { fontSize: '4rem', color: '#1cb0f6' } : {}}
      onClick={onClick}
    >
      {opt.display}
    </button>
  );
}
