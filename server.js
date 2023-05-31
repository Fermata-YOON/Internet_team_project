const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const schedule = require('node-schedule');

main()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const mySchema = new mongoose.Schema({
    ride_month: String, //출발 월
    ride_day: String, //출발 일
    ride_hour: String, //출발 시
    ride_minute: String, //출발 분
    count: Number, //현재인원
    maxCount: Number, //최대탑승인원
    link: String, //채팅링크
    create: String, //게시글 생성일
    arrival: String, //출발지
    departure: String, //목적지
    password: String, //글 비밀번호
    studentNum: [] //학번
})

let Article = mongoose.model('Article', mySchema)


function postArticle(data) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const date = today.getDate()

    const article = new Article

    article.ride_month = data.ride_month + '월'
    article.ride_day = data.ride_day + '일'
    article.ride_hour = data.ride_hour + '시'
    article.ride_minute = data.ride_minute + '분'
    article.count = 1
    article.maxCount = data.people
    article.link = data.talk
    article.create = year + "-" + month + "-" + date
    article.arrival = data.from
    article.departure = data.to
    article.password = data.password
    article.studentNum = data.studentNum

    return article
}

async function getList() {
    await Article.find({}, (err, articles) => {
        if (err) {
            console.error('게시물 중 오류가 발생했습니다:', err);
        } else {
            console.log('게시물 목록:');
            articles.forEach((article) => {
                console.log(article)
            });
        }
    })
}

async function main() {
    await mongoose.connect("mongodb+srv://masterAdmin:master1234@cluster0.8a0ppgx.mongodb.net/", {
        dbName: 'Taxi'
    })
        .then(() => console.log('connected'))
        .catch((err) => console.log('connect fail'))

// 서버 시작
    app.listen(3000, () => {
        console.log('서버가 3000 포트에서 실행 중입니다.');
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/article', (req, res) => {
    const newArticle = postArticle(req.body)
    newArticle.save()
        .then(res.json({"msg": "게시글 작성 완료"}))
        .catch((err)=>{res.json({"msg": "에러가 발생했습니다"})})
});

app.delete('/delete_article', async (req, res) => {
    const id = req.body.id
    const password = req.body.password
    const myquery = {'_id': id, 'password': password}

    const article = await Article.find({'_id': id, 'password': password})

    if(article.length != 0) {
        Article.deleteOne({'_id': id})
            .then(res.json({'msg':'삭제완료'}))
            .catch((err)=>{res.json({'msg': '에러가 발생했습니다.'})})
    } else {
        res.json({'msg': '비밀번호가 일치하지 않습니다!'})
    }
});

app.get('/list', async (req, res) => {
    let articles = await Article.find({})
    //console.log(articles)
    res.json(articles)
})

app.post('/link', async (req, res) => {
    const id = req.body.id
    const studentNum = req.body.studentNum
    const article = await Article.find({'_id': id})
    console.log(article[0]['studentNum'])

    if(article[0]['studentNum'].includes(studentNum)) {
        console.log('student in article')
        res.json(article)
    } else {
        console.log('push student')
        await Article.updateOne({'_id': id},{$push: {'studentNum': studentNum}, $inc:{'count': 1}})
        res.json(article)
    }
})

schedule.scheduleJob('0 0/5 * * *', async () => {
    const now = new Date();
    const now_year = now.toLocaleDateString('en-US', {
        year: 'numeric',});
    const now_month = now.toLocaleDateString('en-US', {
        month: '2-digit',});
    const now_day = now.toLocaleDateString('en-US', {
        day: '2-digit',});
    const now_hour = now.toLocaleDateString('en-US', {
        hour: '2-digit',});
    const now_minute = now.toLocaleDateString('en-US', {
        minute: '2-digit',});
    const article = await Article.find({})

    console.log(now);
    console.log(now_hour);
    console.log(now_minute);
    for(let i=0; i<article.length; i++){
        const id = article[i]['id']
        if(
            Number(article[i]['create'].substring(0, 4)) < Number(now_year) &&
            Number(article[i]['ride_month'].substring(0, article[i]['ride_month'].length - 1)) < Number(now_month) &&
            Number(article[i]['ride_day'].substring(0, article[i]['ride_day'].length -1)) < Number(now_day) &&
            Number(article[i]['ride_hour'].substring(0, article[i]['ride_hour'].length -1)) < Number(now_hour) &&
            Number(article[i]['ride_minute'].substring(0, article[i]['ride_minute'].length -1)) < Number(now_minute)

        ){
            Article.deleteOne({'_id': id})
                .then(console.log("삭제완료"))
                .catch((err)=> console.log("오류가 발생했습니다"))
        }
    }
})

