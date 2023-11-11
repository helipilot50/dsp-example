
// find export const (.+) = topicForSubscription\('(.+)'\);
// replace case '$2':\nreturn process.env.KAFKA_TOPIC_$1 || subscriptionName;

export function topicForSubscription(subscriptionName: string) {
  switch (subscriptionName) {
    case 'LineitemActivated':
      return process.env.KAFKA_TOPIC_LINEITEM_ACTIVATED || subscriptionName;
    case 'LineitemPaused':
      return process.env.KAFKA_TOPIC_LINEITEM_PAUSED || subscriptionName;
    case 'LineitemCreated':
      return process.env.KAFKA_TOPIC_LINEITEM_CREATED || subscriptionName;
    case 'AccountCreated':
      return process.env.KAFKA_TOPIC_ACCOUNT_CREATED || subscriptionName;
    case 'PortfolioUsersUpdated':
      return process.env.KAFKA_TOPIC_PORTFOLIO_USERS_UPDATED || subscriptionName;
    case 'PortfolioCreated':
      return process.env.KAFKA_TOPIC_PORTFOLIO_CREATED || subscriptionName;
    case 'PortfolioAccountsUpdated':
      return process.env.KAFKA_TOPIC_PORTFOLIO_ACCOUNTS_UPDATED || subscriptionName;
    case 'PortfolioBrandsUpdated':
      return process.env.KAFKA_TOPIC_PORTFOLIO_BRANDS_UPDATED || subscriptionName;
    case 'AccountCreated':
      return process.env.KAFKA_TOPIC_ACCOUNT_CREATED || subscriptionName;
    case 'AccountBrandedKeywordsDisabled':
      return process.env.KAFKA_TOPIC_ACCOUNT_BRANDED_KEYWORDS_DISABLED || subscriptionName;
    case 'AccountBrandedKeywordsEnabled':
      return process.env.KAFKA_TOPIC_ACCOUNT_BRANDED_KEYWORDS_ENABLED || subscriptionName;
    case 'AccountBrandsUpated':
      return process.env.KAFKA_TOPIC_ACCOUNT_BRANDS_UPATED || subscriptionName;
    case 'AccountCountryAdded':
      return process.env.KAFKA_TOPIC_ACCOUNT_COUNTRY_ADDED || subscriptionName;
    case 'AccountCurrencyDataChanged':
      return process.env.KAFKA_TOPIC_ACCOUNT_CURRENCY_DATA_CHANGED || subscriptionName;
    case 'AccountFeesModified':
      return process.env.KAFKA_TOPIC_ACCOUNT_FEES_MODIFIED || subscriptionName;
    case 'AccountInitialized':
      return process.env.KAFKA_TOPIC_ACCOUNT_INITIALIZED || subscriptionName;
    case 'AccountReportingLabelModified':
      return process.env.KAFKA_TOPIC_ACCOUNT_REPORTING_LABEL_MODIFIED || subscriptionName;
    case 'AccountRetailerConnected':
      return process.env.KAFKA_TOPIC_ACCOUNT_RETAILER_CONNECTED || subscriptionName;
    case 'AccountRetailersUpdated':
      return process.env.KAFKA_TOPIC_ACCOUNT_RETAILERS_UPDATED || subscriptionName;
    case 'AccountSalesforceDataModified':
      return process.env.KAFKA_TOPIC_ACCOUNT_SALESFORCE_DATA_MODIFIED || subscriptionName;
    case 'AccountSellerModified':
      return process.env.KAFKA_TOPIC_ACCOUNT_SELLER_MODIFIED || subscriptionName;
    case 'AccountWhileLabelSettingsCreated':
      return process.env.KAFKA_TOPIC_ACCOUNT_WHITE_LABEL_SETTINGS_CREATED || subscriptionName;
    case 'AccountWhileLabelSettingsUpdated':
      return process.env.KAFKA_TOPIC_ACCOUNT_WHITE_LABEL_SETTINGS_UPDATED || subscriptionName;
    default:
      return subscriptionName;
  }
}