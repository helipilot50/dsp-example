"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetailerStatus = exports.PageType = exports.PageEnvironment = exports.MatchLevel = exports.LookbackWindow = exports.LineitemStatus = exports.FinancialStatus = exports.CurrencyCode = exports.CountryCode = exports.CampaignType = exports.CampaignStatus = exports.CampaignEligibility = exports.BudgetType = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["Demand"] = "DEMAND";
    AccountType["Supply"] = "SUPPLY";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var BudgetType;
(function (BudgetType) {
    BudgetType["Daily"] = "Daily";
    BudgetType["Hourly"] = "Hourly";
    BudgetType["Monthly"] = "Monthly";
    BudgetType["Total"] = "Total";
})(BudgetType = exports.BudgetType || (exports.BudgetType = {}));
var CampaignEligibility;
(function (CampaignEligibility) {
    CampaignEligibility["Auction"] = "Auction";
    CampaignEligibility["Offsite"] = "Offsite";
    CampaignEligibility["OffsiteCpc"] = "OffsiteCpc";
    CampaignEligibility["Preferred"] = "Preferred";
    CampaignEligibility["Unknown"] = "Unknown";
})(CampaignEligibility = exports.CampaignEligibility || (exports.CampaignEligibility = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["Active"] = "Active";
    CampaignStatus["Ended"] = "Ended";
    CampaignStatus["Inactive"] = "Inactive";
    CampaignStatus["Scheduled"] = "Scheduled";
    CampaignStatus["Unknown"] = "Unknown";
})(CampaignStatus = exports.CampaignStatus || (exports.CampaignStatus = {}));
var CampaignType;
(function (CampaignType) {
    CampaignType["CommerceDisplay"] = "CommerceDisplay";
    CampaignType["SponsoredProducts"] = "SponsoredProducts";
    CampaignType["Unknown"] = "Unknown";
})(CampaignType = exports.CampaignType || (exports.CampaignType = {}));
/** ISO 3166 country codes */
var CountryCode;
(function (CountryCode) {
    /** Andorra */
    CountryCode["Ad"] = "AD";
    /** United Arab Emirates */
    CountryCode["Ae"] = "AE";
    /** Afghanistan */
    CountryCode["Af"] = "AF";
    /** Antigua and Barbuda */
    CountryCode["Ag"] = "AG";
    /** Anguilla */
    CountryCode["Ai"] = "AI";
    /** Albania */
    CountryCode["Al"] = "AL";
    /** Armenia */
    CountryCode["Am"] = "AM";
    /** Netherlands Antilles */
    CountryCode["An"] = "AN";
    /** Angola */
    CountryCode["Ao"] = "AO";
    /** Antarctica */
    CountryCode["Aq"] = "AQ";
    /** Argentina */
    CountryCode["Ar"] = "AR";
    /** American Samoa */
    CountryCode["As"] = "AS";
    /** Austria */
    CountryCode["At"] = "AT";
    /** Australia */
    CountryCode["Au"] = "AU";
    /** Aruba */
    CountryCode["Aw"] = "AW";
    /** Åland Islands */
    CountryCode["Ax"] = "AX";
    /** Azerbaijan */
    CountryCode["Az"] = "AZ";
    /** Bosnia and Herzegovina */
    CountryCode["Ba"] = "BA";
    /** Barbados */
    CountryCode["Bb"] = "BB";
    /** Bangladesh */
    CountryCode["Bd"] = "BD";
    /** Belgium */
    CountryCode["Be"] = "BE";
    /** Burkina Faso */
    CountryCode["Bf"] = "BF";
    /** Bulgaria */
    CountryCode["Bg"] = "BG";
    /** Bahrain */
    CountryCode["Bh"] = "BH";
    /** Burundi */
    CountryCode["Bi"] = "BI";
    /** Benin */
    CountryCode["Bj"] = "BJ";
    /** Saint Barthélemy */
    CountryCode["Bl"] = "BL";
    /** Bermuda */
    CountryCode["Bm"] = "BM";
    /** Brunei Darussalam */
    CountryCode["Bn"] = "BN";
    /** Bolivia (Plurinational State of) */
    CountryCode["Bo"] = "BO";
    /** "Bonaire, Sint Eustatius and Saba" */
    CountryCode["Bq"] = "BQ";
    /** Brazil */
    CountryCode["Br"] = "BR";
    /** Bahamas */
    CountryCode["Bs"] = "BS";
    /** Bhutan */
    CountryCode["Bt"] = "BT";
    /** Bouvet Island */
    CountryCode["Bv"] = "BV";
    /** Botswana */
    CountryCode["Bw"] = "BW";
    /** Belarus */
    CountryCode["By"] = "BY";
    /** Belize */
    CountryCode["Bz"] = "BZ";
    /** Canada */
    CountryCode["Ca"] = "CA";
    /** Cocos (Keeling) Islands */
    CountryCode["Cc"] = "CC";
    /** "Congo, Democratic Republic of the" */
    CountryCode["Cd"] = "CD";
    /** Central African Republic */
    CountryCode["Cf"] = "CF";
    /** Congo */
    CountryCode["Cg"] = "CG";
    /** Switzerland */
    CountryCode["Ch"] = "CH";
    /** Côte d'Ivoire */
    CountryCode["Ci"] = "CI";
    /** Cook Islands */
    CountryCode["Ck"] = "CK";
    /** Chile */
    CountryCode["Cl"] = "CL";
    /** Cameroon */
    CountryCode["Cm"] = "CM";
    /** China */
    CountryCode["Cn"] = "CN";
    /** Colombia */
    CountryCode["Co"] = "CO";
    /** Costa Rica */
    CountryCode["Cr"] = "CR";
    /** Cuba */
    CountryCode["Cu"] = "CU";
    /** Cabo Verde */
    CountryCode["Cv"] = "CV";
    /** Curaçao */
    CountryCode["Cw"] = "CW";
    /** Christmas Island */
    CountryCode["Cx"] = "CX";
    /** Cyprus */
    CountryCode["Cy"] = "CY";
    /** Czechia */
    CountryCode["Cz"] = "CZ";
    /** Germany */
    CountryCode["De"] = "DE";
    /** Djibouti */
    CountryCode["Dj"] = "DJ";
    /** Denmark */
    CountryCode["Dk"] = "DK";
    /** Dominica */
    CountryCode["Dm"] = "DM";
    /** Dominican Republic */
    CountryCode["Do"] = "DO";
    /** Algeria */
    CountryCode["Dz"] = "DZ";
    /** Ecuador */
    CountryCode["Ec"] = "EC";
    /** Estonia */
    CountryCode["Ee"] = "EE";
    /** Egypt */
    CountryCode["Eg"] = "EG";
    /** Western Sahara */
    CountryCode["Eh"] = "EH";
    /** Eritrea */
    CountryCode["Er"] = "ER";
    /** Spain */
    CountryCode["Es"] = "ES";
    /** Ethiopia */
    CountryCode["Et"] = "ET";
    /** Finland */
    CountryCode["Fi"] = "FI";
    /** Fiji */
    CountryCode["Fj"] = "FJ";
    /** Falkland Islands (Malvinas) */
    CountryCode["Fk"] = "FK";
    /** Micronesia (Federated States of) */
    CountryCode["Fm"] = "FM";
    /** Faroe Islands */
    CountryCode["Fo"] = "FO";
    /** France */
    CountryCode["Fr"] = "FR";
    /** Gabon */
    CountryCode["Ga"] = "GA";
    /** United Kingdom of Great Britain and Northern Ireland */
    CountryCode["Gb"] = "GB";
    /** Grenada */
    CountryCode["Gd"] = "GD";
    /** Georgia */
    CountryCode["Ge"] = "GE";
    /** French Guiana */
    CountryCode["Gf"] = "GF";
    /** Guernsey */
    CountryCode["Gg"] = "GG";
    /** Ghana */
    CountryCode["Gh"] = "GH";
    /** Gibraltar */
    CountryCode["Gi"] = "GI";
    /** Greenland */
    CountryCode["Gl"] = "GL";
    /** Gambia */
    CountryCode["Gm"] = "GM";
    /** Guinea */
    CountryCode["Gn"] = "GN";
    /** Guadeloupe */
    CountryCode["Gp"] = "GP";
    /** Equatorial Guinea */
    CountryCode["Gq"] = "GQ";
    /** Greece */
    CountryCode["Gr"] = "GR";
    /** South Georgia and the South Sandwich Islands */
    CountryCode["Gs"] = "GS";
    /** Guatemala */
    CountryCode["Gt"] = "GT";
    /** Guam */
    CountryCode["Gu"] = "GU";
    /** Guinea-Bissau */
    CountryCode["Gw"] = "GW";
    /** Guyana */
    CountryCode["Gy"] = "GY";
    /** Hong Kong */
    CountryCode["Hk"] = "HK";
    /** Heard Island and McDonald Islands */
    CountryCode["Hm"] = "HM";
    /** Honduras */
    CountryCode["Hn"] = "HN";
    /** Croatia */
    CountryCode["Hr"] = "HR";
    /** Haiti */
    CountryCode["Ht"] = "HT";
    /** Hungary */
    CountryCode["Hu"] = "HU";
    /** Indonesia */
    CountryCode["Id"] = "ID";
    /** Ireland */
    CountryCode["Ie"] = "IE";
    /** Israel */
    CountryCode["Il"] = "IL";
    /** Isle of Man */
    CountryCode["Im"] = "IM";
    /** India */
    CountryCode["In"] = "IN";
    /** British Indian Ocean Territory */
    CountryCode["Io"] = "IO";
    /** Iraq */
    CountryCode["Iq"] = "IQ";
    /** Iran (Islamic Republic of) */
    CountryCode["Ir"] = "IR";
    /** Iceland */
    CountryCode["Is"] = "IS";
    /** Italy */
    CountryCode["It"] = "IT";
    /** Jersey */
    CountryCode["Je"] = "JE";
    /** Jamaica */
    CountryCode["Jm"] = "JM";
    /** Jordan */
    CountryCode["Jo"] = "JO";
    /** Japan */
    CountryCode["Jp"] = "JP";
    /** Kenya */
    CountryCode["Ke"] = "KE";
    /** Kyrgyzstan */
    CountryCode["Kg"] = "KG";
    /** Cambodia */
    CountryCode["Kh"] = "KH";
    /** Kiribati */
    CountryCode["Ki"] = "KI";
    /** Comoros */
    CountryCode["Km"] = "KM";
    /** Saint Kitts and Nevis */
    CountryCode["Kn"] = "KN";
    /** Korea (Democratic People's Republic of) */
    CountryCode["Kp"] = "KP";
    /** "Korea, Republic of" */
    CountryCode["Kr"] = "KR";
    /** Kuwait */
    CountryCode["Kw"] = "KW";
    /** Cayman Islands */
    CountryCode["Ky"] = "KY";
    /** Kazakhstan */
    CountryCode["Kz"] = "KZ";
    /** Lao People's Democratic Republic */
    CountryCode["La"] = "LA";
    /** Lebanon */
    CountryCode["Lb"] = "LB";
    /** Saint Lucia */
    CountryCode["Lc"] = "LC";
    /** Liechtenstein */
    CountryCode["Li"] = "LI";
    /** Sri Lanka */
    CountryCode["Lk"] = "LK";
    /** Liberia */
    CountryCode["Lr"] = "LR";
    /** Lesotho */
    CountryCode["Ls"] = "LS";
    /** Lithuania */
    CountryCode["Lt"] = "LT";
    /** Luxembourg */
    CountryCode["Lu"] = "LU";
    /** Latvia */
    CountryCode["Lv"] = "LV";
    /** Libya */
    CountryCode["Ly"] = "LY";
    /** Morocco */
    CountryCode["Ma"] = "MA";
    /** Monaco */
    CountryCode["Mc"] = "MC";
    /** "Moldova, Republic of" */
    CountryCode["Md"] = "MD";
    /** Montenegro */
    CountryCode["Me"] = "ME";
    /** Saint Martin (French part) */
    CountryCode["Mf"] = "MF";
    /** Madagascar */
    CountryCode["Mg"] = "MG";
    /** Marshall Islands */
    CountryCode["Mh"] = "MH";
    /** North Macedonia */
    CountryCode["Mk"] = "MK";
    /** Mali */
    CountryCode["Ml"] = "ML";
    /** Myanmar */
    CountryCode["Mm"] = "MM";
    /** Mongolia */
    CountryCode["Mn"] = "MN";
    /** Macao */
    CountryCode["Mo"] = "MO";
    /** Northern Mariana Islands */
    CountryCode["Mp"] = "MP";
    /** Martinique */
    CountryCode["Mq"] = "MQ";
    /** Mauritania */
    CountryCode["Mr"] = "MR";
    /** Montserrat */
    CountryCode["Ms"] = "MS";
    /** Malta */
    CountryCode["Mt"] = "MT";
    /** Mauritius */
    CountryCode["Mu"] = "MU";
    /** Maldives */
    CountryCode["Mv"] = "MV";
    /** Malawi */
    CountryCode["Mw"] = "MW";
    /** Mexico */
    CountryCode["Mx"] = "MX";
    /** Malaysia */
    CountryCode["My"] = "MY";
    /** Mozambique */
    CountryCode["Mz"] = "MZ";
    /** Namibia */
    CountryCode["Na"] = "NA";
    /** New Caledonia */
    CountryCode["Nc"] = "NC";
    /** Niger */
    CountryCode["Ne"] = "NE";
    /** Norfolk Island */
    CountryCode["Nf"] = "NF";
    /** Nigeria */
    CountryCode["Ng"] = "NG";
    /** Nicaragua */
    CountryCode["Ni"] = "NI";
    /** Netherlands */
    CountryCode["Nl"] = "NL";
    /** Norway */
    CountryCode["No"] = "NO";
    /** Nepal */
    CountryCode["Np"] = "NP";
    /** Nauru */
    CountryCode["Nr"] = "NR";
    /** Niue */
    CountryCode["Nu"] = "NU";
    /** New Zealand */
    CountryCode["Nz"] = "NZ";
    /** Oman */
    CountryCode["Om"] = "OM";
    /** Panama */
    CountryCode["Pa"] = "PA";
    /** Peru */
    CountryCode["Pe"] = "PE";
    /** French Polynesia */
    CountryCode["Pf"] = "PF";
    /** Papua New Guinea */
    CountryCode["Pg"] = "PG";
    /** Philippines */
    CountryCode["Ph"] = "PH";
    /** Pakistan */
    CountryCode["Pk"] = "PK";
    /** Poland */
    CountryCode["Pl"] = "PL";
    /** Saint Pierre and Miquelon */
    CountryCode["Pm"] = "PM";
    /** Pitcairn */
    CountryCode["Pn"] = "PN";
    /** Puerto Rico */
    CountryCode["Pr"] = "PR";
    /** "Palestine, State of" */
    CountryCode["Ps"] = "PS";
    /** Portugal */
    CountryCode["Pt"] = "PT";
    /** Palau */
    CountryCode["Pw"] = "PW";
    /** Paraguay */
    CountryCode["Py"] = "PY";
    /** Qatar */
    CountryCode["Qa"] = "QA";
    /** Réunion */
    CountryCode["Re"] = "RE";
    /** Romania */
    CountryCode["Ro"] = "RO";
    /** Serbia */
    CountryCode["Rs"] = "RS";
    /** Russian Federation */
    CountryCode["Ru"] = "RU";
    /** Rwanda */
    CountryCode["Rw"] = "RW";
    /** Saudi Arabia */
    CountryCode["Sa"] = "SA";
    /** Solomon Islands */
    CountryCode["Sb"] = "SB";
    /** Seychelles */
    CountryCode["Sc"] = "SC";
    /** Sudan */
    CountryCode["Sd"] = "SD";
    /** Sweden */
    CountryCode["Se"] = "SE";
    /** Singapore */
    CountryCode["Sg"] = "SG";
    /** "Saint Helena, Ascension and Tristan da Cunha" */
    CountryCode["Sh"] = "SH";
    /** Slovenia */
    CountryCode["Si"] = "SI";
    /** Svalbard and Jan Mayen */
    CountryCode["Sj"] = "SJ";
    /** Slovakia */
    CountryCode["Sk"] = "SK";
    /** Sierra Leone */
    CountryCode["Sl"] = "SL";
    /** San Marino */
    CountryCode["Sm"] = "SM";
    /** Senegal */
    CountryCode["Sn"] = "SN";
    /** Somalia */
    CountryCode["So"] = "SO";
    /** Suriname */
    CountryCode["Sr"] = "SR";
    /** South Sudan */
    CountryCode["Ss"] = "SS";
    /** Sao Tome and Principe */
    CountryCode["St"] = "ST";
    /** El Salvador */
    CountryCode["Sv"] = "SV";
    /** Sint Maarten (Dutch part) */
    CountryCode["Sx"] = "SX";
    /** Syrian Arab Republic */
    CountryCode["Sy"] = "SY";
    /** Eswatini */
    CountryCode["Sz"] = "SZ";
    /** Turks and Caicos Islands */
    CountryCode["Tc"] = "TC";
    /** Chad */
    CountryCode["Td"] = "TD";
    /** French Southern Territories */
    CountryCode["Tf"] = "TF";
    /** Togo */
    CountryCode["Tg"] = "TG";
    /** Thailand */
    CountryCode["Th"] = "TH";
    /** Tajikistan */
    CountryCode["Tj"] = "TJ";
    /** Tokelau */
    CountryCode["Tk"] = "TK";
    /** Timor-Leste */
    CountryCode["Tl"] = "TL";
    /** Turkmenistan */
    CountryCode["Tm"] = "TM";
    /** Tunisia */
    CountryCode["Tn"] = "TN";
    /** Tonga */
    CountryCode["To"] = "TO";
    /** East Timor */
    CountryCode["Tp"] = "TP";
    /** Turkey */
    CountryCode["Tr"] = "TR";
    /** Trinidad and Tobago */
    CountryCode["Tt"] = "TT";
    /** Tuvalu */
    CountryCode["Tv"] = "TV";
    /** "Taiwan, Province of China" */
    CountryCode["Tw"] = "TW";
    /** "Tanzania, United Republic of" */
    CountryCode["Tz"] = "TZ";
    /** Ukraine */
    CountryCode["Ua"] = "UA";
    /** Uganda */
    CountryCode["Ug"] = "UG";
    /** United States Minor Outlying Islands */
    CountryCode["Um"] = "UM";
    /** United States of America */
    CountryCode["Us"] = "US";
    CountryCode["Usaf"] = "USAF";
    /** Uruguay */
    CountryCode["Uy"] = "UY";
    /** Uzbekistan */
    CountryCode["Uz"] = "UZ";
    /** Holy See */
    CountryCode["Va"] = "VA";
    /** Saint Vincent and the Grenadines */
    CountryCode["Vc"] = "VC";
    /** Venezuela (Bolivarian Republic of) */
    CountryCode["Ve"] = "VE";
    /** Virgin Islands (British) */
    CountryCode["Vg"] = "VG";
    /** Virgin Islands (U.S.) */
    CountryCode["Vi"] = "VI";
    /** Viet Nam */
    CountryCode["Vn"] = "VN";
    /** Vanuatu */
    CountryCode["Vu"] = "VU";
    /** Wallis and Futuna */
    CountryCode["Wf"] = "WF";
    /** Samoa */
    CountryCode["Ws"] = "WS";
    /** Yemen */
    CountryCode["Ye"] = "YE";
    /** Mayotte */
    CountryCode["Yt"] = "YT";
    /** South Africa */
    CountryCode["Za"] = "ZA";
    /** Zambia */
    CountryCode["Zm"] = "ZM";
    /** Zimbabwe */
    CountryCode["Zw"] = "ZW";
})(CountryCode = exports.CountryCode || (exports.CountryCode = {}));
/** ISO 4217 currency codes */
var CurrencyCode;
(function (CurrencyCode) {
    /** UAE Dirham */
    CurrencyCode["Aed"] = "AED";
    /** Afghani */
    CurrencyCode["Afn"] = "AFN";
    /** Lek */
    CurrencyCode["All"] = "ALL";
    /** Armenian Dram */
    CurrencyCode["Amd"] = "AMD";
    /** Netherlands Antillean Guilder */
    CurrencyCode["Ang"] = "ANG";
    /** Kwanza */
    CurrencyCode["Aoa"] = "AOA";
    CurrencyCode["Aqd"] = "AQD";
    /** Argentine Peso */
    CurrencyCode["Ars"] = "ARS";
    /** Australian Dollar */
    CurrencyCode["Aud"] = "AUD";
    /** Aruban Florin */
    CurrencyCode["Awg"] = "AWG";
    /** Azerbaijan Manat */
    CurrencyCode["Azn"] = "AZN";
    /** Convertible Mark */
    CurrencyCode["Bam"] = "BAM";
    /** Barbados Dollar */
    CurrencyCode["Bbd"] = "BBD";
    /** Taka */
    CurrencyCode["Bdt"] = "BDT";
    /** Bulgarian Lev */
    CurrencyCode["Bgn"] = "BGN";
    /** Bahraini Dinar */
    CurrencyCode["Bhd"] = "BHD";
    /** Burundi Franc */
    CurrencyCode["Bif"] = "BIF";
    /** Bermudian Dollar */
    CurrencyCode["Bmd"] = "BMD";
    /** Brunei Dollar */
    CurrencyCode["Bnd"] = "BND";
    /** Boliviano */
    CurrencyCode["Bob"] = "BOB";
    /** Mvdol */
    CurrencyCode["Bov"] = "BOV";
    /** Brazilian Real */
    CurrencyCode["Brl"] = "BRL";
    /** Bahamian Dollar */
    CurrencyCode["Bsd"] = "BSD";
    /** Ngultrum */
    CurrencyCode["Btn"] = "BTN";
    /** Pula */
    CurrencyCode["Bwp"] = "BWP";
    /** Belarusian Ruble */
    CurrencyCode["Byn"] = "BYN";
    /** Belarus Ruble */
    CurrencyCode["Byr"] = "BYR";
    /** Belize Dollar */
    CurrencyCode["Bzd"] = "BZD";
    /** Canadian Dollar */
    CurrencyCode["Cad"] = "CAD";
    /** Congolese Franc */
    CurrencyCode["Cdf"] = "CDF";
    /** WIR Euro */
    CurrencyCode["Che"] = "CHE";
    /** Swiss Franc */
    CurrencyCode["Chf"] = "CHF";
    /** WIR Franc */
    CurrencyCode["Chw"] = "CHW";
    /** Unidad de Fomento */
    CurrencyCode["Clf"] = "CLF";
    /** Chilean Peso */
    CurrencyCode["Clp"] = "CLP";
    /** Yuan Renminbi */
    CurrencyCode["Cny"] = "CNY";
    /** Colombian Peso */
    CurrencyCode["Cop"] = "COP";
    /** Unidad de Valor Real */
    CurrencyCode["Cou"] = "COU";
    /** Costa Rican Colon */
    CurrencyCode["Crc"] = "CRC";
    /** Peso Convertible */
    CurrencyCode["Cuc"] = "CUC";
    /** Cuban Peso */
    CurrencyCode["Cup"] = "CUP";
    /** Cabo Verde Escudo */
    CurrencyCode["Cve"] = "CVE";
    CurrencyCode["Cyp"] = "CYP";
    /** Czech Koruna */
    CurrencyCode["Czk"] = "CZK";
    /** Djibouti Franc */
    CurrencyCode["Djf"] = "DJF";
    /** Danish Krone */
    CurrencyCode["Dkk"] = "DKK";
    /** Dominican Peso */
    CurrencyCode["Dop"] = "DOP";
    /** Algerian Dinar */
    CurrencyCode["Dzd"] = "DZD";
    CurrencyCode["Ecs"] = "ECS";
    CurrencyCode["Eek"] = "EEK";
    /** Egyptian Pound */
    CurrencyCode["Egp"] = "EGP";
    /** Nakfa */
    CurrencyCode["Ern"] = "ERN";
    /** Ethiopian Birr */
    CurrencyCode["Etb"] = "ETB";
    /** Euro */
    CurrencyCode["Eur"] = "EUR";
    /** Fiji Dollar */
    CurrencyCode["Fjd"] = "FJD";
    /** Falkland Islands Pound */
    CurrencyCode["Fkp"] = "FKP";
    /** Pound Sterling */
    CurrencyCode["Gbp"] = "GBP";
    /** Lari */
    CurrencyCode["Gel"] = "GEL";
    CurrencyCode["Ggp"] = "GGP";
    /** Ghana Cedi */
    CurrencyCode["Ghs"] = "GHS";
    /** Gibraltar Pound */
    CurrencyCode["Gip"] = "GIP";
    /** Dalasi */
    CurrencyCode["Gmd"] = "GMD";
    /** Guinean Franc */
    CurrencyCode["Gnf"] = "GNF";
    /** Quetzal */
    CurrencyCode["Gtq"] = "GTQ";
    /** Guyana Dollar */
    CurrencyCode["Gyd"] = "GYD";
    /** Hong Kong Dollar */
    CurrencyCode["Hkd"] = "HKD";
    /** Lempira */
    CurrencyCode["Hnl"] = "HNL";
    /** Kuna */
    CurrencyCode["Hrk"] = "HRK";
    /** Gourde */
    CurrencyCode["Htg"] = "HTG";
    /** Forint */
    CurrencyCode["Huf"] = "HUF";
    /** Rupiah */
    CurrencyCode["Idr"] = "IDR";
    /** New Israeli Sheqel */
    CurrencyCode["Ils"] = "ILS";
    /** Indian Rupee */
    CurrencyCode["Inr"] = "INR";
    /** Iraqi Dinar */
    CurrencyCode["Iqd"] = "IQD";
    /** Iranian Rial */
    CurrencyCode["Irr"] = "IRR";
    /** Iceland Krona */
    CurrencyCode["Isk"] = "ISK";
    /** Jamaican Dollar */
    CurrencyCode["Jmd"] = "JMD";
    /** Jordanian Dinar */
    CurrencyCode["Jod"] = "JOD";
    /** Yen */
    CurrencyCode["Jpy"] = "JPY";
    /** Kenyan Shilling */
    CurrencyCode["Kes"] = "KES";
    /** Som */
    CurrencyCode["Kgs"] = "KGS";
    /** Riel */
    CurrencyCode["Khr"] = "KHR";
    /** Comorian Franc */
    CurrencyCode["Kmf"] = "KMF";
    /** North Korean Won */
    CurrencyCode["Kpw"] = "KPW";
    /** Won */
    CurrencyCode["Krw"] = "KRW";
    /** Kuwaiti Dinar */
    CurrencyCode["Kwd"] = "KWD";
    /** Cayman Islands Dollar */
    CurrencyCode["Kyd"] = "KYD";
    /** Tenge */
    CurrencyCode["Kzt"] = "KZT";
    /** Lao Kip */
    CurrencyCode["Lak"] = "LAK";
    /** Lebanese Pound */
    CurrencyCode["Lbp"] = "LBP";
    /** Sri Lanka Rupee */
    CurrencyCode["Lkr"] = "LKR";
    /** Liberian Dollar */
    CurrencyCode["Lrd"] = "LRD";
    /** Loti */
    CurrencyCode["Lsl"] = "LSL";
    CurrencyCode["Ltl"] = "LTL";
    CurrencyCode["Lvl"] = "LVL";
    /** Libyan Dinar */
    CurrencyCode["Lyd"] = "LYD";
    /** Moroccan Dirham */
    CurrencyCode["Mad"] = "MAD";
    /** Moldovan Leu */
    CurrencyCode["Mdl"] = "MDL";
    /** Malagasy Ariary */
    CurrencyCode["Mga"] = "MGA";
    /** Denar */
    CurrencyCode["Mkd"] = "MKD";
    /** Kyat */
    CurrencyCode["Mmk"] = "MMK";
    /** Tugrik */
    CurrencyCode["Mnt"] = "MNT";
    /** Pataca */
    CurrencyCode["Mop"] = "MOP";
    CurrencyCode["Mro"] = "MRO";
    /** Ouguiya */
    CurrencyCode["Mru"] = "MRU";
    CurrencyCode["Mtl"] = "MTL";
    /** Mauritius Rupee */
    CurrencyCode["Mur"] = "MUR";
    /** Rufiyaa */
    CurrencyCode["Mvr"] = "MVR";
    /** Malawi Kwacha */
    CurrencyCode["Mwk"] = "MWK";
    /** Mexican Peso */
    CurrencyCode["Mxn"] = "MXN";
    /** Mexican Unidad de Inversion (UDI) */
    CurrencyCode["Mxv"] = "MXV";
    /** Malaysian Ringgit */
    CurrencyCode["Myr"] = "MYR";
    /** Mozambique Metical */
    CurrencyCode["Mzn"] = "MZN";
    /** Namibia Dollar */
    CurrencyCode["Nad"] = "NAD";
    /** Naira */
    CurrencyCode["Ngn"] = "NGN";
    /** Cordoba Oro */
    CurrencyCode["Nio"] = "NIO";
    /** Norwegian Krone */
    CurrencyCode["Nok"] = "NOK";
    /** Nepalese Rupee */
    CurrencyCode["Npr"] = "NPR";
    /** New Zealand Dollar */
    CurrencyCode["Nzd"] = "NZD";
    /** Rial Omani */
    CurrencyCode["Omr"] = "OMR";
    /** Balboa */
    CurrencyCode["Pab"] = "PAB";
    /** Sol */
    CurrencyCode["Pen"] = "PEN";
    /** Kina */
    CurrencyCode["Pgk"] = "PGK";
    /** Philippine Peso */
    CurrencyCode["Php"] = "PHP";
    /** Pakistan Rupee */
    CurrencyCode["Pkr"] = "PKR";
    /** Zloty */
    CurrencyCode["Pln"] = "PLN";
    /** Guarani */
    CurrencyCode["Pyg"] = "PYG";
    /** Qatari Rial */
    CurrencyCode["Qar"] = "QAR";
    /** Romanian Leu */
    CurrencyCode["Ron"] = "RON";
    /** Serbian Dinar */
    CurrencyCode["Rsd"] = "RSD";
    /** Russian Ruble */
    CurrencyCode["Rub"] = "RUB";
    /** Rwanda Franc */
    CurrencyCode["Rwf"] = "RWF";
    /** Saudi Riyal */
    CurrencyCode["Sar"] = "SAR";
    /** Solomon Islands Dollar */
    CurrencyCode["Sbd"] = "SBD";
    /** Seychelles Rupee */
    CurrencyCode["Scr"] = "SCR";
    /** Sudanese Pound */
    CurrencyCode["Sdg"] = "SDG";
    /** Swedish Krona */
    CurrencyCode["Sek"] = "SEK";
    /** Singapore Dollar */
    CurrencyCode["Sgd"] = "SGD";
    /** Saint Helena Pound */
    CurrencyCode["Shp"] = "SHP";
    CurrencyCode["Skk"] = "SKK";
    /** Leone */
    CurrencyCode["Sll"] = "SLL";
    /** Somali Shilling */
    CurrencyCode["Sos"] = "SOS";
    /** Surinam Dollar */
    CurrencyCode["Srd"] = "SRD";
    CurrencyCode["Ssk"] = "SSK";
    /** South Sudanese Pound */
    CurrencyCode["Ssp"] = "SSP";
    CurrencyCode["Std"] = "STD";
    /** Dobra */
    CurrencyCode["Stn"] = "STN";
    /** El Salvador Colon */
    CurrencyCode["Svc"] = "SVC";
    /** Syrian Pound */
    CurrencyCode["Syp"] = "SYP";
    /** Lilangeni */
    CurrencyCode["Szl"] = "SZL";
    /** Baht */
    CurrencyCode["Thb"] = "THB";
    /** Somoni */
    CurrencyCode["Tjs"] = "TJS";
    /** Turkmenistan New Manat */
    CurrencyCode["Tmt"] = "TMT";
    /** Tunisian Dinar */
    CurrencyCode["Tnd"] = "TND";
    /** Pa'anga */
    CurrencyCode["Top"] = "TOP";
    /** Turkish Lira */
    CurrencyCode["Try"] = "TRY";
    /** Trinidad and Tobago Dollar */
    CurrencyCode["Ttd"] = "TTD";
    /** New Taiwan Dollar */
    CurrencyCode["Twd"] = "TWD";
    /** Tanzanian Shilling */
    CurrencyCode["Tzs"] = "TZS";
    /** Hryvnia */
    CurrencyCode["Uah"] = "UAH";
    /** Uganda Shilling */
    CurrencyCode["Ugx"] = "UGX";
    /** US Dollar */
    CurrencyCode["Usd"] = "USD";
    /** Uruguay Peso en Unidades Indexadas (UI) */
    CurrencyCode["Uyi"] = "UYI";
    /** Peso Uruguayo */
    CurrencyCode["Uyu"] = "UYU";
    /** Unidad Previsional */
    CurrencyCode["Uyw"] = "UYW";
    /** Uzbekistan Sum */
    CurrencyCode["Uzs"] = "UZS";
    CurrencyCode["Vef"] = "VEF";
    /** Bolívar Soberano */
    CurrencyCode["Ves"] = "VES";
    /** Dong */
    CurrencyCode["Vnd"] = "VND";
    /** Vatu */
    CurrencyCode["Vuv"] = "VUV";
    /** Tala */
    CurrencyCode["Wst"] = "WST";
    /** CFA Franc BEAC */
    CurrencyCode["Xaf"] = "XAF";
    /** Silver */
    CurrencyCode["Xag"] = "XAG";
    /** Gold */
    CurrencyCode["Xau"] = "XAU";
    /** Bond Markets Unit European Composite Unit (EURCO) */
    CurrencyCode["Xba"] = "XBA";
    /** Bond Markets Unit European Monetary Unit (E.M.U.-6) */
    CurrencyCode["Xbb"] = "XBB";
    /** Bond Markets Unit European Unit of Account 9 (E.U.A.-9) */
    CurrencyCode["Xbc"] = "XBC";
    /** Bond Markets Unit European Unit of Account 17 (E.U.A.-17) */
    CurrencyCode["Xbd"] = "XBD";
    /** East Caribbean Dollar */
    CurrencyCode["Xcd"] = "XCD";
    /** SDR (Special Drawing Right) */
    CurrencyCode["Xdr"] = "XDR";
    /** CFA Franc BCEAO */
    CurrencyCode["Xof"] = "XOF";
    /** Palladium */
    CurrencyCode["Xpd"] = "XPD";
    /** CFP Franc */
    CurrencyCode["Xpf"] = "XPF";
    /** Platinum */
    CurrencyCode["Xpt"] = "XPT";
    /** Sucre */
    CurrencyCode["Xsu"] = "XSU";
    /** Codes specifically reserved for testing purposes */
    CurrencyCode["Xts"] = "XTS";
    /** ADB Unit of Account */
    CurrencyCode["Xua"] = "XUA";
    /** Yemeni Rial */
    CurrencyCode["Yer"] = "YER";
    /** Rand */
    CurrencyCode["Zar"] = "ZAR";
    CurrencyCode["Zmk"] = "ZMK";
    /** Zambian Kwacha */
    CurrencyCode["Zmw"] = "ZMW";
    CurrencyCode["Zwd"] = "ZWD";
    /** Zimbabwe Dollar */
    CurrencyCode["Zwl"] = "ZWL";
})(CurrencyCode = exports.CurrencyCode || (exports.CurrencyCode = {}));
var FinancialStatus;
(function (FinancialStatus) {
    FinancialStatus["Active"] = "Active";
    FinancialStatus["BudgetHitDaily"] = "BudgetHitDaily";
    FinancialStatus["BudgetHitMonthly"] = "BudgetHitMonthly";
    FinancialStatus["BudgetHitTotal"] = "BudgetHitTotal";
    FinancialStatus["NoFunds"] = "NoFunds";
    FinancialStatus["Unknown"] = "Unknown";
})(FinancialStatus = exports.FinancialStatus || (exports.FinancialStatus = {}));
var LineitemStatus;
(function (LineitemStatus) {
    LineitemStatus["Active"] = "Active";
    LineitemStatus["Archived"] = "Archived";
    LineitemStatus["Paused"] = "Paused";
})(LineitemStatus = exports.LineitemStatus || (exports.LineitemStatus = {}));
/**
 * Look back window is the attribution window and refers to the acceptable number of days between the click and the conversion.
 *
 * See: https://criteo.atlassian.net/wiki/spaces/RMP/pages/1503109321/8.1.7.4.+Attribution+-+Look-back+Windows+and+How+to+Customize+Them
 */
var LookbackWindow;
(function (LookbackWindow) {
    /** 30 Days */
    LookbackWindow["OneMonth"] = "OneMonth";
    /** 7 Days */
    LookbackWindow["OneWeek"] = "OneWeek";
    /** 14 Days */
    LookbackWindow["TwoWeeks"] = "TwoWeeks";
})(LookbackWindow = exports.LookbackWindow || (exports.LookbackWindow = {}));
/** SKU matching level is used in Attribution and is the level of granularity at which the SKU is matched. */
var MatchLevel;
(function (MatchLevel) {
    /** Matches on the exact SKU */
    MatchLevel["Sku"] = "Sku";
    /** Matches on SKU Category */
    MatchLevel["SkuCategory"] = "SkuCategory";
    /** Matches on SKU Category and SKU Brand */
    MatchLevel["SkuCategoryBrand"] = "SkuCategoryBrand";
})(MatchLevel = exports.MatchLevel || (exports.MatchLevel = {}));
var PageEnvironment;
(function (PageEnvironment) {
    PageEnvironment["App"] = "App";
    PageEnvironment["Mobile"] = "Mobile";
    PageEnvironment["Web"] = "Web";
})(PageEnvironment = exports.PageEnvironment || (exports.PageEnvironment = {}));
var PageType;
(function (PageType) {
    PageType["Brand"] = "Brand";
    PageType["Category"] = "Category";
    PageType["Other"] = "Other";
    PageType["Product"] = "Product";
    PageType["Search"] = "Search";
})(PageType = exports.PageType || (exports.PageType = {}));
var RetailerStatus;
(function (RetailerStatus) {
    RetailerStatus["Active"] = "ACTIVE";
    RetailerStatus["Inactive"] = "INACTIVE";
    RetailerStatus["Live"] = "LIVE";
})(RetailerStatus = exports.RetailerStatus || (exports.RetailerStatus = {}));
