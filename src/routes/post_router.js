const express = require('express')
const router = express.Router()
const {
    getAllPosts, getPostById, getPostsByAuthor, createPost, updatePost, deletePost
} = require('../controllers/posts_controller');

router.get('/', async (request, response) => {
    let allPosts = await getAllPosts()
    response.json({
        postsCount : allPosts.length,
        postArray: allPosts
    })
})

router.get('/author/:authorId', async (request, response) => {
    let postsByAuthor = await getPostsByAuthor(request.params.authorId)
    response.json({
        postsCount: postsByAuthor.length,
        postsArray: postsByAuthor
    })
})

router.get('/postId', async (request, response) => {
    response.json(await getPostById(request.params.postId))
})

router.post('/', async (request, response) => {
    response.json(await createPost(request.body.postDetails));
});

// Update a specific post
router.put('/:postID', async (request, response) => {
    let postDetails = {
        postID: request.params.postID,
        updatedData: request.body.newPostData
    };

    response.json(await updatePost(postDetails));
});

// Delete a specific post
router.delete('/:postID', async (request, response) => {
    response.json(await deletePost(request.params.postID));
});


// Export the router so that other files can use it:
module.exports = router;