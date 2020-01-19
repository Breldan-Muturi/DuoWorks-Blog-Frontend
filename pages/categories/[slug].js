import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import moment from'moment';
import renderHTML from 'react-render-html';
import {singleCategory} from '../../actions/category';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';
import Card from '../../components/blog/Card';

const Category = ({ category, blogs, query }) => {

    const head = () => (
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta 
                name="description" 
                content={`Highest rated people in ${category.name}`}  //Used for SEO //This allows platforms like Facebook to find our page more easily the meta og'
            />
            <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
            <meta property="og:title" content={`${category.name} | ${APP_NAME}`} /> 
            <meta 
                property="og:description" 
                content={`Highest rated people in ${category.name}`}  //Used for SEO //This allows platforms like Facebook to find our page more easily the meta og'
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/duoworks-blog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/duoworks-blog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );

    return (
        <React.Fragment>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            {head()}
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                                {blogs.map((b,i) => (
                                    <div key={i}>
                                        <Card blog={b}/>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    );
};

Category.getInitialProps = ({query}) => { //With this methos we let Categories be server rendered
    return singleCategory(query.slug).then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            return {category: data.category, blogs: data.blogs, query};
        }
    });
};

export default Category;


//How could we get the rignt name in the card for written by