import { Volume2, Star } from 'lucide-react';
import logo from './assets/ch.png';
import { useGameEngine } from './hooks/useGameEngine';
import { TopBar } from './components/TopBar';
import { Button3D } from './components/Button3D';
import { CardBtn } from './components/CardBtn';

export default function App() {
  const {
    gameState, stage, progress, lives, mode, targetWord, targetLetter, options,
    selectedOpt, isChecked, isCorrect, startGame, checkAnswer, nextLevel, 
    replayAudio, getTargetId, handleOptClick, handleContinueOrRetry
  } = useGameEngine();

  if (gameState === 'menu') {
    return (
      <div className="main-menu">
        <img src={logo} alt="Jogos do Charles" style={{ width: 180, height: 180, marginBottom: 20, objectFit: 'contain' }} className="animate-pop" />
        <h1 style={{fontSize: '2.8rem', color: '#ffc800'}}>Jogos do Charles</h1>
        <p style={{ color: '#1cb0f6', fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>NÍVEL {stage}</p>
        <p>Um jogo divertido para aprender!</p>
        <Button3D onClick={startGame}>
          COMEÇAR A JOGAR
        </Button3D>
      </div>
    );
  }

  if (gameState === 'level_complete') {
    return (
      <div className="main-menu" style={{ backgroundColor: '#d7ffb8' }}>
        <Star size={100} color="#ffc800" fill="#ffc800" style={{ marginBottom: 20 }} className="animate-bounce-in" />
        <h1 style={{ color: '#58cc02' }}>Nível {stage} Concluído!</h1>
        <p>Você é incrível! Vamos continuar?</p>
        <Button3D onClick={nextLevel}>
          PRÓXIMO NÍVEL
        </Button3D>
      </div>
    );
  }

  return (
    <>
      <TopBar progress={progress} lives={lives} />

      <div className="game-area">
        {lives === 0 ? (
          <div className="main-menu" style={{ flex: 1, padding: 0 }}>
            <h1 style={{ color: '#ff4b4b' }}>Fim de jogo</h1>
            <p>Você tentou muito bem! Vamos recomeçar?</p>
            <Button3D variant="danger" onClick={startGame} style={{ marginTop: 20 }}>
              TENTAR NOVAMENTE
            </Button3D>
          </div>
        ) : (
          <>
            <h2 className="question-title">
              {mode === 'match_word' && 'Qual é a imagem para:'}
              {mode === 'starts_with' && 'Qual imagem começa com:'}
              {mode === 'guess_first_letter' && 'Com qual letra começa:'}
              {mode === 'find_letter' && 'Ouça e encontre:'}
            </h2>
            
            <button 
              className="speaker-btn animate-pop" 
              onClick={replayAudio}
              aria-label="Ouvir"
            >
              <Volume2 size={32} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, marginBottom: '30px', color: '#58cc02', letterSpacing: '2px' }}>
              {mode === 'match_word' && targetWord?.word?.toUpperCase()}
              {mode === 'starts_with' && targetLetter}
              {mode === 'guess_first_letter' && <span style={{fontSize: '5rem', lineHeight: '1'}}>{targetWord?.emoji}</span>}
              {mode === 'find_letter' && <span style={{fontSize: '4rem', color: '#afafaf'}}>?</span>}
            </p>

            <div className="options-grid">
              {options.map((opt) => (
                <CardBtn
                  key={opt.id}
                  opt={opt}
                  isSelected={selectedOpt?.id === opt.id}
                  isChecked={isChecked}
                  isCorrect={isChecked && opt.id === getTargetId()}
                  isWrong={isChecked && selectedOpt?.id === opt.id && selectedOpt?.id !== getTargetId()}
                  onClick={() => handleOptClick(opt)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bottom-actions">
        {lives > 0 && (
          isChecked ? (
            <>
              <div className={`result-banner ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? 'Excelente!' : 'Ops, não é essa.'}
              </div>
              <Button3D 
                variant={isCorrect ? 'primary' : 'danger'} 
                onClick={handleContinueOrRetry}
              >
                {isCorrect ? 'CONTINUAR' : 'ENTENDI'}
              </Button3D>
            </>
          ) : (
             <Button3D 
               disabled={!selectedOpt}
               onClick={checkAnswer}
               style={{ padding: '20px 24px', fontSize: '1.4rem' }}
             >
               VERIFICAR
             </Button3D>
           )
        )}
      </div>
    </>
  );
}
