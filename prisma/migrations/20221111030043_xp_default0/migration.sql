-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "id_skill_config" INTEGER NOT NULL,
    "xp" REAL NOT NULL DEFAULT 0,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Skill_id_skill_config_fkey" FOREIGN KEY ("id_skill_config") REFERENCES "SkillConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Skill" ("crdate", "id", "id_skill_config", "id_user", "xp") SELECT "crdate", "id", "id_skill_config", "id_user", "xp" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
