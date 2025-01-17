-- CreateTable
CREATE TABLE "uutinen" (
    "uutisId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "kommentti" (
    "kommenttiId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uutisId" INTEGER NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "kommentti" TEXT NOT NULL,
    "aikaleima" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "kayttaja" (
    "kayttajaId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasana" TEXT NOT NULL
);
