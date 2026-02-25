import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Star, Sparkles, Dumbbell, Package, Check, User, BookOpen, ScrollText, AlertTriangle, Lock } from 'lucide-react';
import type {
  Character,
  SpecialAttribute,
  SkillName,
  OriginId,
  SurvivorTraitId,
} from '../data/characters';
import {
  SPECIAL_ATTRIBUTES,
  SKILL_NAMES,
  SKILL_ATTRIBUTES,
  ORIGINS,
  SURVIVOR_TRAITS,
  calculateMaxHp,
  calculateInitiative,
  calculateDefense,
  calculateMeleeDamageBonus,
  calculateMaxLuckPoints,
  calculateCarryCapacity,
  calculateSkillPoints,
} from '../data/characters';
import { PERKS, getAvailablePerks, getRequiredLevelForRank } from '../data/perks';
import { SPECIAL_COLORS } from '../data/specialColors';
import { getPerkHPBonus, getPerkDRBonuses, getPerkCarryCapacityBonus, PERK_EFFECTS } from '../data/effects';
import { useEquipmentPacksForOrigin, useTagSkillBonuses, useLevelBonus } from '../hooks/useEquipmentPacks';
import type { EquipmentPackApi, EquipmentPackItemApi, TagSkillBonusEntryApi, TagSkillBonusDirectApi, ItemType } from '../services/api';
// Helper to check if a tag skill bonus entry is a choice group
function isTagSkillChoice(entry: TagSkillBonusEntryApi): entry is { isChoice: true; options: TagSkillBonusDirectApi[] } {
  return 'isChoice' in entry && entry.isChoice === true;
}

// Mapping from ammoType enum to ammo item names
const AMMO_TYPE_TO_NAME: Record<string, string> = {
  '.38': '.38 Rounds',
  '10mm': '10mm Rounds',
  '.308': '.308 Rounds',
  '.45': '.45 Rounds',
  shotgunShell: 'Shotgun Shells',
  '.44': '.44 Rounds',
  '.50': '.50 Rounds',
  '5mm': '5mm Rounds',
  '5.56mm': '5.56mm Rounds',
};

import { Button } from './Button';
import { SpecialInput } from './SpecialInput';
import { ItemDetailModal } from './ItemDetailModal';
import { StepWizard, type WizardStep } from './StepWizard';
import { StepIndicator } from './StepIndicator';

interface CharacterFormProps {
  character?: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultType?: 'PC' | 'NPC';
}

// Helper to map ItemType to translation category key
const getCategoryKeyFromItemType = (itemType?: ItemType): string => {
  switch (itemType) {
    case 'weapon': return 'weapons';
    case 'armor': return 'armor';
    case 'powerArmor': return 'armor';
    case 'robotArmor': return 'armor';
    case 'clothing': return 'clothing';
    case 'ammunition': return 'ammunition';
    case 'syringerAmmo': return 'ammunition';
    case 'chem': return 'chems';
    case 'food': return 'food';
    case 'generalGood': return 'general';
    case 'oddity': return 'general';
    default: return '';
  }
};

const DEFAULT_SPECIAL = 5;
const SPECIAL_POINTS_TO_DISTRIBUTE = 5;
const BASE_TAG_SKILLS_COUNT = 3;
const TAG_SKILL_STARTING_RANK = 2;
const MAX_SKILL_RANK = 6;
const GIFTED_BONUS_COUNT = 2; // Gifted trait gives +1 to two chosen SPECIAL

const SPECIAL_SHORT: Record<SpecialAttribute, string> = {
  strength: 'F', perception: 'P', endurance: 'E',
  charisma: 'C', intelligence: 'I', agility: 'A', luck: 'L',
};

function StepValidation({ warnings, errors }: { warnings?: string[]; errors?: string[] }) {
  return (
    <>
      {errors?.map((msg, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-red-900/30 border border-red-600/50 rounded text-red-400 text-sm">
          <AlertTriangle size={14} className="shrink-0" />
          {msg}
        </div>
      ))}
      {warnings?.map((msg, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-yellow-900/20 border border-yellow-600/40 rounded text-yellow-400 text-sm">
          <AlertTriangle size={14} className="shrink-0" />
          {msg}
        </div>
      ))}
    </>
  );
}

export function CharacterForm({
  character,
  isOpen,
  onClose,
  onSave,
  defaultType = 'PC',
}: CharacterFormProps) {
  const { t } = useTranslation();

  // Detect creation vs edit mode
  const isEditMode = !!character;
  const isCreateMode = !character;

  // Wizard step
  const [currentStep, setCurrentStep] = useState(0);

  // Basic info
  const [name, setName] = useState('');
  const [type, setType] = useState<'PC' | 'NPC'>(defaultType);
  const [level, setLevel] = useState(1);
  const [origin, setOrigin] = useState<OriginId>('survivor');
  const [survivorTraits, setSurvivorTraits] = useState<SurvivorTraitId[]>([]);

  // Gifted trait: +1 to two chosen SPECIAL attributes
  const [giftedBonusAttributes, setGiftedBonusAttributes] = useState<SpecialAttribute[]>([]);

  // SPECIAL (before origin modifiers)
  const [baseSpecial, setBaseSpecial] = useState<Record<SpecialAttribute, number>>({
    strength: 5,
    perception: 5,
    endurance: 5,
    charisma: 5,
    intelligence: 5,
    agility: 5,
    luck: 5,
  });

  // Skills & Tag Skills
  const [skills, setSkills] = useState<Record<SkillName, number>>(() => {
    const defaultSkills: Record<SkillName, number> = {} as Record<SkillName, number>;
    SKILL_NAMES.forEach((skill) => {
      defaultSkills[skill] = 0;
    });
    return defaultSkills;
  });
  const [tagSkills, setTagSkills] = useState<SkillName[]>([]);

  // Perks & Notes
  const [perks, setPerks] = useState<{ perkId: string; rank: number }[]>([]);
  const [showPerkSelector, setShowPerkSelector] = useState(false);
  const [pendingExercisePerk, setPendingExercisePerk] = useState<number | null>(null); // rank to add
  const [exerciseBonuses, setExerciseBonuses] = useState<SpecialAttribute[]>([]); // one entry per rank
  const [pendingTagPerk, setPendingTagPerk] = useState(false);
  const [tagPerkSkill, setTagPerkSkill] = useState<SkillName | null>(null);
  // Origin constrained bonus tag skill (e.g. Brotherhood → one of energyWeapons/science/repair)
  const [originOptionTagSkill, setOriginOptionTagSkill] = useState<SkillName | null>(null);
  const [notes, setNotes] = useState('');

  // Equipment Pack
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  // Equipment choices: key = "packId-index", value = selected option index
  const [equipmentChoices, setEquipmentChoices] = useState<Record<string, number>>({});
  // Tag skill bonus choices: key = "skill-choiceIndex", value = selected option index
  const [tagSkillBonusChoices, setTagSkillBonusChoices] = useState<Record<string, number>>({});
  // Barter bonus caps (2d20)
  const [barterBonusCaps, setBarterBonusCaps] = useState<number>(0);
  // Item detail modal
  const [selectedItemDetail, setSelectedItemDetail] = useState<{ id: number; itemType: ItemType } | null>(null);

  // API hooks for equipment packs
  const { packs: availablePacks, loading: packsLoading } = useEquipmentPacksForOrigin(
    type === 'PC' ? origin : undefined
  );
  const { bonuses: tagSkillBonusesApi, loading: tagBonusesLoading } = useTagSkillBonuses();
  const { bonus: levelBonusApi } = useLevelBonus(level);

  // Get origin data
  const currentOrigin = useMemo(
    () => ORIGINS.find((o) => o.id === origin),
    [origin]
  );

  // Check survivor traits
  const hasGifted = survivorTraits.includes('gifted');
  const hasEducated = survivorTraits.includes('educated');
  const hasSmallFrame = survivorTraits.includes('smallFrame');
  const hasHeavyHanded = survivorTraits.includes('heavyHanded');

  // Origin bonus tag skills — locked (auto-applied fixed ones + user-chosen constrained option)
  const originBonusTagSkills: SkillName[] = [
    ...((currentOrigin?.bonusTagSkills ?? []) as SkillName[]),
    ...(originOptionTagSkill ? [originOptionTagSkill] : []),
  ];

  // Dynamic tag skills count (Educated gives +1, Tag! perk gives +1, some origins give extra slots)
  const hasTagPerk = perks.some(p => p.perkId === 'tag');
  const originBonusTagSlots = currentOrigin?.bonusTagSkillSlots ?? 0;
  const tagSkillsCount = BASE_TAG_SKILLS_COUNT + (hasEducated ? 1 : 0) + (hasTagPerk ? 1 : 0) + originBonusTagSlots;

  // User-selected tag skills only (excluding origin bonus ones)
  const userTagSkills = tagSkills.filter(s => !originBonusTagSkills.includes(s));

  // Calculate final SPECIAL with origin modifiers, Gifted bonuses, and Exercice bonuses applied
  const special = useMemo(() => {
    const result = { ...baseSpecial };

    // Apply origin modifiers (e.g., Super Mutant +2 STR/END)
    if (currentOrigin?.specialModifiers) {
      SPECIAL_ATTRIBUTES.forEach((attr) => {
        const modifier = currentOrigin.specialModifiers?.[attr] ?? 0;
        const maxValue = currentOrigin.specialMaxOverrides?.[attr] ?? 10;
        result[attr] = Math.min(baseSpecial[attr] + modifier, maxValue);
      });
    }

    // Apply Gifted trait bonus (+1 to chosen attributes)
    if (hasGifted) {
      giftedBonusAttributes.forEach((attr) => {
        const maxValue = currentOrigin?.specialMaxOverrides?.[attr] ?? 10;
        result[attr] = Math.min(result[attr] + 1, maxValue);
      });
    }

    // Apply Exercice (Intense Training) perk bonuses
    exerciseBonuses.forEach((attr) => {
      const maxValue = currentOrigin?.specialMaxOverrides?.[attr] ?? 10;
      result[attr] = Math.min(result[attr] + 1, maxValue);
    });

    return result;
  }, [baseSpecial, currentOrigin, hasGifted, giftedBonusAttributes, exerciseBonuses]);

  // Calculate SPECIAL points spent (based on baseSpecial, not including origin bonuses)
  const specialPointsSpent = useMemo(() => {
    let spent = 0;
    SPECIAL_ATTRIBUTES.forEach((attr) => {
      spent += baseSpecial[attr] - DEFAULT_SPECIAL;
    });
    return spent;
  }, [baseSpecial]);

  const specialPointsRemaining = SPECIAL_POINTS_TO_DISTRIBUTE - specialPointsSpent;

  // Get max skill rank (can be limited by origin)
  const maxSkillRank = currentOrigin?.skillMaxOverride ?? MAX_SKILL_RANK;

  // Calculate skill points
  const baseSkillPoints = calculateSkillPoints(special.intelligence, level);
  const skillPointsSpent = useMemo(() => {
    let spent = 0;
    SKILL_NAMES.forEach((skill) => {
      // Tag skills start at rank 2, so only count points above that
      const tagBonus = tagSkills.includes(skill) ? TAG_SKILL_STARTING_RANK : 0;
      spent += Math.max(0, skills[skill] - tagBonus);
    });
    return spent;
  }, [skills, tagSkills]);
  const skillPointsRemaining = baseSkillPoints - skillPointsSpent;

  // Check if character is a robot (for perk prerequisites)
  const isRobot = currentOrigin?.isRobot ?? false;

  // Perk limits: 1 perk choice per level (each rank counts as 1 choice)
  const maxPerkChoices = level;
  const currentPerkChoices = perks.reduce((sum, p) => sum + p.rank, 0);
  const canAddMorePerks = currentPerkChoices < maxPerkChoices;

  // Get available perks based on current character stats
  const availablePerks = useMemo(() => {
    if (!canAddMorePerks) return [];
    return getAvailablePerks(level, special, skills, perks, isRobot);
  }, [level, special, skills, perks, isRobot, canAddMorePerks]);

  // Get selected pack data (from API)
  const selectedPack = useMemo(() => {
    if (!selectedPackId) return null;
    return availablePacks.find((p) => p.id === selectedPackId) ?? null;
  }, [selectedPackId, availablePacks]);

  // Get tag skill equipment bonuses (from API)
  const tagSkillEquipmentBonuses = useMemo(() => {
    return tagSkills.flatMap((skill) => {
      const entries = tagSkillBonusesApi[skill];
      if (!entries || entries.length === 0) return [];
      return [{ skill, entries }];
    });
  }, [tagSkills, tagSkillBonusesApi]);

  // Check if barter is a tag skill
  const hasBarterTagSkill = tagSkills.includes('barter');

  // Auto-detect smallGuns ammo from selected pack for pre-selection
  useEffect(() => {
    if (!selectedPack) return;
    const hasSmallGuns = tagSkills.includes('smallGuns');
    if (!hasSmallGuns) return;

    // Find smallGuns weapon in the selected pack (direct or chosen)
    let detectedAmmoType: string | undefined;
    selectedPack.items.forEach((item, index) => {
      if (item.isChoice && item.options) {
        const choiceKey = `${selectedPackId}-${index}`;
        const selectedIdx = equipmentChoices[choiceKey] ?? 0;
        const opt = item.options[selectedIdx];
        if (opt?.ammoType) detectedAmmoType = opt.ammoType;
      } else if (item.ammoType && item.itemType === 'weapon') {
        detectedAmmoType = item.ammoType;
      }
    });

    if (detectedAmmoType) {
      const ammoName = AMMO_TYPE_TO_NAME[detectedAmmoType];
      if (ammoName) {
        // Find the smallGuns bonus entries and pre-select the matching ammo
        const smallGunsEntries = tagSkillBonusesApi['smallGuns'];
        if (smallGunsEntries) {
          smallGunsEntries.forEach((entry, entryIdx) => {
            if (isTagSkillChoice(entry)) {
              const matchIdx = entry.options.findIndex((opt) => opt.itemName === ammoName);
              if (matchIdx >= 0) {
                setTagSkillBonusChoices((prev) => ({
                  ...prev,
                  [`smallGuns-${entryIdx}`]: matchIdx,
                }));
              }
            }
          });
        }
      }
    }
  }, [selectedPack, selectedPackId, tagSkills, equipmentChoices, tagSkillBonusesApi]);

  // Level bonus (from API)
  const levelBonus = levelBonusApi ?? { baseCaps: 0, maxRarity: 0 };

  // Calculated derived stats (using final special with origin bonuses + perk bonuses)
  const baseMaxHp = calculateMaxHp(special.endurance, special.luck, level);
  const perkHpBonus = getPerkHPBonus(perks);
  const maxHp = baseMaxHp + perkHpBonus;

  const initiative = calculateInitiative(special.perception, special.agility);
  const defense = calculateDefense(special.agility);

  const baseMeleeDamageBonus = calculateMeleeDamageBonus(special.strength);
  const meleeDamageBonus = hasHeavyHanded ? baseMeleeDamageBonus + 1 : baseMeleeDamageBonus;

  const maxLuckPoints = calculateMaxLuckPoints(special.luck, hasGifted);

  const baseCarryCapacity = calculateCarryCapacity(special.strength, hasSmallFrame);
  const perkCarryBonus = getPerkCarryCapacityBonus(perks);
  const carryCapacity = baseCarryCapacity + perkCarryBonus;

  // DR bonuses from perks (Toughness, Refractor, Rad Resistant)
  const perkDRBonuses = getPerkDRBonuses(perks);

  // === Wizard steps configuration ===
  const wizardSteps = useMemo(() => {
    const steps: WizardStep[] = [
      {
        id: 'basic',
        labelKey: 'characters.basicInfo',
        icon: <User size={16} />,
        badge: !name.trim() ? '!' : undefined,
        badgeColor: !name.trim() ? 'warning' : 'success',
      },
    ];

    // Conditional: Survivor Traits (PC + origin survivor)
    if (type === 'PC' && origin === 'survivor') {
      steps.push({
        id: 'traits',
        labelKey: 'characters.survivorTraits',
        badge: `${survivorTraits.length}/2`,
        badgeColor: survivorTraits.length === 2 ? 'success' : survivorTraits.length > 0 ? 'default' : 'warning',
      });
    }

    steps.push(
      {
        id: 'special',
        labelKey: 'wizard.special',
        badge: specialPointsRemaining,
        badgeColor: specialPointsRemaining === 0 ? 'success' : specialPointsRemaining > 0 ? 'default' : 'error',
      },
      {
        id: 'skills',
        labelKey: 'characters.skills',
        icon: <BookOpen size={16} />,
        badge: skillPointsRemaining,
        badgeColor: skillPointsRemaining === 0 ? 'success' : skillPointsRemaining > 0 ? 'default' : 'error',
      },
      {
        id: 'perks',
        labelKey: 'characters.traitsAndAptitudes',
        badge: perks.length > 0 ? `${currentPerkChoices}/${maxPerkChoices}` : undefined,
      },
    );

    // Conditional: Equipment Pack (PC + create mode)
    if (type === 'PC' && isCreateMode) {
      steps.push({
        id: 'equipment',
        labelKey: 'equipment.title',
        icon: <Package size={16} />,
        badge: selectedPack ? '1' : undefined,
        badgeColor: selectedPack ? 'success' : 'default',
      });
    }

    steps.push({
      id: 'notes',
      labelKey: 'characters.notes',
      icon: <ScrollText size={16} />,
    });

    return steps;
  }, [name, type, origin, survivorTraits.length, specialPointsRemaining, skillPointsRemaining, perks.length, currentPerkChoices, maxPerkChoices, isCreateMode, selectedPack]);

  // Clamp currentStep when steps change
  useEffect(() => {
    if (currentStep >= wizardSteps.length) {
      setCurrentStep(wizardSteps.length - 1);
    }
  }, [wizardSteps.length, currentStep]);

  // Reset form when opening with new character
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      if (character) {
        setName(character.name);
        setType(character.type);
        setLevel(character.level);
        setOrigin(character.origin ?? 'survivor');
        setSurvivorTraits(character.survivorTraits ?? []);
        // Restore gifted and exercise bonuses from character
        const savedGiftedBonuses = character.giftedBonusAttributes ?? [];
        const savedExerciseBonuses = character.exerciseBonuses ?? [];
        setGiftedBonusAttributes(savedGiftedBonuses);
        setExerciseBonuses(savedExerciseBonuses);
        setPendingExercisePerk(null);

        // Remove all modifiers to get base special:
        const charOrigin = ORIGINS.find((o) => o.id === character.origin);
        const base: Record<SpecialAttribute, number> = {
          strength: 5,
          perception: 5,
          endurance: 5,
          charisma: 5,
          intelligence: 5,
          agility: 5,
          luck: 5,
        };
        SPECIAL_ATTRIBUTES.forEach((attr) => {
          base[attr] = character.special?.[attr] ?? 5;
          const originModifier = charOrigin?.specialModifiers?.[attr] ?? 0;
          base[attr] -= originModifier;
          const giftedCount = savedGiftedBonuses.filter((a) => a === attr).length;
          base[attr] -= giftedCount;
          const exerciseCount = savedExerciseBonuses.filter((a) => a === attr).length;
          base[attr] -= exerciseCount;
        });
        setBaseSpecial(base);
        const loadedSkills: Record<SkillName, number> = {} as Record<SkillName, number>;
        SKILL_NAMES.forEach((skill) => {
          loadedSkills[skill] = character.skills?.[skill] ?? 0;
        });
        setSkills(loadedSkills);
        setTagSkills(character.tagSkills ?? []);
        // Detect origin option tag skill (e.g. Brotherhood: which of energyWeapons/science/repair was chosen)
        const charOriginOptions = (charOrigin?.bonusTagSkillOptions ?? []) as SkillName[];
        const detectedOption = character.tagSkills?.find(s => charOriginOptions.includes(s as SkillName)) as SkillName | null;
        setOriginOptionTagSkill(detectedOption ?? null);
        setPerks(character.perks);
        setNotes(character.notes);
        setSelectedPackId(null);
        setEquipmentChoices({});
      } else {
        setName('');
        setType(defaultType);
        setLevel(1);
        setOrigin('survivor');
        setSurvivorTraits([]);
        setGiftedBonusAttributes([]);
        setExerciseBonuses([]);
        setPendingExercisePerk(null);
        setOriginOptionTagSkill(null);
        setSelectedPackId(null);
        setEquipmentChoices({});
        setTagSkillBonusChoices({});
        setBarterBonusCaps(0);
        setBaseSpecial({
          strength: 5,
          perception: 5,
          endurance: 5,
          charisma: 5,
          intelligence: 5,
          agility: 5,
          luck: 5,
        });
        const defaultSkills: Record<SkillName, number> = {} as Record<SkillName, number>;
        SKILL_NAMES.forEach((skill) => {
          defaultSkills[skill] = 0;
        });
        setSkills(defaultSkills);
        setTagSkills([]);
        setPerks([]);
        setNotes('');
      }
    }
  }, [isOpen, character, defaultType]);

  // Reset survivor traits when origin changes to non-survivor
  useEffect(() => {
    if (origin !== 'survivor') {
      setSurvivorTraits([]);
      setGiftedBonusAttributes([]);
    }
  }, [origin]);

  // Reset selected pack and choices when origin changes
  useEffect(() => {
    setSelectedPackId(null);
    setEquipmentChoices({});
  }, [origin]);

  // Auto-apply/remove origin bonus tag skills when origin changes
  useEffect(() => {
    const bonusSkills = (ORIGINS.find(o => o.id === origin)?.bonusTagSkills ?? []) as SkillName[];
    // All fixed bonus skills + all possible constrained options from all origins
    const allFixedBonus = ORIGINS.flatMap(o => (o.bonusTagSkills ?? []) as SkillName[]);
    const allOptions = ORIGINS.flatMap(o => (o.bonusTagSkillOptions ?? []) as SkillName[]);
    setOriginOptionTagSkill(null);
    setTagSkills(prev => {
      const filtered = prev.filter(s => !allFixedBonus.includes(s) && !allOptions.includes(s));
      return [...filtered, ...bonusSkills];
    });
  }, [origin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset equipment choices when pack changes
  useEffect(() => {
    setEquipmentChoices({});
  }, [selectedPackId]);

  // Reset gifted bonus attributes when Gifted trait is removed
  useEffect(() => {
    if (!hasGifted) {
      setGiftedBonusAttributes([]);
    }
  }, [hasGifted]);

  // Sync exerciseBonuses with intenseTraining perk ranks
  useEffect(() => {
    const exercisePerk = perks.find((p) => p.perkId === 'intenseTraining');
    const exerciseRanks = exercisePerk?.rank ?? 0;
    if (exerciseBonuses.length > exerciseRanks) {
      setExerciseBonuses((prev) => prev.slice(0, exerciseRanks));
    }
  }, [perks, exerciseBonuses.length]);

  // Update skills when tag skills change (set them to minimum rank 2)
  useEffect(() => {
    setSkills((prev) => {
      const updated = { ...prev };
      tagSkills.forEach((skill) => {
        if (updated[skill] < TAG_SKILL_STARTING_RANK) {
          updated[skill] = TAG_SKILL_STARTING_RANK;
        }
      });
      return updated;
    });
  }, [tagSkills]);

  // Clamp skills when maxSkillRank changes (e.g., switching to Super Mutant)
  useEffect(() => {
    setSkills((prev) => {
      const updated = { ...prev };
      let changed = false;
      SKILL_NAMES.forEach((skill) => {
        if (updated[skill] > maxSkillRank) {
          updated[skill] = maxSkillRank;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [maxSkillRank]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBaseSpecialChange = (attr: SpecialAttribute, value: number) => {
    setBaseSpecial((prev) => ({ ...prev, [attr]: value }));
  };

  const handleSkillChange = (skill: SkillName, value: number) => {
    const minValue = tagSkills.includes(skill) ? TAG_SKILL_STARTING_RANK : 0;
    const clampedValue = Math.max(minValue, Math.min(value, maxSkillRank));
    setSkills((prev) => ({ ...prev, [skill]: clampedValue }));
  };

  const handleTagSkillToggle = (skill: SkillName) => {
    // Origin bonus tag skills are locked (auto-applied by origin)
    if (originBonusTagSkills.includes(skill)) return;

    setTagSkills((prev) => {
      if (prev.includes(skill)) {
        const newTags = prev.filter((s) => s !== skill);
        if (skills[skill] === TAG_SKILL_STARTING_RANK) {
          setSkills((prevSkills) => ({ ...prevSkills, [skill]: 0 }));
        }
        return newTags;
      }
      // Count only user-selected tag skills (excluding origin bonus ones)
      const prevUserTagCount = prev.filter(s => !originBonusTagSkills.includes(s)).length;
      if (prevUserTagCount < tagSkillsCount) {
        setSkills((prevSkills) => ({
          ...prevSkills,
          [skill]: Math.max(prevSkills[skill], TAG_SKILL_STARTING_RANK),
        }));
        return [...prev, skill];
      }
      return prev;
    });
  };

  const handleGiftedBonusToggle = (attr: SpecialAttribute) => {
    setGiftedBonusAttributes((prev) => {
      if (prev.includes(attr)) {
        return prev.filter((a) => a !== attr);
      } else if (prev.length < GIFTED_BONUS_COUNT) {
        return [...prev, attr];
      }
      return prev;
    });
  };

  const handleSurvivorTraitToggle = (traitId: SurvivorTraitId) => {
    setSurvivorTraits((prev) => {
      if (prev.includes(traitId)) {
        return prev.filter((t) => t !== traitId);
      } else if (prev.length < 2) {
        return [...prev, traitId];
      }
      return prev;
    });
  };

  const handleAddPerk = (perkId: string, rank: number) => {
    if (perkId === 'intenseTraining') {
      setPendingExercisePerk(rank);
      setShowPerkSelector(false);
      return;
    }

    if (perkId === 'tag') {
      setPendingTagPerk(true);
      setShowPerkSelector(false);
      return;
    }

    setPerks((prev) => {
      const existingIndex = prev.findIndex((p) => p.perkId === perkId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { perkId, rank };
        return updated;
      }
      return [...prev, { perkId, rank }];
    });
    setShowPerkSelector(false);
  };

  const handleConfirmExercise = (attr: SpecialAttribute) => {
    if (pendingExercisePerk === null) return;

    setExerciseBonuses((prev) => [...prev, attr]);

    setPerks((prev) => {
      const existingIndex = prev.findIndex((p) => p.perkId === 'intenseTraining');
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { perkId: 'intenseTraining', rank: pendingExercisePerk };
        return updated;
      }
      return [...prev, { perkId: 'intenseTraining', rank: pendingExercisePerk }];
    });

    setPendingExercisePerk(null);
  };

  const handleCancelExercise = () => {
    setPendingExercisePerk(null);
  };

  const handleConfirmTag = (skill: SkillName) => {
    setTagPerkSkill(skill);
    setTagSkills((prev) => [...prev, skill]);
    setSkills((prev) => ({ ...prev, [skill]: Math.max(prev[skill], TAG_SKILL_STARTING_RANK) }));
    setPerks((prev) => {
      if (prev.some((p) => p.perkId === 'tag')) return prev;
      return [...prev, { perkId: 'tag', rank: 1 }];
    });
    setPendingTagPerk(false);
  };

  const handleCancelTag = () => {
    setPendingTagPerk(false);
  };

  const handleOriginOptionSelect = (skill: SkillName) => {
    const prev = originOptionTagSkill;
    if (prev === skill) {
      // Deselect
      setOriginOptionTagSkill(null);
      setTagSkills(tags => tags.filter(s => s !== skill));
      setSkills(prevSkills => ({
        ...prevSkills,
        [skill]: prevSkills[skill] === TAG_SKILL_STARTING_RANK ? 0 : prevSkills[skill],
      }));
    } else {
      // Select (replacing previous option if any)
      setOriginOptionTagSkill(skill);
      setTagSkills(tags => {
        const withoutPrev = prev ? tags.filter(s => s !== prev) : tags;
        return withoutPrev.includes(skill) ? withoutPrev : [...withoutPrev, skill];
      });
      setSkills(prevSkills => {
        const updated = { ...prevSkills, [skill]: Math.max(prevSkills[skill], TAG_SKILL_STARTING_RANK) };
        if (prev && prevSkills[prev] === TAG_SKILL_STARTING_RANK) updated[prev] = 0;
        return updated;
      });
    }
  };

  const handleRemovePerk = (perkId: string) => {
    if (perkId === 'intenseTraining') {
      setExerciseBonuses([]);
    }
    if (perkId === 'tag' && tagPerkSkill) {
      setTagSkills((prev) => prev.filter((s) => s !== tagPerkSkill));
      setSkills((prev) => ({
        ...prev,
        [tagPerkSkill]: prev[tagPerkSkill] === TAG_SKILL_STARTING_RANK ? 0 : prev[tagPerkSkill],
      }));
      setTagPerkSkill(null);
    }
    setPerks((prev) => prev.filter((p) => p.perkId !== perkId));
  };

  const handleSubmit = () => {
    // Build inventory from selected pack + choices + tag skill bonuses
    const inventory: { itemId: number; quantity: number; equipped: boolean }[] = [];

    // Add items from selected equipment pack
    if (selectedPack && !character) {
      selectedPack.items.forEach((item, index) => {
        const choiceKey = `${selectedPackId}-${index}`;

        if (item.isChoice && item.options) {
          const selectedOptionIndex = equipmentChoices[choiceKey] ?? 0;
          const selectedOption = item.options[selectedOptionIndex];
          if (selectedOption?.itemId) {
            inventory.push({
              itemId: selectedOption.itemId,
              quantity: selectedOption.quantity ?? 1,
              equipped: false,
            });
          }
        } else if (item.itemId) {
          inventory.push({
            itemId: item.itemId,
            quantity: item.quantity ?? 1,
            equipped: false,
          });
        }
      });

      tagSkillEquipmentBonuses.forEach(({ skill, entries }) => {
        entries.forEach((entry, entryIdx) => {
          if (isTagSkillChoice(entry)) {
            const choiceKey = `${skill}-${entryIdx}`;
            const selectedIdx = tagSkillBonusChoices[choiceKey] ?? 0;
            const selectedOption = entry.options[selectedIdx];
            if (selectedOption?.itemId) {
              inventory.push({
                itemId: selectedOption.itemId,
                quantity: selectedOption.quantity ?? 1,
                equipped: false,
              });
            }
          } else if (entry.itemId) {
            inventory.push({
              itemId: entry.itemId,
              quantity: entry.quantity ?? 1,
              equipped: false,
            });
          }
        });
      });
    }

    const startingCaps = !character
      ? (levelBonus.baseCaps ?? 0) + (hasBarterTagSkill ? barterBonusCaps : 0)
      : (character.caps ?? 0);

    const characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim() || t('characters.unnamed'),
      type,
      level,
      origin: type === 'PC' ? origin : undefined,
      survivorTraits: origin === 'survivor' ? survivorTraits : [],
      giftedBonusAttributes: hasGifted ? giftedBonusAttributes : [],
      exerciseBonuses,
      special,
      skills,
      tagSkills,
      maxHp,
      currentHp: character ? Math.min(character.currentHp, maxHp) : maxHp,
      defense,
      initiative,
      meleeDamageBonus,
      maxLuckPoints,
      currentLuckPoints: character
        ? Math.min(character.currentLuckPoints, maxLuckPoints)
        : maxLuckPoints,
      carryCapacity,
      equippedWeapons: character?.equippedWeapons ?? [],
      equippedArmor: character?.equippedArmor ?? {},
      equippedClothing: character?.equippedClothing ?? [],
      perks,
      notes,
      inventory: isEditMode ? character?.inventory : inventory,
      caps: startingCaps,
    };

    onSave(characterData);
    onClose();
  };

  // === Build step content ===
  const buildStepContent = () => {
    const panels: React.ReactNode[] = [];

    // Step: Basic Info
    panels.push(
      <div key="basic" className="space-y-4">
        <StepValidation
          warnings={!name.trim() ? [t('characters.validation.nameRequired')] : []}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {t('characters.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('characters.namePlaceholder')}
              className="w-full px-3 py-3 bg-gray-800 border border-vault-yellow-dark rounded text-white text-base"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {t('characters.type')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'PC' | 'NPC')}
              className="w-full px-3 py-3 bg-gray-800 border border-vault-yellow-dark rounded text-white text-base"
            >
              <option value="PC">{t('characters.pc')}</option>
              <option value="NPC">{t('characters.npc')}</option>
            </select>
          </div>

          {type === 'PC' && (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">
                {t('characters.origin')}
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as OriginId)}
                className="w-full px-3 py-3 bg-gray-800 border border-vault-yellow-dark rounded text-white text-base"
              >
                {ORIGINS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {t(o.nameKey)}
                  </option>
                ))}
              </select>
              {currentOrigin && (
                <p className="text-xs text-gray-500 mt-1">
                  {t(currentOrigin.trait.nameKey)}: {t(currentOrigin.trait.descriptionKey)}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {t('characters.level')}
            </label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={50}
              className="w-full px-3 py-3 bg-gray-800 border border-vault-yellow-dark rounded text-white text-base"
            />
          </div>
        </div>
      </div>
    );

    // Step: Survivor Traits (conditional)
    if (type === 'PC' && origin === 'survivor') {
      panels.push(
        <div key="traits" className="space-y-4">
          <StepValidation
            warnings={survivorTraits.length < 2 ? [t('characters.validation.traitsRemaining', { count: 2 - survivorTraits.length })] : []}
          />
          <p className="text-xs text-gray-400">{t('characters.survivorTraitsDesc')}</p>
          <div className="grid grid-cols-1 gap-3">
            {SURVIVOR_TRAITS.map((trait) => (
              <label
                key={trait.id}
                className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors min-h-[44px] ${
                  survivorTraits.includes(trait.id)
                    ? 'border-vault-yellow bg-vault-blue'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={survivorTraits.includes(trait.id)}
                  onChange={() => handleSurvivorTraitToggle(trait.id)}
                  disabled={!survivorTraits.includes(trait.id) && survivorTraits.length >= 2}
                  className="mt-1 w-5 h-5"
                />
                <div className="flex-1">
                  <span className="text-vault-yellow font-bold">{t(trait.nameKey)}</span>
                  <p className="text-xs text-green-400 mt-1">+ {t(trait.benefitKey)}</p>
                  <p className="text-xs text-red-400">- {t(trait.drawbackKey)}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }

    // Step: SPECIAL
    panels.push(
      <div key="special" className="space-y-4">
        <p className="text-xs text-gray-400">{t('characters.specialDesc')}</p>

        <div className="text-sm font-mono text-center mb-2">
          <span className={specialPointsRemaining === 0 ? 'text-green-400' : specialPointsRemaining > 0 ? 'text-vault-yellow' : 'text-red-400'}>
            {t('characters.pointsRemaining')}: {specialPointsRemaining}
          </span>
        </div>

        <StepValidation
          warnings={specialPointsRemaining > 0 ? [`${specialPointsRemaining} ${t('characters.validation.specialRemaining')}`] : []}
          errors={specialPointsRemaining < 0 ? [`${Math.abs(specialPointsRemaining)} ${t('characters.validation.specialOver')}`] : []}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SPECIAL_ATTRIBUTES.map((attr) => {
            const originModifier = currentOrigin?.specialModifiers?.[attr] ?? 0;
            const giftedBonus = hasGifted && giftedBonusAttributes.includes(attr) ? 1 : 0;
            const exerciseBonus = exerciseBonuses.filter((a) => a === attr).length;
            const totalBonus = originModifier + giftedBonus + exerciseBonus;
            const maxValue = currentOrigin?.specialMaxOverrides?.[attr] ?? 10;
            const maxBase = maxValue - totalBonus;
            const finalValue = special[attr];
            const hasGiftedBonus = giftedBonusAttributes.includes(attr);
            const hasExerciseBonus = exerciseBonus > 0;
            const canAddGiftedBonus = hasGifted && !hasGiftedBonus && giftedBonusAttributes.length < GIFTED_BONUS_COUNT && finalValue < maxValue;

            return (
              <div key={attr} className="flex items-center gap-2">
                <SpecialInput
                  label={t(`special.${attr}`)}
                  value={baseSpecial[attr]}
                  onChange={(value) => handleBaseSpecialChange(attr, value)}
                  min={4}
                  max={Math.min(10, maxBase)}
                  color={SPECIAL_COLORS[attr]}
                />
                {hasGifted && (
                  <button
                    type="button"
                    onClick={() => handleGiftedBonusToggle(attr)}
                    disabled={!hasGiftedBonus && !canAddGiftedBonus}
                    className={`p-2 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      hasGiftedBonus
                        ? 'text-green-400'
                        : canAddGiftedBonus
                        ? 'text-gray-500 hover:text-green-300'
                        : 'text-gray-700 cursor-not-allowed'
                    }`}
                    title={hasGiftedBonus ? t('characters.removeGiftedBonus') : t('characters.addGiftedBonus')}
                  >
                    <Sparkles size={16} fill={hasGiftedBonus ? 'currentColor' : 'none'} />
                  </button>
                )}
                {hasExerciseBonus && (
                  <span
                    className="p-1 text-blue-400"
                    title={t('characters.exerciseBonus', { count: exerciseBonus })}
                  >
                    <Dumbbell size={16} />
                  </span>
                )}
                {totalBonus > 0 && (
                  <span className="text-xs text-green-400 whitespace-nowrap">
                    +{totalBonus} = <span className="font-bold">{finalValue}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {hasGifted && (
          <div className="p-2 bg-vault-blue rounded border border-green-600">
            <p className="text-xs text-green-400">
              <Sparkles size={12} className="inline mr-1" />
              {t('characters.giftedBonusDesc', { count: giftedBonusAttributes.length, max: GIFTED_BONUS_COUNT })}
            </p>
          </div>
        )}

        {/* Derived Stats */}
        <div className="pt-4 border-t border-vault-yellow-dark">
          <h4 className="text-vault-yellow font-bold text-sm uppercase mb-3">
            {t('characters.derivedStats')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">{t('characters.hp')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">{maxHp}</span>
              {perkHpBonus > 0 && (
                <span className="text-xs text-green-400 ml-1">(+{perkHpBonus})</span>
              )}
            </div>
            <div>
              <span className="text-gray-400">{t('characters.defense')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">{defense}</span>
            </div>
            <div>
              <span className="text-gray-400">{t('characters.initiative')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">{initiative}</span>
            </div>
            <div>
              <span className="text-gray-400">{t('characters.meleeDamageBonus')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">+{meleeDamageBonus} CD</span>
              {hasHeavyHanded && <span className="text-xs text-green-400 ml-1">(+1)</span>}
            </div>
            <div>
              <span className="text-gray-400">{t('characters.luckPoints')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">{maxLuckPoints}</span>
              {hasGifted && <span className="text-xs text-red-400 ml-1">(-1)</span>}
            </div>
            <div>
              <span className="text-gray-400">{t('characters.carryCapacity')}:</span>
              <span className="ml-2 text-vault-yellow font-bold">{carryCapacity} {t('common.labels.lbs')}</span>
              {hasSmallFrame && <span className="text-xs text-red-400 ml-1">(x0.5)</span>}
              {perkCarryBonus > 0 && (
                <span className="text-xs text-green-400 ml-1">(+{perkCarryBonus})</span>
              )}
            </div>
          </div>

          {(perkDRBonuses.physical > 0 || perkDRBonuses.energy > 0 || perkDRBonuses.radiation > 0) && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <span className="text-gray-400 text-sm">{t('characters.drFromPerks')}:</span>
              <div className="flex flex-wrap gap-3 mt-1">
                {perkDRBonuses.physical > 0 && (
                  <span className="text-sm">
                    <span className="text-gray-500">Physical:</span>
                    <span className="text-green-400 font-bold ml-1">+{perkDRBonuses.physical}</span>
                  </span>
                )}
                {perkDRBonuses.energy > 0 && (
                  <span className="text-sm">
                    <span className="text-gray-500">Energy:</span>
                    <span className="text-blue-400 font-bold ml-1">+{perkDRBonuses.energy}</span>
                  </span>
                )}
                {perkDRBonuses.radiation > 0 && (
                  <span className="text-sm">
                    <span className="text-gray-500">Radiation:</span>
                    <span className="text-yellow-400 font-bold ml-1">+{perkDRBonuses.radiation}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    // Step: Skills
    panels.push(
      <div key="skills" className="space-y-4">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-gray-400">
            <Star size={12} className="inline text-vault-yellow mr-1" />
            {t('characters.tagSkills')}: {userTagSkills.length}/{tagSkillsCount}
            {originBonusTagSkills.length > 0 && <span className="text-xs text-vault-yellow-dark ml-1">(+{originBonusTagSkills.length} <Lock size={10} className="inline" />)</span>}
            {originBonusTagSlots > 0 && <span className="text-xs text-vault-yellow ml-1">(+{originBonusTagSlots} {t('characters.originBonus')})</span>}
            {hasEducated && <span className="text-xs text-green-400 ml-1">(+1 Educated)</span>}
            {hasTagPerk && <span className="text-xs text-vault-yellow ml-1">(+1 Tag!)</span>}
          </span>
          <span className={`text-sm font-mono ${skillPointsRemaining === 0 ? 'text-green-400' : skillPointsRemaining > 0 ? 'text-vault-yellow' : 'text-red-400'}`}>
            {t('characters.skillPointsRemaining')}: {skillPointsRemaining}
          </span>
        </div>

        <StepValidation
          warnings={[
            ...(skillPointsRemaining > 0 ? [`${skillPointsRemaining} ${t('characters.validation.skillsRemaining')}`] : []),
            ...(userTagSkills.length < tagSkillsCount ? [t('characters.validation.tagSkillsRemaining', { count: tagSkillsCount - userTagSkills.length })] : []),
            ...(type === 'PC' && currentOrigin?.bonusTagSkillOptions && !originOptionTagSkill
              ? [t('characters.validation.originBonusSkillRequired')]
              : []),
          ]}
          errors={skillPointsRemaining < 0 ? [`${Math.abs(skillPointsRemaining)} ${t('characters.validation.skillsOver')}`] : []}
        />

        {/* Origin constrained bonus tag skill selector (e.g. Brotherhood) */}
        {type === 'PC' && currentOrigin?.bonusTagSkillOptions && (
          <div className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
            <p className="text-xs text-gray-300 mb-2">
              <Lock size={11} className="inline mr-1 text-vault-yellow" />
              {t('characters.originBonusSkillChoice')}
            </p>
            <div className="flex gap-2 flex-wrap">
              {currentOrigin.bonusTagSkillOptions.map(skill => {
                const isSelected = originOptionTagSkill === skill;
                const isAlreadyRegularTag = userTagSkills.includes(skill as SkillName);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => !isAlreadyRegularTag && handleOriginOptionSelect(skill as SkillName)}
                    disabled={isAlreadyRegularTag}
                    className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                      isSelected
                        ? 'bg-vault-yellow text-vault-blue font-bold border-vault-yellow'
                        : isAlreadyRegularTag
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-vault-yellow-dark text-vault-yellow hover:border-vault-yellow'
                    }`}
                    title={isAlreadyRegularTag ? t('characters.alreadyRegularTag') : undefined}
                  >
                    {t(`skills.${skill}`)}
                    {isSelected && <Check size={12} className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">
          {t('characters.skillsDesc', { points: baseSkillPoints, maxRank: maxSkillRank })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[...SKILL_NAMES]
            .map((skill) => ({
              skill,
              linkedAttr: SKILL_ATTRIBUTES[skill],
              currentRank: skills[skill],
              isTag: tagSkills.includes(skill),
              tn: special[SKILL_ATTRIBUTES[skill]] + skills[skill],
            }))
            .sort((a, b) => {
              // Tag skills first, then by TN descending
              if (a.isTag !== b.isTag) return a.isTag ? -1 : 1;
              return b.tn - a.tn;
            })
            .map(({ skill, linkedAttr, currentRank, isTag, tn }) => {
            const isOriginBonus = originBonusTagSkills.includes(skill);
            const canAddTag = userTagSkills.length < tagSkillsCount;

            return (
              <div
                key={skill}
                className={`flex items-center gap-2 p-2 rounded ${
                  isTag ? 'bg-vault-blue border border-vault-yellow-dark' : 'bg-gray-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleTagSkillToggle(skill)}
                  disabled={isOriginBonus || (!isTag && !canAddTag)}
                  className={`p-2 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    isOriginBonus
                      ? 'text-vault-yellow opacity-60 cursor-not-allowed'
                      : isTag
                      ? 'text-vault-yellow'
                      : canAddTag
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-700 cursor-not-allowed'
                  }`}
                  title={isOriginBonus ? t('characters.originBonusTag') : isTag ? t('characters.removeTag') : t('characters.addTag')}
                >
                  {isOriginBonus
                    ? <Lock size={16} />
                    : <Star size={16} fill={isTag ? 'currentColor' : 'none'} />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <span className={`text-sm block truncate ${isTag ? 'text-vault-yellow font-bold' : 'text-white'}`}>
                    {t(`skills.${skill}`)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t(`special.${linkedAttr}`).substring(0, 3).toUpperCase()} | TN: {tn}
                  </span>
                </div>

                <select
                  value={currentRank}
                  onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                  className="w-14 px-1 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm text-center min-h-[44px]"
                >
                  {Array.from({ length: maxSkillRank + 1 }, (_, i) => i)
                    .filter((rank) => !isTag || rank >= TAG_SKILL_STARTING_RANK)
                    .map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    );

    // Step: Traits & Aptitudes (Perks)
    panels.push(
      <div key="perks" className="space-y-4">
        {/* Active Origin Trait */}
        {type === 'PC' && currentOrigin && (
          <div>
            <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
              {t('characters.originTrait')}
            </h4>
            <div className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
              <span className="text-vault-yellow font-bold">{t(currentOrigin.trait.nameKey)}</span>
              <p className="text-xs text-gray-300 mt-1">{t(currentOrigin.trait.descriptionKey)}</p>
            </div>
          </div>
        )}

        {/* Active Survivor Traits */}
        {type === 'PC' && origin === 'survivor' && survivorTraits.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
              {t('characters.activeSurvivorTraits')}
            </h4>
            <div className="space-y-2">
              {survivorTraits.map((traitId) => {
                const trait = SURVIVOR_TRAITS.find((t) => t.id === traitId);
                if (!trait) return null;
                return (
                  <div key={traitId} className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
                    <span className="text-vault-yellow font-bold">{t(trait.nameKey)}</span>
                    <p className="text-xs text-green-400 mt-1">+ {t(trait.benefitKey)}</p>
                    <p className="text-xs text-red-400">- {t(trait.drawbackKey)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Perks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400 uppercase tracking-wide">
              {t('characters.perks')}
            </h4>
            <span className={`text-sm font-mono ${
              currentPerkChoices === maxPerkChoices
                ? 'text-green-400'
                : 'text-vault-yellow'
            }`}>
              {currentPerkChoices}/{maxPerkChoices}
            </span>
          </div>

          {perks.length > 0 && (
            <div className="space-y-2 mb-3">
              {perks.map((perkData) => {
                const perk = PERKS.find((p) => p.id === perkData.perkId);
                if (!perk) return null;
                const isExercise = perkData.perkId === 'intenseTraining';
                const effect = PERK_EFFECTS[perkData.perkId];

                const bonusTags: { label: string; color: string }[] = [];
                if (effect?.perRank) {
                  const rank = perkData.rank;
                  if (effect.perRank.hp) bonusTags.push({ label: `+${effect.perRank.hp * rank} HP`, color: 'bg-red-900 text-red-300' });
                  if (effect.perRank.drPhysical) bonusTags.push({ label: `+${effect.perRank.drPhysical * rank} DR Phys`, color: 'bg-orange-900 text-orange-300' });
                  if (effect.perRank.drEnergy) bonusTags.push({ label: `+${effect.perRank.drEnergy * rank} DR Energy`, color: 'bg-blue-900 text-blue-300' });
                  if (effect.perRank.drRadiation) bonusTags.push({ label: `+${effect.perRank.drRadiation * rank} DR Rad`, color: 'bg-yellow-900 text-yellow-300' });
                  if (effect.perRank.carryCapacity) bonusTags.push({ label: `+${effect.perRank.carryCapacity * rank} Carry`, color: 'bg-purple-900 text-purple-300' });
                }

                return (
                  <div
                    key={perkData.perkId}
                    className="flex items-center justify-between p-2 bg-vault-blue rounded border border-vault-yellow-dark"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-vault-yellow font-bold text-sm">
                        {t(perk.nameKey)}
                        {perk.maxRanks > 1 && (
                          <span className="ml-1 text-gray-400">
                            ({t('characters.rank')} {perkData.rank}/{perk.maxRanks})
                          </span>
                        )}
                      </span>
                      {isExercise && exerciseBonuses.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exerciseBonuses.map((attr, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-1.5 py-0.5 bg-green-900 text-green-300 rounded"
                            >
                              {t(`special.${attr}`)} +1
                            </span>
                          ))}
                        </div>
                      )}
                      {bonusTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {bonusTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-1.5 py-0.5 rounded ${tag.color}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {!isExercise && bonusTags.length === 0 && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {t(perk.effectKey)}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePerk(perkData.perkId)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {perks.length === 0 && (
            <p className="text-xs text-gray-500 italic mb-3">{t('characters.noPerks')}</p>
          )}

          {!showPerkSelector ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowPerkSelector(true)}
              className="w-full min-h-[44px]"
              disabled={!canAddMorePerks}
            >
              <Plus size={16} className="mr-1" />
              {canAddMorePerks
                ? t('characters.addPerk')
                : t('characters.maxPerksReached')
              }
            </Button>
          ) : (
            <div className="border border-vault-yellow-dark rounded bg-gray-800 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-vault-yellow font-bold">
                  {t('characters.selectPerk')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPerkSelector(false)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X size={16} />
                </button>
              </div>

              {availablePerks.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[...availablePerks]
                    .sort((a, b) => {
                      const levelA = getRequiredLevelForRank(a.perk, a.availableRank);
                      const levelB = getRequiredLevelForRank(b.perk, b.availableRank);
                      if (levelA !== levelB) return levelA - levelB;
                      return a.perk.id.localeCompare(b.perk.id);
                    })
                    .map(({ perk, availableRank }) => {
                    const prereqs = perk.prerequisites;
                    const requiredLevel = getRequiredLevelForRank(perk, availableRank);

                    return (
                      <button
                        key={`${perk.id}-${availableRank}`}
                        type="button"
                        onClick={() => handleAddPerk(perk.id, availableRank)}
                        className="w-full text-left p-3 rounded border border-gray-600 hover:border-vault-yellow hover:bg-vault-blue transition-colors min-h-[44px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-vault-yellow font-bold text-sm">
                            {t(perk.nameKey)}
                            {perk.maxRanks > 1 && (
                              <span className="ml-1 text-gray-400 font-normal">
                                ({t('characters.rank')} {availableRank})
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {t(perk.effectKey)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {requiredLevel > 1 && (
                            <span className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                              {t('characters.levelShort')} {requiredLevel}+
                            </span>
                          )}
                          {prereqs.special && Object.entries(prereqs.special).map(([attr, val]) => (
                            <span key={attr} className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                              {t(`special.${attr}`).substring(0, 3).toUpperCase()} {val}+
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {t('characters.noAvailablePerks')}
                </p>
              )}
            </div>
          )}

          {/* Tag! perk skill selector */}
          {pendingTagPerk && (
            <div className="mt-3 border border-vault-yellow-dark rounded bg-gray-800 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-vault-yellow font-bold">
                  {t('characters.selectTagSkill')}
                </span>
                <button
                  type="button"
                  onClick={handleCancelTag}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {t('characters.tagPerkDesc')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_NAMES.filter((skill) => !tagSkills.includes(skill)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleConfirmTag(skill)}
                    className="p-2 rounded border border-gray-600 hover:border-vault-yellow hover:bg-vault-blue text-left transition-colors min-h-[44px]"
                  >
                    <span className="text-vault-yellow font-bold text-sm">
                      {t(`skills.${skill}`)}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {skills[skill]} → {Math.max(skills[skill], TAG_SKILL_STARTING_RANK)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exercice (Intense Training) attribute selector */}
          {pendingExercisePerk !== null && (
            <div className="mt-3 border border-green-600 rounded bg-gray-800 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-green-400 font-bold">
                  {t('characters.selectExerciseAttribute')}
                </span>
                <button
                  type="button"
                  onClick={handleCancelExercise}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {t('characters.exerciseDesc')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SPECIAL_ATTRIBUTES.map((attr) => {
                  const currentValue = special[attr];
                  const maxValue = currentOrigin?.specialMaxOverrides?.[attr] ?? 10;
                  const canIncrease = currentValue < maxValue;

                  return (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => handleConfirmExercise(attr)}
                      disabled={!canIncrease}
                      className={`p-3 rounded border text-left transition-colors min-h-[44px] ${
                        canIncrease
                          ? 'border-gray-600 hover:border-green-500 hover:bg-vault-blue'
                          : 'border-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold text-sm" style={{ color: SPECIAL_COLORS[attr] }}>
                        {t(`special.${attr}`)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {currentValue} → {canIncrease ? currentValue + 1 : `max ${maxValue}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    // Step: Equipment Pack (conditional: PC + create mode)
    if (type === 'PC' && isCreateMode) {
      panels.push(
        <div key="equipment" className="space-y-4">
          {/* Pack selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t('equipment.selectPack')}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {availablePacks.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPackId(pack.id === selectedPackId ? null : pack.id)}
                  className={`text-left p-4 rounded border transition-colors min-h-[44px] ${
                    selectedPackId === pack.id
                      ? 'border-vault-yellow bg-vault-blue'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package size={16} className={selectedPackId === pack.id ? 'text-vault-yellow' : 'text-gray-400'} />
                    <span className={`font-bold ${selectedPackId === pack.id ? 'text-vault-yellow' : 'text-white'}`}>
                      {t(pack.nameKey)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-6">
                    {t(pack.descriptionKey)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Pack contents */}
          {selectedPack && (
            <div>
              <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                {t('equipment.packContents')}
              </h4>
              <div className="bg-gray-800 rounded border border-gray-700 p-3 space-y-2">
                {selectedPack.items.map((entry, index) => (
                  <EquipmentEntryDisplay
                    key={index}
                    entry={entry}
                    t={t}
                    choiceKey={`${selectedPackId}-${index}`}
                    selectedChoice={equipmentChoices[`${selectedPackId}-${index}`]}
                    onChoiceSelect={(optIndex) =>
                      setEquipmentChoices((prev) => ({
                        ...prev,
                        [`${selectedPackId}-${index}`]: optIndex,
                      }))
                    }
                    onItemClick={(itemId, itemType) => {
                      setSelectedItemDetail({ id: itemId, itemType });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tag skill bonuses */}
          {(tagSkillEquipmentBonuses.length > 0 || hasBarterTagSkill) && (
            <div>
              <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                {t('equipment.tagSkillBonus')}
              </h4>
              <div className="bg-gray-800 rounded border border-gray-700 p-3">
                {tagSkillEquipmentBonuses.map(({ skill, entries }) => (
                  <div key={skill} className="mb-3 last:mb-0">
                    <span className="text-vault-yellow text-sm font-bold">
                      {t(`skills.${skill}`)}:
                    </span>
                    <div className="ml-4 mt-1 space-y-2">
                      {entries.map((entry, entryIdx) => (
                        <TagSkillBonusEntryDisplay
                          key={entryIdx}
                          entry={entry}
                          skill={skill}
                          entryIndex={entryIdx}
                          t={t}
                          selectedChoice={tagSkillBonusChoices[`${skill}-${entryIdx}`]}
                          onChoiceSelect={(optIndex) =>
                            setTagSkillBonusChoices((prev) => ({
                              ...prev,
                              [`${skill}-${entryIdx}`]: optIndex,
                            }))
                          }
                          onItemClick={(itemId, itemType) => {
                            setSelectedItemDetail({ id: itemId, itemType });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Barter: 2d20 caps */}
                {hasBarterTagSkill && (
                  <div className="mb-3 last:mb-0">
                    <span className="text-vault-yellow text-sm font-bold">
                      {t(`skills.barter`)}:
                    </span>
                    <div className="ml-4 mt-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const roll1 = Math.floor(Math.random() * 20) + 1;
                            const roll2 = Math.floor(Math.random() * 20) + 1;
                            setBarterBonusCaps(roll1 + roll2);
                          }}
                          className="px-3 py-2 bg-vault-blue border border-vault-yellow-dark rounded text-vault-yellow text-sm hover:bg-vault-yellow hover:text-vault-gray transition-colors min-h-[44px]"
                        >
                          {t('equipment.roll2d20')}
                        </button>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={barterBonusCaps}
                            onChange={(e) => setBarterBonusCaps(Math.max(0, parseInt(e.target.value) || 0))}
                            min={0}
                            max={40}
                            className="w-20 px-2 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm text-center min-h-[44px]"
                          />
                          <span className="text-gray-400 text-sm">caps</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('equipment.barterBonusDesc')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level bonus caps */}
          {levelBonus.baseCaps > 0 && (
            <div className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
              <span className="text-vault-yellow font-bold text-sm">
                {t('equipment.levelBonusCaps', { level })}:
              </span>
              <span className="ml-2 text-white">{levelBonus.baseCaps} caps</span>
              <p className="text-xs text-gray-400 mt-1">
                {t('common.rarity.' + levelBonus.maxRarity)} max
              </p>
            </div>
          )}
        </div>
      );
    }

    // Step: Notes (always last)
    panels.push(
      <div key="notes" className="space-y-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('characters.notesPlaceholder')}
          rows={8}
          className="w-full px-3 py-3 bg-gray-800 border border-vault-yellow-dark rounded text-white resize-none text-base"
        />
      </div>
    );

    return panels;
  };

  if (!isOpen) return null;

  const stepContent = buildStepContent();

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay — visible on md+ */}
      <div className="hidden md:block absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Container: fullscreen on mobile, centered modal on desktop */}
      <div
        className="relative md:absolute md:inset-0 md:flex md:items-center md:justify-center md:p-4 h-full"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-vault-gray h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:w-full md:rounded-lg md:border-2 md:border-vault-yellow md:shadow-xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — title + SPECIAL + close, one line */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-vault-yellow-dark/50 flex-shrink-0">
            <h2 className="text-base font-bold text-vault-yellow whitespace-nowrap">
              {character ? t('characters.editCharacter') : t('characters.createCharacter')}
            </h2>

            {/* SPECIAL pills */}
            <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
              {SPECIAL_ATTRIBUTES.map((attr) => (
                <span
                  key={attr}
                  className="inline-flex flex-col items-center min-w-[24px]"
                  title={t(`special.${attr}`)}
                >
                  <span className="text-[9px] text-gray-500 font-bold leading-none">{SPECIAL_SHORT[attr]}</span>
                  <span className="text-xs font-bold font-mono text-vault-yellow leading-tight">{special[attr]}</span>
                </span>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-vault-yellow-dark hover:text-vault-yellow transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            steps={wizardSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          {/* Wizard Content */}
          <StepWizard
            steps={wizardSteps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            footer={
              <div className="flex justify-end gap-3 px-4 py-3 border-t border-vault-yellow-dark/50 flex-shrink-0">
                <Button type="button" variant="secondary" onClick={onClose} className="min-h-[44px]">
                  {t('common.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="min-h-[44px]"
                >
                  {character ? t('common.save') : t('common.create')}
                </Button>
              </div>
            }
          >
            {stepContent}
          </StepWizard>

          {/* Item Detail Modal */}
          <ItemDetailModal
            isOpen={!!selectedItemDetail}
            onClose={() => setSelectedItemDetail(null)}
            itemId={selectedItemDetail?.id ?? null}
            itemType={selectedItemDetail?.itemType ?? null}
          />
        </div>
      </div>
    </div>
  );
}

// Helper component to display equipment entries from API
interface EquipmentEntryDisplayProps {
  entry: EquipmentPackItemApi;
  t: (key: string, options?: Record<string, unknown>) => string;
  choiceKey?: string;
  selectedChoice?: number;
  onChoiceSelect?: (optionIndex: number) => void;
  onItemClick?: (itemId: number, itemType: ItemType) => void;
}

// Helper to render an item option from API
interface ItemOptionApi {
  itemId?: number;
  itemName?: string;
  itemType?: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
  location?: string;
}

function EquipmentEntryDisplay({
  entry,
  t,
  choiceKey,
  selectedChoice,
  onChoiceSelect,
  onItemClick,
}: EquipmentEntryDisplayProps) {
  const translateItemName = (name?: string, nameKey?: string, itemType?: ItemType) => {
    if (nameKey) {
      const translated = t(nameKey);
      if (translated !== nameKey) return translated;
    }
    if (name) {
      const categoryKey = getCategoryKeyFromItemType(itemType);
      if (categoryKey) {
        const itemKey = `items.${categoryKey}.${name}`;
        const itemTranslated = t(itemKey);
        if (itemTranslated !== itemKey) return itemTranslated;
      }
    }
    return name ?? 'Unknown Item';
  };

  const formatQuantity = (item: ItemOptionApi) => {
    const qty = item.quantity ?? 1;
    const cd = item.quantityCD ?? 0;

    if (cd > 0 && qty > 0) {
      return t('equipment.quantityWithCD', { base: qty, cd });
    } else if (cd > 0) {
      return `${cd} CD`;
    } else if (qty > 1) {
      return t('equipment.quantity', { count: qty });
    }
    return '';
  };

  const renderItemName = (item: ItemOptionApi, isSelected?: boolean) => {
    const hasDetailData = item.itemId !== undefined && item.itemType !== undefined;
    const qty = formatQuantity(item);
    const locationNote = item.location === 'choice' ? ` (${t('equipment.chooseLocation')})` : '';

    return (
      <span className="inline-flex items-center gap-1">
        {isSelected !== undefined && (
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? 'border-vault-yellow bg-vault-yellow'
                : 'border-gray-500'
            }`}
          >
            {isSelected && <Check size={10} className="text-vault-gray" />}
          </span>
        )}
        {hasDetailData ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.(item.itemId!, item.itemType!);
            }}
            className="text-vault-yellow hover:text-yellow-300 hover:underline text-left"
          >
            {translateItemName(item.itemName, item.itemNameKey, item.itemType)}
          </button>
        ) : (
          <span className="text-white">{translateItemName(item.itemName, item.itemNameKey, item.itemType)}</span>
        )}
        {qty && <span className="text-gray-500">({qty})</span>}
        {locationNote && <span className="text-gray-500 text-xs">{locationNote}</span>}
      </span>
    );
  };

  if (entry.isChoice && entry.options) {
    return (
      <div className="text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {entry.options.map((opt, idx) => {
            const isSelected = selectedChoice === idx;
            return (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-gray-500 text-xs italic">{t('equipment.orChoice')}</span>
                )}
                <button
                  type="button"
                  onClick={() => onChoiceSelect?.(idx)}
                  className={`px-3 py-2 rounded border text-left transition-colors min-h-[44px] ${
                    isSelected
                      ? 'border-vault-yellow bg-vault-blue'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {renderItemName(opt, isSelected)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm flex items-center gap-1">
      <span className="text-gray-600">•</span>
      {renderItemName(entry)}
    </div>
  );
}

// Helper component for tag skill bonus entries (direct items or choice groups)
interface TagSkillBonusEntryDisplayProps {
  entry: TagSkillBonusEntryApi;
  skill: string;
  entryIndex: number;
  t: (key: string, options?: Record<string, unknown>) => string;
  selectedChoice?: number;
  onChoiceSelect?: (optionIndex: number) => void;
  onItemClick?: (itemId: number, itemType: ItemType) => void;
}

function TagSkillBonusEntryDisplay({
  entry,
  t,
  selectedChoice,
  onChoiceSelect,
  onItemClick,
}: TagSkillBonusEntryDisplayProps) {
  const translateItemName = (name?: string, nameKey?: string, itemType?: ItemType) => {
    if (nameKey) {
      const translated = t(nameKey);
      if (translated !== nameKey) return translated;
    }
    if (name) {
      const categoryKey = getCategoryKeyFromItemType(itemType);
      if (categoryKey) {
        const itemKey = `items.${categoryKey}.${name}`;
        const itemTranslated = t(itemKey);
        if (itemTranslated !== itemKey) return itemTranslated;
      }
    }
    return name ?? 'Unknown Item';
  };

  const formatQuantity = (item: { quantity?: number; quantityCD?: number }) => {
    const qty = item.quantity ?? 1;
    const cd = item.quantityCD ?? 0;

    if (cd > 0 && qty > 0) {
      return t('equipment.quantityWithCD', { base: qty, cd });
    } else if (cd > 0) {
      return `${cd} CD`;
    } else if (qty > 1) {
      return t('equipment.quantity', { count: qty });
    }
    return '';
  };

  if (isTagSkillChoice(entry)) {
    return (
      <div className="text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {entry.options.map((opt, idx) => {
            const isSelected = (selectedChoice ?? 0) === idx;
            const qty = formatQuantity(opt);
            return (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-gray-500 text-xs italic">{t('equipment.orChoice')}</span>
                )}
                <button
                  type="button"
                  onClick={() => onChoiceSelect?.(idx)}
                  className={`px-3 py-2 rounded border text-left transition-colors min-h-[44px] ${
                    isSelected
                      ? 'border-vault-yellow bg-vault-blue'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-vault-yellow bg-vault-yellow'
                          : 'border-gray-500'
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-vault-gray" />}
                    </span>
                    {opt.itemId ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick?.(opt.itemId, opt.itemType);
                        }}
                        className="text-vault-yellow hover:text-yellow-300 hover:underline text-left"
                      >
                        {translateItemName(opt.itemName, opt.itemNameKey, opt.itemType)}
                      </button>
                    ) : (
                      <span className="text-white">{translateItemName(opt.itemName, opt.itemNameKey, opt.itemType)}</span>
                    )}
                    {qty && <span className="text-gray-500">({qty})</span>}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Direct item
  const directItem = entry as TagSkillBonusDirectApi;
  const hasDetailData = directItem.itemId !== undefined && directItem.itemType !== undefined;
  const qty = formatQuantity(directItem);

  return (
    <div className="text-sm flex items-center gap-1">
      <span className="text-gray-600">•</span>
      {hasDetailData ? (
        <button
          type="button"
          onClick={() => onItemClick?.(directItem.itemId, directItem.itemType)}
          className="text-vault-yellow hover:text-yellow-300 hover:underline text-left"
        >
          {translateItemName(directItem.itemName, directItem.itemNameKey, directItem.itemType)}
        </button>
      ) : (
        <span className="text-white">{translateItemName(directItem.itemName, directItem.itemNameKey, directItem.itemType)}</span>
      )}
      {qty && <span className="text-gray-500">({qty})</span>}
    </div>
  );
}
