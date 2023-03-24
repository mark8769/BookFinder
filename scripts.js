/*
Mark Ortega-Ponce
3/24/23
scripts.js
Purpose: BookFinder functions.
*/

window.addEventListener("DOMContentLoaded", main);

function main(){

    addDefaultBooks();
}

function addDefaultBooks(){

    let requestor = new XMLHttpRequest();
    // https://openlibrary.org/dev/docs/api/search
    let endpoint = "https://openlibrary.org/search.json?title="
    // Handle request when response comes back.
    requestor.addEventListener("load", requestHandler);
    // Add some default books to page.
    let books = ["1984", "The Universal Computer", "Animal Farm"]
    // requestor.open("GET", endpoint + "1984");
    // requestor.send();
    // requestor.open("GET", endpoint + "The universal computer");
    // requestor.send();
    requestor.open("GET", endpoint + "Animal Farm");
    requestor.send();
}

/*
Only grab ISBN and image for api call and do not store locally.
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
}

/*
Add some books to local storage.
*/
function addDefaultBooks(){
    let books = [{
        title: "Código civil (1984)",
        author: "Author",
        numberOfPages: "516",
        copyrightDate: "1960",
        isbn: "9972653056",
        image: "https://covers.openlibrary.org/b/isbn/9972653056-M.jpg"
    },
    {
        title: "The Universal Computer",
        author: "Martin Davis",
        numberOfPages: "256",
        copyrigthDate: "2000",
        isbn: "9780393047851",
        image: "https://covers.openlibrary.org/b/isbn/9780393047851-M.jpg"
    },
    {
        title: "Animal Farm",
        author: "George Orwell",
        numberOfPages: "128",
        copyrightDate: "1945",
        isbn: "9798787429817",
        image: "https://covers.openlibrary.org/b/isbn/9798787429817-M.jpg"
    }];
    /* Don't use # inside the id param! (My mistake) */
    let sideNav = document.getElementById("sideNav");
    /* Store default books in local storage. */
    for (let book of books){
        localStorage.setItem(book.title, JSON.stringify(book));
        let div = document.createElement("div");
        div.id = book.title;
        div.innerHTML = book.title;
        sideNav.appendChild(div);
        console.log(sideNav);
        console.log(div);
    }
}