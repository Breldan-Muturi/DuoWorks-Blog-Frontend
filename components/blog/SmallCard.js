import Link from 'next/link';
import moment from'moment';
import renderHTML from 'react-render-html';
import {API} from '../../config';

const SmallCard = ({blog}) => {
    return(
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img 
                            className="img img-fluid" 
                            style={{objectFit: 'cover', width: '100%', maxHeight: '200px'}} 
                            src= {`${API}/blog/photo/${blog.slug}`}
                            onError={image => (image.target.src = `../static/images/download.jpeg`)}
                            alt={blog.title}
                        />  
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <h5 className="card-title">{blog.title}</h5>
                    </a>
                </Link>
                <p className="card-text">{renderHTML(blog.excerpt)}</p>
                </section>
            </div>
            <div className="card-body">
                Posted {moment(blog.updatedAt).fromNow()} by{' '}
                <Link href={`/profile/${blog.postedBy.username}`}>
                    <a>{blog.postedBy.username}</a>
                </Link>       
            </div>
        </div>
    );
}; 

export default SmallCard;


//Could we show all catgories and tags in the blogs page?  {' '}