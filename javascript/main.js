/* global $ */
var allLectures;
var rishuModel = [];
var rishuUnit  = [0,0,0,0,0,0,0,0];
var subjectUnit = [0,0,0,0,0,0,0,0,0];
var totalUnit  = 0;
var minimalUnit = [];
var profData   ;
var fieldData  = [];
var ryouiki    = ["環境理工学", "応用物理学", "物質理工学", "生命理工学"];
var ryouikiColor = [ "env", "apply", "material", "bio"];
function init(){
  
}

function getAddress(profName){
  var link;
  for(var i=0; i < profData.length; i++) {
    if(profData[i].prof === profName){
      link = profData[i].link;
      break;
    }
  }
  return link;
}
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
function windowSizeControll () {
  var height = $(window).height();
    $('#displayModel').css('height', height);

  $(window).resize(function() {
    var height = $(window).height(),
        width  = $(window).width();
    
    $('#displayModel').css('height', height);
    
    if(width <= 768){
      $("#displayModel").css("position", "static");
    }
  });
}
function windowScroll() {
  $(window).scroll(function(e){
    var scrollTop = $(window).scrollTop(),
        width     = $(window).width(),
        navHeight = 50;
    
    if(scrollTop >= navHeight && width >= 768){
      $("#displayModel").css("position", "fixed");
    } else {
      $("#displayModel").css("position", "static");
    }
  });
  
  
}
function selectSubject(subject){
  switch(subject){
    case "英語科目":             return 0; 
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
function selectRyouiki(){
  $(".fieldBtn").on("click", function(){
    var btn = $(this),
        field = btn.attr("data-field");
    if(field == "none")  return $(".lecture").show();
    $(".lecture").show();
    for(var i=0;  i < allLectures.length; i++){
      var k=i+1;
      if(!(field === allLectures[i].classField)){
        $(".lecture:nth-child(" + k + ")").css("display", "none");
      }
    }
  });
}
function getClsId(clsName){
  var classId;
  for(var l=0; l < allLectures.length; l++){
    if(allLectures[l].name === clsName ){
      classId = allLectures[l].classId;
      break;
    } 
  }
  return classId;
}
function detailBtnOnClick() {
  var classTable = $('.lecture__table'),
      detailOnBtn  = $('.detailOnBtn'),
      detailOffBtn  = $('.detailOffBtn'),
      duration   = 500;
  
  detailOnBtn.on('click', function(){
    var self    = $(this),
        table   = self
        .parent().parent().parent('.lecture').find('.lectureDivTable');
    self.css({"display": "none"});
    self.parent().find('.detailOffBtn').css({"display": "inline-block"});
    table.slideDown(duration);
  });
  detailOffBtn.on('click', function(){
    
    var self    = $(this),
        table   = self
        .parent().parent().parent('.lecture').find('.lectureDivTable');
    self.css({"display": "none"});
    self.parent().find('.detailOnBtn').css({"display": "inline-block"});
    table.slideUp(duration);
  });
}
function rishuBtnOnClick (lectures) {
  //-------------------- 履修ボタンクリック処理 --------------------//
  $('.rishuBtnOn').on('click', function(e) {
    var Onbtn  = $(this),
        Offbtn = Onbtn.parent().find('.rishuBtnOff'),
        clsId  = Onbtn.attr('data-clsNum'),
        lecture = allLectures[clsId];
    console.log("授業登録ボタンを押す -> classナンバー：",  clsId);
    
    // 登録ボタンのCSS切り替え
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
function clsOnClick() {
  $(".nextClass a").on("click", function() {
    var cls   = $(this),
        duration = 500,
        clsId = cls.attr('href');
        console.log(clsId);
    $(  clsId + " > .lectureDivTable").slideDown(duration);
    $(  clsId + "  .detailOnBtn").css("display", "none");
    $(  clsId + "  .detailOffBtn").css("display", "inline-block");
  });
}
function showClasses (clsArr) {
  var divLecs      = $(".lectures");
  for (var i=0; i < clsArr.length ; i++) {
    var childLecs = clsArr[i].childClass,
        parentLecs  = clsArr[i].parentClass;
    var j = i+1;
    divLecs.append('<div class="lecture" value='+ i +' id=' + clsArr[i].classId + '></div>');
    var lecture = $(".lecture:nth-child(" + j + ")");
    
    lecture.append('<div class="col-sm-10"><h3 class="lecture__title"> <span id=' + clsArr[i].name + ' >' + clsArr[i].name + '</span><span>  </span><span class="glyphicon glyphicon-plus detailBtn detailOnBtn"  aria-hidden="true"></span><span class="glyphicon glyphicon-minus detailBtn detailOffBtn" style="display:none" aria-hidden="true"></span> </span> <h4>' + clsArr[i].subject + " " + clsArr[i].year + '年 ' + clsArr[i].semester + 'セメスター (' + clsArr[i].unit + '単位)</h4></div> ');
    if(clsArr[i].subject === "専門応用科目理工学系"){
      lecture.find('#' + clsArr[i].name).attr("class", "sciEn");
    }
    if(clsArr[i].subject === "専門応用科目工学系"){
      lecture.find('#' + clsArr[i].name).attr("class", "eng");
    }
    if((clsArr[i].classField === "環境理工学") && clsArr[i].isFieldCommon){
      if(clsArr[i].subject === "専門応用科目理工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "env sciEn ryouikihisshu").append("(領域必修)");
      } else if(clsArr[i].subject === "専門応用科目工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "env eng ryouikihisshu").append("(領域必修)");
      } else {
        lecture.find('#' + clsArr[i].name).attr("class", "env ryouikihisshu").append("(領域必修)");
      }
    }
    if((clsArr[i].classField === "物質理工学") && clsArr[i].isFieldCommon){
      if(clsArr[i].subject === "専門応用科目理工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "material sciEn ryouikihisshu").append("(領域必修)");
      } else if(clsArr[i].subject === "専門応用科目工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "material eng ryouikihisshu").append("(領域必修)");
      } else {
        lecture.find('#' + clsArr[i].name).attr("class", "material ryouikihisshu").append("(領域必修)");
      }
    }
    if((clsArr[i].classField === "応用物理学") && clsArr[i].isFieldCommon){
      if(clsArr[i].subject === "専門応用科目理工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "apply sciEn ryouikihisshu").append("(領域必修)");
      } else if(clsArr[i].subject === "専門応用科目工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "apply eng ryouikihisshu").append("(領域必修)");
      } else {
        lecture.find('#' + clsArr[i].name).attr("class", "apply ryouikihisshu").append("(領域必修)");
      }
    }
    if((clsArr[i].classField === "生命理工学") && clsArr[i].isFieldCommon){
      if(clsArr[i].subject === "専門応用科目理工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "bio sciEn ryouikihisshu").append("(領域必修)");
      } else if(clsArr[i].subject === "専門応用科目工学系"){
        lecture.find('#' + clsArr[i].name).attr("class", "bio eng ryouikihisshu").append("(領域必修)");
      } else {
        lecture.find('#' + clsArr[i].name).attr("class", "bio ryouikihisshu").append("(領域必修)");
      }
    }
    
    
    lecture.append('<div class="col-sm-2"><button class="rishuBtnOn rishuBtn btn btn-primary" style="display: inline-block;" data-clsNum="' + i + '"　value="' + i + '" >履修する</button><button class="rishuBtnOff rishuBtn btn btn-light" value="' + i + '" style="display: none;">はずす</button></div>');
    lecture.append('<div class="table lectureDivTable" style="display: none;" ></div>');
    $(".lecture:nth-child(" + j + ") > .lectureDivTable").append('<table class="lecture__table table" > <tr><td>教員名</td><td class="profName"></td></tr> <tr><td>事前履修科目</td><td class="childClass nextClass"></td></tr> <tr><td>必要とする科目</td><td class="parentClass nextClass"></td> </tr><tr><td>概要</td><td ><p class="lectureDesc">' + clsArr[i].description + '</p></td></tr></table>');
    
    
    // --------------- 授業を担当する教授の名前にリンクを載せて表示する（リンクがない場合はのせない） --------------- //
    var profNames = clsArr[i].teacher.split(" ");
    for(var k=0; k < profNames.length; k++){
      var profLink = getAddress(profNames[k]);
      
      if(!(profLink === undefined)){
        $(".profName:eq(" + i + ")").append('<a href=' + profLink + ' target=_blank>' + profNames[k] + ' </a>');
      }
      else{
        $(".profName:eq(" + i + ")").append(' ' + profNames[k] + ' ');
      }
      
    }
    // --------------- 事前履修科目についてのリンクを乗せるコード --------------- //
    for(var k=0; k < childLecs.length; k++){
      var lectureId = getClsId(childLecs[k]);
      if(!(lectureId === undefined)){
        $(".childClass:eq(" + i + ")").append('<a href=#' + lectureId + ' >' + childLecs[k] + ' </a>');
      }
      else{
        $(".childClass:eq(" + i + ")").append(' ' + childLecs[k] + ' ');
      }
    }
    // --------------- 必要とする科目のリンクを乗せるコード ---------------//
    for(var k=0; k < parentLecs.length; k++){
      var lectureId = getClsId(parentLecs[k]);
      if(!(lectureId === undefined)){
        $(".parentClass:eq(" + i + ")").append('<a href=#' + lectureId + '>' + parentLecs[k] + ' </a>');
      }
      else{
        $(".parentClass:eq(" + i + ")").append(' ' + parentLecs[k] + ' ');
      }
    }
  }// for (var i=0; i < clsArr.length ; i++) 終了
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
    url: './data/classData5.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       allLectures = json;
       showClasses(allLectures);
       rishuBtnOnClick();
       detailBtnOnClick();
       clsOnClick();
       windowSizeControll();
       windowScroll();
       selectRyouiki();
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
  $.ajax({
    type: 'GET',
    url: './data/profData.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       profData = json;
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
  /*
  $(window).scroll(function(e) {
    var height = $(window).scrollTop();
    $("#displayModel").css({"margin-top":height });
  });
  */
})
