const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');

const client = new MongoClient("mongodb+srv://hyunsub:60171914@cluster0.8a0ppgx.mongodb.net/");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

main()

const mySchema = new mongoose.Schema({
    time: String,
    count: Number, //현재인원
    maxCount: Number, //최대탑승인원
    link: String, //채팅링크
    create: String, //게시글 생성일
    arrival: String, //출발지
    departure: String, //목적지
    password: String, //글 비밀번호
})

let Article = mongoose.model('Article', mySchema)

function postArticle(data) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const date = today.getDate()

    const article = new Article

    article.time = data.hour + '/' + data.minute
    article.count = 1
    article.maxcount = data.people
    article.link = data.url
    article.create = year + "-" + month + "-" + date
    article.arrival = data.from
    article.departure = data.to
    article.password = data.password

    return article
}

function find_listing() {
    let result = null;
    result = client.db("test").collection("articles").find({}).toArray();
    //console.log(result)
    return result

}

async function main() {
    try {
        // Connect the client to the server
        await client.connect();


        console.log("connect")
    } catch (e) {
        console.log("false")
    }

    app.listen(3000, () => {
        console.log('서버가 3000 포트에서 실행 중입니다.');
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'prototype.html'));
});

app.post('/article', (req, res) => {
    const newArticle = postArticle(req.body)
    client.db("test").collection("article").insert(newArticle)
        .then(res.json({"msg": "success"}))
        .catch((err) => {
            res.json({"msg": "error"})
        })
});

app.get('/list', async (req, res) => {
    let articles = await find_listing()
    console.log(articles)
    //console.log(articles)
    res.json(articles)
})