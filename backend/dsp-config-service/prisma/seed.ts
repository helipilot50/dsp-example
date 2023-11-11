import { PrismaClient, Prisma, RetailerStatus } from '@prisma/client';

import currencySeedData, { currencyData } from './currency';
import skuSeedData from './sku';
import countrySeedData, { countryData } from './country';
import brandSeedData from './brand';
import retailerSeedData from './retailer';

const prisma = new PrismaClient();




async function main() {
  console.log(`Start seeding ...`);


  // await currencySeedData();

  // await countrySeedData();

  // await skuSeedData();

  // await brandSeedData();

  // await retailerSeedData();


  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });