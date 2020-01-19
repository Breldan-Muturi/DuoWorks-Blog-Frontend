import Link from 'next/link';
import {useState, useEffect} from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';  //We use this functionality to ensure SSL is fakse so that it's not rendering in the server side
import {withRouter} from 'next/router';  //In next js with this allows us to export our component
import {getCookie, isAuth } from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {singleBlog, updateBlog} from '../../actions/blog';
const ReactQuill = dynamic (() => import('react-quill'), {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';
import {QuillModules, QuillFormats} from '../../helpers/quill';
import {API} from '../../config';

const BlogUpdate = ({router}) => {
    const [body, setBody] = useState('');

    const[categories, setCategories] = useState([]);
    const[tags, setTags] = useState([]);

    const [checked, setChecked] = useState([]); //categories setting state when they're checked or unchecked
    const [checkedTag, setCheckedTag] = useState([]); //Tags setting state when they're checked or unchecked
     
    const [values, setValues] = useState({
        title: '',
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        body: '',
    });

    const {title, error, success, formData} = values;
    const token = getCookie('token');
    
    useEffect(() => {
        setValues({...values, formData: new FormData()});         
        initBlog();
        initCategories();
        initTags();
    }, [router]); //We run this anytime the router changes

    const initBlog = () => {
        if(router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if(data.error){
                    console.log(data.error);
                } else {
                    setValues({...values, title: data.title});
                    setBody(data.body);
                    setCategoriesArray(data.categories); 
                    setTagsArray(data.tags); 
                }
            });
        }  
    }; 

    const setCategoriesArray = blogCategories => {
        let ca = [];
        blogCategories.map((c, i) => {
            ca.push(c._id);
        });
        setChecked(ca);
    };

    const setTagsArray = blogTags => {
        let ta = [];
        blogTags.map((t, i) => {
            ta.push(t._id);
        });
        setCheckedTag(ta);
    };

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

    const findOutCategory = c => {
        const result = checked.indexOf(c);  //Returns true or falsed based on whether the blog has that category
        if(result !== -1) { //WHen the category is found
            return true; 
        } else {
            return false;
        }
    };

    const findOutTag = t => {
        const result = checkedTag.indexOf(t);  //Returns true or falsed based on whether the blog has that category
        if(result !== -1) { //WHen the category is found
            return true; 
        } else {
            return false;
        }
    };

    const showCategories = () => {
        return (
            categories && categories.map((c,i) => (
                <li className="list-unstyled">
                    <input 
                        onChange={handleToggle(c._id)} 
                        checked={findOutCategory(c._id)} 
                        type="checkbox" 
                        className="mr-2" 
                    />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return (
            tags && tags.map((t,i) => (
                <li key={i} className="list-unstyled">
                    <input 
                        onChange={handleTagsToggle(t._id)} 
                        checked={findOutTag(t._id)} 
                        type="checkbox" 
                        className="mr-2" 
                    />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
    };

    const handleChange = name => e => {
        // console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value; //Dynamically determine whether were getting a photo from the blog
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''});
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    };

    const editBlog = (e) => {
        e.preventDefault();
        updateBlog(formData, token, router.query.slug).then(data =>{
            if(data.error) { 
                setValues({...values, error: data.error});
            } else {
                setValues({...values, title:'', success:`Blog titled "${data.title}" is successfully updated`});
                if (isAuth() && isAuth().role == 1) {
                    // Router.replace(`/admin/crud/${router.query.slug}`);
                    Router.replace(`/admin`);
                } else if (isAuth() && isAuth().role == 0) {
                    // Router.replace(`/user/crud/${router.query.slug}`);
                    Router.replace(`/user`);
                } 
            }
        });
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

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')}/>  
                </div>

                <div className="form-group">
                    <ReactQuill 
                    modules={QuillModules} 
                    formats={QuillFormats} 
                    value={body} 
                    placeholder="Write something amazing..." 
                    onChange={handleBody}
                />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    <div className="pt-3">
                        {showSuccess()}
                        {showError()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5>Featured Image</h5>
                            {body && (
                                <div>
                                    <img 
                                        src={`${API}/blog/photo/${router.query.slug}`} 
                                        alt={title} 
                                        style={{objectFit: 'cover', width: '100%', maxHeight: '200px'}}
                                        onError={image => (image.target.src = `/static/images/download.jpeg`)}
                                    />
                                </div>
                             )}
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

export default withRouter(BlogUpdate);