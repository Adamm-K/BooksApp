('use strict');

class BookList {
  constructor() {
    const thisBookList = this;

    thisBookList.select = {
      books: {
        booksPanel: '.books-panel',
        bookList: '.books-list',
        bookImageLink: 'data-id',
        cardOfBook: '.book',
        bookImage: '.book__image',
      },
      form: '.filters',
      InputCheckbox: 'input[type="checkbox"]',
      InputName: 'input[name="filter"]',
      templateOf: {
        bookTemplate: '#template-book',
      }
    };

    thisBookList.templates = {
      bookCard: Handlebars.compile(document.querySelector(thisBookList.select.templateOf.bookTemplate).innerHTML),
    };

    thisBookList.initData();
    thisBookList.getElements();
    thisBookList.render();
    thisBookList.initAction();
    thisBookList.initFilterAction();
    thisBookList.favoriteBooks = [];
    thisBookList.filters = [];
  }

  initData() {
    const thisBookList = this;
    thisBookList.data = dataSource.books;
  }

  getElements() {
    const thisBookList = this;
    thisBookList.listOfBooks = document.querySelector(thisBookList.select.books.bookList);
    thisBookList.booksContainer = document.querySelector(thisBookList.select.books.booksPanel);
    thisBookList.filterForm = document.querySelector(thisBookList.select.form);
  }

  render() {
    const thisBookList = this;
    for (const book of dataSource.books) {
      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rating,
        image: book.image,
        details: book.details,
      };
      const ratingBgc = thisBookList.determineRatingBgc(book.rating);
      bookData.ratingBgc = ratingBgc;
      const ratingWidth = book.rating * 10;
      bookData.ratingWidth = ratingWidth;
      const generatedHTML = thisBookList.templates.bookCard(bookData);
      const element = utils.createDOMFromHTML(generatedHTML);
      thisBookList.listOfBooks.appendChild(element);
    }
  }

  initAction() {
    const thisBookList = this;
    thisBookList.booksContainer.addEventListener('dblclick', function (event) {
      const bookId = event.target.offsetParent.getAttribute('data-id');
      if (!thisBookList.favoriteBooks.includes(bookId) && event.target.offsetParent.classList.contains('book__image')) {
        event.preventDefault();
        event.target.offsetParent.classList.add('favorite');
        thisBookList.favoriteBooks.push(bookId);
      } else if (thisBookList.favoriteBooks.includes(bookId)) {
        event.target.offsetParent.classList.remove('favorite');
        const index = thisBookList.favoriteBooks.indexOf(bookId);
        thisBookList.favoriteBooks.splice(index, 1);
      }
    });
    thisBookList.booksContainer.addEventListener('click', function(event) {
      event.preventDefault();
    });
  }

  initFilterAction() {
    const thisBookList = this;
    thisBookList.filterForm.addEventListener('click', function (event) {
      if (event.target.type == 'checkbox') {
        const value = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
          thisBookList.filters.push(value);
        } else {
          thisBookList.filters.splice(thisBookList.filters.indexOf(value), 1);
        }
      }
      thisBookList.filterBooks();
    });
  }

  filterBooks() {
    const thisBookList = this;
    for (let book of dataSource.books) {
      let shouldBeHidden = false;
      const bookId = book.id;
      const selected = document.querySelector(thisBookList.select.books.bookImage + '[data-id = "' + bookId + '"]');

      for (let filter of thisBookList.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        selected.classList.add('hidden');
      } else {
        selected.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating) {
    let background = '';
    if (rating < 6) {
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
    return background;
  }
}

const app = new BookList();

