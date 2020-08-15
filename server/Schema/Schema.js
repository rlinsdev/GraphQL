const graphql = require('graphql');
const _ = require('lodash'); // É o undercore utilizado para fazer os filtros em Arrays
const Book = require('../models/book');
const Author = require('../models/author');

// Variávies globais que são utilizadas para consimur iGraphQL
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


// dummy data - Books
/*var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
    { name: 'The Hero of the ages', genre: 'Fantasy', id: '4', authorId: '2'},
    { name: 'The Color of magic', genre: 'Fantasy', id: '5', authorId: '3'},
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3'}
];*/

// dummy data - Authors
/*var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Randerson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];*/

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // Precisa ser uma função aqui porque ela só é executada depois de todo o código passado
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author:{
          type: AuthorType,
          resolve(parent, args){
            //return _.find(authors, {id: parent.authorId});
            return Author.findById(parent.authorId);
          }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({ // Precisa ser uma função aqui porque ela só é executada depois de todo o código passado
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books:{
          type: new GraphQLList(BookType),
          resolve(parent, args){
            //return _.filter(books,{authorId: parent.id})
            return Book.find({authorId: parent.id});
          }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                //return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
              return Author.findById(args.id);
                //return _.find(authors, { id: args.id });
            }
        },
        books:{// Trará todos os books
          type: new GraphQLList(BookType),
          resolve(parent, args){
            //return books;
            console.log('teste');
            return Book.find({});
          }
        },
        authors:{
          type: new GraphQLList(AuthorType),
          resolve(parent, args){
            //return authors;
            return Author.find({});
          }
        }
    }
});


// Mudança dos valores/registros
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
          type: BookType,
          args:{
            name:{type: new GraphQLNonNull(GraphQLString)},
            genre: {type: new GraphQLNonNull(GraphQLString)},
            authorId:{type: new GraphQLNonNull(GraphQLID)}
          },
          resolve(parent, args){
            let book = new Book({
              name: args.name,
              genre: args.genre,
              authorId:args.authorId
            });
            return book.save();
          }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
