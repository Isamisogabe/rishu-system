/* global $ */
var allLectures;
var rishuModel = [];
var rishuUnit  = [0,0,0,0,0,0,0,0];
var subjectUnit = [0,0,0,0,0,0,0,0,0];
var totalUnit  = 0;
var minimalUnit = []
  

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
function sideScroll () {
  $("#displayModel").hover(function(e){
    var sidebar = $(this),
        height  = sidebar.height(),
        windowHeight = $(window).height();
    
    sidebar.scroll(function(e) {
      
    })
  })
}
function selectSubject(subject){
  switch(subject){
    case "英語科目":             
    case "専門導入科目":         return 1; 
    case "専門基礎科目":         return 2; 
    case "専門演習科目":         return 3; 
    case "専門応用科目理学系":   return 4; 
    case "専門応用科目理工学系": return 5; 
    case "専門応用科目工学系":   return 6; 
    case "専門関連科目":         return 7; 
    case "専門学外学修科目":     return 8; 
  }
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
    
    var semester = parseInt(lecture.semester, 10),
        unit     = parseInt(lecture.unit, 10);
    var lecLi = $("<li id=display__" + lecture.classId + "><a href=#" + lecture.classId+ ">" + lecture.name + " (" + lecture.subject +")</a></li>");
    $("#rishu__" + lecture.semester).append(lecLi);
    rishuUnit[semester-1] += unit;
    totalUnit += unit;
    $("#rishuInfo #unit__rishu__" + semester).html("").append(rishuUnit[semester-1]);
    $("#rishuInfo #unit__total").html("").append(totalUnit);
    console.log("履修状況の単位 セメスター：",semester, "その単位数：", rishuUnit[semester-1]);
    
    var subjectId = selectSubject(lecture.subject);
    console.log("選択した授業の科目 ->", lecture.subject);
    subjectUnit[subjectId] += unit;
    $("#subject__" + subjectId).html("")
    .append(subjectUnit[subjectId]);
    console.log("選んだ授業のsubjectUnit", subjectUnit[subjectId]);
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
    var semester = parseInt(lecture.semester),
        unit     = parseInt(lecture.unit);
    console.log(unit);
    $("#rishu__" + semester).find("#display__" + lecture.classId).remove();
    
    rishuUnit[semester-1] -= unit;
    totalUnit -= unit;
    $("#rishuInfo #unit__rishu__" + semester).html("").append(rishuUnit[semester-1]);
    $("#rishuInfo #unit__total").html("").append(totalUnit);
    
    var subjectId = selectSubject(lecture.subject);
    console.log("選択した授業の科目 ->", lecture.subject);
    subjectUnit[subjectId] -= unit;
    $("#subject__" + subjectId).html("")
    .append(subjectUnit[subjectId]);
    console.log("選んだ授業のsubjectUnit", subjectUnit[subjectId]);
  });
}



function showClasses (clsArr) {
  var divLecs      = $(".lectures");
  
  for (var i in clsArr) {
    var lecture = $(".lectures > .lecture:nth-child(" + i + ")");
    divLecs.append('<div class="lecture" value='+ i +'></div>');
    
    lecture.append('<div class="lecture__title" id=' + clsArr[i].classId + ' value="' + i + '">' + clsArr[i].name + ' ' + clsArr[i].subject + " " + clsArr[i].year + '年 ' + clsArr[i].semester + 'セメスター (' + clsArr[i].unit + '単位)</div>');
    lecture.append('<button class="rishuBtnOn btn btn-primary" value="' + i + '" style="display: inline-block">履修する</button>');
    lecture.append('<button class="rishuBtnOff btn btn-light" value="' + i + '" style="display: none;">はずす</button>');
    lecture.append('<div class="lecture__table table"></div>');
    $(".lecture:nth-child(" + i + ") > .lecture__table").append('<table class="lecture__table table"> <tr><td>教員名</td><td>' + clsArr[i].teacher + '</td></tr> <tr><td>事前履修科目</td><td>' + clsArr[i].childClass + '</td></tr> <tr><td>次の推奨授業</td><td>' + clsArr[i].parentClass + '</td> </tr><tr><td>概要</td><td>' + clsArr[i].description + '</td></tr></table>');
  
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
