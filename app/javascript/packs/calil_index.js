function promiseFactory(count) {
  return new Promise((resolve, reject) => {
    timer_id = setTimeout(() => {
      count++;

      gon.books.forEach(function(book) {
        console.log(book);

        //本の貸出情報をGETリクエストする
        $.ajax({
          type: 'GET',
          url: 'https://api.calil.jp/check',
          data:{
            appkey: gon.calil_key,
            isbn: Number(book.systemid),
            systemid: gon.library,
          },
          dataType: 'jsonp',
          jsonp: 'callback',
        })

        // 成功した場合dataにJSONを格納
        .done(function(data){
          // JSONから図書館、貸出情報を取得してsituationに代入
          const situation = data.books[Number(book.systemid)][gon.library].libkey
          // JSONから予約情報を取得してreserveurlに代入
          const reserveurl = data.books[Number(book.systemid)][gon.library].reserveurl
          // JSONからリクエスト結果を取得してstatusに代入
          const status = data.books[Number(book.systemid)][gon.library].status


          var btn = $('#isbn').val();


          // data.continueが0だった場合
          if (data.continue === 0) {
            if (status === 'Error') {
                $("#kensaku").remove();
                $(`#${book.systemid}`).after(`<div>
                <button type="button" class="btn btn-dark">図書館から応答がありません<p>時間を空けてお試しください</button>
                </div>`)
                clearTimeout( timer_id );
            } else {
              if (Object.keys(situation).length === 0 && situation.constructor === Object) {
                  $("#kensaku").remove();
                  $("#choice").prepend(`<button type="button" class="badge bg-secondary btn-block">図書館に本がありません</button>`)
                  clearTimeout( timer_id );
              } else {
                // situationからひとづつ値を取り出してvalueに代入
                Object.keys(situation).forEach( function(value) {
                  //kensakuに値があれば削除からひとづつ値を取り出してvalueに代入
                  $("#kensaku").remove();
                  //choiceにvalue（図書館名）、this[value](貸出情報)を出力
                  if (this[value] === "貸出可") {
                    // $("#choice").prepend(`<h4>
                    $(`.library-info${book.systemid}`).after(`<span class="badge bg-info text-white">${value} : ${this[value]}</span>`)
                  
                  } else {

                    $(`.library-info${book.systemid}`).after(`<span class="badge bg-success text-white">${value} : ${this[value]}</span>`)
                  }
                }, situation)
                $(`.reserve${book.systemid}`).after(`<button type="button" class="badge bg-outline-info"><a href="${reserveurl}">予約する</a></button>`)
                //data.continueが0だった場合にループ（setTimeout）を抜ける
                clearTimeout( timer_id );
                }
            }
          //data.continueが0だった場合は10回リトライをする 
          } else {
            // 10回目のコールでエラー
            if (count === 10 ) {
            reject(count);
            } else {
            resolve(count);
            }
          }
        })
      
        //https://api.calil.jp/checkへのGETに失敗した場合
        .fail(function(data){
          $("#jsonp").append("エラーです");
        });

      })
    }, 2000);
  });
}
    async function execute() {
      try {
          let count = await promiseFactory(0);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
          count = await promiseFactory(count);
      } catch (errorCount) {
          console.error(`エラーに飛びました。現在のカウントは ${errorCount} です。`);
      } finally {
          console.log("処理を終了します。");
      }
  }
  execute();