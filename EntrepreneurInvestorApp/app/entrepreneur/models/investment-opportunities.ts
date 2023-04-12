export interface InvestmentOpportunityJourney {
    name: string,
    imageUrl: string,
    stage: string,
    date: Date,
    opportunity: string
}

export interface InvestmentOpportunities {
    investment: number;
    stage: string;
    equity: number;
    valuation: number;
  }