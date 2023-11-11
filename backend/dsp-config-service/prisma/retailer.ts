import { PrismaClient, Prisma, RetailerStatus } from '@prisma/client';
import * as csv from 'csv';
import fs from 'fs';

const prisma = new PrismaClient();

export default async function retailerSeedData() {
  await prisma.retailer.deleteMany({});

  // Read the content
  const content = fs.readFileSync(`./prisma/cos2019.csv`);
  // Parse the CSV content
  const parser = csv.parse(content, { delimiter: ';', columns: false, skip_empty_lines: true, trim: true });

  // rank;name;country_of_origin;retail_revenue;parent_company_revenue;parent_company_net_income;dominant_operational_format;countries_of_operation;retail_revenue_cagr

  for await (const record of parser) {
    // record current line
    const data: Prisma.RetailerCreateInput = {
      rank: Number.parseInt(record[0]),
      name: record[1],
      countryOfOrigin: record[2],
      retailRevenue: Number.parseFloat(record[3]),
      parentRevenue: Number.parseFloat(record[4] || '0'),
      parentCompanyNetIncome: Number.parseInt(record[5] || '0'),
      operationalFormat: record[6],
      countriesOfOperation: Number.parseInt(record[7]),
      retailRevenueCagr: Number.parseFloat(record[8] || '0'),
      status: RetailerStatus.ACTIVE,
    };

    const retailer = await prisma.retailer.create({
      data,
    });
    console.log(`Created retailer with id: ${retailer.id} ${retailer.name}`);
  }
}