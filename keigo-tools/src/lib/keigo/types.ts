export type RecipientType = 'external' | 'boss' | 'colleague' | 'recruiter';
export type EmailType =
  | 'thanks'
  | 'apology'
  | 'request'
  | 'report'
  | 'inquiry'
  | 'schedule'
  | 'reminder'
  | 'decline'
  | 'greeting'
  | 'proposal'
  | 'invitation'
  | 'congratulation'
  | 'condolence'
  | 'custom';

export type AdjustmentType = 'more-formal' | 'more-casual' | undefined;

export interface KeigoTechnique {
  original: string;
  converted: string;
  explanation: string;
}

export interface GenerateRequest {
  recipient: RecipientType;
  emailType: EmailType;
  tone: number;
  subject: string;
  content: string;
  senderName?: string;
  senderCompany?: string;
  recipientName?: string;
  recipientCompany?: string;
  adjustment?: AdjustmentType;
}

export interface GenerateResult {
  subject: string;
  body: string;
  techniques: KeigoTechnique[];
}

export interface Template {
  id: string;
  label: string;
  category: string;
  recipient: RecipientType;
  type: EmailType;
  subject: string;
  body: string;
}
