function get_list() {
    $.ajax({
        type: "GET",
        url: "/list",
        data: {},
        success: function (response) {
            const articles = response;
            const findFrom = $("#find_from").val();
            const findTo = $("#find_to").val();
            const findMonth = $("#find_month").val();
            const findDay = $("#find_day").val();
            const findHour = $("#find_hour").val();
            const findMinute = $("#find_minute").val();
            $('#article-list').empty();
            let article_arr = [];
            article_arr.length = 0;
            for (let i = 0; i < articles.length; i++) {
                let article = articles[i];
                const from = article["arrival"];
                const to = article["departure"];
                const rideMonth = article['ride_month'];
                const rideDay = article['ride_day'];
                const rideHour = article['ride_hour'];
                const rideMinute = article['ride_minute'];
                const people = article["maxCount"];
                const count = article["count"];
                const id = article["_id"];
                const matchFrom = (findFrom === "" || findFrom === from);
                const matchTo = (findTo === "" || findTo === to);
                const matchMonth = (findMonth === "" || findMonth === rideMonth);
                const matchDay = (findDay === "" || findDay === rideDay);
                const matchHour = (findHour === "" || findHour === rideHour);
                const matchMinute = (findMinute === "" || findMinute === rideMinute);
                if (matchFrom && matchTo && matchMonth && matchDay && matchHour && matchMinute) {
                    let cell = new Array(from, to, rideMonth, rideDay, rideHour, rideMinute, people, count, id);
                    article_arr.push(cell);
                }
            }
            //console.log(article_arr);
            article_arr.sort(function (a, b) {
                let a_month = a[2];
                a_month = a_month.substr(0, a_month.length - 1)
                a_month = Number(a_month);
                let b_month = b[2];
                b_month = b_month.substr(0, b_month.length - 1)
                b_month = Number(b_month);
                let a_day = a[3];
                a_day = a_day.substr(0, a_day.length - 1)
                a_day = Number(a_day);
                let b_day = b[3];
                b_day = b_day.substr(0, b_day.length - 1)
                b_day = Number(b_day);
                let a_hour = a[4];
                a_hour = a_hour.substr(0, a_hour.length - 1)
                a_hour = Number(a_hour);
                let b_hour = b[4];
                b_hour = b_hour.substr(0, b_hour.length - 1)
                b_hour = Number(b_hour);
                let a_minute = a[5];
                a_minute = a_minute.substr(0, a_minute.length - 1)
                a_minute = Number(a_minute);
                let b_minute = b[5];
                b_minute = b_minute.substr(0, b_minute.length - 1)
                b_minute = Number(b_minute);

                if (a_month > b_month) {
                    return 1
                }
                ;
                if (a_month < b_month) {
                    return -1
                }
                ;
                if (a_day > b_day) {
                    return 1
                }
                ;
                if (a_day < b_day) {
                    return -1
                }
                ;
                if (a_hour > b_hour) {
                    return 1
                }
                ;
                if (a_hour < b_hour) {
                    return -1
                }
                ;
                if (a_minute > b_minute) {
                    return 1
                }
                ;
                if (a_minute < b_minute) {
                    return -1
                }
                ;
            });
            console.log(article_arr);
            if (article_arr.length != 0) {
                for (let j = 0; j < article_arr.length; j++) {
                    const arr_from = article_arr[j][0];
                    const arr_to = article_arr[j][1];
                    const arr_rideMonth = article_arr[j][2];
                    const arr_rideDay = article_arr[j][3];
                    const arr_rideHour = article_arr[j][4];
                    const arr_rideMinute = article_arr[j][5];
                    const arr_people = article_arr[j][6];
                    const arr_count = article_arr[j][7];
                    const arr_id = article_arr[j][8];

                    let temp_html = `
                            <tr>
                            <td colspan="1">${arr_from}</td>
                            <td colspan="1">${arr_to}</td>
                            <td colspan="1">${arr_rideMonth}</td>
                            <td colspan="1">${arr_rideDay}</td>
                            <td colspan="1">${arr_rideHour}</td>
                            <td colspan="1">${arr_rideMinute}</td>
                            <td colspan="1">${arr_count}/${arr_people}</td>
                            <td colspan="1">
                                <button onClick="show_link('${arr_id}', '${arr_count}', '${arr_people}')" type="button" class="btn btn-warning mybtn">신청</button>
                            </td>
                            <td colspan="1">
                                <button onClick="delete_order('${arr_id}')" type="button" class="btn btn-warning mybtn">삭제</button>
                            </td>
                            </tr>`;
                    $('#article-list').append(temp_html);
                }
            }
        }
    });
}

function save_article() {

    const ride_month = $('#month').val()
    const ride_day = $('#day').val()
    const ride_hour = $('#hour').val()
    const ride_minute = $('#minute').val()
    const from = $('#from').val()
    const to = $('#to').val()
    const people = $('#people').val()
    const talk = $('#url').val()
    const password = $('#password').val()
    const studentNum = $('#studentNum').val()
    if (checkData()) {
        $.ajax({
            type: "POST",
            url: "/article",
            data: {
                "ride_month": ride_month,
                "ride_day": ride_day,
                "ride_hour": ride_hour,
                "ride_minute": ride_minute,
                "from": from,
                "to": to,
                "people": people,
                "talk": talk,
                "password": password,
                "studentNum": studentNum
            },
            dataType: "JSON",
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        });
    }
}

function show_link(id, count, people) {
    if (count - people == 0) {
        alert("인원이 이미 다 찼습니다.")
    } else if (window.confirm('정말로 신청하시겠습니까?')) {
        const studentNum = prompt('학번을 입력해주세요')
        $.ajax({
            type: "POST",
            url: '/link',
            data: {'id': id, 'studentNum': studentNum},
            dataType: "JSON",
            success: function (response) {
                const article = response
                const link = article[0]['link']
                window.location.reload()
                window.open(link)
            }
        });
    }
}

function delete_order(id) {
    const password = prompt('비밀번호 입력')
    $.ajax({
        type: "DELETE",
        url: "/delete_article",
        data: {
            "id": id, "password": password
        },
        dataType: "JSON",
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

//<kdh
function checkData() {
    const ride_month = $('#month').val()
    const ride_day = $('#day').val()
    const ride_hour = $('#hour').val()
    const ride_minute = $('#minute').val()
    const from = $('#from').val()
    const to = $('#to').val()
    const people = $('#people').val()
    const talk = $('#url').val()
    const password = $('#password').val()
    const studentNum = $('#studentNum').val()

    // 데이터 형식을 검사하고 오류가 있는 경우 알림창을 띄웁니다.
    //< 날짜 년, 월, 일 가져오는 함수
    const today = new Date();

    function formatDate(date, format) {
        const map = {
            mm: date.getMonth() + 1,
            dd: date.getDate(),
            yy: date.getFullYear().toString().slice(-2),
            yyyy: date.getFullYear()
        }
        return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
    }

    //>
    //<--
    if (!isValiRide_month(ride_month)) {
        alert('잘못된 월 형식입니다.');
        return 0;
    } else if (isValiRide_month(ride_month)) {

        if (ride_month < parseInt(formatDate(today, 'mm'), 10)) {

            alert('지난 날짜(월) 입니다.');
            return 0;
        }

    }
    //>--

    //<--
    if (!isValiRide_day(ride_day)) {
        alert('잘못된 일 형식입니다.');
        return 0;
    } else if (isValiRide_month(ride_day)) {

        if (ride_day < parseInt(formatDate(today, 'dd'), 10)) {

            if (ride_month <= parseInt(formatDate(today, 'mm'), 10)) {
                alert('지난 날짜(일) 입니다.');
                return 0;
            }

        }
    }
    //>--

    if (!isValiRide_Hour(ride_hour)) {
        alert('잘못된 시간 형식입니다.');
        return 0;
    }

    if (!isValiRide_Minute(ride_minute)) {
        alert('잘못된 분 형식입니다.');
        return 0;
    }

    if (!isValidFromTo(from, to)) {
        alert('출발지와 도착지를 올바르게 입력해주세요.');
        return 0;
    }

    if (!isValidPeople(people)) {
        alert('잘못된 인원 수입니다.');
        return 0;
    }

    if (!isValidUrl(talk)) {
        alert('잘못된 URL 형식입니다.');
        return 0;
    }
    if (!isValiPassword(password)) {
        alert('잘못된 비밀번호 형식입니다.');
        return 0;
    }
    if (!isValiStudentNum(studentNum)) {
        alert('잘못된 학번 형식입니다.');
        return 0;
    }
    return true;
}

//월 형식을 검사하는 함수
function isValiRide_month(ride_month) {
    return ride_month != '-- 월 선택 --';
}

//일 형식을 구하는 함수
function isValiRide_day(ride_day) {
    return ride_day != '-- 일 선택 --';
}

// 시간 형식을 검사하는 함수
function isValiRide_Hour(ride_hour) {

    return ride_hour != '-- 시간 선택 --';
}

// 분 형식을 검사하는 함수
function isValiRide_Minute(ride_minute) {

    return ride_minute != '-- 분 선택 --';
}

// 출발지와 도착지 형식을 검사하는 함수
function isValidFromTo(from, to) {
    // 출발지와 도착지가 모두 입력되어야 합니다.
    return from != '-- 출발지를 선택해주세요 --' && to != '-- 목적지를 선택해주세요 --';
}

// 인원 수 형식을 검사하는 함수
function isValidPeople(people) {

    return people != '-- 본인 포함 최대 탑승 인원 --';
}

// URL 형식을 검사하는 함수
function isValidUrl(talk) {
    return talk.includes('https://open.kakao.com/');
}

//password 형식을 검사하는 함수
function isValiPassword(password) {
    return password.length > 3 && password.length < 5;
}

//studentNum 형식을 검사하는 함수
function isValiStudentNum(studentNum) {
    return studentNum.length > 7 && studentNum.length < 9;
}

//> kdh