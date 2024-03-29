import Link from 'next/link'
import {useState, useEffect} from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import {withRouter} from 'next/router'
import {getCookie, isAuth} from '../../actions/auth'
import {getCategories} from '../../actions/category'
import {getTags} from '../../actions/tag'
import {createBlog} from '../../actions/blog'
const ReactQuill = dynamic(()=> import('react-quill'),{ssr: false})
import '../../node_modules/react-quill/dist/quill.snow.css'
import {quillModules, quillFormats} from '../../helpers/quill'
import { Label } from 'reactstrap'


const CreateBlog = ({ router})=> {

    const blogFromLS = () => {
        if(typeof window === 'undefined') {
            return false;
        }

        if(localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'))
        }
        else {
            return false;
        }
    }

    const [categories, setCategory] = useState([])
    const [tags, setTags] = useState([])
    const [body, setBody] = useState(blogFromLS())
    const [checked, setChecked] = useState([])
    const [checkedTag, setCheckedTag] = useState([])
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton:  false
    })
    const initCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            }
            else setCategory(data)
        })
    }

    const initTags = () => {
        getTags().then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            }
            else setTags(data)
        })
    }
    const {error, sizeError, success, formData, title, hidePublishButton} = values
    const token = getCookie('token')
    useEffect(() => {
        setValues({...values, formData: new FormData()})
        initCategories();
        initTags();
    },[router])

    const publishBlog = (e) => {
        e.preventDefault()
        createBlog(formData,token).then(data => {
            if(data.error) {
                setValues({...values, error:data.error})
            } else {
                setValues({...values, title:'', error:'', success: `A new blog titled "${data.title}" is created`})
                setBody('')
                setCategory([])
                setTags([])
            }
        });
    }

    const handleBody = (e) => {
       setBody(e)
       formData.set('body',e)
       if(typeof window !== 'undefined') {
           localStorage.setItem('blog', JSON.stringify(e))
       }
    }

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        setValues({...values, [name]: value, formData, error: ''})
    }

    const handleToggle = (c) => () =>  {
        setValues({...values, error:''})
        const clickedCategory = checked.indexOf(c)
        const all = [...checked]
        if(clickedCategory===-1) {
            all.push(c)
        }
        else all.splice(clickedCategory, 1)

        console.log(all);
        setChecked(all)
        formData.set('categories', all);

    }

    const handleTagsToggle = (t) => () =>  {
        setValues({...values, error:''})
        const clickedTag = checkedTag.indexOf(t)
        const all = [...checkedTag]
        if(clickedTag===-1) {
            all.push(t)
        }
        else all.splice(clickedTag, 1) 
        console.log(all);
        setCheckedTag(all)
        formData.set('tags', all);

    }

    const showCategories = () => {
        return (
            categories && categories.map((c,i)=> (
                <li key={i} className="list-unstyled">
                    <input onChange = {handleToggle(c._id)} type="checkbox" className="mr-2"/>
                    <Label className="form-check-label">{c.name}</Label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t,i)=> (
                <li key={i} className="list-unstyled">
                    <input onChange = {handleTagsToggle(t._id)} type="checkbox" className="mr-2"/>
                    <Label className="form-check-label">{t.name}</Label>
                </li>
            ))
        )
    }

    const showError = () => {
        return (
        <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
        );
    }

    const showSuccess = () => {
        return (
            <div className="alert alert-success" style={{display: success ? '': 'none'}}>{success}</div>
        );
    }
    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <Label className="text-muted">Title</Label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill modules = {quillModules} formats = {quillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody} ></ReactQuill>
                </div>

                <div>
                    <button type="submit "className="btn btn-primary">Publish</button>
                </div>
            </form>
        )
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                {createBlogForm()}
                <div className="pt-3">
                    {showError()}
                    {showSuccess()}
                </div>
                </div>
                    <div className="col-md-4">
                        <div>
                            <div className="form-group pb-2">
                                <h5>Featured Image</h5>
                                <hr />
                                <small className="text-muted">Max size: 1mb</small>
                                <label className="btn btn-outline-info">Upload featured Image
                                <input type="file" onChange={handleChange('photo')} accept="image/*" hidden/>
                                </label>
                            </div>
                        </div>
                        <div>
                            <h5>Categories</h5>
                            <hr/>
                            <ul style={{maxHeight: '200px', overflowY: 'scroll'}}> 
                                {showCategories()} 
                            </ul> 
                        </div>
                        <div>
                            <h5>Tags</h5>
                            <hr/>
                            <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                {showTags()} 
                            </ul> 
                            
                        </div>     
                    
                </div>
            </div>
            
        </div>
    );
}



export default withRouter(CreateBlog);