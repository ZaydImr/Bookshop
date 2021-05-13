import React,{useEffect,useState} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import {Link, useParams} from 'react-router-dom'
import {firestore} from '../firebase/config'
import Book from './Book'

const BookInfo = () => {
      const {ISBN} = useParams();
      const [book, setBook] = useState([]);
      const [books, setBooks] = useState([]);
      const [load,setLoad] = useState(true);
      const [info,setInfo] = useState({
            ContactUsEmail:'',
            ContactUsLocation:'',
            ContactUsPhoneNumber:'',
      });

      useEffect(()=>{
            const unsub = firestore.collection('Book').onSnapshot((snap)=>{
                  let books = [];
                  let i = 1;
                  let j=5
                  for (const book of snap.docs) {
                        i++;
                        if(book.data().ISBN === ISBN){
                              j++;
                              console.log('test');
                        }
                        else if(i<=j){
                              books.push({...book.data()});
                        }
                        else
                              break;
                  };
                  setBooks(books);
                  return () => unsub();
            });
            const unsubs = firestore.collection('Book').onSnapshot((snap)=>{
                  for (const book of snap.docs) {
                        if(book.data().ISBN === ISBN){
                              let bo = [];
                              bo.push({...book.data()});
                              setBook(bo);
                        }
                  };
                  return () => unsubs();
            });
      },[])

      useEffect(() =>{
            setLoad(true);
            try{
                  const unsub = firestore.collection('Home').onSnapshot((snap)=>{
                  snap.forEach(doc => {
                        setInfo({...doc.data()});
                  });
                  setLoad(false);
                  return () => unsub();
                  })}catch(err){setLoad(true)}
      },[]);

      return (
                  <>
                        <Navbar/>
                        <div id='botNav' style={{height:72}}></div>
                        {load ? (<h2>Loading...</h2>):(<>
                        <div className='external-book'>
                              {book.map((item)=>{
                                    const {Author,Bookname,Category,Description,Price,Qte,imgUrl} = item;
                                    return (
                                          <div className='book' key={ISBN}>
                                                <div className='pre-media'>
                                                            <h2 style={{marginTop:0}}>{Bookname}</h2>
                                                            <div style={{display:'flex'}}><h4 style={{marginRight:0}}>by</h4><h4 id='Author'>{Author}</h4></div>
                                                </div>
                                                <div className='pic'>
                                                      <img src={imgUrl} alt={Bookname}/>
                                                </div>
                                                <div className='book-info'>
                                                      <div className='media'>
                                                            <h2>{Bookname}</h2>
                                                            <div style={{display:'flex'}}><h4 style={{marginRight:0}}>by</h4><h4 id='Author'>{Author}</h4></div>
                                                            <h4 style={{float:'right',marginTop:-28}}>{Category}</h4>
                                                      </div>
                                                      <div className="line"></div>
                                                      <div className='price'>
                                                            <p>{Qte} available in stock</p>
                                                            <span className='price2'>{Price}$</span>
                                                      </div>      
                                                      <h3>Description</h3>
                                                      <p>{Description}</p>
                                                </div>      
                                          </div>      
                                    )
                              })}
                              <div className='line'></div>
                              <div className='may-know'>
                                    <h3>More books to explore</h3>
                                    {books.map((book)=>{
                                          return (
                                                <Link to={`/BookShop/book/${book.ISBN}`} key={book.ISBN}>
                                                      <img src={book.imgUrl} alt={book.Bookname} />
                                                </Link>
                                          )
                                    })}
                              </div>
                        </div>
                        <div id='botNav' style={{height:72}}></div>
                        <Footer ContactUsEmail={info.ContactUsEmail} ContactUsLocation={info.ContactUsLocation} ContactUsPhoneNumber={info.ContactUsPhoneNumber}/>
                        </>)}
                  </>
      )
}

export default BookInfo
