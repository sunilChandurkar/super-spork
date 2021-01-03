import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

import BookShelf from './BookShelf'

class BooksApp extends React.Component {
  state = {
    showSearchPage: false,
    books: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
    searchedBooks: [],

    bookIds: [],
      currentlyReadingSearched: [],
      wantToReadSearched: [],
      readSearched: [],
      noneSearched:[]
  }

    componentDidMount() {
        BooksAPI.getAll()
            .then((books) => {
                //Books on 'currentlyReading' shelf.
                const curr = books.filter((b) => {
                    return b.shelf==='currentlyReading'
                })
                //Books on 'read' shelf.
                const read = books.filter((b) => {
                    return b.shelf==='read'
                })
                //Books on 'wantToRead' shelf.
                const want = books.filter((b) => {
                    return b.shelf==='wantToRead'
                })
                //Array of Book Ids
                let bookIds = books.map((book) => {
                    return book.id
                })

                this.setState({
                    books: books,
                    currentlyReading: curr,
                    wantToRead: want,
                    read: read,
                    bookIds: bookIds
                })

            })//ends then

    }

	processSearch = (query) => {
      query=query.trim()
      if(query){
      		//If we have a search string then...
      BooksAPI.search(query, 10).then((books) =>{
      		const booksWithShelf = books.map((book) => {
      		    //If a book in the search results matches
                //a book on the main page.
            	if(this.state.bookIds.indexOf(book.id)){
                	let index = this.state.bookIds.indexOf(book.id)
                    if(index >= 0){

                      let bookWithShelf = this.state.books[index]

                      let shelf = bookWithShelf.shelf

                      if(shelf){
                            book.shelf = shelf
                        }
                    }
                }
              return book
            })              

            if(booksWithShelf.length > 0){
                //Books on 'currentlyReading' shelf in search results.
                const currS = booksWithShelf.filter((b) => {
                    return b.shelf==='currentlyReading'
                })

                //Books on 'read' shelf in search results.
                const readS = booksWithShelf.filter((b) => {
                    return b.shelf==='read'
                })

                //Books on 'wantToRead' shelf in search results.
                const wantS = booksWithShelf.filter((b) => {
                    return b.shelf==='wantToRead'
                })

                //Books on 'None' shelf in search results.
                const noneS = booksWithShelf.filter((b) => {

                    return b.shelf===undefined
                })
                this.setState({
                    noneSearched: noneS,
                    wantToReadSearched: wantS,
                    readSearched: readS,
                    currentlyReadingSearched: currS,
                    searchedBooks: booksWithShelf
                })
                query = ''
            }

      })//ends .then
      }else{
          //If query string is empty clear everything.
          this.setState({
              searchedBooks: [],
              currentlyReadingSearched: [],
              wantToReadSearched: [],
              readSearched: [],
              noneSearched: []
          })

      }
  }


    //Function takes the book shelf, book id, and the page as params.
    //It changes the shelf for the book with the given id in the db and gets all books.
    //If the page is the main page then it updates shelves on the main page.
    //Otherwise if the page is the search page it updates shelves on the search page.
	changeShelf = (shelf, id, page) => {
    	
      	let books = [...this.state.books];
        //Find the book whose shelf needs to be changed.
      	let book = books.filter((b) => { 
          return b.id===id
        })
        book = book[0]
      	book.shelf=shelf

      	BooksAPI.update(book, shelf)
      
      	    BooksAPI.getAll()
      		.then((books) => {

                if(page==='main'){
                    const curr = books.filter((b) => {
                        return b.shelf==='currentlyReading'
                    })

                    const read = books.filter((b) => {
                        return b.shelf==='read'
                    })

                    const want = books.filter((b) => {
                        return b.shelf==='wantToRead'
                    })
                    this.setState({
                        books: books,
                        currentlyReading: curr,
                        wantToRead: want,
                        read: read
                    })
                    console.log('State changed on Main Page')
                }
                if(page==='search'){
                    const currS = this.state.searchedBooks.filter((b) => {
                        return b.shelf==='currentlyReading'
                    })

                    const readS = this.state.searchedBooks.filter((b) => {
                        return b.shelf==='read'
                    })

                    const wantS = this.state.searchedBooks.filter((b) => {
                        return b.shelf==='wantToRead'
                    })

                    //Books on 'None' shelf in search results.
                    const noneS = this.state.searchedBooks.filter((b) => {

                        return b.shelf===undefined
                    })

                    this.setState({
                        books: books,
                        currentlyReadingSearched: currS,
                        readSearched: readS,
                        wantToReadSearched: wantS,
                        noneSearched: noneS
                    })
                    console.log('State changed on Search Page')
                }
            })
    }

  render() {

    return (
      <div className="app">
       {
		this.state.showSearchPage ? ( 
       	<div className="search-books">
       		  <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">

                <input type="text" placeholder="Search by title or author"             
					
            		onChange={(event) => this.processSearch(event.target.value)} />

              </div>
            </div>
			<div className="search-books-results">
              <ol className="books-grid">
                  {this.state.searchedBooks.length > 0 ? (
                      <div>
                      <BookShelf page='search' shelf='CurrentlyReading' books={this.state.currentlyReadingSearched}
                                 onChangeShelf={(shelf, id, page) => {
                                     this.changeShelf(shelf, id, page)
                                 }}/>

                      <BookShelf page='search' shelf='Want to Read' books={this.state.wantToReadSearched}
                                 onChangeShelf={(shelf, id, page) => {
                                     this.changeShelf(shelf, id, page)
                                 }}/>

                      <BookShelf page='search' shelf='Read' books={this.state.readSearched}
                      onChangeShelf={(shelf, id, page) => {
                      this.changeShelf(shelf, id, page)
                  }}/>

                      <BookShelf page='search' shelf='No Shelf' books={this.state.noneSearched}
                      onChangeShelf={(shelf, id, page) => {
                      this.changeShelf(shelf, id, page)
                  }}/>
                      </div>
                  ) : ('')
                  }
			  </ol>
            </div>
        </div> 
      ) : ( 
    	<div className="list-books">
    		<div className="list-books-title">
              <h1>MyReads</h1>
            </div>
        
        	<div className="list-books-content">
            <div>
              <BookShelf page='main' shelf='CurrentlyReading' books={this.state.currentlyReading} onChangeShelf={(shelf, id, page) => {this.changeShelf(shelf, id, page)}} />

              <BookShelf page='main' shelf='Want To Read' books={this.state.wantToRead} onChangeShelf={(shelf, id, page) => {this.changeShelf(shelf, id, page)}} />

              <BookShelf page='main' shelf='read' books={this.state.read} onChangeShelf={(shelf, id, page) => {this.changeShelf(shelf, id, page)}} />
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
            </div>  
    	</div> 
    	  )       	
       }
      </div>
	
    )
  
}

}

export default BooksApp