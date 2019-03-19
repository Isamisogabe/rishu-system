/* global $ */
/* global sigma */
var allLectures;
var rishuModel = [];
var rishuUnit  = [0,0,0,0,0,0,0,0];
var subjectUnit = [0,0,0,0,0,0,0,0,0];
var standardUnit= [6,8,20,8,38];
var totalUnit  = 0;
var profData   ;
var otherProfData;
var eleValues;
var fieldData  = [];
const ryouiki    = ["環境理工学", "応用物理学", "物質理工学", "生命理工学"];
const ryouikiColor = [ "env", "apply", "material", "bio"];
// moduleの作成
var rishuSystem = {
  
};

// --------------- 履修登録用の関数 --------------- //
function pushHtmlFile(){
  $("#textBtn").hide();
  var htmlContent = $("#rishuModel__Content").html(),
      content = htmlContent.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,''),
      bom     = new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8
      blob = new Blob([bom, htmlContent], {type: 'text/html'}),
      a = document.getElementById('download');
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(htmlContent, "Myplan.txt");
  } else {
    a.href = window.URL.createObjectURL(blob);
    a.target = "_blank";
  }
  $("#textBtn").show();
}
function pushInitLecs(){
  for(var i=0;i<allLectures.length;i++){
    if(allLectures[i].isCommon){
      var j = i + 1,
          onBtn = $(".lecture:nth-child(" + j +") .rishuBtnOn"),
          offBtn = $(".lecture:nth-child(" + j +") .rishuBtnOff"),
          lecture= allLectures[i];
      
      // 登録ボタンのCSS切り替え
      onBtn.css('display', 'none');
      offBtn.css('display', 'inline-block');
      
      
      lecture.isSigned = true;
      
      rishuModel.push(allLectures[i]);
      
      console.log("追加した後の履修モデル", rishuModel);
      
      addRishuModel(lecture);
    }
  }
}
function clear() {
  $(".lecture").css("display", "block");
}
function supervise(unit, id){
  console.log(unit );
  if(unit < standardUnit[id] ){
    $("#subject__" + id).parent().css("color", "#ff4500");
  } else {
    $("#subject__" + id).parent().css("color", "#000000");
  }
  if( 3 < id && id <= 6 ){
    var totalUnit = subjectUnit[4] + subjectUnit[5] + subjectUnit[6];
    console.log(totalUnit, standardUnit[4]);
    if(totalUnit < standardUnit[4]){
      $("#subject__" + 4).parent().css("color", "#ff4500");
      $("#subject__" + 5).parent().css("color", "#ff4500");
      $("#subject__" + 6).parent().css("color", "#ff4500");
    }
    else {
      $("#subject__" + 4).parent().css("color", "#000000");
      $("#subject__" + 5).parent().css("color", "#000000");
      $("#subject__" + 6).parent().css("color", "#000000");
    }
  } 
}
function switchTabs(){
  $(".tab").on("click", function() {
    var tab = $(this),
        target= tab.attr("data-target");
    clear();
    $(".tab").removeClass("active");
    tab.addClass("active");
    
    $(".tabContent").css("display", "none");
    $(target).css("display", "block");
  });
}
function deployLabRadioBtn () {
  var profName;
  for(var i=0;i<profData.length; i++){
    var fields = profData[i].field.split(" ");
    for(var j=0;j<fields.length;j++){
      var field = fields[j];
      if(field === "応用物理学"){
      $("#applyProfs").append("<div class='prof'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "物質理工学"){
        $("#materialProfs").append("<div class='prof'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "生命理工学"){
        $("#bioProfs").append("<div class='prof'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "環境理工学"){
        $("#envProfs").append("<div class='prof'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
    }
  }
  
  $("input[name='profName']").on("click", function() {
    $(".lecture").css("display", "none");
    profName = $("input[name='profName']:checked").val();
    console.log(profName);
    for(var i=0;i<profData.length; i++){
      var lecs;
      if(profName === profData[i].prof){
        $(".description").html("<h2 class='noteLabel'>" + profData[i].prof + "研究室</h2><p>" + profData[i].description  + "</p>");
      
        lecs = profData[i].classes.split(" ");
        for(var j=0;j<lecs.length;j++){
          var clsId = getClsId(lecs[j]);
          $("#" + clsId).css("display", "block");
        }
      }
    }
  });
}
function searchCls() {
  $("#searchBtn").on("click", function(){
    var text = $("#searchTxt").val(),
        reg  = new RegExp(text);
    console.log(reg);
    if(text.length >= 30) return window.alert("30文字を超えています。修正してください。");
    var type = $("input[name=search]:checked").val();
    if(type === "1"){
      for(var i=0;i<allLectures.length;i++){
        var j = i + 1;
        if(allLectures[i].name.search(reg) >= 0){
          $(".lecture:nth-child(" + j + ")").css("display", "block");
        } else{
          $(".lecture:nth-child(" + j + ")").css("display", "none");
        }
      }
    } else if(type === "2"){
      for(var i=0;i<allLectures.length;i++){
        var j = i + 1;
        if(allLectures[i].description && allLectures[i].description.search(reg) >= 0){
          $(".lecture:nth-child(" + j + ")").css("display", "block");
        } 
        else{
          $(".lecture:nth-child(" + j + ")").css("display", "none");
        }
      }
    }
    else if(type === "3"){
      for(var i=0;i<allLectures.length;i++){
        var j = i + 1;
        if(allLectures[i].teacher.search(reg) >= 0){
          $(".lecture:nth-child(" + j + ")").css("display", "block");
        } 
        else{
          $(".lecture:nth-child(" + j + ")").css("display", "none");
        }
      }
    }
    console.log(text);
  })
}
function getProfLink(profName){
  var link;
  for(var i=0; i < profData.length; i++) {
    if(profData[i].prof === profName){
      link = profData[i].link;
      break;
    }
  }
  for(var i=0; i<otherProfData.length; i++){
    if(otherProfData[i].prof === profName){
      link = otherProfData[i].link;
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
    case "学部学科英語科目":     return 0; 
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
  // 領域ボタンを押すと消去法で関係ない授業を消すようにする。
  $(".fieldBtn").on("click", function(){
    var btn     = $(this),
        field   = btn.attr("data-field"),
        isOnlyFieldCommon = btn.attr("data-isonlyfieldcommon");
    console.log(isOnlyFieldCommon);
    if(field == "none"){
      $("#" + field).parent().html("");
      return $(".lecture").show();
    }  
    $(".lecture").show();
    for(var i=0;  i < allLectures.length; i++){
      var k=i+1;
      var lecture = $(".lecture:nth-child(" + k + ")");
      if(!isOnlyFieldCommon) {
        var classField = allLectures[i].classField.split(" ");
        console.log(field in classField);
        lecture.css("display", "none");
        for(var l in classField){
          if(field === classField[l]){
            lecture.css("display", "block");
            if(allLectures[i].isCommon){
              lecture.css("display", "none");
            }
            break;
          }
          lecture.css("display", "none");
        }
      } 
      else if (isOnlyFieldCommon) {
        lecture.css("display", "none");
        if(!(allLectures[i].reqField === undefined)){
          var reqField = allLectures[i].reqField.split(" ");
        
          for(var l in reqField){
            if(reqField[l] === field){
              lecture.css("display", "block");
              break;
            }
          }
        }
      }
    }
    
    $(".conditions").append("<li id=" + field +">" + field + "</li>");
  });
}
function selectYear(){
  $(".yearBtn").on("click", function(){
    var btn = $(this),
        year = btn.attr("data-year");
    if(year == "none")  return $(".lecture").show();
    $(".lecture").show();
    for(var i=0;  i < allLectures.length; i++){
      var k=i+1;
      if(!(year === allLectures[i].year)){
        $(".lecture:nth-child(" + k + ")").css("display", "none");
      }
    }
  });
}
function selectSemester(){
  $(".semesterBtn").on("click", function(){
    var btn = $(this),
        semester = btn.attr("data-semester");
    if(semester == "none")  return $(".lecture").show();
    $(".lecture").show();
    for(var i=0;  i < allLectures.length; i++){
      var k=i+1;
      if(!(semester === allLectures[i].semester)){
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
  var classTable    = $('.lecture__table'),
      detailOnBtn   = $('.detailOnBtn'),
      detailOffBtn  = $('.detailOffBtn'),
      duration      = 500;
  
  detailOnBtn.on('click', function(){
    var self    = $(this),
        table   = self
        .parent().parent().parent('.lecture').find('.lectureDivTable');
    self.css({"display": "none"});
    self.parent().find('.detailOffBtn').css({"display": "inline-block"});
    table.stop().slideDown(duration);
  });
  detailOffBtn.on('click', function(){
    
    var self    = $(this),
        table   = self
        .parent().parent().parent('.lecture').find('.lectureDivTable');
    self.css({"display": "none"});
    self.parent().find('.detailOnBtn').css({"display": "inline-block"});
    table.stop().slideUp(duration);
  });
}
function addRishuModel(lecture) {
  var semester = parseInt(lecture.semester, 10),
      unit     = parseInt(lecture.unit, 10);
  var lecLi = $("<li id=display__" + lecture.classId + "><a href=#" + lecture.classId+ " class='nextClass'>" + lecture.name + " (" + lecture.subject +")</a></li>");
  $("#rishu__" + lecture.semester).append(lecLi);
  rishuUnit[semester-1] += unit;
  totalUnit += unit;
  $(".unit__rishu__" + semester).html("").append(rishuUnit[semester-1]);
  $("#rishuInfo #unit__total").html("").append(totalUnit);
  console.log("履修状況の単位 セメスター：",semester, "その単位数：", rishuUnit[semester-1]);
  
  var subjectId = selectSubject(lecture.subject);
  console.log("選択した授業の科目 ->", lecture.subject);
  subjectUnit[subjectId] += unit;
  $("#subject__" + subjectId).html("")
  .append(subjectUnit[subjectId]);
  supervise(subjectUnit[subjectId], subjectId);
  console.log("選んだ授業のsubjectUnit", subjectUnit[subjectId]);
}
function reduceRishuModel(lecture) {
  var semester = parseInt(lecture.semester,10),
      unit     = parseInt(lecture.unit,10);
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
  supervise(subjectUnit[subjectId], subjectId);
  console.log("選んだ授業のsubjectUnit", subjectUnit[subjectId]);
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
    
    addRishuModel(lecture);
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
    reduceRishuModel(lecture);
  });
}
function clsOnClick() {
  $(".nextClass").on("click", function() {
    var cls   = $(this),
        duration = 500,
        clsId = cls.attr('href');
    
    $(clsId).css("display", "block");
    $(  clsId + " > .lectureDivTable").slideDown(duration);
    $(  clsId + "  .detailOnBtn").css("display", "none");
    $(  clsId + "  .detailOffBtn").css("display", "inline-block");
  });
}
function labBtnOnClick() {
  $(".well-ryouiki").css("display", "none");
  $("#wellApply").css("display", "block");
  $(".labBtn").on("click", function() {
    var id = $(this).attr("data-target");
    $(".well-ryouiki").css("display", "none");
    $(id).css("display", "block");
  });
}
function showClasses (clsArr) {
  // 授業を包括するタグの生成
  var divLecs      = $(".lectures");
  for (var i=0; i < clsArr.length ; i++) {
    var childLecs   = clsArr[i].childClass,  // 子クラスの変数
        parentLecs  = clsArr[i].parentClass, // 親クラスの変数
        reqField;                            // 領域選択必修の領域の変数
    var j = i+1;                             // for Jquery nth-child
    
    
    // 新しく授業タグを生成する
    divLecs.append('<div class="lecture" id=' + clsArr[i].classId + '></div>');
    
    // 授業タグを指定する変数
    var lecture = $(".lecture:nth-child(" + j + ")");
        
    
    // 授業タイトル部分の内容作成
    lecture.append('<div class="col-sm-10"><h3 class="lecture__title"> <span id=' + clsArr[i].name + ' >' + clsArr[i].name + '</span><span>  </span><span class="glyphicon glyphicon-plus detailBtn detailOnBtn"  aria-hidden="true"></span><span class="glyphicon glyphicon-minus detailBtn detailOffBtn" style="display:none" aria-hidden="true"></span> </span> <h4>' + clsArr[i].subject + " " + clsArr[i].year + '年 ' + clsArr[i].semester + 'セメスター (' + clsArr[i].unit + '単位)</h4></div> ');
    var lecNameTag = lecture.find('#' + clsArr[i].name);
    // lectureタグに含む内容からidで探査し、タイトルを見つけてクラスをつける
    // これらのクラスをつけるのはフォントを加工するためである。
    // sciEnは理工学系で太字となる。
    if(clsArr[i].subject === "専門応用科目理工学系"){
      lecNameTag.attr("class", "sciEn");
    }
    // 工学系はすべて斜体の文字となる。
    if(clsArr[i].subject === "専門応用科目工学系"){
      lecNameTag.attr("class", "eng");
    }
    
    if(!(clsArr[i].reqField === undefined)){
      reqField = clsArr[i].reqField.split(" ");
      // 領域必修がある場合のフォント処理をするコードである。
      for(var l=0;l<reqField.length;l++){
        for (var k=0;k<ryouiki.length;k++){ // 定数列ryouikiはグローバル変数
          if((reqField[l] === ryouiki[k]) && clsArr[i].isFieldCommon){
            var className;
            if(clsArr[i].subject === "専門応用科目理工学系"){
              className = ryouikiColor[k] + " sciEn ryouikihisshu";
              lecNameTag.attr("class", className).append("(領域選択必修)");
            } else if(clsArr[i].subject === "専門応用科目工学系"){
              className = ryouikiColor[k] + " eng ryouikihisshu";
              lecNameTag.attr("class", className).append("(領域選択必修)");
            } else {
              className = ryouikiColor[k] + " sciEn ryouikihisshu";
              lecNameTag.attr("class", className).append("(領域選択必修)");
            }
          }
        }
      }
      
    }
    
    
    // 推奨授業がある場合はここで赤の点線を下線として更新する。
    if(clsArr[i].isRecommended){
      lecNameTag.addClass("recommended").append("　推奨（物質・生命・環境）");
    }

    
    // 履修するボタンの表示をするコード
    lecture.append('<div class="col-sm-2"><button class="rishuBtnOn rishuBtn btn btn-primary" style="display: inline-block;" data-clsNum="' + i + '"　value="' + i + '" >履修する</button><button class="rishuBtnOff rishuBtn btn btn-light" value="' + i + '" style="display: none;">はずす</button></div>');
    
    // タイトル下のテーブルに関するタグを付加するコード、説明欄、教授、関係する授業等である。
    lecture.append('<div class="table lectureDivTable" style="display: none;" ></div>');
    $(".lecture:nth-child(" + j + ") > .lectureDivTable").append('<table class="lecture__table table" > <tr><td>教員名</td><td class="profName"></td></tr> <tr><td>事前履修科目</td><td class="childClass nextClass"></td></tr> <tr><td>必要とする科目</td><td class="parentClass nextClass"></td> </tr><tr><td>概要</td><td ><p class="lectureDesc">' + clsArr[i].description + '</p></td></tr></table>');
    
    
    // --------------- 授業を担当する教授の名前にリンクを載せて表示する（リンクがない場合はのせない） --------------- //
    var profNames = clsArr[i].teacher.split(" ");
    for(var k=0; k < profNames.length; k++){
      var profLink = getProfLink(profNames[k]);
      
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
        $(".childClass:eq(" + i + ")").append('<a href=#' + lectureId + ' data-clsid=' + lectureId + ' class="nextClass">' + childLecs[k] + ' </a>');
      }
      else{
        $(".childClass:eq(" + i + ")").append(' ' + childLecs[k] + ' ');
      }
    }
    // --------------- 必要とする科目のリンクを乗せるコード ---------------//
    for(var k=0; k < parentLecs.length; k++){
      var lectureId = getClsId(parentLecs[k]);
      if(!(lectureId === undefined)){
        $(".parentClass:eq(" + i + ")").append('<a href=#' + lectureId + ' data-clsid=' + lectureId +  ' class="nextClass">' + parentLecs[k] + ' </a>');
      }
      else{
        $(".parentClass:eq(" + i + ")").append(' ' + parentLecs[k] + ' ');
      }
    }
  }// for (var i=0; i < clsArr.length ; i++) 終了
}
// --------------- 履修登録用関数終了 --------------- //

// --------------- 授業関係のデータビジュアライゼーション -------------- //

function isExist(clsName, graph){
  for(var i in graph.nodes){
    
    if(graph.nodes[i].label === clsName) return true;
  }
  return false;
}
function searchLecJson(clsName){
  var cls;
  for(var i =0;i<allLectures.length; i++) {
    if(clsName === allLectures[i].name) {
      cls = allLectures[i];
      break;
    }
  }
  return cls;
}
function* calcPosX () {
  
}
function calcMargin(clsName) {
  var rate = 0.029;
  var len = parseInt(clsName.length, 10);
  if(len >= 30) rate =0.008;
  return rate * len;
  
}
function setClsData(){
  const positionY = [0.98, 0.80, 0.62, 0.44, 0.26, 0.08];
  var positionX = [0,0,0,0,0,0];
  var maxNode = allLectures.length,
      maxEdge,
      i;
  var physGraph  = {
        nodes: [],
        edges: []
      },
      materialGraph = {
        nodes: [],
        edges: []
      }, 
      envGraph = {
        nodes: [],
        edges: []
      }, 
      bioGraph = {
        nodes: [],
        edges: []
      };
  var physLecs = [];
  
  for (i = 0; i < allLectures.length ; i++){
    console.log(positionX);
    var lec = allLectures[i];
    console.log(lec.name);
    console.log("isCommon:", lec.isCommon);
    if(((lec.classField === "応用物理学") || lec.isCommon)  && (lec.semester < 7)){
      physLecs.push(lec);
      if(!(isExist(lec.name, physGraph))){
        
        var id = parseInt(lec.semester,10) -1;
        console.log("lecName", lec.name);
        physGraph.nodes.push({
          id: lec.name,
          label: lec.name,
          x: positionX[id],
          y: positionY[id],
          size: 0.5,
          color: '#666'
        });
        positionX[id]+=calcMargin(lec.name);
      }
      
      
      for(var j in lec.parentClass) {
        var parentLec = lec.parentClass[j];
        console.log("parentLec: ",parentLec);
        if(parentLec === undefined) continue;
        console.log("parentLec:", parentLec);
        console.log("ペアレントクラスでノードに存在するかどうかisExist:", isExist(parentLec, physGraph));
        console.log("この時点でのgraph", physGraph.nodes);
        if(!(isExist(parentLec, physGraph))) {
          var parentLecJson = searchLecJson(parentLec);
          console.log("parentLecJson: ", parentLecJson);
          if(parentLecJson === undefined) continue;
          
          physGraph.nodes.push({
            id: parentLecJson.name,
            label: parentLecJson.name,
            x: positionX[parseInt(parentLecJson.semester, 10)-1],
            y: positionY[parseInt(parentLecJson.semester, 10)-1],
            size: 0.5,
            color: '#666'
          });
          positionX[parseInt(parentLecJson.semester, 10)-1]+=calcMargin(parentLecJson.name);
        }
      }
      
    
      for(var j in lec.childClass){
        var childLec = lec.childClass[j];
        console.log(childLec);
        if(childLec === undefined) continue;
        console.log(isExist(childLec, physGraph));
        if(isExist(childLec, physGraph)) continue;
        var childLecJson = searchLecJson(childLec);
        console.log("childLecJson: ", parentLecJson);
        if(childLecJson === undefined) continue;
        
        physGraph.nodes.push({
          id: childLecJson.name,
          label: childLecJson.name,
          x: positionX[parseInt(childLecJson.semester, 10)-1],
          y: positionY[parseInt(childLecJson.semester, 10)-1],
          size: 0.5,
          color: '#666'
        });
        positionX[parseInt(childLecJson.semester, 10)-1]+=calcMargin(childLecJson.name);
      }
      
    }
  }
  
  console.log("ノードの状態：", physGraph.nodes);
  var parentEdgeCount = 0;
  var childEdgeCount  = 0;
  for(i=0;i<physLecs.length;i++){
    var lec = physLecs[i];
    console.log(lec.name);
    for(var id in lec.parentClass){
      var parentClsName = lec.parentClass[id];
      console.log("parentClassName", parentClsName);
      if(parentClsName === undefined) continue;
      if(isExist(parentClsName, physGraph)){
          physGraph.edges.push({
          id: 'edgeParent' + parentEdgeCount,
          source: lec.name,
          target: parentClsName,
          size: 0.1,
          type: 'line',
          color: '#ddd',
          hover_color: '#ffd700'
        });
      }
      
      parentEdgeCount++;
    }
    for(var id in lec.childClass) {
      var childClsName = lec.childClass[id];
      if(childClsName === undefined) continue;
      if(isExist(childClsName, physGraph)){
          physGraph.edges.push({
          id: 'edgeChild' + childEdgeCount,
          source: lec.name,
          target: childClsName,
          size: 0.1,
          type: 'line',
          color: '#ddd',
          hover_color: '#ffd700'
        });
      }
      childEdgeCount++;
    }
  }
  
    
  var physSigma = new sigma({
    graph: physGraph,
    renderer: {
      container: document.getElementById('physicsGraph'),
      type: 'canvas'
    },
    settings: {
      doubleClickEnabled: false,
      minEdgeSize: 0.1,
      maxEdgeSize: 2,
      enableEdgeHovering: true,
      enableCamera: false,
      edgeHoverColor: 'edge',
      defaultEdgeHoverColor: '#ffd700',
      edgeHoverSizeRatio: 1,
      edgeHoverExtremities: true,
      labelSize: "fixed"
    }
  });
  
  // Bind the events:
  physSigma.bind('overNode', function(e) {
    var nodeName = e.data.node.name,
        max_edge = e.data.edges;
        edges = function() {
          var list = [];
        
        }
    var hoverNode = function () {
      
      
    };
  });
  physSigma.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
    console.log(e.type, e.data.node.label, e.data.captor, e.data);
  });
  physSigma.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
    console.log(e.type, e.data.edge, e.data.captor);
  });
  physSigma.bind('clickStage', function(e) {
    console.log(e.type, e.data.captor);
  });
  physSigma.bind('doubleClickStage rightClickStage', function(e) {
    console.log(e.type, e.data.captor);
  });
  
  physSigma.refresh();
  // Initialize the dragNodes plugin:
var dragListener = sigma.plugins.dragNodes(physSigma, physSigma.renderers[0]);

dragListener.bind('startdrag', function(event) {
  console.log(event);
});
dragListener.bind('drag', function(event) {
  console.log(event);
});
dragListener.bind('drop', function(event) {
  console.log(event);
});
dragListener.bind('dragend', function(event) {
  console.log(event);
});
}
function graphBtnOnClick () {
  $(".graphBtn").on("click", function() {
    var data = $(this).attr("data-id");
    $(".graph").css("display", "none");
    $(data).css("display", "block");
    setClsData();
  });
}

// --------------- easyExam用の関数 --------------- //
var evals = [0,0,0,0];
function switchNavs() {
  $(".home-nav").on("click", function() {
    var id = $(this).attr("data-target");
    $(this).parent().parent().find("li[class='active']").removeClass("active");
    $("main").css("display", "none");
    $(id).css("display", "block");
  });
}
function showExamBtns(data) {
  console.log(data);
  for(var i=0;i<data.length;i++){
    $("#eleBtns").append("<li> <button class='eleBtn'  id=" + data[i].ele +" >" + data[i].ele + "</button></li>" );
    $("#" + data[i].ele).attr(
      {  
        "data-phy"  : data[i].phy,
        "data-chem" : data[i].chem,
        "data-bio"  : data[i].bio,
        "data-env"  : data[i].env,
      });
  }
}
function examBtnOnClick() {
  $(".eleBtn").on("click", function() {
    var self = $(this);
    if(self.hasClass("checked")){
      self.removeClass("checked");
      examCalc(self, "-");

    } else{
      self.addClass("checked");
      examCalc(self, "+");
    }
  });
}
function examCalc(self, operand){
  var phy  = parseInt(self.attr("data-phy"), 10),
      chem = parseInt(self.attr("data-chem"), 10),
      bio  = parseInt(self.attr("data-bio"),10),
      env  = parseInt(self.attr("data-env"), 10);
  if(operand === "+") {
    evals[0] += phy;
    evals[1] += chem;
    evals[2] += bio;
    evals[3] += env;
  } 
  if(operand === "-"){
    evals[0] -= phy;
    evals[1] -= chem;
    evals[2] -= bio;
    evals[3] -= env;
  }
}
function evaluate() {
  $("#evaluate").on("click", function() {
    var scrapPhy  = "応用物理学領域：" + evals[0] + "/ 150",
        scrapChem = "物質理工学領域：" + evals[1] + "/ 150",
        scrapBio = "生命理工学領域：" + evals[2] + "/ 150",
        scrapEnv = "環境理工学領域：" + evals[3] + "/ 150",
        sentence  = scrapPhy + scrapChem + scrapBio + scrapEnv,
        result   = $("#examResult");
    result.html("");
    result.append("<h4>" + scrapPhy  + "</h4>");
    result.append("<h4>" + scrapChem + "</h4>");
    result.append("<h4>" + scrapBio  + "</h4>");
    result.append("<h4>" + scrapEnv  + "</h4>");
  });
}

// --------------- fieldLabs用関数 --------------- //
function setTd(string, ryouiki, index, subindex){
  if(string === ryouiki){
    $("#labsRyouikiTable > tr:nth-child(" + index + ") > td:nth-child(" + subindex + ")").html("〇");
  }
  return false;
}
function showTable() {
  var table = $("#labsRyouikiTable");
  
  for(var i=0; i<profData.length; i++){
    var strings = profData[i].field.split(" "),
        j = i + 1;
    table.append("<tr><td>"+ profData[i].prof + "</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    
    for(var k=0;k<strings.length;k++){
      var l = k + 2;
      setTd(strings[k], "応用物理学", j, l);
      setTd(strings[k], "物質理工学", j, l);
      setTd(strings[k], "生命理工学", j, l);
      setTd(strings[k], "環境理工学", j, l);
    }
    $("#labsRyouikiTable > tr:nth-child(" + j + ") > td:nth-child(6)").html(profData[i].else);
    $("#labsRyouikiTable > tr:nth-child(" + j + ") > td:nth-child(7)").html(profData[i].master);
  }
}
// --------------- データの読み込み --------------- //

$(document).ready(function() {
  var rishuModel = rishuModel || [];
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
  $.ajax({
    type: 'GET',
    url: './data/otherProfData.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       otherProfData = json;
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
  $.ajax({
    type: 'GET',
    url: './data/easyExam.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
       eleValues = json;
       showExamBtns(eleValues);
       examBtnOnClick();
       evaluate();
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
});
window.onload = function(){
  $.ajax({
    type: 'GET',
    url: './data/classData12.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      console.log(json);
      
       allLectures = json;
       showClasses(allLectures);
       pushInitLecs();
       rishuBtnOnClick();
       detailBtnOnClick();
       clsOnClick();
       windowSizeControll();
       windowScroll();
       selectRyouiki();
       selectYear();
       selectSemester();
       searchCls();
       deployLabRadioBtn();
       switchTabs();
       labBtnOnClick();
       switchNavs();
       clear();
       
       showTable();
       
       graphBtnOnClick();
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
};