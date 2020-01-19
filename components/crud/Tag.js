import {useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { getCookie} from '../../actions/auth';
import {create, getTags, removeTag} from '../../actions/tag';

const Tag = () => {  //We add things necessary to define a tag in state
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false,
    });

    const {name, error, success, tags, removed, reload} = values;
    const token = getCookie('token'); //This passes the name of the cookie we want to get

    useEffect(() => {
        loadTags();
    },[reload]);//This empty arrray allows it to rub by default any time there is a change in the state

    const loadTags = () => {
        getTags().then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setValues({...values, tags: data});
            }
        });
    };
    //Looping through all  the tags
    const showTags = () => {
        return tags.map((t, i)=> {
            return (
                 <button 
                    onDoubleClick={() => deleteConfirm(t.slug)} 
                    title="Double click to delete"  
                    key={i} 
                    className="btn btn-outline-info mr-1 ml-1 mt-3"
                >
                    {t.name}
                 </button>   //This is what must change when we think about displaying new Category names
            );
        });
    };
    //Front end deleting a tag
    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this tag?');
        if(answer) {
            deleteTag(slug);
        }
    };

    const deleteTag = slug => {  //Pass the slug to the removeCategory do it can be deleted from the backend
        // console.log('delete', slug);
        removeTag(slug, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setValues({...values, error: false, success: false, name: '', removed: !removed, reload: !reload});
            }
        });
    };

    const clickSubmit = (e) => {
        e.preventDefault();   //So the page doesnt reload
        // console.log('create tag', name);
        create({name}, token).then(data => {
            if(data.error){
                setValues({...values, error: data.error, success: false});
            } else {
                setValues({...values, error: false, success: true, name:'', removed: '', reload: !reload});  //If this succeeds we set the name o empty so you an create another category f you want to.
            }
        });
    };

    const handleChange = e => {
        setValues({...values, name: e.target.value, error: false, success: false, removed:''});  //Whatever the user writes we grab it we populate the state with the name because we want to clear out if there are any errors
    };

    const showSuccess = () => {
        if(success) {
            return <p className="text-success">Tag is created</p>;
        }
    };

    const showError = () => {
        if(error) {
            return <p className="text-danger">Tag already exists</p>;
        }
    };

    const showRemoved = () => {
        if(removed) {
            return <p className="text-danger">Tag is removed</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({...values, error: false, success: false, removed: ''});
    };
    // This will make request to backend using the create method
    const newTagForm = () => (
         <form onSubmit={clickSubmit}>  
             <div className="form-group">
                 <label className="text-muted">Tag Name</label>
                 <input type="text" className="form-control" onChange={handleChange} value={name} required />
             </div>
             <div>
                <button type="submit" className="btn btn-info">
                    Create Tag
                </button>
             </div>
         </form>
    );
        
    return (
    <React.Fragment>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        <div onMouseMove={mouseMoveHandler}>
            {newTagForm()}
            {showTags()}
        </div>
    </React.Fragment>
    );
};

export default Tag;