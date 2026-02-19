import { useTranslation } from 'react-i18next';
import type { ItemEffect } from '../services/api';

interface EffectDisplayProps {
  effect: ItemEffect;
  showTitle?: boolean;
}

/**
 * Renders structured ItemEffect fields as a readable list of effects.
 * Used in item detail modals for chems, food, general goods, syringer ammo, clothing.
 */
export function EffectDisplay({ effect, showTitle = true }: EffectDisplayProps) {
  const { t } = useTranslation();

  const lines: { label: string; value: string; color?: string }[] = [];

  // HP healed
  if (effect.hpHealed) {
    lines.push({ label: t('itemDetail.hpHealed'), value: `+${effect.hpHealed}`, color: 'text-green-400' });
  }

  // HP damage
  if (effect.hpDamage) {
    lines.push({ label: t('itemDetail.hpHealed'), value: `-${effect.hpDamage}`, color: 'text-red-400' });
  }

  // Max HP bonus
  if (effect.maxHpBonus) {
    lines.push({ label: 'Max HP', value: `+${effect.maxHpBonus}`, color: 'text-green-400' });
  }

  // Rads healed
  if (effect.radsHealed) {
    lines.push({ label: t('effects.radsHealed'), value: `${effect.radsHealed}`, color: 'text-cyan-400' });
  }

  // Radiation damage
  if (effect.radiationDamage) {
    lines.push({ label: t('effects.radiationDamage'), value: `+${effect.radiationDamage}`, color: 'text-yellow-400' });
  }

  // AP bonus
  if (effect.apBonus) {
    lines.push({ label: t('effects.apBonus'), value: `+${effect.apBonus}`, color: 'text-blue-400' });
  }

  // SPECIAL bonuses
  if (effect.specialBonus) {
    for (const [attr, val] of Object.entries(effect.specialBonus)) {
      if (val && val !== 0) {
        const sign = val > 0 ? '+' : '';
        lines.push({
          label: t(`special.${attr}`),
          value: `${sign}${val}`,
          color: val > 0 ? 'text-green-400' : 'text-red-400',
        });
      }
    }
  }

  // Skill bonuses
  if (effect.skillBonus) {
    for (const [skill, val] of Object.entries(effect.skillBonus)) {
      if (val && val !== 0) {
        const sign = val > 0 ? '+' : '';
        lines.push({
          label: t(`skills.${skill}`),
          value: `${sign}${val}`,
          color: val > 0 ? 'text-green-400' : 'text-red-400',
        });
      }
    }
  }

  // DR bonuses
  if (effect.drBonus) {
    const drEntries = Object.entries(effect.drBonus).filter(([, v]) => v && v !== 0);
    if (drEntries.length > 0) {
      for (const [type, val] of drEntries) {
        lines.push({
          label: `DR ${t(`itemDetail.${type}`)}`,
          value: `+${val}`,
          color: 'text-blue-400',
        });
      }
    }
  }

  // Melee damage bonus
  if (effect.meleeDamageBonus) {
    lines.push({ label: t('effects.meleeDamageBonus'), value: `+${effect.meleeDamageBonus} DC`, color: 'text-orange-400' });
  }

  // Damage bonus
  if (effect.damageBonus) {
    lines.push({ label: t('effects.damageBonus'), value: `+${effect.damageBonus} DC`, color: 'text-orange-400' });
  }

  // Crit bonus
  if (effect.critBonus) {
    lines.push({ label: t('effects.critBonus'), value: `+${effect.critBonus}`, color: 'text-purple-400' });
  }

  // Carry capacity bonus
  if (effect.carryCapacityBonus) {
    lines.push({ label: t('effects.carryCapacityBonus'), value: `+${effect.carryCapacityBonus}`, color: 'text-green-400' });
  }

  // Radiation immunity
  if (effect.radiationImmunity) {
    lines.push({ label: t('effects.radiationImmunity'), value: '', color: 'text-yellow-400' });
  }

  // Conditions added
  if (effect.addCondition && effect.addCondition.length > 0) {
    lines.push({
      label: t('effects.addCondition'),
      value: effect.addCondition.map(c => t(`conditions.${c}`)).join(', '),
      color: 'text-red-400',
    });
  }

  // Conditions removed
  if (effect.removeCondition && effect.removeCondition.length > 0) {
    lines.push({
      label: t('effects.removeCondition'),
      value: effect.removeCondition.map(c => t(`conditions.${c}`)).join(', '),
      color: 'text-green-400',
    });
  }

  // Difficulty reduction
  if (effect.difficultyReduction) {
    const skill = effect.difficultyReduction.skill ? t(`skills.${effect.difficultyReduction.skill}`) : '';
    lines.push({
      label: t('effects.difficultyReduction'),
      value: `${skill} -${effect.difficultyReduction.amount}`,
      color: 'text-cyan-400',
    });
  }

  // Description (free text via i18n key)
  const hasDescription = effect.descriptionKey;

  if (lines.length === 0 && !hasDescription) return null;

  return (
    <div>
      {showTitle && (lines.length > 0 || hasDescription) && (
        <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.effect')}</h4>
      )}
      {lines.length > 0 && (
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="text-sm flex gap-2">
              <span className="text-vault-yellow-dark">{line.label}:</span>
              <span className={line.color || 'text-white'}>{line.value}</span>
            </div>
          ))}
        </div>
      )}
      {hasDescription && (
        <p className="text-sm text-gray-300 mt-1">{t(effect.descriptionKey!)}</p>
      )}
    </div>
  );
}
