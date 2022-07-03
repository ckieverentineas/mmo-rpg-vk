-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "idvk" INTEGER NOT NULL,
    "id_user_type" INTEGER NOT NULL,
    "gold" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "id" SERIAL NOT NULL,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "gold_min" INTEGER NOT NULL,
    "gold_max" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillConfig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "id_skill_category" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "atk_min" INTEGER NOT NULL,
    "atk_max" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DamageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponConfig" (
    "id" SERIAL NOT NULL,
    "atk_min" INTEGER NOT NULL,
    "atk_max" INTEGER NOT NULL,
    "lvl_req_min" INTEGER NOT NULL,
    "lvl_req_max" INTEGER NOT NULL,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Armor" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "id_damage_type" INTEGER NOT NULL,
    "id_armor_type" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "def_min" INTEGER NOT NULL,
    "def_max" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Armor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArmorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorConfig" (
    "id" SERIAL NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "def_min" INTEGER NOT NULL,
    "def_max" INTEGER NOT NULL,
    "lvl_req_min" INTEGER NOT NULL,
    "lvl_req_max" INTEGER NOT NULL,
    "hp_min" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArmorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_battle_registrator" INTEGER NOT NULL,
    "hp_temp" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleRegistrator" (
    "id" SERIAL NOT NULL,
    "id_battle_type" INTEGER NOT NULL,
    "crdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleRegistrator_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_user_type_fkey" FOREIGN KEY ("id_user_type") REFERENCES "UserType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillConfig" ADD CONSTRAINT "SkillConfig_id_skill_category_fkey" FOREIGN KEY ("id_skill_category") REFERENCES "SkillCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponConfig" ADD CONSTRAINT "WeaponConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_id_damage_type_fkey" FOREIGN KEY ("id_damage_type") REFERENCES "DamageType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_id_armor_type_fkey" FOREIGN KEY ("id_armor_type") REFERENCES "ArmorType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmorConfig" ADD CONSTRAINT "ArmorConfig_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_id_battle_registrator_fkey" FOREIGN KEY ("id_battle_registrator") REFERENCES "BattleRegistrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleRegistrator" ADD CONSTRAINT "BattleRegistrator_id_battle_type_fkey" FOREIGN KEY ("id_battle_type") REFERENCES "BattleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
