import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

import BookShelf from './BookShelf'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
    searchedBooks: [],
    bookTitles: []
  }

	processSearch = (query) => {
      query=query.trim()
      if(query){
      		//If we have a search string then...
    
      BooksAPI.search(query, 10).then((books) =>{
      		const booksWithShelf = books.map((book) => {
            	if(this.state.bookTitles.indexOf(book.title)){
                	let index = this.state.bookTitles.indexOf(book.title)
                    if(index){
                      console.log(index)
                      let bookWithShelf = this.state.books[index]
                      //let shelf = bookWithShelf.shelf
                      //console.log(shelf)
                    }
                    
                    
                  	
                    //book.shelf = shelf
                }
              return book
            })              
       		this.setState({searchedBooks: booksWithShelf})
            console.log('currSearched', books)
      })//ends .then
      }
  }

    componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
		const curr = books.filter((b) => {
        	return b.shelf==='currentlyReading'
        })
        let bookTitles = books.map((book) => {
        	return book.title
        })
        console.log('bookTitles', bookTitles)
        this.setState({bookTitless: bookTitles})
        console.log('curr', curr)
        this.setState({books: books})
        this.setState({currentlyReading: curr})
        
        const read = books.filter((b) => {
        	return b.shelf==='read'
        })
        console.log('read', read)
        this.setState({read: read})
        
        const want = books.filter((b) => {
        	return b.shelf==='wantToRead'
        })
        console.log('want', want)
        console.log('allBooks', books)
        this.setState({wantToRead: want})
        //const book1 = books[0]
        //const book2 = books[1]
        //console.log(BooksAPI.update(book1, 'currentlyReading'))
        //console.log(BooksAPI.update(book2, 'currentlyReading'))
      })//ends then

  }

	changeShelf = (shelf, title) => {
    	
      	let books = [...this.state.books];
      	console.log('books', books)
      	let book = books.filter((b) => { 
          return b.title===title
        })
        book = book[0]
      	book.shelf=shelf
        //console.log(book)
        const modifiedBooks = books.filter((b) => { 
          return b.title!==title
        })
        const newBookArray = [...modifiedBooks, book]
        console.log('newBooks', newBookArray)
      	
      	BooksAPI.update(book, shelf)
      
      	    BooksAPI.getAll()
      		.then((books) => {
            	this.setState({books: books})
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
				<BookShelf shelf='Search' books={this.state.searchedBooks} onChangeShelf={(shelf, title) => {this.changeShelf(shelf, title)}} />
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
              <BookShelf shelf='CurrentlyReading' books={this.state.currentlyReading} onChangeShelf={(shelf, title) => {this.changeShelf(shelf, title)}} />

              <BookShelf shelf='Want To Read' books={this.state.wantToRead} onChangeShelf={(shelf, title) => {this.changeShelf(shelf, title)}} />

              <BookShelf shelf='read' books={this.state.read} onChangeShelf={(shelf, title) => {this.changeShelf(shelf, title)}} />
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