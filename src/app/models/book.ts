import { Column } from "./columns";

export type Genre =
    'Drama'
    | 'Crime'
    | 'Mystery'
    | 'Romance'
    | 'Thriller'
    | 'Comedy'
    | 'Documentary'
    | 'Fantasy'
    | 'Horror'
    | 'Musical'
    | 'Western'
    | 'Action'
    | 'Adventure'
    | 'Sci-Fi';

export interface Book {
    id: number;
    title: string,
    author: string,
    isbn: string,
    genre: Genre[],
    stock: number
}

export const BookColumns: Column[] = [
    {
        property: 'id',
        label: 'ID',
        show: true
    },
    {
        property: 'title',
        label: 'Title',
        show: true
    },
    {
        property: 'author',
        label: 'Author',
        show: false
    },
    {
        property: 'isbn',
        label: 'ISBN',
        show: false
    },
    {
        property: 'genre',
        label: 'Genre',
        show: false
    },
    {
        property: 'stock',
        label: 'Stock',
        show: true
    },
    
]

