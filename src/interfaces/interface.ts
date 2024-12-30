export interface StockDetails {
    tickerId: string;
    companyName: string;
    industry: string;
    companyProfile: CompanyProfile;
    currentPrice: {
        BSE: string;
        NSE: string;
    };
    stockTechnicalData: StockTechnicalData;
    percentChange: string;
    yearHigh: string;
    yearLow: string;
    financials: FiscalData[];
    keyMetrics: {
        [key: string]: any; 
    };
    futureExpiryDates: string[];
    futureOverviewData: {
        [key: string]: any; 
    };
    initialStockFinancialData: {
        [key: string]: any; 
    };
    analystView: AnalystView[];
    recosBar: {
        stockAnalyst:{
            colorCode: string;
            ratingName: string;
            ratingValue: number;
            minValue: number;
            maxValue: number;
            numberOfAnalysts: number;
          }[]
        tickerRatingValue: number;
        isDataPresent: boolean;
        noOfRecommendations: number;
        meanValue: number;
        tickerPercentage: number;
    };
    riskMeter: { 
        categoryName: string; 
        stdDev: number;
    };
    shareholding: {
        categoryName: string;
        categories: {
            holdingDate: string;
            percentage: string;
          }[];
      };
    stockCorporateActionData:CorporateActions;
    stockDetailsReusableData: {
            close: string;
            date: string;
            time: string;
            price: string;
            percentChange: string;
            marketCap: string;
            yhigh: string;
            ylow: string;
            high: string;
            low: string;
            pPerEBasicExcludingExtraordinaryItemsTTM: string;
            currentDividendYieldCommonStockPrimaryIssueLTM: string;
            totalDebtPerTotalEquityMostRecentQuarter: string;
            priceYTDPricePercentChange: string;
            price5DayPercentChange: string;
            NetIncome: string;
            FiscalYear: string;
            interimNetIncome: string;
            stockAnalyst: {
                colorCode: string;
                ratingName: string;
                ratingValue: number;
                numberOfAnalystsLatest: string;
                numberOfAnalysts1WeekAgo: string;
                numberOfAnalysts1MonthAgo: string;
                numberOfAnalysts2MonthAgo: string;
                numberOfAnalysts3MonthAgo: string;
              }[];
            peerCompanyList: TickerDetails[];
            sectorPriceToEarningsValueRatio: string;
            averageRating: string;
    };
    stockFinancialData:[]
    recentNews: {
        id: string;
        headline: string;
        date: string;
        timeToRead: string; 
        url: string;
        listimage: string;
        thumbnailimage: string;
      }[];
}


interface CompanyProfile {
    companyDescription: string;
    mgIndustry: string;
    isInId: string;
    officers: Officers;
    exchangeCodeBse: string;
    exchangeCodeNse: string;
    peerCompanyList: PeerCompany[];
  }
  

  interface Officers {
    officer: Officer[];
  }
  
  interface Officer {
    rank: number;
    since: string;
    firstName: string;
    mI?: string | null;
    lastName: string;
    age?: string | null;
    title: Title;
  }
  
  interface Title {
    startYear: string;
    startMonth: string;
    startDay: string;
    iD1: string;
    abbr1: string;
    iD2?: string | null;
    abbr2?: string | null;
    Value: string;
  }
  
  interface PeerCompany {
    tickerId: string;
    companyName: string;
    priceToBookValueRatio: number;
    priceToEarningsValueRatio: number;
    marketCap: number;
    price: number;
    percentChange: number;
    netChange: number;
    returnOnAverageEquity5YearAverage: number;
    returnOnAverageEquityTrailing12Month: number;
    ltDebtPerEquityMostRecentFiscalYear: number;
    netProfitMargin5YearAverage: number;
    netProfitMarginPercentTrailing12Month: number;
    dividendYieldIndicatedAnnualDividend: number;
    totalSharesOutstanding: number;
    languageSupport: string;
    imageUrl: string;
    overallRating: string;
    ylow: number;
    yhigh: number;
  }

  interface StockTechnicalData {
    days: number;
    bsePrice: string;
    nsePrice: string;
  }
  

  export interface FiscalData {
    stockFinancialMap:FinancialData
    FiscalYear: string;
    EndDate: string;
    Type: string;
    StatementDate: string;
    fiscalPeriodNumber: number;
  }
  

  export interface FinancialData {
    CAS: FinancialItem[];
    BAL: FinancialItem[];
    INC: FinancialItem[];
  }
  
  export interface FinancialItem {
    displayName: string;
    key: string;
    value: string;
    yqoQComp: string | null;
    qoQComp: string | null;
  }

  interface CorporateActions {
    bonus: BonusAction[];
    dividend: DividendAction[];
    rights: any[]; 
    splits: any[]; 
    annualGeneralMeeting: AGMAction[];
    boardMeetings: BoardMeeting[];
  }
  
  interface BonusAction {
    tickerId: string;
    companyName: string;
    remarks: string;
    recordDate: string;
    xbDate: string;
    sortDate: string;
  }
  
  interface DividendAction {
    tickerId: string;
    companyName: string;
    remarks: string;
    recordDate: string;
    xdDate: string;
    interimOrFinal: string;
    instrumentType: number;
    value: number;
    percentage: number;
    dateOfAnnouncement: string;
    bookClosureStartDate: string;
    bookClosureEndDate: string;
    sortDate: string;
  }
  

  
  interface AGMAction {
    tickerId: string;
    companyName: string;
    remarks: string;
    dateOfAnnouncement: string;
    recordDate: string;
    agmDate: string;
    purpose: string;
  }
  
  interface BoardMeeting {
    tickerId: string;
    companyName: string;
    remarks: string;
    boardMeetDate: string;
    purpose: string;
  }
  
  interface TickerDetails {
    tickerId: string;
    companyName: string;
    priceToBookValueRatio: number;
    priceToEarningsValueRatio: number;
    marketCap: number;
    price: number;
    percentChange: number;
    netChange: number;
    returnOnAverageEquity5YearAverage: number;
    returnOnAverageEquityTrailing12Month: number;
    ltDebtPerEquityMostRecentFiscalYear: number;
    netProfitMargin5YearAverage: number;
    netProfitMarginPercentTrailing12Month: number;
    dividendYieldIndicatedAnnualDividend: number;
    totalSharesOutstanding: number;
    languageSupport: string;
    imageUrl: string;
    overallRating: string;
    yhigh: number;
    ylow: number;
  }


  export interface CompanyData {
    companyName: string;
    currentPrice: {
      BSE: string;
      NSE: string;
    };
    percentChange: string;
    yearHigh: string;
    yearLow: string;
    valuation: {
      priceToBookValueRatio: number;
      priceToEarningsValueRatio: number;
      marketCap: number;
    };
    profitability: {
      returnOnEquity: number;
      netProfitMargin: number;
    };
    dividend: {
      yield: number;
    };
    debt: {
      debtToEquity: number;
    };
    companyDescription?:string;
  }
  
  export interface StockAnalysisModel extends CompanyData {
    latestNewsUrls: {url:string}[];
  }


  export interface AnalystView{
    colorCode: string;
    ratingName: string;
    ratingValue: number;
    numberOfAnalystsLatest: string;
    numberOfAnalysts1WeekAgo: string;
    numberOfAnalysts1MonthAgo: string;
    numberOfAnalysts2MonthAgo: string;
    numberOfAnalysts3MonthAgo: string;
  }[]