/*
Mark Ortega-Ponce
3/24/23
scripts.js
Purpose: BookFinder functions.
*/

window.addEventListener("DOMContentLoaded", main);

/*
Main entry point for the program.
*/
function main(){
    addDefaultBooksToStorage();
    loadDefaultBook();
    addEventListeners();
}
function addEventListeners(){
    document.getElementById("edit").addEventListener("click", edit);
}
/*
Edit button functionality, when pressed disable other links.
*/
function edit(){
    let editButton = document.getElementById("edit");
    document.getElementById("save").addEventListener("click", save);
    editButton.classList.toggle("button");
    editButton.removeEventListener("click", edit);

    let divs = document.querySelectorAll("#sideNav > div");
    for (e of divs){
        e.removeEventListener("click", showBookInfo);
        console.log("removed event listeners");
    }
    document.getElementById("title").removeAttribute("readonly");
    document.getElementById("author").removeAttribute("readonly");
}
// function save(){

//     document.getElementById("save").removeEventListener("click", save);
//     let editButton = document.getElementById("edit");
//     editButton.classList.toggle("button");
//     editButton.addEventListener("click", edit);
//     let container = document.getElementsByClassName("mainContent")[0];
//     let title = document.getElementById("title");
//     title.setAttribute("readonly", "");
//     let author = document.getElementById("author");
//     author.setAttribute("readonly", "");
//     // Get old name from set id.
//     let oldTitle = container.id;

//     let oldEntry = JSON.parse(localStorage.getItem(oldTitle));
//     // Get new names from new values in input.
//     let newTitle = title.value;
//     let newAuthor = author.value;
//     oldEntry.title = newTitle;
//     localStorage.removeItem(oldTitle);
//     apiRequest(newTitle);


//     let divs = document.querySelectorAll("#sideNav > div");
//     for (e of divs){
//         e.addEventListener("click", showBookInfo);
//         console.log("added event listeners back");
//     }
//     //showBookInfo(newTitle);

// }
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
Function to make a request for a book title.
*/
function apiRequest(title){
    console.log("inside api request (" + title + ")");
    let requestor = new XMLHttpRequest();
    // https://openlibrary.org/dev/docs/api/search
    let endpoint = "https://openlibrary.org/search.json?title="
    // Handle request when response comes back.
    requestor.addEventListener("load", requestHandler);

    let cleanedTitle = title.toLowerCase();
    cleanedTitle = cleanedTitle.replace(" ", "+");
    console.log(title);
    requestor.open("GET", endpoint + cleanedTitle);
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
    // let title = bookInfo.title;
    // let author = bookInfo.author_name[0];
    // let numberOfPages = bookInfo.number_of_pages_median;
    // let copyrightDate = bookInfo.first_publish_year;
    let bookCover = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

    let book = {
        title: title,
        author: author,
        numberOfPages: numberOfPages,
        copyrightDate: copyrightDate,
        image: bookCover
    }
    /* Store new book in local storage */
    localStorage.setItem(title, JSON.stringify(book));
}
/*
Function to fill in book inputs from parsed json in local storage.
*/
function fillInputs(json){
    let container = document.getElementsByClassName("mainContent")[0];
    container.id = json.title;
    document.getElementById("title").value = json.title;
    document.getElementById("author").value = json.author;
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