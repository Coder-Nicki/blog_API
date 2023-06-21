const {app, PORT, HOST} = require("./server.js")

app.listen(PORT, HOST, () => {
    console.log("The blog API is now running")

})