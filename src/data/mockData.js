export const mockBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', isbn: '9780132350884', category: 'Programming', total_copies: 3, available_copies: 2 },
  { id: 2, title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780062315007', category: 'Fiction', total_copies: 5, available_copies: 5 },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', category: 'Self-Help', total_copies: 2, available_copies: 0 },
];

export const mockMembers = [
  { id: 1, name: 'Anjali Nair', email: 'anjali@example.com', role: 'member' },
  { id: 2, name: 'Rahul Menon', email: 'rahul@example.com', role: 'member' },
];

export const mockTransactions = [
  { id: 1, bookId: 1, memberId: 1, issueDate: '2026-08-10', dueDate: '2026-08-24', returnDate: null, status: 'issued' },
];