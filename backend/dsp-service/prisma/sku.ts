import { PrismaClient, Prisma } from '@prisma/client';
import * as csv from 'csv';
import fs from 'fs';
import { open } from 'node:fs/promises';

const prisma = new PrismaClient();

const skuTotal = 100;

const skuData: Prisma.SKUCreateInput[] = [
  {
    skuKey: "SKU1",
    name: "SKU 0001 name",
    description: "SKU 0001 description",
    price: 100,
    quantity: 100,
  },

];
function parseQuantity(quatityAsString: string | undefined): number {
  if (!quatityAsString) return 0;
  if (quatityAsString === '') {
    return 0;
  }
  const regex = /(^\d+)/;
  const match = regex.exec(quatityAsString);
  if (match) {
    // console.log(`Matched ${match[0]}`);
    return parseInt(match[0]);
  }
  return 0;
}

function parsePrice(priceAsString: string | undefined): number {
  if (!priceAsString) return -1;
  if (priceAsString === '') {
    return -1;
  }
  const regex = /^(\d*\.?\d+)$/;
  const match = regex.exec(priceAsString.substring(1));
  if (match) {
    // console.log(`Price Matched ${match[0]}`);
    return parseInt(match[0]);
  }
  return -1;
}


export default async function skuSeedData() {
  console.log(`Starting SKU data`);
  await prisma.sKU.deleteMany({});

  // CSV row
  // uniq_id,
  // product_name,
  // manufacturer,
  // price,
  // number_available_in_stock,
  // number_of_reviews,
  // number_of_answered_questions,
  // average_review_rating,
  // amazon_category_and_sub_category,
  // customers_who_bought_this_item_also_bought,description,
  // product_information,
  // product_description,
  // items_customers_buy_after_viewing_this_item,
  // customer_questions_and_answers,customer_reviews,
  // sellers



  // Read the content
  const content = fs.readFileSync(`./prisma/amazon_co_ecommerce_sample.csv`);
  // Parse the CSV content

  const parser = csv.parse(content, { columns: false, skip_empty_lines: true, trim: true });

  for await (const record of parser) {
    // record current line
    const data: Prisma.SKUCreateInput = {
      skuKey: record[0],
      name: record[1],
      description: record[11],
      price: parsePrice(record[3]),
      quantity: parseQuantity(record[4]),
      manufacturer: record[2],
    };

    const newSku = await prisma.sKU.create({
      data
    });
    console.log(`Created SKU : ${newSku.skuKey} ${newSku.name}`);
  }

  console.log(`Completed SKU data`);



}