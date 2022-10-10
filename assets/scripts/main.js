const BOOK_LIST_KEY = 'book_list_key';

const addBookForm = document.getElementById('addBookForm');
const judulInput = document.getElementById('judulInput');
const penulisInput = document.getElementById('penulisInput');
const tahunInput = document.getElementById('tahunInput');
const selesaiDibacaCheckbox = document.getElementById('alreadyReadCheckbox');

function loadInitialBookList(){
  if(typeof (Storage) === 'undefined'){
    alert('Browser anda tidak mendukung web storage!');
    return;
  }
  return JSON.parse(localStorage.getItem(BOOK_LIST_KEY)) || [];
}

let bookList = loadInitialBookList();

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
});

addBookForm.addEventListener('change', function(){
  const addBookButton = document.getElementById('tambah');

  if(judulInput.value && penulisInput.value && tahunInput.value) addBookButton.removeAttribute('disabled');
  else addBookButton.setAttribute('disabled', true);
})