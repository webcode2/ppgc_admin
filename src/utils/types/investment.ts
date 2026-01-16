export interface Transaction {
    amount: number;
    name: string;
    trx_id: string;
    id: number;
    trx_type: "deposit" | "withdrawal" | string;   // extendable
    created_at: string; // ISO timestamp
}

export interface AppInvestmentItem {
    name: string;
    amount: number;
    interest_rate: number;
    duration: number;
    trx: Transaction;
    id: number;
    created_at: string; // ISO timestamp
    roi: number;
    maturity_time: string; // ISO timestamp
    status: "active" | "inactive" | "pending" | string; // extendable
}




export interface CreateInvestmentPayload {
  planName: string;
  category: 'Stocks' | 'Bonds' | 'Real Estate' | 'Crypto' | 'Other';
  minInvestmentAmount: number;
  durationMonths: number;
  annualInterestRate: number;
  description: string;
  status: SubmissionStatus;
}

export interface InvestmentResponse extends CreateInvestmentPayload {
  id: string; // Unique ID assigned by the backend
  createdAt: string;
}

export interface FormErrors {
  planName?: string;
  category?: string;
  minInvestmentAmount?: string;
  durationMonths?: string;
  annualInterestRate?: string;
  description?: string;
}


export type SubmissionStatus = 'DRAFT' | 'PUBLISHED';


export interface ReadInvestmentItem {
    name: string;
    category: string;
    package: string;
    amount: number;
    roi: number;
    investmentDate: string;
    maturityDate: string;
}
