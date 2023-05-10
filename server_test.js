const mongoose = require('mongoose');

main()

async function main() {
    await mongoose.connect("mongodb+srv://hyunsub:60171914@cluster0.8a0ppgx.mongodb.net/", {
        dbName: 'test'
    })
        .then(() => console.log('connected'))
        .catch((err) => console.log('connect fail'))

    mySchema = new mongoose.Schema({
        title: String, //글 제목
        time: String, //탑승시간
        count: Number, //탑승인원
        link: String, //채팅링크
        create: String, //게시글 생성시간
        arrival: String, //출발지
        departure: String, //목적지
        password: String //글 비밀번호
    })

    const Article = mongoose.model('Article', mySchema)

    var test_article = new Article({
        title: '명지택시', //글 제목
        time: '1000', //탑승시간
        count: 1, //탑승인원
        link: 'open.link.test', //채팅링크
        create: '0900', //게시글 생성시간
        arrival: '명지대', //출발지
        departure: '기흥역', //목적지
        password: '0000' //글 비밀번호
    })

    console.log(test_article.title)

    await test_article.save()
        .then(() => console.log("성공"))
        .catch((err) => console.log("실패"))

    console.log(Article.find({}))
}

