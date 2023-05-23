const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const db = main()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const mySchema = new mongoose.Schema({
    time: String,
    count: Number, //현재인원
    maxCount: Number, //최대탑승인원
    link: String, //채팅링크
    create: String, //게시글 생성일
    arrival: String, //출발지
    departure: String, //목적지
    password: String, //글 비밀번호
    student_id: Number //본인 학번
})

const Article = mongoose.model('Article', mySchema)


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
    article.student_id = data.student_id

    return article
}

function getList() {
    const articles = Article.find({});

    return articles
}

async function main() {
    const db = await mongoose.connect("mongodb+srv://ohyuntaek:60181907@cluster0.8a0ppgx.mongodb.net/", {
        dbName: 'test'
    })
        .then(() => console.log('connected'))
        .catch((err) => console.log('connect fail'))

    /*await test_article.save()
        .then(() => console.log("성공"))
        .catch((err) => console.log("실패"))

    const articles = await Article.find()
    console.log(articles)*/

// 서버 시작
    app.listen(3000, () => {
        console.log('서버가 3000 포트에서 실행 중입니다.');
    });

    return db
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'prototype.html'));
});

app.post('/article', (req, res) => {
    const newArticle = postArticle(req.body)
    newArticle.save()
        .then(res.json({"msg": "success"}))
        .catch((err)=>{res.json({"msg": "error"})})
});

app.get('/list', (req, res) => {
    const articles = getList()
    console.log(articles)
    res.json(articles)
})

