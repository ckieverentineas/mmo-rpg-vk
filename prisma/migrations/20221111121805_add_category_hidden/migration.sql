-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SkillCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "crdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SkillCategory" ("crdate", "description", "id", "label", "name") SELECT "crdate", "description", "id", "label", "name" FROM "SkillCategory";
DROP TABLE "SkillCategory";
ALTER TABLE "new_SkillCategory" RENAME TO "SkillCategory";
CREATE UNIQUE INDEX "SkillCategory_name_key" ON "SkillCategory"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
