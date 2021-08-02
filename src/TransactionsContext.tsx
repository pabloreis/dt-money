import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from './services/api';

export interface ITransaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  createdAt: Date;
  type: string;
}

type TransactionModel = Omit<ITransaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextModel {
  transactions: ITransaction[];
  createTransactions: (transaction: TransactionModel) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextModel>({} as TransactionsContextModel);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    api.get('/transactions').then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransactions(transaction: TransactionModel): Promise<void> {
    const response = await api.post('/transactions', {
      ...transaction,
      createdAt: new Date()
    });
    const { transaction: newTransaction } = response.data;

    setTransactions([...transactions, newTransaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}