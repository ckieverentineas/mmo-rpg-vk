/*
  Warnings:

  - You are about to drop the `Battle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BattleRegistrator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BattleType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `def_max` on the `ArmorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `def_min` on the `ArmorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_max` on the `ArmorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_min` on the `ArmorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `lvl_req_max` on the `ArmorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `lvl_req_min` on the `ArmorConfig` table. All the data in the column will be lost.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lvl` on the `Skill` table. All the data in the column will be lost.
  - You are about to alter the column `xp` on the `Skill` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_user_type` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `gold` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `hp` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to drop the column `gold_max` on the `UserConfig` table. All the data in the column will be lost.
  - You are about to drop the column `gold_min` on the `UserConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_max` on the `UserConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_min` on the `UserConfig` table. All the data in the column will be lost.
  - The primary key for the `Weapon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_skill_config` on the `Weapon` table. All the data in the column will be lost.
  - You are about to alter the column `atk_max` on the `Weapon` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `atk_min` on the `Weapon` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `hp` on the `Weapon` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `lvl` on the `Weapon` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - The primary key for the `Armor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_skill_config` on the `Armor` table. All the data in the column will be lost.
  - You are about to alter the column `def_max` on the `Armor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `def_min` on the `Armor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `hp` on the `Armor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `lvl` on the `Armor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to drop the column `atk_max` on the `WeaponConfig` table. All the data in the column will be lost.
  - You are about to drop the column `atk_min` on the `WeaponConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_max` on the `WeaponConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_min` on the `WeaponConfig` table. All the data in the column will be lost.
  - You are about to drop the column `lvl_req_max` on the `WeaponConfig` table. All the data in the column will be lost.
  - You are about to drop the column `lvl_req_min` on the `WeaponConfig` table. All the data in the column will be lost.
  - Added the required column `def` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `def_mod` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp_mod` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lvl` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lvl_mod` to the `ArmorConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user_config` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gold` to the `UserConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gold_mod` to the `UserConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `UserConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp_mod` to the `UserConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user_type` to the `UserConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_weapon_config` to the `Weapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_weapon_type` to the `Weapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_armor_config` to the `Armor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atk` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atk_mod` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp_mod` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lvl` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lvl_mod` to the `WeaponConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BattleType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Battle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BattleRegistrator";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BattleType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WeaponType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArmorConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_skill_config" INTEGER NOT NULL,
    "def" REAL NOT NULL,
    "def_mod" REAL NOT NULL,
    "lvl" REAL NOT NULL,
    "lvl_mod" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "hp_mod" REAL NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArmorConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArmorConfig" ("crdate", "id", "id_skill_config") SELECT "crdate", "id", "id_skill_config" FROM "ArmorConfig";
DROP TABLE "ArmorConfig";
ALTER TABLE "new_ArmorConfig" RENAME TO "ArmorConfig";
CREATE TABLE "new_Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "xp" REAL NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Skill_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Skill" ("crdate", "id", "id_skill_config", "id_user", "xp") SELECT "crdate", "id", "id_skill_config", "id_user", "xp" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idvk" INTEGER NOT NULL,
    "id_user_config" INTEGER NOT NULL,
    "gold" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_id_user_config_fkey" FOREIGN KEY ("id_user_config") REFERENCES "UserConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("crdate", "gold", "hp", "id", "idvk") SELECT "crdate", "gold", "hp", "id", "idvk" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_UserConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user_type" INTEGER NOT NULL,
    "hp" REAL NOT NULL,
    "hp_mod" REAL NOT NULL,
    "gold" REAL NOT NULL,
    "gold_mod" REAL NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserConfig_id_user_type_fkey" FOREIGN KEY ("id_user_type") REFERENCES "UserType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserConfig" ("crdate", "id") SELECT "crdate", "id" FROM "UserConfig";
DROP TABLE "UserConfig";
ALTER TABLE "new_UserConfig" RENAME TO "UserConfig";
CREATE TABLE "new_Weapon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_weapon_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "id_weapon_type" INTEGER NOT NULL,
    "lvl" REAL NOT NULL,
    "atk_min" REAL NOT NULL,
    "atk_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_weapon_config_fkey" FOREIGN KEY ("id_weapon_config") REFERENCES "WeaponConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_weapon_type_fkey" FOREIGN KEY ("id_weapon_type") REFERENCES "WeaponType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_damage_type", "id_user", "lvl", "name") SELECT "atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_damage_type", "id_user", "lvl", "name" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
CREATE TABLE "new_Armor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_armor_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "id_armor_type" INTEGER NOT NULL,
    "lvl" REAL NOT NULL,
    "def_min" REAL NOT NULL,
    "def_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_config_fkey" FOREIGN KEY ("id_armor_config") REFERENCES "ArmorConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_type_fkey" FOREIGN KEY ("id_armor_type") REFERENCES "ArmorType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Armor" ("crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_type", "id_damage_type", "id_user", "lvl", "name") SELECT "crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_type", "id_damage_type", "id_user", "lvl", "name" FROM "Armor";
DROP TABLE "Armor";
ALTER TABLE "new_Armor" RENAME TO "Armor";
CREATE TABLE "new_WeaponConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_skill_config" INTEGER NOT NULL,
    "atk" REAL NOT NULL,
    "atk_mod" REAL NOT NULL,
    "lvl" REAL NOT NULL,
    "lvl_mod" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "hp_mod" REAL NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeaponConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WeaponConfig" ("crdate", "id", "id_skill_config") SELECT "crdate", "id", "id_skill_config" FROM "WeaponConfig";
DROP TABLE "WeaponConfig";
ALTER TABLE "new_WeaponConfig" RENAME TO "WeaponConfig";
CREATE TABLE "new_SkillConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_skill_category" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillConfig_id_skill_category_fkey" FOREIGN KEY ("id_skill_category") REFERENCES "SkillCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SkillConfig" ("crdate", "description", "id", "id_skill_category", "label", "name") SELECT "crdate", "description", "id", "id_skill_category", "label", "name" FROM "SkillConfig";
DROP TABLE "SkillConfig";
ALTER TABLE "new_SkillConfig" RENAME TO "SkillConfig";
CREATE UNIQUE INDEX "SkillConfig_name_key" ON "SkillConfig"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "WeaponType_name_key" ON "WeaponType"("name");
