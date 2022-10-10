const BOOK_LIST_KEY = 'book_list_key';

const addBookForm = document.getElementById('addBookForm');
const judulInput = document.getElementById('judulInput');
const penulisInput = document.getElementById('penulisInput');
const tahunInput = document.getElementById('tahunInput');
const selesaiDibacaCheckbox = document.getElementById('alreadyReadCheckbox');

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

function renderBookView(bookList){
  console.log('bookList: ', bookList);
  const isNotCompletedBookListView = document.getElementById('isNotCompletedBookList');
  isNotCompletedBookListView.innerHTML = '';
  const isNotCompletedBookList = bookList.filter(book => !book.isComplete);

  const isCompletedBookListView = document.getElementById('isCompletedBookList');
  isCompletedBookListView.innerHTML = '';
  const isCompletedBookList = bookList.filter(book => book.isComplete);

  function render(viewContainer, list){
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
      <div class="itemButtonBox">
        <button class="actionButton itemButton" id="toggleSelesaiDibaca">Selesai dibaca</button>
        <button class="actionButton itemButton" id="hapusBuku">Hapus buku</button>
        <button class="actionButton itemButton" id="editBuku">Edit buku</button>
      </div>
      `;
      viewContainer.appendChild(bookItem);
    }
  }

  render(isNotCompletedBookListView, isNotCompletedBookList);
  render(isCompletedBookListView, isCompletedBookList);
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
  bookList.push(newBook);
  saveListToStorage();
});

addBookForm.addEventListener('change', function(){
  const addBookButton = document.getElementById('tambah');

  if(judulInput.value && penulisInput.value && tahunInput.value) addBookButton.removeAttribute('disabled');
  else addBookButton.setAttribute('disabled', true);
});

document.addEventListener('DOMContentLoaded', function(){
  console.log('dom content loaded');
  renderBookView(bookList);
})