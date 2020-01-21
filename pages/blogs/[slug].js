import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {useState, useEffect} from 'react';
import moment from'moment';
import renderHTML from 'react-render-html';
import {singleBlog, listRelated} from '../../actions/blog';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';
import SmallCard from '../../components/blog/SmallCard'; 
import DisqusThread from '../../components/DisqusThread';
    
const SingleBlog = ({ blog, query}) => {
    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({blog}).then(data => {
            if(data.error) {
                console.log(data.error); 
            } else {
                setRelated(data);
            }            
        });
    };

    useEffect(() => {
        loadRelated();
    }, []);

    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta 
                name="description" 
                content={blog.mdesc}  //Used for SEO //This allows platforms like Facebook to find our page more easily the meta og'
            />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} /> 
            <meta 
                property="og:description" 
                content={blog.mdesc}  //Used for SEO //This allows platforms like Facebook to find our page more easily the meta og'
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/img_5.jpg`} />
            <meta property="og:image:type" content="image/*" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );

    const showBlogCategories = blog =>  //same as showTags but dufferent coding approach
        blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-outline-info mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));

    const showBlogTags = blog => {
        return blog.tags.map((t, i) => (
            <Link key={i} href={`/tags/${t.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
            </Link>
        ));
    }; 

    const showRelatedBlog = () => {
        return related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        )); 
    }; 

    const showComments = () => {
        return (
            <div>
                <DisqusThread id={blog.id} title={blog.title} path={`/blog/${blog.slug}`} />
            </div>
        );
    };

    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{marginTop: '-30px'}}>
                                    <img 
                                        src={`${API}/blog/photo/${blog.slug}`} 
                                        alt={blog.title } 
                                        className="img img-fluid featured-image" 
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="container-fluid">
                                    <h1 className="dispaly-2 pb-3 text-center font-weight-bold pb-3">{blog.title}</h1>
                                    <p className="lead mt-3 mark">
                                        Written by {' '}
                                        <Link href={`/profile/${blog.postedBy.username}`}>
                                            <a>{blog.postedBy.username}</a>
                                        </Link>{' '}
                                        | Published {moment(blog.updatedAt).fromNow()}                                    
                                    </p>
                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                        <br />  
                                        <br />  
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <section>
                                <div className="col-md-12 lead overflow-auto">{renderHTML(blog.body)}</div>
                            </section>
                        </div>

                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
                            <hr/>
                            <div className="row">{showRelatedBlog()}</div>
                        </div>

                        <div className="container pt-5 pb-5">{showComments()}</div>

                    </article>
                </main>
            </Layout>
        </React.Fragment>
    );
};

SingleBlog.getInitialProps = ({query}) => {  //IN the backend parameter is available as query and in the frontend the parameter is available as front end
    return singleBlog(query.slug).then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            // console.log('GET INITAL PROPS IN SINGLE BLOG',data);
            return {blog: data, query};
        }
    });
};

export default SingleBlog;