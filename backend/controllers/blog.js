const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const {errorHandler} = require('../helpers/dberror');
const fs = require('fs');
const {smartTrim} = require('../helpers/blog')


exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        const {title, body, categories, tags} = fields
        if(!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            })
        }

        if(!categories || (categories.length)===0) {
            return res.status(400).json({
                error: 'Atleast one category is required'
            })
        }

        if(!tags || (tags.length)===0) {
            return res.status(400).json({
                error: 'Atleast one tag is required'
            })
        }

        let blog = new Blog()
        blog.title = title
        blog.body = body
        blog.slug = slugify(title).toLowerCase()
        blog.mtitle = `${title} | ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(body.substring(0,160)).result
        blog.postedBy = req.user._id
        blog.excerpt = smartTrim(body, 320, ' ', '...');

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')
        //console.log(req.user)
        if(files.photo) {
            if(files.photo.size> 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                })
            }
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.contentType
        }
        console.log(err)
        blog.save((err,result) => {
            
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            //res.json(result);

            Blog.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true}).exec((err,result) => {
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                else {
                    Blog.findByIdAndUpdate(result._id, {$push: {tags: arrayOfTags}}, {new: true}).exec((err,result) => {
                        if(err){
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        }
                        else  res.json(result);
                    })
                }
            })

        })

    })
};

//list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req,res)=> {
    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err, data)=> {
        if(err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
} 

exports.listAllBlogsCategoriesTags = (req,res)=> {
    let limit = req.body.limit ? parseInt(req.body.limit):10
    let skip = req.body.skip ? parseInt(req.body.skip):0
    let blogs
    let categories
    let tags

    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err,data)=> {
        if(err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        blogs = data
        Category.find({}).exec((err,c)=> {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            categories=c
            Tag.find({}).exec((err,t)=> {
                if(err) {
                    return res.json({
                        error: errorHandler(err)
                    })
                }
                tags=t
            })
            res.json({blogs, categories, tags, size: blogs.length})
        })

    })

    
} 
exports.read = (req,res)=> {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
    .exec((err, data)=> {
        if(err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
} 
exports.remove = (req,res)=> {
    const slug = req.params.slug.toLowerCase()
    Blog.findOneAndRemove({slug})
    .exec((err,data)=> {
        if(err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Blog deleted successfully'
        })
    })
} 
exports.update = (req,res)=> {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug}).exec((err, oldBlog)=> {
        if(err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        let form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req,(err, fields, files)=> {
            if(err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                })
            }
    
            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields)
            oldBlog.slug = slugBeforeMerge

            const {body, desc, categories, tags} = fields

            if(body){
                oldBlog.excerpt = smartTrim(body, 320, ' ...')
                oldBlog.desc = stripHtml(body.substring(0,160))
            }
            
            if(categories) {
                oldBlog.categories=categories.split(',')
            }
            
            if(tags) {
                oldBlog.tags=tags.split(',')
            }
            
            if(files.photo) {
                if(files.photo.size> 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 1MB in size'
                    })
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.contentType
            }
            console.log(err)
            oldBlog.save((err,result) => {
                
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                //res.json(result);
                res.json(result)
            })    
        })
    })
    
    
};