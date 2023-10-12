import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();


const rawData = [
  {
    code: "ALL",
    symbol: '\u004c\u0065\u006b',
    name: "Albania Lek"
  },
  {
    code: "AFN",
    symbol: '\u060b',
    name: "Afghanistan Afghani"
  },
  {
    code: "ARS",
    symbol: '\u0024',
    name: "Argentina Peso"
  },
  {
    code: "AWG",
    symbol: '\u0192',
    name: "Aruba Guilder"
  },
  {
    code: "AUD",
    symbol: '\u0024',
    name: "Australia Dollar"
  },
  {
    code: "AZN",
    symbol: '\u043c\u0430\u043d',
    name: "Azerbaijan New Manat"
  },
  {
    code: "BSD",
    symbol: '\u0024',
    name: "Bahamas Dollar"
  },
  {
    code: "BBD",
    symbol: '\u0024',
    name: "Barbados Dollar"
  },
  {
    code: "BYR",
    symbol: '\u0070\u002e',
    name: "Belarus Ruble"
  },
  {
    code: "BZD",
    symbol: '\u0042\u005a\u0024',
    name: "Belize Dollar"
  },
  {
    code: "BMD",
    symbol: '\u0024',
    name: "Bermuda Dollar"
  },
  {
    code: "BOB",
    symbol: '\u0024\u0062',
    name: "Bolivia Boliviano"
  },
  {
    code: "BAM",
    symbol: '\u004b\u004d',
    name: "Bosnia and Herzegovina Convertible Marka"
  },
  {
    code: "BWP",
    symbol: '\u0050',
    name: "Botswana Pula"
  },
  {
    code: "BGN",
    symbol: '\u043b\u0432',
    name: "Bulgaria Lev"
  },
  {
    code: "BRL",
    symbol: '\u0052\u0024',
    name: "Brazil Real"
  },
  {
    code: "BND",
    symbol: '\u0024',
    name: "Brunei Darussalam Dollar"
  },
  {
    code: "KHR",
    symbol: '\u17db',
    name: "Cambodia Riel"
  },
  {
    code: "CAD",
    symbol: '\u0024',
    name: "Canada Dollar"
  },
  {
    code: "KYD",
    symbol: '\u0024',
    name: "Cayman Islands Dollar"
  },
  {
    code: "CLP",
    symbol: '\u0024',
    name: "Chile Peso"
  },
  {
    code: "CNY",
    symbol: '\u00a5',
    name: "China Yuan Renminbi"
  },
  {
    code: "COP",
    symbol: '\u0024',
    name: "Colombia Peso"
  },
  {
    code: "CRC",
    symbol: '\u20a1',
    name: "Costa Rica Colon"
  },
  {
    code: "HRK",
    symbol: '\u006b\u006e',
    name: "Croatia Kuna"
  },
  {
    code: "CUP",
    symbol: '\u20b1',
    name: "Cuba Peso"
  },
  {
    code: "CZK",
    symbol: '\u004b\u010d',
    name: "Czech Republic Koruna"
  },
  {
    code: "DKK",
    symbol: '\u006b\u0072',
    name: "Denmark Krone"
  },
  {
    code: "DOP",
    symbol: '\u0052\u0044\u0024',
    name: "Dominican Republic Peso"
  },
  {
    code: "XCD",
    symbol: '\u0024',
    name: "East Caribbean Dollar"
  },
  {
    code: "EGP",
    symbol: '\u00a3',
    name: "Egypt Pound"
  },
  {
    code: "SVC",
    symbol: '\u0024',
    name: "El Salvador Colon"
  },
  {
    code: "EEK",
    symbol: '\u006b\u0072',
    name: "Estonia Kroon"
  },
  {
    code: "EUR",
    symbol: '\u20ac',
    name: "Euro Member Countries"
  },
  {
    code: "FKP",
    symbol: '\u00a3',
    name: "Falkland Islands (Malvinas) Pound"
  },
  {
    code: "FJD",
    symbol: '\u0024',
    name: "Fiji Dollar"
  },
  {
    code: "GHC",
    symbol: '\u00a2',
    name: "Ghana Cedis"
  },
  {
    code: "GIP",
    symbol: '\u00a3',
    name: "Gibraltar Pound"
  },
  {
    code: "GTQ",
    symbol: '\u0051',
    name: "Guatemala Quetzal"
  },
  {
    code: "GGP",
    symbol: '\u00a3',
    name: "Guernsey Pound"
  },
  {
    code: "GYD",
    symbol: '\u0024',
    name: "Guyana Dollar"
  },
  {
    code: "HNL",
    symbol: '\u004c',
    name: "Honduras Lempira"
  },
  {
    code: "HKD",
    symbol: '\u0024',
    name: "Hong Kong Dollar"
  },
  {
    code: "HUF",
    symbol: '\u0046\u0074',
    name: "Hungary Forint"
  },
  {
    code: "ISK",
    symbol: '\u006b\u0072',
    name: "Iceland Krona"
  },
  {
    code: "INR",
    symbol: '\u20b9',
    name: "India Rupee"
  },
  {
    code: "IDR",
    symbol: '\u0052\u0070',
    name: "Indonesia Rupiah"
  },
  {
    code: "IRR",
    symbol: '\ufdfc',
    name: "Iran Rial"
  },
  {
    code: "IMP",
    symbol: '\u00a3',
    name: "Isle of Man Pound"
  },
  {
    code: "ILS",
    symbol: '\u20aa',
    name: "Israel Shekel"
  },
  {
    code: "JMD",
    symbol: '\u004a\u0024',
    name: "Jamaica Dollar"
  },
  {
    code: "JPY",
    symbol: '\u00a5',
    name: "Japan Yen"
  },
  {
    code: "JEP",
    symbol: '\u00a3',
    name: "Jersey Pound"
  },
  {
    code: "KZT",
    symbol: '\u043b\u0432',
    name: "Kazakhstan Tenge"
  },
  {
    code: "KPW",
    symbol: '\u20a9',
    name: "Korea (North) Won"
  },
  {
    code: "KGS",
    symbol: '\u043b\u0432',
    name: "Kyrgyzstan Som"
  },
  {
    code: "LAK",
    symbol: '\u20ad',
    name: "Laos Kip"
  },
  {
    code: "LVL",
    symbol: '\u004c\u0073',
    name: "Latvia Lat"
  },
  {
    code: "LBP",
    symbol: '\u00a3',
    name: "Lebanon Pound"
  },
  {
    code: "LRD",
    symbol: '\u0024',
    name: "Liberia Dollar"
  },
  {
    code: "LTL",
    symbol: '\u004c\u0074',
    name: "Lithuania Litas"
  },
  {
    code: "MKD",
    symbol: '\u0434\u0435\u043d',
    name: "Macedonia Denar"
  },
  {
    code: "MYR",
    symbol: '\u0052\u004d',
    name: "Malaysia Ringgit"
  },
  {
    code: "MUR",
    symbol: '\u20a8',
    name: "Mauritius Rupee"
  },
  {
    code: "MXN",
    symbol: '\u0024',
    name: "Mexico Peso"
  },
  {
    code: "MNT",
    symbol: '\u20ae',
    name: "Mongolia Tughrik"
  },
  {
    code: "MZN",
    symbol: '\u004d\u0054',
    name: "Mozambique Metical"
  },
  {
    code: "NAD",
    symbol: '\u0024',
    name: "Namibia Dollar"
  },
  {
    code: "NPR",
    symbol: '\u20a8',
    name: "Nepal Rupee"
  },
  {
    code: "ANG",
    symbol: '\u0192',
    name: "Netherlands Antilles Guilder"
  },
  {
    code: "NZD",
    symbol: '\u0024',
    name: "New Zealand Dollar"
  },
  {
    code: "NIO",
    symbol: '\u0043\u0024',
    name: "Nicaragua Cordoba"
  },
  {
    code: "NGN",
    symbol: '\u20a6',
    name: "Nigeria Naira"
  },
  {
    code: "NOK",
    symbol: '\u006b\u0072',
    name: "Norway Krone"
  },
  {
    code: "OMR",
    symbol: '\ufdfc',
    name: "Oman Rial"
  },
  {
    code: "PKR",
    symbol: '\u20a8',
    name: "Pakistan Rupee"
  },
  {
    code: "PAB",
    symbol: '\u0042\u002f\u002e',
    name: "Panama Balboa"
  },
  {
    code: "PYG",
    symbol: '\u0047\u0073',
    name: "Paraguay Guarani"
  },
  {
    code: "PEN",
    symbol: '\u0053\u002f\u002e',
    name: "Peru Nuevo Sol"
  },
  {
    code: "PHP",
    symbol: '\u20b1',
    name: "Philippines Peso"
  },
  {
    code: "PLN",
    symbol: '\u007a\u0142',
    name: "Poland Zloty"
  },
  {
    code: "QAR",
    symbol: '\ufdfc',
    name: "Qatar Riyal"
  },
  {
    code: "RON",
    symbol: '\u006c\u0065\u0069',
    name: "Romania New Leu"
  },
  {
    code: "RUB",
    symbol: '\u0440\u0443\u0431',
    name: "Russia Ruble"
  },
  {
    code: "SHP",
    symbol: '\u00a3',
    name: "Saint Helena Pound"
  },
  {
    code: "SAR",
    symbol: '\ufdfc',
    name: "Saudi Arabia Riyal"
  },
  {
    code: "RSD",
    symbol: '\u0414\u0438\u043d\u002e',
    name: "Serbia Dinar"
  },
  {
    code: "SCR",
    symbol: '\u20a8',
    name: "Seychelles Rupee"
  },
  {
    code: "SGD",
    symbol: '\u0024',
    name: "Singapore Dollar"
  },
  {
    code: "SBD",
    symbol: '\u0024',
    name: "Solomon Islands Dollar"
  },
  {
    code: "SOS",
    symbol: '\u0053',
    name: "Somalia Shilling"
  },
  {
    code: "ZAR",
    symbol: '\u0052',
    name: "South Africa Rand"
  },
  {
    code: "KRW",
    symbol: '\u20a9',
    name: "Korea (South) Won"
  },
  {
    code: "LKR",
    symbol: '\u20a8',
    name: "Sri Lanka Rupee"
  },
  {
    code: "SEK",
    symbol: '\u006b\u0072',
    name: "Sweden Krona"
  },
  {
    code: "CHF",
    symbol: '\u0043\u0048\u0046',
    name: "Switzerland Franc"
  },
  {
    code: "SRD",
    symbol: '\u0024',
    name: "Suriname Dollar"
  },
  {
    code: "SYP",
    symbol: '\u00a3',
    name: "Syria Pound"
  },
  {
    code: "TWD",
    symbol: '\u004e\u0054\u0024',
    name: "Taiwan New Dollar"
  },
  {
    code: "THB",
    symbol: '\u0e3f',
    name: "Thailand Baht"
  },
  {
    code: "TTD",
    symbol: '\u0054\u0054\u0024',
    name: "Trinidad and Tobago Dollar"
  },
  {
    code: "TRY",
    symbol: '\u20a4',
    name: "Turkey Lira"
  },
  {
    code: "TRL",
    symbol: '\u20a4',
    name: "Turkey Lira"
  },
  {
    code: "TVD",
    symbol: '\u0024',
    name: "Tuvalu Dollar"
  },
  {
    code: "UAH",
    symbol: '\u20b4',
    name: "Ukraine Hryvna"
  },
  {
    code: "GBP",
    symbol: '\u00a3',
    name: "United Kingdom Pound"
  },
  {
    code: "USD",
    symbol: '\u0024',
    name: "United States Dollar"
  },
  {
    code: "UYU",
    symbol: '\u0024\u0055',
    name: "Uruguay Peso"
  },
  {
    code: "UZS",
    symbol: '\u043b\u0432',
    name: "Uzbekistan Som"
  },
  {
    code: "VEF",
    symbol: '\u0042\u0073',
    name: "Venezuela Bolivar"
  },
  {
    code: "VND",
    symbol: '\u0020ab',
    name: "Viet Nam Dong"
  },
  {
    code: "YER",
    symbol: '\ufdfc',
    name: "Yemen Rial"
  },
  {
    code: "ZWD",
    symbol: '\u005a\u0024',
    name: "Zimbabwe Dollar"
  }
];

export const currencyData: Prisma.CurrencyCreateInput[] = rawData;

export default async function currencySeedData() {
  await prisma.currency.deleteMany({});
  for (const u of currencyData) {
    const currency = await prisma.currency.create({
      data: u,
    });
    console.log(`Created currency with id: ${currency.code}`);
  }
  console.log(`Completed currency data`);
}