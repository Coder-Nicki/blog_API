const {Post} = require('../models/PostModel')

async function getAllPosts(){
    return await Post.find({})
}

async function getPostById(postId){
    return await Post.findById(postId)
}

async function getPostByAuthor(userId){
    return await Post.find({author: userId})
}

async function createPost(postDetails){
    return await Post.create(postDetails)
}

async function updatePost(postDetails){
    return await Post.findByIdAndUpdate(postDetails.postId, postDetails.updatedDetails)
}

async function deletePost(postId){
    return await Post.findByIdAndDelete(postId)
}

module.exports = {
    getAllPosts, getPostById, getPostsByAuthor, createPost, updatePost, deletePost
}