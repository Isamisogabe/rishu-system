/* global $ */
function getClassJson(url) {
  var req = new XMLHttpRequest();
  var jsonObj;
  var makeData = '<tr class="jugyou"><td></td><td></td><td></td><td></td><td></td> </tr>';
  var table = $('.table');
  
  req.onload = function() {
    jsonObj = req.response;
    console.log(jsonObj);
    
    
    return false;
  };
  req.open("GET", url, true);
  req.responseType = "json";
  req.send(null);
}

function rishuBtnOnClick () {
  //-------------------- 履修ボタンクリック処理 --------------------//
  $('.rishuBtnOn').on('click', function(e) {
    var Onbtn  = $(this),
        Offbtn = Onbtn.parent().find('.rishuBtnOff');
    console.log(e);
    Onbtn.css('display', 'none');
    Offbtn.css('display', 'inline-block');
    
  });
  $('.rishuBtnOff').on('click', function(e) {
    var Offbtn  = $(this),
        Onbtn = Offbtn.parent().find('.rishuBtnOn');
    console.log(e);
    Offbtn.css('display', 'none');
    Onbtn.css('display', 'inline-block');
    
  });
}

function showClasses (clsArr) {
  var divLecs      = $(".lectures"),
      divLec       = $(".lecture"),
      divLecTitle  = $("lecture__title"),
      divRishuBtn  = $("rishuBtn"),
      tableLecture = $("lecture__table"),
      tableTr      = $("tr"),
      tableTd      = $("td");
  
  for (var i in clsArr) {
    
    divLecs.append('<div class="lecture"></div>');
    $(".lectures > .lecture:nth-child(" + i + ")").append('<div class="lecture__title">' + clsArr[i].name + ' ' + clsArr[i].subject + " " + clsArr[i].year + '年 ' + clsArr[i].semester + 'セメスター (' + clsArr[i].unit + '単位)</div>');
    $(".lectures > .lecture:nth-child(" + i + ")").append('<button class="rishuBtnOn btn btn-primary" value="true" style="display: inline-block">履修する</button>');
    $(".lectures > .lecture:nth-child(" + i + ")").append('<button class="rishuBtnOff btn btn-light" value="false" style="display: none;">キャンセル</button>');
    $(".lectures > .lecture:nth-child(" + i + ")").append('<div class="lecture__table table"></div>');
    $(".lecture:nth-child(" + i + ") > .lecture__table").append('<table class="lecture__table table"> <tr><td>教員名</td><td>' + clsArr[i].teacher + '</td></tr> <tr><td>事前履修科目</td><td>' + clsArr[i].childClass + '</td></tr> <tr><td>後続授業</td><td>' + clsArr[i].parentClass + '</td> </tr><tr><td>概要</td><td>' + clsArr[i].description + '</td></tr></table>');
  
  }
      
}

$.ajax({
  type: 'GET',
  url: './data/classData.json',
  dataType: 'json'
})
.then(
  function(json) {
    console.log(json);
     
  },
  function() {
    console.log('読み込みに失敗しました');
  }
);


$(document).ready(function() {
  var lectures;
  
  $.ajax({
    type: 'GET',
    url: './data/classData.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       lectures = json;
       showClasses(lectures);
       rishuBtnOnClick();
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
  
  $(window).scroll(function(e) {
    
  }
})
