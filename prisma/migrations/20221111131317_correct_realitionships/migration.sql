/*
  Warnings:

  - You are about to drop the column `bodyId` on the `Weapon` table. All the data in the column will be lost.
  - You are about to drop the column `bodyId` on the `Armor` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Weapon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_weapon_config" INTEGER NOT NULL,
    "id_body_config" INTEGER NOT NULL,
    "lvl" REAL NOT NULL,
    "atk_min" REAL NOT NULL,
    "atk_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_body_config_fkey" FOREIGN KEY ("id_body_config") REFERENCES "BodyConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_weapon_config_fkey" FOREIGN KEY ("id_weapon_config") REFERENCES "WeaponConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_body_config", "id_user", "id_weapon_config", "lvl", "name") SELECT "atk_max", "atk_min", "crdate", "equip", "hp", "id", "id_body_config", "id_user", "id_weapon_config", "lvl", "name" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
CREATE TABLE "new_Armor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_armor_config" INTEGER NOT NULL,
    "id_body_config" INTEGER NOT NULL,
    "lvl" REAL NOT NULL,
    "def_min" REAL NOT NULL,
    "def_max" REAL NOT NULL,
    "hp" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "equip" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_body_config_fkey" FOREIGN KEY ("id_body_config") REFERENCES "BodyConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_config_fkey" FOREIGN KEY ("id_armor_config") REFERENCES "ArmorConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Armor" ("crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_config", "id_body_config", "id_user", "lvl", "name") SELECT "crdate", "def_max", "def_min", "equip", "hp", "id", "id_armor_config", "id_body_config", "id_user", "lvl", "name" FROM "Armor";
DROP TABLE "Armor";
ALTER TABLE "new_Armor" RENAME TO "Armor";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
