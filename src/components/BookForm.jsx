import { useState, useEffect } from 'react';

function BookForm({ onSubmitBook, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        category: initialData.category || '',
        total_copies: initialData.total_copies || 1,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      alert('Title and Author are required.');
      return;
    }

    const bookData = {
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      total_copies: Number(formData.total_copies),
    };

    onSubmitBook(bookData);

    if (!initialData) {
      setFormData({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Book' : 'Add New Book'}</h3>
      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleChange}
      />
      <input
        type="text"
        name="isbn"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      <input
        type="number"
        name="total_copies"
        placeholder="Total Copies"
        min="1"
        value={formData.total_copies}
        onChange={handleChange}
      />
      <div className="form-actions">
        <button type="submit">{initialData ? 'Save Changes' : 'Add Book'}</button>
        {initialData && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;