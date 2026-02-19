import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dice6, Target, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, Button, Select } from '../../components';
import type { DiceResult } from '../../generators/utils';
import { rollD20 } from '../../generators/utils';

export function DicePage() {
  const { t } = useTranslation();
  const [targetNumber, setTargetNumber] = useState(10);
  const [critRange, setCritRange] = useState(1);
  const [extraDice, setExtraDice] = useState(0);
  const [result, setResult] = useState<DiceResult | null>(null);
  const [history, setHistory] = useState<DiceResult[]>([]);

  const handleRoll = () => {
    // Roll base 2d20
    const allRolls: number[] = [];
    let totalSuccesses = 0;
    let totalComplications = 0;
    let hasCrit = false;

    // Roll 2 + extra dice
    const totalDice = 2 + extraDice;
    for (let i = 0; i < totalDice; i++) {
      const roll = rollD20();
      allRolls.push(roll);

      if (roll <= critRange) {
        totalSuccesses += 2;
        hasCrit = true;
      } else if (roll <= targetNumber) {
        totalSuccesses += 1;
      }

      if (roll >= 20) {
        totalComplications += 1;
      }
    }

    const newResult: DiceResult = {
      rolls: allRolls,
      successes: totalSuccesses,
      complications: totalComplications,
      criticalSuccess: hasCrit,
    };

    setResult(newResult);
    setHistory(prev => [newResult, ...prev.slice(0, 9)]);
  };

  const targetOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}`,
  }));

  const critOptions = [
    { value: '1', label: t('dice.critOptions.1') },
    { value: '2', label: t('dice.critOptions.2') },
    { value: '3', label: t('dice.critOptions.3') },
  ];

  const extraDiceOptions = [
    { value: '0', label: t('dice.extraOptions.0') },
    { value: '1', label: t('dice.extraOptions.1') },
    { value: '2', label: t('dice.extraOptions.2') },
    { value: '3', label: t('dice.extraOptions.3') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Dice6 className="w-8 h-8 text-vault-yellow" />
        <h1 className="text-2xl font-bold text-vault-yellow">
          {t('dice.title')}
        </h1>
      </div>

      {/* Configuration */}
      <Card title={t('dice.config')} icon={<Target size={20} />}>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <Select
            label={t('dice.targetNumber')}
            value={targetNumber.toString()}
            onChange={e => setTargetNumber(parseInt(e.target.value))}
            options={targetOptions}
          />
          <Select
            label={t('dice.critRange')}
            value={critRange.toString()}
            onChange={e => setCritRange(parseInt(e.target.value))}
            options={critOptions}
          />
          <Select
            label={t('dice.extraDice')}
            value={extraDice.toString()}
            onChange={e => setExtraDice(parseInt(e.target.value))}
            options={extraDiceOptions}
          />
        </div>

        <Button onClick={handleRoll} size="lg" className="w-full">
          <Dice6 className="w-5 h-5 inline mr-2" />
          {t('dice.roll')} {2 + extraDice}D20
        </Button>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <div className="text-center">
            {/* Dice display */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              {result.rolls.map((roll, index) => {
                const isCrit = roll <= critRange;
                const isSuccess = roll <= targetNumber;
                const isComplication = roll >= 20;

                return (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold border-4 transition-all ${
                      isCrit
                        ? 'bg-vault-yellow text-vault-blue border-vault-yellow-light animate-pulse'
                        : isComplication
                        ? 'bg-vault-danger text-white border-red-400'
                        : isSuccess
                        ? 'bg-vault-success text-white border-green-400'
                        : 'bg-vault-gray-light text-vault-yellow-dark border-vault-gray'
                    }`}
                  >
                    {roll}
                  </div>
                );
              })}
            </div>

            {/* Results summary */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className={`p-4 rounded-lg ${result.successes > 0 ? 'bg-vault-success/20' : 'bg-vault-gray-light'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-vault-success" />
                  <span className="text-vault-yellow-dark text-sm uppercase">{t('dice.successes')}</span>
                </div>
                <div className="text-3xl font-bold text-vault-yellow">
                  {result.successes}
                </div>
              </div>

              <div className={`p-4 rounded-lg ${result.complications > 0 ? 'bg-vault-danger/20' : 'bg-vault-gray-light'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-vault-danger" />
                  <span className="text-vault-yellow-dark text-sm uppercase">{t('dice.complications')}</span>
                </div>
                <div className="text-3xl font-bold text-vault-yellow">
                  {result.complications}
                </div>
              </div>
            </div>

            {/* Critical indicator */}
            {result.criticalSuccess && (
              <div className="mt-4 flex items-center justify-center gap-2 text-vault-yellow">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold uppercase">{t('dice.criticalSuccess')}</span>
                <Sparkles className="w-5 h-5" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card title={t('dice.history')}>
          <div className="space-y-2">
            {history.map((roll, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${
                  index === 0 ? 'bg-vault-blue' : 'bg-vault-gray-light'
                }`}
              >
                <div className="flex gap-2">
                  {roll.rolls.map((r, i) => (
                    <span
                      key={i}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                        r <= critRange
                          ? 'bg-vault-yellow text-vault-blue'
                          : r >= 20
                          ? 'bg-vault-danger text-white'
                          : r <= targetNumber
                          ? 'bg-vault-success text-white'
                          : 'bg-vault-gray text-vault-yellow-dark'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-vault-success">{roll.successes} {t('dice.successes').toLowerCase()}</span>
                  {roll.complications > 0 && (
                    <span className="text-vault-danger">{roll.complications} comp.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Rules reference */}
      <Card title={t('dice.rules.title')}>
        <div className="space-y-3 text-sm text-vault-yellow-dark">
          <div>
            <span className="text-vault-yellow font-bold">{t('dice.rules.successLabel')} </span>
            {t('dice.rules.success')}
          </div>
          <div>
            <span className="text-vault-yellow font-bold">{t('dice.rules.criticalLabel')} </span>
            {t('dice.rules.critical')}
          </div>
          <div>
            <span className="text-vault-yellow font-bold">{t('dice.rules.complicationLabel')} </span>
            {t('dice.rules.complication')}
          </div>
          <div>
            <span className="text-vault-yellow font-bold">{t('dice.rules.apLabel')} </span>
            {t('dice.rules.ap')}
          </div>
        </div>
      </Card>
    </div>
  );
}
