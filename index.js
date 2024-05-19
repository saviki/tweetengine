const express = require('express')
const mongoose = require( 'mongoose' )
const bodyParser = require( 'body-parser' )
const multer = require('multer')

const app = express()
const upload = multer()

app.use(upload.array())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

mongoose.connect( 'mongodb+srv://savinkisunu:hhqN5qpzL4pclKZg@cluster0.z0fwaiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' )
    .then(() => console.log( 'Connected to MongoDB' ))
    .catch(err => console.error( 'Could not connect to MongoDB' , err))

const tweetSchema = new mongoose.Schema({
    name: String,
    author: String,
    date: String
    });
const Tweet = mongoose.model( 'Tweet' , tweetSchema)

async function createTweet(name, author, date) {
    console.log(name, author, date)
    const tweet = new Tweet({
        name: name ,
        author: author,
        date: date
    });
    const result = await tweet.save()
    console.log(result);
}
async function getTweets() {
    var tweets  = []
    const result = await Tweet
    .find({})
    .then((data) => {
        console.log(data);
        tweets = data
    })
    .catch((err) => {
        console.error("Error: ", err);
    })
    return tweets
}
async function updateTweet(id, newTweetName) {
    const todo = await Tweet.findOne({_id: id});
    todo.set({
        name : newTweetName ,
    });
    const result = await todo.save();
    console.log(result);
}

function deleteTweet(id) {
    Tweet.deleteOne({_id: id})
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.error("Error: ", err);
        });
}

app.get('/', async (req, res)=> {
    res.send({tweets: await getTweets()})
})
app.post('/tweets', async (req, res)=>{
    createTweet(req.body.name, req.body.author, req.body.date)
    .then((data) =>{
        res.send(true)
    }).catch((err) => {
        res.send(false)
    });
})
app.delete('/tweets/:id', async (req, res)=>{
    res.send(deleteTweet(req.params.id))
})

app.listen(8080, ()=> console.log('listnening on port 8080'))
