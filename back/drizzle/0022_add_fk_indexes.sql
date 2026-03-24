-- Performance: Add indexes on all foreign key columns
-- These were missing, causing sequential scans on every character/inventory/session load

-- character_inventory: queried on every character load
CREATE INDEX idx_character_inventory_character_id ON character_inventory(character_id);
CREATE INDEX idx_character_inventory_item_id ON character_inventory(item_id);

-- inventory_item_mods: queried for every inventory item's mods
CREATE INDEX idx_inventory_item_mods_target ON inventory_item_mods(target_inventory_id);
CREATE INDEX idx_inventory_item_mods_mod ON inventory_item_mods(mod_inventory_id);

-- item_compatible_mods: queried per moddable item
CREATE INDEX idx_item_compatible_mods_target ON item_compatible_mods(target_item_id);
CREATE INDEX idx_item_compatible_mods_mod ON item_compatible_mods(mod_item_id);

-- character relation tables (all queried by character_id in getFullCharacter)
CREATE INDEX idx_character_special_character_id ON character_special(character_id);
CREATE INDEX idx_character_skills_character_id ON character_skills(character_id);
CREATE INDEX idx_character_tag_skills_character_id ON character_tag_skills(character_id);
CREATE INDEX idx_character_survivor_traits_character_id ON character_survivor_traits(character_id);
CREATE INDEX idx_character_perks_character_id ON character_perks(character_id);
CREATE INDEX idx_character_gifted_bonuses_character_id ON character_gifted_bonuses(character_id);
CREATE INDEX idx_character_exercise_bonuses_character_id ON character_exercise_bonuses(character_id);
CREATE INDEX idx_character_conditions_character_id ON character_conditions(character_id);
CREATE INDEX idx_character_dr_character_id ON character_dr(character_id);
CREATE INDEX idx_character_traits_character_id ON character_traits(character_id);

-- mod_effects and mods
CREATE INDEX idx_mod_effects_mod_id ON mod_effects(mod_id);
CREATE INDEX idx_mods_item_id ON mods(item_id);

-- session_participants
CREATE INDEX idx_session_participants_session_id ON session_participants(session_id);
CREATE INDEX idx_session_participants_character_id ON session_participants(character_id);

-- bestiary sub-tables
CREATE INDEX idx_bestiary_attributes_entry_id ON bestiary_attributes(bestiary_entry_id);
CREATE INDEX idx_bestiary_skills_entry_id ON bestiary_skills(bestiary_entry_id);
CREATE INDEX idx_bestiary_dr_entry_id ON bestiary_dr(bestiary_entry_id);
CREATE INDEX idx_bestiary_attacks_entry_id ON bestiary_attacks(bestiary_entry_id);
CREATE INDEX idx_bestiary_attack_qualities_attack_id ON bestiary_attack_qualities(attack_id);
CREATE INDEX idx_bestiary_abilities_entry_id ON bestiary_abilities(bestiary_entry_id);
CREATE INDEX idx_bestiary_inventory_entry_id ON bestiary_inventory(bestiary_entry_id);
CREATE INDEX idx_bestiary_inventory_mods_inv_id ON bestiary_inventory_mods(bestiary_inventory_id);

-- clothing sub-tables
CREATE INDEX idx_clothing_locations_item_id ON clothing_locations(item_id);
CREATE INDEX idx_clothing_effects_item_id ON clothing_effects(item_id);

-- weapon_qualities
CREATE INDEX idx_weapon_qualities_item_id ON weapon_qualities(item_id);

-- perk prerequisites (queried when loading perk details)
CREATE INDEX idx_perk_special_prereqs_perk_id ON perk_special_prerequisites(perk_id);
CREATE INDEX idx_perk_skill_prereqs_perk_id ON perk_skill_prerequisites(perk_id);
CREATE INDEX idx_perk_required_perks_perk_id ON perk_required_perks(perk_id);
CREATE INDEX idx_perk_excluded_perks_perk_id ON perk_excluded_perks(perk_id);
CREATE INDEX idx_perk_rank_effects_perk_id ON perk_rank_effects(perk_id);
