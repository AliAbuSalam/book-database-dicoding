const BOOK_LIST_KEY = 'book_list_key';

const addBookForm = document.getElementById('addBookForm');
const judulInput = document.getElementById('judulInput');
const penulisInput = document.getElementById('penulisInput');
const tahunInput = document.getElementById('tahunInput');
const selesaiDibacaCheckbox = document.getElementById('alreadyReadCheckbox');

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('judulSearchInput');
const cancelSearchButton = document.getElementById('clear');

const editBookForm = document.getElementById('editBookForm');
const editBookField = document.querySelector('.editFieldSet');
const judulEditInput = document.getElementById('judulEditInput');
const penulisEditInput = document.getElementById('penulisEditInput');
const tahunEditInput = document.getElementById('tahunEditInput');
const selesaiDibacaEditCheckbox = document.getElementById('alreadyReadEditCheckbox');
let bookToEditId;

function checkStorage(){
  if(typeof (Storage) === 'undefined'){
    alert('Browser anda tidak mendukung web storage!');
    return false;
  }
  return true;
}
function loadInitialBookList(){
  if(!checkStorage()) return;
  return JSON.parse(localStorage.getItem(BOOK_LIST_KEY)) || [];
}

let bookList = loadInitialBookList();

function saveListToStorage(){
  if(!checkStorage()) return;
  localStorage.setItem(BOOK_LIST_KEY, JSON.stringify(bookList));
}

function renderBookView(bookList, searchFilter = ''){
  const filteredBookList = bookList.filter(book => book.title.toLowerCase().startsWith(searchFilter?.toLowerCase()));
  const isNotCompletedBookListView = document.getElementById('isNotCompletedBookList');
  isNotCompletedBookListView.innerHTML = '';
  const isNotCompletedBookList = filteredBookList.filter(book => !book.isComplete);

  const isCompletedBookListView = document.getElementById('isCompletedBookList');
  isCompletedBookListView.innerHTML = '';
  const isCompletedBookList = filteredBookList.filter(book => book.isComplete);

  function render(viewContainerType, viewContainer, list){
    for(const book of list){
      const bookItem = document.createElement('div');
      bookItem.setAttribute('class', 'bookItem');
      bookItem.setAttribute('id', book.id);
      bookItem.innerHTML = 
      `<b>${book.title}</b><br>
      <p>
        Penulis: ${book.author}<br>
        Tahun: ${book.year}
      </p>
      <div class='itemButtonBox'>
        <button class='actionButton itemButton' id='toggleSelesaiDibaca-${book.id}'>
          ${viewContainerType === 'belum selesai' ? 'Selesai dibaca': 'Belum selesai dibaca'}
        </button>
        <button class='actionButton itemButton' id='hapusBuku-${book.id}'>Hapus buku</button>
        <a href='#editDiv'>
          <button class='actionButton itemButton' id='editBuku-${book.id}'>Edit button</button>
        </a>
      </div>
      `;
      viewContainer.appendChild(bookItem);
    }
  }
  showOrHideSearchWarning(searchFilter);
  render('belum selesai', isNotCompletedBookListView, isNotCompletedBookList);
  render('selesai', isCompletedBookListView, isCompletedBookList);
  setEventForElements('[id^=toggleSelesaiDibaca]', 'click', toggleIsComplete);
  setEventForElements('[id^=hapusBuku]', 'click', removeBook);
  setEventForElements('[id^=editBuku]', 'click', editBook);
}

function setEventForElements(querySelector, eventType, event){
  const elements = document.querySelectorAll(querySelector);
  for(const element of elements){
    element.addEventListener(eventType, event);
  }
}

function resetForm(){
  const addBookButton = document.getElementById('tambah');
  addBookForm.reset();
  addBookButton.setAttribute('disabled', true);
}

addBookForm.addEventListener('submit', function(event){
  event.preventDefault();
  const newBook = {
    id: Date.now(),
    title: judulInput.value,
    author: penulisInput.value,
    year: tahunInput.value,
    isComplete: selesaiDibacaCheckbox.checked
  }
  bookList.unshift(newBook);
  saveListToStorage();
  renderBookView(bookList);
  resetForm();
});

searchForm.addEventListener('submit', function(event){
  event.preventDefault();
  const searchInputValue = searchInput.value.trim();
  renderBookView(bookList, searchInputValue);
});

function showOrHideSearchWarning(searchFilter){
  const searchWarning = document.getElementById('filterWarning');
  if(searchFilter) searchWarning.removeAttribute('hidden');
  else searchWarning.setAttribute('hidden', true);
}

cancelSearchButton.addEventListener('click', function(){
  searchForm.reset();
  renderBookView(bookList);
})

addBookForm.addEventListener('change', function(){
  const addBookButton = document.getElementById('tambah');

  if(judulInput.value && penulisInput.value && tahunInput.value) addBookButton.removeAttribute('disabled');
  else addBookButton.setAttribute('disabled', true);
});

document.addEventListener('DOMContentLoaded', function(){
  resetForm();
  searchForm.reset();
  clearEditField();
  renderBookView(bookList);
});

function getBookId(elementId){
  const idSplit = elementId.split('-');
  return parseInt(idSplit[1]);
}

function toggleIsComplete(event){
  const id = getBookId(event.target.id);
  bookList = bookList.map(book => book.id === id ? { ...book, isComplete: !book.isComplete}: book);
  saveListToStorage();
  renderBookView(bookList);
}

function removeBook(event){
  const id = getBookId(event.target.id);
  bookList = bookList.filter(book => book.id !== id);
  saveListToStorage();
  renderBookView(bookList);
}

function editBook(event){
  const id = getBookId(event.target.id);
  const book = bookList.find(book => book.id === id);
  editBookField.removeAttribute('disabled');
  setEditField(book);
}

function setEditField(book){
  bookToEditId = book.id;
  judulEditInput.value = book.title;
  penulisEditInput.value = book.author;
  tahunEditInput.value = book.year;
  selesaiDibacaEditCheckbox.checked = book.isComplete;
}

function clearEditField(){
  editBookForm.reset();
  editBookField.setAttribute('disabled', true);
}

function editBookSubmit(){
  if(!bookToEditId) return;
  const newBookDetails = {
    id: bookToEditId,
    title: judulEditInput.value,
    author: penulisEditInput.value,
    year: tahunEditInput.value,
    isComplete: selesaiDibacaEditCheckbox.checked
  };
  bookList = bookList.map(book => book.id === bookToEditId ? newBookDetails: book);
  saveListToStorage();
  renderBookView(bookList);
  clearEditField();
}
editBookForm.addEventListener('submit', editBookSubmit);