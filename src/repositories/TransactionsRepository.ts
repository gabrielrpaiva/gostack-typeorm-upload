import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<IBalance> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();

    const { income, outcome } = transactions.reduce(
      (sumAll: IBalance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            sumAll.income += Number(transaction.value);
            break;
          case 'outcome':
            sumAll.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        sumAll.total += Number(transaction.value);
        return sumAll;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
