-- CreateEnum
CREATE TYPE "PromptSectionKey" AS ENUM ('ROLE', 'PERSONALITY', 'GUIDELINES', 'TERMINOLOGY', 'CLOSING', 'TOOLS_ASK_QUESTIONS', 'TOOLS_SAVE_MEMORY', 'TOOLS_GET_MEMORIES', 'TOOLS_UPDATE_MEMORY');

-- CreateTable
CREATE TABLE "PromptSection" (
    "id" TEXT NOT NULL,
    "key" "PromptSectionKey" NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromptSection_key_key" ON "PromptSection"("key");
