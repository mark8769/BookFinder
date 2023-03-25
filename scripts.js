/*
Mark Ortega-Ponce
3/24/23
scripts.js
Purpose: BookFinder functions.
*/

window.addEventListener("DOMContentLoaded", main);

function main(){
    addDefaultBooksToStorage();
    loadDefaultBook();
    addEventListeners();
}
function addEventListeners(){
    document.getElementById("edit").addEventListener("click", edit);
}
function edit(){

}
function apiRequest(title){
    let requestor = new XMLHttpRequest();
    // https://openlibrary.org/dev/docs/api/search
    let endpoint = "https://openlibrary.org/search.json?title="
    // Handle request when response comes back.
    requestor.addEventListener("load", requestHandler);
    title = title.toLowerCase();
    title = title.replace(" ", "+");
    console.log(title);
    requestor.open("GET", endpoint + title);
    requestor.send();
}
/*
Add book to local storage.
*/
function requestHandler(){

    if (this.status !== 200){
        console.log("first time in here");
        alert("No information available, taking you back to home page.");
    }
    // Title, author, copyright date, # of pages, cover image.
    // Put these in a side navigation bar?
    let json = JSON.parse(this.response);

    let bookInfo = json.docs[0];
    let isbn = bookInfo.isbn[0];
    let title = bookInfo.title;
    let author = bookInfo.author_name;
    let numberOfPages = bookInfo.number_of_pages_median;
    let copyrightDate = bookInfo.first_publish_year;
    let bookCover = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

    let book = {
        title: title,
        author: author,
        isbn: isbn,
        numberOfPages: numberOfPages,
        copyrightDate: copyrightDate,
        image: bookCover
    }
    /* Store new book in local storage */
    localStorage.setItem(title, JSON.stringify(book));
}
/* 
Display book information if available.
If not search by title, get isbn, and get image.
*/
function showBookInfo() {
    let title = this.id;
    let localItem = localStorage.getItem(title);

    if (localItem == null){
        // get required information
        apiRequest(title);
        localItem = localStorage.getItem(title);
    }

    let json = JSON.parse(localItem);
    fillInputs(json);
    document.getElementById("edit").removeAttribute("disabled");
}
/*
Function to fill in book inputs from parsed json in local storage.
*/
function fillInputs(json){
    document.getElementById("title").value = json.title;
    document.getElementById("author").value = json.author;
    document.getElementById("isbn").value = json.isbn;
    document.getElementById("numberOfPages").value = json.numberOfPages;
    document.getElementById("copyrightDate").value = json.copyrightDate;
    let img = document.getElementById("bookCover");
    img.src = json.image;
    img.setAttribute("alt", json.title);
}
/*
Add some default books to local storage.
*/
function addDefaultBooksToStorage(){
    let books = [{
        title: "Fahrenheit 451",
    },
    {
        title: "The Universal Computer",
    },
    {
        title: "American Psycho",
    }];
    let sideNav = document.getElementById("sideNav");
    /* Store default books in local storage. */
    for (let book of books){
        apiRequest(book.title);
        let div = document.createElement("div");
        div.id = book.title;
        div.innerHTML = book.title;
        sideNav.appendChild(div);
        div.addEventListener("click", showBookInfo);
    }
}
/*
Default book to load when site is refreshed. 
*/
function loadDefaultBook(){
    let book = JSON.parse(localStorage.getItem("Fahrenheit 451"));
    fillInputs(book);
}