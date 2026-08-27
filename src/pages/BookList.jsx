import { useState, useEffect } from 'react';
import { getBooks, addBook as addBookApi, updateBook as updateBookApi, deleteBook as deleteBookApi } from '../services/api';
import BookForm from '../components/BookForm';

function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, title) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`);
  if (!confirmed) return;

  try {
    await deleteBookApi(id);
    setBooks(books.filter((book) => book.id !== id));
  } catch (err) {
    console.error('Error deleting book:', err);
  }
};

  const handleAddBook = async (newBookData) => {
    try {
      const res = await addBookApi(newBookData);
      setBooks([...books, res.data]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to add book. Check console for details.');
    }
  };

  const handleUpdateBook = async (updatedData) => {
    try {
      const res = await updateBookApi(editingBook.id, updatedData);
      setBooks(books.map((b) => (b.id === editingBook.id ? res.data : b)));
      setEditingBook(null);
    } catch (err) {
      console.error('Error updating book:', err);
      alert('Failed to update book. Check console for details.');
    }
  };

  const startEditing = (book) => {
    setEditingBook(book);
    setShowForm(false); // close "add" form if it was open
  };

  if (loading) return <div className="page"><h1>Books</h1><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Books</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingBook(null); }}>
          {showForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {showForm && <BookForm onSubmitBook={handleAddBook} />}
      {editingBook && (
        <BookForm
          initialData={editingBook}
          onSubmitBook={handleUpdateBook}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.available_copies} / {book.total_copies}</td>
              <td>
                <button onClick={() => startEditing(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id, book.title)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;