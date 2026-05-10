let bookCache = null;

function currentPrefix() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}

export async function getBooks() {
  if (bookCache) {
    return bookCache;
  }

  const response = await fetch(`${currentPrefix()}assets/data/books.json`);
  if (!response.ok) {
    throw new Error("Unable to load the book catalog.");
  }
  bookCache = await response.json();
  return bookCache;
}

export function formatPrice(value) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

export function findBook(books, id) {
  return books.find((book) => book.id === id);
}

export function getCategories(books) {
  return [...new Set(books.map((book) => book.category))].sort((a, b) => a.localeCompare(b));
}

export function filterAndSortBooks(books, filters) {
  const query = filters.query.trim().toLowerCase();

  const filtered = books.filter((book) => {
    const matchesQuery = !query || book.title.toLowerCase().includes(query);
    const matchesCategory = filters.category === "all" || book.category === filters.category;
    const matchesPrice = book.price <= filters.maxPrice;
    return matchesQuery && matchesCategory && matchesPrice;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "low-high") return a.price - b.price;
    if (filters.sort === "high-low") return b.price - a.price;
    return b.publishedYear - a.publishedYear;
  });
}
