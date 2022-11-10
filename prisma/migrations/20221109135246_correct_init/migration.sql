-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Armor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "id_armor_type" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "def_min" INTEGER NOT NULL,
    "def_max" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_type_fkey" FOREIGN KEY ("id_armor_type") REFERENCES "ArmorType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Armor" ("crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_type", "id_damage_type", "id_skill_config", "id_user", "lvl", "name") SELECT "crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_type", "id_damage_type", "id_skill_config", "id_user", "lvl", "name" FROM "Armor";
DROP TABLE "Armor";
ALTER TABLE "new_Armor" RENAME TO "Armor";
CREATE TABLE "new_Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "atk_min" INTEGER NOT NULL,
    "atk_max" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_damage_type", "id_skill_config", "id_user", "lvl", "name") SELECT "atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_damage_type", "id_skill_config", "id_user", "lvl", "name" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
