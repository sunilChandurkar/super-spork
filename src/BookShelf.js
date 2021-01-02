import React, { Component } from 'react';

class BookShelf extends Component{
  	handleChange = (e) => {
    	e.preventDefault()
      	const shelf = e.target.value;
      	const title = e.target.getAttribute('id')
      	if (this.props.onChangeShelf){
        	this.props.onChangeShelf(shelf, title)
        }
    }

  	render(){
    	return(
      		<div className="bookshelf">
          		<h2 className="bookshelf-title">{this.props.shelf}</h2>
          		<div className="bookshelf-books">
          			<ol className="books-grid">
          				{this.props.books.map((book) => (
        			<li key={book.title}>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 173, backgroundImage: `url(${book.imageLinks.smallThumbnail})`}}></div>
                            <div className="book-shelf-changer">
                              <select id={book.title} value={book.shelf} onChange={this.handleChange}>
                                <option value="move" disabled>Move to...</option>
								<option value="none">None</option>	
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                           
                              </select>
                            </div>
                          </div>
                          <div className="book-title">{book.title}</div>
                          <div className="book-authors">Harper Lee</div>
                        </div>
                      </li>
        					)					
        				)}
          			</ol>
          		</div>
            </div>
        )
    }
}

export default BookShelf;