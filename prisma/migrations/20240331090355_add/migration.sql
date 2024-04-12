-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "content" VARCHAR(280) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "posterId" UUID NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
