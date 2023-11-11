import { PrismaClient, Prisma } from '@prisma/client';
import * as csv from 'csv';
import fs from 'fs';


const prisma = new PrismaClient();


export default async function brandSeedData() {
  await prisma.brand.deleteMany({});

  // Read the content
  const content = fs.readFileSync(`./prisma/brandirectory-ranking-data-global-2022.csv`);
  // Parse the CSV content
  const parser = csv.parse(content, { delimiter: ',', columns: false, skip_empty_lines: true, trim: true });

  // Brand,Founded By/How it was founded,Founded In,Country,Key People,Genre/Industry,Website,Rank in 2022,Rank in 2021,Brand Value ($M) in 2022,Brand Value ($M) in 2021,% Change,Rating in 2022,Rating in 2021 

  for await (const record of parser) {
    // record current line
    const data: Prisma.BrandCreateInput = {
      name: record[0],
      foundedBy: record[1],
      foundedIn: record[2],
      country: record[3],
      keyPeople: record[4],
      industry: record[5],
      website: record[6],
      rank: Number.parseInt(record[7]),
      brandValue: Number.parseFloat(record[9]),
      rating: record[12],
    };

    const brand = await prisma.brand.create({
      data,
    });
    console.log(`Created brand with id: ${brand.id} ${brand.name}`);
  }
}