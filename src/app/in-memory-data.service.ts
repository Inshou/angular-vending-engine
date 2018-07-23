import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const vendors = [
      { id: 1, 
        name: 'User', 
        money: { id: 1, money: [10, 30, 20, 15] },
        store: [],
        deposite: 0
      },
      { id: 2, 
        name: 'CoffeeMachine', 
        money: { id: 2, money: [100, 100, 100, 100] },
        store: [
          { id: 1, title: 'Tea', cost: 13, quantity: 10 },
          { id: 2, title: 'Coffee', cost: 18, quantity: 20 },
          { id: 3, title: 'Coffee with milk', cost: 21, quantity: 20 },
          { id: 4, title: 'Juice', cost: 35, quantity: 15 }
        ],
        deposite: 0
      }
    ];

    const settings = {
      coins : [
        { id: 0, value: 1, title: '1 rub'},
        { id: 1, value: 2, title: '2 rub'},
        { id: 2, value: 5, title: '5 rub'},
        { id: 3, value: 10, title: '10 rub'}
      ],
      defaultMoney : [10, 30, 20, 15],
      defaultVendorId: 2,
      defaultCustomerId: 1
    };
    return {settings, vendors};
  }
}