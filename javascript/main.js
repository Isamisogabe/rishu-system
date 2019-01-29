/* global $ */
var allLectures;
var rishuModel = [];
  

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

function rishuBtnOnClick (lectures) {
  //-------------------- 履修ボタンクリック処理 --------------------//
  $('.rishuBtnOn').on('click', function(e) {
    var Onbtn  = $(this),
        Offbtn = Onbtn.parent().find('.rishuBtnOff'),
        clsId  = parseInt(Onbtn.val()),
        lecture = allLectures[clsId];
    console.log("授業登録ボタンを押す -> classナンバー：",  clsId);
    
    Onbtn.css('display', 'none');
    Offbtn.css('display', 'inline-block');
    
    lecture.isSigned = true;
    rishuModel.push(allLectures[clsId]);
    
    console.log("追加した後の履修モデル", rishuModel);
    
    var semester = parseInt(lecture.semester);
    var lecLi = $("<li><a href=#" + lecture.classId+ ">" + lecture.name + " (" + lecture.subject +")</a></li>");
    $("#rishuModel__Content #rishu__" + semester).append(lecLi);
  });
  $('.rishuBtnOff').on('click', function(e) {
    var Offbtn  = $(this),
        Onbtn = Offbtn.parent().find('.rishuBtnOn'),
        clsId = Offbtn.val(),
        lecture = allLectures[clsId];
    console.log("ボタンOffクリック", e, clsId);
    Offbtn.css('display', 'none');
    Onbtn.css('display', 'inline-block');
    lecture.isSigned = false;
    
    for(var i in rishuModel){
      var classId = rishuModel[i].classId ;
      if(classId === allLectures[clsId].classId){
        rishuModel.splice(i,1);
      }
    }
    console.log(rishuModel);
    var semester = parseInt(lecture.semester);
    $("#rishu__" + semester).find("#" + lecture.classId).remove();
  });
}



function showClasses (clsArr) {
  var divLecs      = $(".lectures");
  
  for (var i in clsArr) {
    var lecture = $(".lectures > .lecture:nth-child(" + i + ")");
    divLecs.append('<div class="lecture" value='+ i +'></div>');
    
    lecture.append('<div class="lecture__title" id=' + clsArr[i].classId + ' value="' + i + '">' + clsArr[i].name + ' ' + clsArr[i].subject + " " + clsArr[i].year + '年 ' + clsArr[i].semester + 'セメスター (' + clsArr[i].unit + '単位)</div>');
    lecture.append('<button class="rishuBtnOn btn btn-primary" value="' + i + '" style="display: inline-block">履修する</button>');
    lecture.append('<button class="rishuBtnOff btn btn-light" value="' + i + '" style="display: none;">キャンセル</button>');
    lecture.append('<div class="lecture__table table"></div>');
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
  var rishuModel = [];
  
  $.ajax({
    type: 'GET',
    url: './data/classData.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       allLectures = json;
       showClasses(allLectures);
       rishuBtnOnClick();
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
  
  $(window).scroll(function(e) {
    var height = $(window).scrollTop();
    $("#displayModel").css({"margin-top":height });
  });
})
