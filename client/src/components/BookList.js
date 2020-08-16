import React, {Component} from 'react';
//import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {getBooksQuery} from '../queries/queries';

import BookDetails from './BookDetails';

class BookList extends Component{
    constructor (props){
     super(props);
     this.state={
         selected: null
     }   
    }

    displayBooks(){
        let data = this.props.data;
        if (data.loading){
            return(<div>loading bookins...</div>);
        } else {
            return data.books.map(book =>{
                return((
                    <li key={book.id} onClick={(e)=>{
                        this.setState({selected: book.id})
                    }}>{book.name}</li>
                ))
            });
        }
    }
    render(){
        return(
            <div>
                <ul id="book-list">
                    {/* <li>Book name</li> */}
                {this.displayBooks()}
                </ul>
                <BookDetails bookid={this.state.selected}></BookDetails>
            </div>
        )
    }
}

export default graphql(getBooksQuery)(BookList);
