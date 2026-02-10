export const DOCUMENT_TYPES = {
  // Employment
  T4: 'T4 - Employment Income',
  RL1: 'RL-1 - Relevé 1 (Quebec Employment)',
  T4A: 'T4A - Pension/Other Income',
  RL2: 'RL-2 - Relevé 2 (Quebec Pension)',
  
  // Investment
  T5: 'T5 - Investment Income',
  RL3: 'RL-3 - Relevé 3 (Quebec Investment)',
  T3: 'T3 - Trust Income',
  RL16: 'RL-16 - Relevé 16 (Quebec Trust)',
  
  // Deductions
  RRSP_RECEIPT: 'RRSP Contribution Receipt',
  T2202: 'T2202 - Tuition',
  RL8: 'RL-8 - Relevé 8 (Quebec Tuition)',
  CHILDCARE_RECEIPT: 'Childcare Receipt',
  RL24: 'RL-24 - Relevé 24 (Quebec Childcare)',
  DONATION_RECEIPT: 'Donation Receipt',
  MEDICAL_RECEIPT: 'Medical Expense Receipt',
  
  // Other
  T2200: 'T2200 - Employment Conditions',
  RECEIPT: 'General Receipt'
} as const;

export type DocType = keyof typeof DOCUMENT_TYPES;
