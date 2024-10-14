import { nanoid } from 'nanoid';

const books = [];

// Menambahkan buku
const addBook = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
};

// Menampilkan seluruh buku dengan query parameters
const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  // Filter berdasarkan query 'name'
  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }

  // Filter berdasarkan query 'reading'
  if (reading) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter berdasarkan query 'finished'
  if (finished) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  return res.status(200).json({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name: bookName, publisher }) => ({
        id, name: bookName, publisher,
      })),
    },
  });
};

// Menampilkan buku berdasarkan ID
const getBookById = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
};

// Memperbarui buku
const updateBookById = (req, res) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[index] = {
    ...books[index],
    name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

// Menghapus buku berdasarkan ID
const deleteBookById = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1); // Menghapus buku dari array
  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

export {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
