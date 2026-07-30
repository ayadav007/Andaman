import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: path.join(process.cwd(), "dev.db") }),
});

async function main() {
  await prisma.package.updateMany({
    data: {
      titleHi: "अंडमान पैकेज",
      summaryHi: "द्वीप यात्रा पैकेज",
      descriptionHi: "होटल और फेरी के साथ अंडमान टूर।",
      inclusionsHi: "रहना और नाश्ता",
      exclusionsHi: "फ्लाइट",
    },
  });
  await prisma.faqItem.updateMany({
    where: { questionEn: { contains: "customise" } },
    data: {
      questionHi: "क्या हम पैकेज कस्टमाइज़ कर सकते हैं?",
      answerHi: "हाँ, अंडमान एक्स्टसी आपकी ज़रूरत के अनुसार यात्रा बनाता है।",
    },
  });
  await prisma.destination.updateMany({
    where: { slug: "havelock" },
    data: { descriptionHi: "फ़िरोज़ी पानी, राधानगर बीच और स्कूबा डाइविंग।" },
  });
  await prisma.statItem.updateMany({
    where: { labelEn: "Happy clients" },
    data: { labelHi: "खुश ग्राहक" },
  });
  console.log("Hindi sample fields updated");
}

main().finally(() => prisma.$disconnect());
