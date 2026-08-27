import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Auth
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const changePassword = (passwordData) => API.post('/auth/change-password', passwordData, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// Books
export const getBooks = () => API.get('/books');
export const addBook = (book) => API.post('/books', book);
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Members
export const getMembers = () => API.get('/members');
export const addMember = (member) => API.post('/members', member);
export const updateMember = (id, member) => API.put(`/members/${id}`, member);
export const deleteMember = (id) => API.delete(`/members/${id}`);

// Transactions
export const getTransactions = () => API.get('/transactions');
export const issueBook = (bookId, memberId) => API.post('/transactions/issue', { bookId, memberId });
export const returnBook = (transactionId) => API.put(`/transactions/return/${transactionId}`);

export default API;