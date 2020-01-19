import Link from 'next/link';
import {useState, useEffect} from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';  //We use this functionality to ensure SSL is fakse so that it's not rendering in the server side
import {withRouter} from 'next/router';  //In next js with this allows us to export our component
import {getCookie, isAuth } from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';
const ReactQuill = dynamic (() => import('react-quill'), {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';
import {QuillModules, QuillFormats} from '../../helpers/quill';

const CreateBlog = ({router}) => {
    const blogFromLS = () => {  //We use this to get data about the blog from loca storage
        if(typeof window == 'undefined') {
            return false;
        }

        if(localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'))
        } else {
            return false;
        }
    };

    const[categories, setCategories] = useState([]);
    const[tags, setTags] = useState([]);

    const [checked, setChecked] = useState([]); //categories setting state when they're checked or unchecked
    const [checkedTag, setCheckedTag] = useState([]); //Tags setting state when they're checked or unchecked
    //We are setting state for the values which will be passed from our forms
    const [body, setBody] = useState(blogFromLS()); //We populate the body with what we get from local storage
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false,
        loading: false
    });

    const {error, sizeError, success, formData, title, hidePublishButton, loading} = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({...values, formData: new FormData()});
        initCategories();
        initTags();
    }, [router]); 

    const initCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags().then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setTags(data);
            }
        });        
    };

    const publishBlog = (e) => {
        setValues({ ...values, loading: true });
        e.preventDefault();
        // console.log('ready to publishBlog');
        createBlog(formData, token).then(data => {
            if(data.error) {
                setValues({...values, error:data.error, loading: false });
            } else {
                setValues({...values, 
                loading: false,
                title:'', 
                error: '', 
                success: `A new blog titled "${data.title}" is created`
            });
            setBody(''); //This will also clear out our local storage because local storage is in sync with our state
            setCategories([]);
            setTags([]); 
            //Load Categories and tags
            initCategories();
            initTags();
            }
        });
    };

    const handleChange = name => e => {
        // console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value; //Dynamically determine whether were getting a photo from the blog
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''});
    };

    const handleBody = e => {
        // console.log(e);
        setBody(e);
        formData.set('body', e);
        if(typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    const handleToggle = c => () => {
        setValues({...values, error: ''});
        //return the first index or return -1;
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];
        if (clickedCategory == -1) {  //If the category wasnt found in state it's added
            all.push(c);
        } else { //if it's found it is removed;
            all.splice(clickedCategory, 1);
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);
    };

    const handleTagsToggle = t => () => {
        setValues({...values, error: ''});
        //return the first index or return -1;
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];
        if (clickedTag == -1) {  //If the tag wasnt found in state it's added
            all.push(t);
        } else { //if it's found it is removed;
            all.splice(clickedTag, 1);
        }
        console.log(all);
        setCheckedTag(all);
        formData.set('tags', all);
    };

    const showCategories = () => {
        return (
            categories && categories.map((c,i) => (
                <li className="list-unstyled">
                    <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return (
            tags && tags.map((t,i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
    };

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '': 'none'}}>
            {error} 
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '': 'none'}}>
            {success}
        </div>
    );

    const showLoading = () => {
        <div className="alert alert-info" style={{display: loading ? '' : 'none'}}>
            Loading ...
        </div>
    }

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')}/>  
                </div>

                <div className="form-group">
                    <ReactQuill 
                    modules={QuillModules} 
                    formats={QuillFormats} 
                    value={body} placeholder="Write something amazing..." 
                    onChange={handleBody}
                />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">
                        Publish
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                        {showLoading()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5>Featured Image</h5>
                            <hr/>
                            <div>
                                <small className="text-muted">Max size 1mB</small>
                            </div>
                            <label className="btn btn-outline-info">
                                Upload Featured Image
                                <input onChange={handleChange('photo')} type="file" accept="image/*"hidden />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <hr/>
                        <ul style={{maxHeight: '200px', overflowY:'scroll '}}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr/>
                        <ul style={{maxHeight: '200px', overflowY:'scroll '}}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(CreateBlog);