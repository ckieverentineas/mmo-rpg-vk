-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idvk" INTEGER NOT NULL,
    "id_user_type" INTEGER NOT NULL,
    "gold" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_id_user_type_fkey" FOREIGN KEY ("id_user_type") REFERENCES "UserType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "gold_min" INTEGER NOT NULL,
    "gold_max" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Skill_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SkillConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "id_skill_category" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillConfig_id_skill_category_fkey" FOREIGN KEY ("id_skill_category") REFERENCES "SkillCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "atk_min" INTEGER NOT NULL,
    "atk_max" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Weapon_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DamageType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WeaponConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "atk_min" INTEGER NOT NULL,
    "atk_max" INTEGER NOT NULL,
    "lvl_req_min" INTEGER NOT NULL,
    "lvl_req_max" INTEGER NOT NULL,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeaponConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Armor" (
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
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Armor_id_armor_type_fkey" FOREIGN KEY ("id_armor_type") REFERENCES "ArmorType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArmorType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ArmorConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_skill_config" INTEGER NOT NULL,
    "def_min" INTEGER NOT NULL,
    "def_max" INTEGER NOT NULL,
    "lvl_req_min" INTEGER NOT NULL,
    "lvl_req_max" INTEGER NOT NULL,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArmorConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_user" INTEGER NOT NULL,
    "id_battle_registrator" INTEGER NOT NULL,
    "hp_temp" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Battle_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Battle_id_battle_registrator_fkey" FOREIGN KEY ("id_battle_registrator") REFERENCES "BattleRegistrator" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattleType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BattleRegistrator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_battle_type" INTEGER NOT NULL,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BattleRegistrator_id_battle_type_fkey" FOREIGN KEY ("id_battle_type") REFERENCES "BattleType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserType_name_key" ON "UserType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SkillCategory_name_key" ON "SkillCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DamageType_name_key" ON "DamageType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArmorType_name_key" ON "ArmorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BattleType_name_key" ON "BattleType"("name");
