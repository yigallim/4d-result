export interface PrizeDetails {
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  special: string[];
  consolation: string[];
}

export interface ProviderResults {
  damacai?: PrizeDetails;
  magnum?: PrizeDetails;
  toto?: PrizeDetails;
  error?: string;
}
