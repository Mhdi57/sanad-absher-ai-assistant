export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  type?: 'text' | 'fines_summary' | 'payment_success' | 'passport_renewal' | 'auth_selection' | 'appointment_selection' | 'status_check';
  data?: any;
  timestamp: Date;
}

export interface Fine {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface PassportInfo {
  number: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'renewing';
}

export interface Contact {
  id: string;
  name: string;
}

export interface AppointmentSlot {
  id: string;
  day: string;
  time: string;
  location: string;
}
