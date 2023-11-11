import { PrismaClient, Prisma, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

export const brandsData: Prisma.AccountCreateInput[] = [
  {
    name: 'Account 1',
    type: AccountType.DEMAND,
    allowBrandedKeywords: true,
    countryIds: ["DK", "AU", "UK", "FR"],
  },
  {
    name: 'Account 2',
    type: AccountType.SUPPLY,
    allowBrandedKeywords: true,
    countryIds: ["US", "FR"],
  }
]; 