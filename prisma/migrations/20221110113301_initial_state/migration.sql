/*
  Warnings:

  - You are about to drop the `ArmorType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamageType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeaponType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `id_armor_type` on the `Armor` table. All the data in the column will be lost.
  - You are about to drop the column `id_damage_type` on the `Armor` table. All the data in the column will be lost.
  - You are about to drop the column `hp` on the `UserConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp_mod` on the `UserConfig` table. All the data in the column will be lost.
  - You are about to drop the column `hp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id_damage_type` on the `Weapon` table. All the data in the column will be lost.
  - You are about to drop the column `id_weapon_type` on the `Weapon` table. All the data in the column will be lost.
  - Added the required column `id_body` to the `Armor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_body` to the `Weapon` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ArmorType_name_key";

-- DropIndex
DROP INDEX "DamageType_name_key";

-- DropIndex
DROP INDEX "WeaponType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArmorType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DamageType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WeaponType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BodyConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_skill_config" INTEGER NOT NULL,
    "atk" REAL NOT NULL,
    "atk_mod" REAL NOT NULL,
    "def" REAL NOT NULL,
    "def_mod" REAL NOT NULL,
    "health" REAL NOT NULL,
    "health_mod" REAL NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BodyConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Body" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_body_config" INTEGER NOT NULL,
    "atk_min" REAL NOT NULL,
    "atk_max" REAL NOT NULL,
    "def_min" REAL NOT NULL,
    "def_max" REAL NOT NULL,
    "health" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Body_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Body_id_body_config_fkey" FOREIGN KEY ("id_body_config") REFERENCES "BodyConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Armor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_armor_config" INTEGER NOT NULL,
    "id_body" TEXT NOT NULL,
    "lvl" REAL NOT NULL,
    "def_min" REAL NOT NULL,
    "def_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_config_fkey" FOREIGN KEY ("id_armor_config") REFERENCES "ArmorConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_body_fkey" FOREIGN KEY ("id_body") REFERENCES "Body" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Armor" ("crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_config", "id_user", "lvl", "name") SELECT "crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_config", "id_user", "lvl", "name" FROM "Armor";
DROP TABLE "Armor";
ALTER TABLE "new_Armor" RENAME TO "Armor";
CREATE TABLE "new_UserConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user_type" INTEGER NOT NULL,
    "gold" REAL NOT NULL,
    "gold_mod" REAL NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserConfig_id_user_type_fkey" FOREIGN KEY ("id_user_type") REFERENCES "UserType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserConfig" ("crdate", "gold", "gold_mod", "id", "id_user_type") SELECT "crdate", "gold", "gold_mod", "id", "id_user_type" FROM "UserConfig";
DROP TABLE "UserConfig";
ALTER TABLE "new_UserConfig" RENAME TO "UserConfig";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user_config" INTEGER NOT NULL,
    "idvk" INTEGER NOT NULL,
    "gold" REAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_id_user_config_fkey" FOREIGN KEY ("id_user_config") REFERENCES "UserConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("crdate", "gold", "id", "id_user_config", "idvk", "nickname") SELECT "crdate", "gold", "id", "id_user_config", "idvk", "nickname" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Weapon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_weapon_config" INTEGER NOT NULL,
    "id_body" TEXT NOT NULL,
    "lvl" REAL NOT NULL,
    "atk_min" REAL NOT NULL,
    "atk_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_weapon_config_fkey" FOREIGN KEY ("id_weapon_config") REFERENCES "WeaponConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_body_fkey" FOREIGN KEY ("id_body") REFERENCES "Body" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_user", "id_weapon_config", "lvl", "name") SELECT "atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_user", "id_weapon_config", "lvl", "name" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
