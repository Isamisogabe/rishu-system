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
const ryouiki    = ["環境理工学", "応用物理学", "物質理工学", "生命理工学"];
const ryouikiColor = [ "env", "apply", "material", "bio"];
const ryouikiColorCode = ["#00f100","#ffd700", "#5cb3f1", "#ff4500"];
var ryouikiGraphs  = [{
        nodes: [],
        edges: []
      },
      {
        nodes: [],
        edges: []
      }, 
      {
        nodes: [],
        edges: []
      }, 
      {
        nodes: [],
        edges: []
      }];
var ryouikiHisshu = [
  [],
  [],
  [],
  []
  ]


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
      
      // 履修モデルに追加されたのでisSignedフラグを変える
      lecture.isSigned = true;
      
      rishuModel.push(allLectures[i]);
      // 授業データを履修モデルに追加する。
      addRishuModel(lecture);
    }
  }
}
function clear() {
  // div class=lecture 授業リストすべてを表示する
  $(".lecture").css("display", "block");
}
function supervise(unit, id){
 // 履修モデルの各分野における単位数を確認し、一定以上超えていなければ赤を表示する部分
  if(unit < standardUnit[id] ){
    $("#subject__" + id).parent().css("color", "#ff4500");
  } else {
    $("#subject__" + id).parent().css("color", "#000000");
  }
  if( 3 < id && id <= 6 ){
    var totalUnit = subjectUnit[4] + subjectUnit[5] + subjectUnit[6];
    
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
function deployLabRadioBtn () { // 研究室別検索において各領域タブのラジオボタンを設定・配置する関数
  var profName;
  
  for(var i=0;i<profData.length; i++){
    var fields = profData[i].field.split(" ");
    for(var j=0;j<fields.length;j++){
      var field = fields[j];
      if(field === "応用物理学"){
        $("#applyProfs").append("<div class='prof' id='apply-" + profData[i].prof + "'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "物質理工学"){
        $("#materialProfs").append("<div class='prof' id='material-" + profData[i].prof + "'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "生命理工学"){
        $("#bioProfs").append("<div class='prof' id='bio-" + profData[i].prof + "'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
      if(field === "環境理工学"){
        $("#envProfs").append("<div class='prof' id='env-" + profData[i].prof + "'><input type='radio' name='profName' value=" + profData[i].prof + " > <h5 class='profName '><a href=" +profData[i].link+ " target='_blank' >" + profData[i].prof +"</a></h5></div>");
      }
    }
  }
  for(var i=0;i<profData.length; i++){
    var fields = profData[i].field.split(" "),
        specialFields = profData[i].specialField.split(" ");
    for(var j=0;j<fields.length;j++){
      for(var k=0;k<specialFields.length;k++){
        var field = fields[j],
            specialField = specialFields[k],
            tag;
        if(specialField === "応用物理学" && field === "応用物理学"){
          tag = $("#apply-" + profData[i].prof);
          tag.find(".profName").addClass("fontBold");
        }
        if(specialField === "物質理工学" && field === "物質理工学"){
          tag = $("#material-" + profData[i].prof);
          tag.find(".profName").addClass("fontBold");
        }
        if(specialField === "生命理工学" && field === "生命理工学"){
          tag = $("#bio-" + profData[i].prof);
          tag.find(".profName").addClass("fontBold");
        }
        if(specialField === "環境理工学" && field === "環境理工学"){
          tag = $("#env-" + profData[i].prof);
          tag.find(".profName").addClass("fontBold");
        }
      }
    }
  }
  // 各研究室の説明を示す部分
  $("input[name='profName']").on("click", function() {
    $(".lecture").css("display", "none");
    profName = $("input[name='profName']:checked").val();
   
    var desc    = $(".description");
    desc.empty();
    for(var i=0;i<profData.length; i++){
      var lecs;
      if(profName === profData[i].prof){
        desc.append("<h2 class='noteLabel'>" + profData[i].prof + "研究室</h2><p>" + profData[i].description.lab  + "</p>");
        
        // ケーススタディの授業
        if(!!(profData[i].description.cas)){
          var profCas = profData[i].description.cas;
          if(!(profCas[0] === "") && profCas[1] === "") desc.append("<h2 class='noteLabel'>ケーススタディⅠの概要</h2><p>" + profCas[0]  + "</p>");
          if(!(profCas[1] === "") && profCas[0] === "") desc.append("<h2 class='noteLabel'>ケーススタディⅡの概要</h2><p>" + profCas[1]  + "</p>");
          if(!(profCas[1] === "") && !(profCas[0] === "")) desc.append("<h2 class='noteLabel'>ケーススタディⅠの概要</h2><p>" + profCas[0]  + "</p>"+ "<h2 class='noteLabel'>ケーススタディⅡの概要</h2><p>" + profCas[1]  + "</p>");
        }
        
        // 研究の授業
        if(!!(profData[i].description.res)){
          var profRes = profData[i].description.res;
          if(!(profRes[0] === "") && profRes[1] === "")desc.append("<h2 class='noteLabel'>研究Ⅰ＆Ⅱ概要</h2><p>" + profRes[0]  + "</p>");
          if(!(profRes[1] === ""))desc.append("<h2 class='noteLabel'>研究概要Ⅰ</h2><p>" + profRes[0]  + "</p><h2 class='noteLabel'>研究概要Ⅱ</h2><p>" + profRes[1]  + "</p>");
        }
        
        // 演習の授業
        if(!!(profData[i].description.exe)){
          var profExe = profData[i].description.exe;
          if(!(profExe[0] === "") && profExe[1] === "")desc.append("<h2 class='noteLabel'>演習Ⅰ＆Ⅱ概要</h2><p>" + profExe[0]  + "</p>");
          else desc.append("<h2 class='noteLabel'>演習Ⅰ概要</h2><p>" + profExe[0]  + "</p><h2 class='noteLabel'>演習Ⅱ概要</h2><p>" + profExe[1]  + "</p>");
          
        }
        
        lecs = profData[i].classes.split(" ");
        for(var j=0;j<lecs.length;j++){
          var clsId = getClsId(lecs[j]);
          $("#" + clsId).css("display", "block");
        }
        
        break;
      }
      
    }
  });
}
function searchCls() {
  // 検索ボタンのファンクションをつける部分
  $("#searchBtn").on("click", function(){
    var text = $("#searchTxt").val(),
        reg  = new RegExp(text);
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
  // 授業リストの+-ボタンのファンクションをつける部分
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
  
  var subjectId = selectSubject(lecture.subject);
  
  subjectUnit[subjectId] += unit;
  $("#subject__" + subjectId).html("")
  .append(subjectUnit[subjectId]);
  supervise(subjectUnit[subjectId], subjectId);
}
function reduceRishuModel(lecture) {
  var semester = parseInt(lecture.semester,10),
      unit     = parseInt(lecture.unit,10);
  $("#rishu__" + semester).find("#display__" + lecture.classId).remove();
  
  rishuUnit[semester-1] -= unit;
  totalUnit -= unit;
  $("#rishuInfo .unit__rishu__" + semester).html("").append(rishuUnit[semester-1]);
  $("#rishuInfo #unit__total").html("").append(totalUnit);
  
  var subjectId = selectSubject(lecture.subject);
  subjectUnit[subjectId] -= unit;
  $("#subject__" + subjectId).html("")
  .append(subjectUnit[subjectId]);
  supervise(subjectUnit[subjectId], subjectId);
}
function rishuBtnOnClick (lectures) {
  //-------------------- 履修ボタンクリック処理 --------------------//
  $('.rishuBtnOn').on('click', function(e) {
    var Onbtn  = $(this),
        Offbtn = Onbtn.parent().find('.rishuBtnOff'),
        clsId  = Onbtn.attr('data-clsNum'),
        lecture = allLectures[clsId];
    
    // 登録ボタンのCSS切り替え
    Onbtn.css('display', 'none');
    Offbtn.css('display', 'inline-block');
    
    lecture.isSigned = true;
    
    rishuModel.push(allLectures[clsId]);
    
    addRishuModel(lecture);
  });
  $('.rishuBtnOff').on('click', function(e) {
    var Offbtn  = $(this),
        Onbtn = Offbtn.parent().find('.rishuBtnOn'),
        clsId = Offbtn.val(),
        lecture = allLectures[clsId];
    
    Offbtn.css('display', 'none');
    Onbtn.css('display', 'inline-block');
    lecture.isSigned = false;
    
    for(var i in rishuModel){
      var classId = rishuModel[i].classId ;
      if(classId === allLectures[clsId].classId){
        rishuModel.splice(i,1);
      }
    }
    
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
            var description = clsArr[i].name + "（領域選択必修）"
            if(clsArr[i].subject === "専門応用科目理工学系"){
              className = ryouikiColor[k] + " sciEn ryouikihisshu";
              lecNameTag.attr("class", className).html(description);
            } else if(clsArr[i].subject === "専門応用科目工学系"){
              className = ryouikiColor[k] + " eng ryouikihisshu";
              lecNameTag.attr("class", className).html(description);
            } else {
              className = ryouikiColor[k] + " sciEn ryouikihisshu";
              lecNameTag.attr("class", className).html(description);
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
    $(".lecture:nth-child(" + j + ") > .lectureDivTable").html('<table class="lecture__table table" > <tr><td>教員名</td><td class="profName"></td></tr> <tr><td>事前履修科目</td><td class="childClass nextClass"></td></tr> <tr><td>必要とする科目</td><td class="parentClass nextClass"></td> </tr><tr><td>概要</td><td ><p class="lectureDesc">' + clsArr[i].description + '</p></td></tr></table>');
    
    
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

// --------------- 授業関係のデー��ビジュアライゼーション -------------- //

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
function calcMargin(clsName) {
  var rate = 0.035;
  var w = $(window).width();
  var h = $(window).height();
  var aspectRatio = w / h;
  if(w < 1500 && aspectRatio > 1.6) rate = 0.055;
  var len = clsName.length;
  if(len >= 30) rate =0.010;
  
  if(len <= 5) rate = 0.09;
  return rate * len;
  
}
function setNodeAndEdge (graph, field){
  var positionY = [1.00, 0.85, 0.72, 0.62, 0.45, 0.20];
  var positionX = [0,0.05,0.01,0.02,0.05,0];
  var feedLineThreshold = 1.5,
      margin_Y = 0.05,
      fieldLecs = [],
      i;
  var w = $(window).width(),
      h = $(window).height(),
      aspectRatio = w / h;
  
  if(w < 800)          feedLineThreshold = 1.2;
  else if(w < 1000)     feedLineThreshold = 1.2;
  else if( w < 1200)    feedLineThreshold = 1.4;
  else if(w < 1500 && aspectRatio > 1.5)     feedLineThreshold = 1.7;
  else                  feedLineThreshold = 2.0;
  
  if(aspectRatio > 1) feedLineThreshold = aspectRatio ;
  if(aspectRatio > 1.5) feedLineThreshold = aspectRatio + 0.5;
  
  
  for (i = 0; i < allLectures.length ; i++){
    var lec        = allLectures[i];
    if(!(lec.reqField === undefined)) var reqField = lec.reqField.split(" ");
    
    
    var classField= lec.classField.split(" ");
    for(var j=0; j<classField.length; j++){
      if(((classField[j] === field) 
       || (lec.isCommon)) 
       && (parseInt(lec.semester, 10) < 7) 
       && (!!reqField)){
        var color = ryouikiColorCode[num];
        var num = ryouiki.indexOf(field);
        fieldLecs.push(lec);
        if(!(isExist(lec.name, graph))){
          var id = parseInt(lec.semester,10) -1;
          
          if( lec.reqField === field) color = color || "#666";
          graph.nodes.push({
            id: lec.name,
            label: lec.name,
            x: positionX[id],
            y: positionY[id],
            size: 0.3,
            color: "#666"
          });
          positionX[id]+=calcMargin(lec.name);
          
          // 横方向の長さが一定以上を超えた場合上にノードをずらす
          if(positionX[id] > feedLineThreshold){
            positionX[id] -=feedLineThreshold;
            positionY[id] -=margin_Y;
          }
        }
        
        
        for(var l in lec.parentClass) {
          var parentLec = lec.parentClass[l];
          if(parentLec === undefined) continue;
          if(!(isExist(parentLec, graph))) {
            var parentLecJson = searchLecJson(parentLec);
            if(parentLecJson === undefined) continue;
            
            graph.nodes.push({
              id: parentLecJson.name,
              label: parentLecJson.name,
              x: positionX[parseInt(parentLecJson.semester, 10)-1],
              y: positionY[parseInt(parentLecJson.semester, 10)-1],
              size: 0.3,
              color: '#666',
            });
            positionX[parseInt(parentLecJson.semester, 10)-1]+=calcMargin(parentLecJson.name);
            if(positionX[parseInt(parentLecJson.semester, 10)-1]>feedLineThreshold){
              positionX[parseInt(parentLecJson.semester, 10)-1]-=feedLineThreshold;
              positionY[parseInt(parentLecJson.semester, 10)-1]-=0.04;
            }
          }
        }
        
      
        for(var l in lec.childClass){
          var childLec = lec.childClass[l];
          if(childLec === undefined) continue;
          if(isExist(childLec, graph)) continue;
          var childLecJson = searchLecJson(childLec);
          if(childLecJson === undefined) continue;
          
          graph.nodes.push({
            id: childLecJson.name,
            label: childLecJson.name,
            x: positionX[parseInt(childLecJson.semester, 10)-1],
            y: positionY[parseInt(childLecJson.semester, 10)-1],
            size: 0.3,
            color: '#666'
          });
          positionX[parseInt(childLecJson.semester, 10)-1]+=calcMargin(childLecJson.name);
          if(positionX[parseInt(childLecJson.semester, 10)-1]>feedLineThreshold){
            positionX[parseInt(childLecJson.semester, 10)-1] -=feedLineThreshold;
            positionY[parseInt(childLecJson.semester, 10)-1] -=margin_Y;
          }
        }
        
      }
    }
    
  }
  for (i = 0; i < allLectures.length ; i++){
    var lec = allLectures[i];
    if(lec.isFieldCommon){
      if(lec.reqField === undefined) continue;
      var fields = lec.reqField.split(" ");
      for(var j= 0; j< fields.length; j++){
        var field = fields[j];
        var fieldId = ryouiki.indexOf(field);
        ryouikiHisshu[fieldId].push(lec);
      }
       
    }
  }
  
  for(var i=0; i< graph.nodes.length; i++){
    var name = graph.nodes[i].label;
    for(var j=0;j<ryouikiHisshu.length;j++){
      var hisshuCls = ryouikiHisshu[j];
      for(var k=0;k<hisshuCls.length;k++){
        var lecture = hisshuCls[k];
        if(lecture.name === name){
          graph.nodes[i].color = ryouikiColorCode[j];
        }
      }
    }
  }
  
  var parentEdgeCount = 0,
      childEdgeCount  = 0,
      fieldLec;
  for(i=0;i<fieldLecs.length;i++){
    fieldLec = fieldLecs[i];
    for(var id in fieldLec.parentClass){
      var parentClsName = fieldLec.parentClass[id];
      if(parentClsName === undefined) continue;
      if(isExist(parentClsName, graph)){
          graph.edges.push({
          id: 'edgeParent' + parentEdgeCount,
          source: fieldLec.name,
          target: parentClsName,
          size: 0.03,
          type: 'line',
          color: '#ddd',
          hover_color: '#ffd700'
        });
        parentEdgeCount++;
      }
    }
    for(var id in fieldLec.childClass) {
      var childClsName = fieldLec.childClass[id];
      if(childClsName === undefined) continue;
      if(isExist(childClsName, graph)){
          graph.edges.push({
          id: 'edgeChild' + childEdgeCount,
          source: fieldLec.name,
          target: childClsName,
          size: 0.03,
          type: 'line',
          color: '#ddd',
          hover_color: '#ffd700'
        });
        childEdgeCount++;
      }
      
    }
  }
}
function draw () {
  // 生成されたキャンバスに線を引き、秋学期や春学期などのフォントを追加
  var sigmaCanvas = $(".sigma-scene");
  if(!!sigmaCanvas){
    var canvasWidth  = sigmaCanvas.width(),
        canvasHeight = sigmaCanvas.height(),
        baseGraph    = $("#baseGraph");
    baseGraph.width(canvasWidth);
    baseGraph.height(canvasHeight);
    $(".graphs").append("<canvas id='baseGraph' width='" + canvasWidth + "px' height=" + canvasHeight + "px' ></canvas>" );
    var aspectRatio = canvasWidth / canvasHeight,
        canvas = document.getElementById("baseGraph"),
        context = canvas.getContext('2d'),
        rateOfHeights = [0.82, 0.70, 0.58, 0.43, 0.18],
        rateOfTextHeights = [0.93, 0.76, 0.65, 0.52, 0.31, 0.13],
        semesterNames = ["１年春学期", "１年秋学期", "２年春学期", "２年秋学期", "３年春学期", "３年秋学期"],
        height,
        width = canvasWidth;
  
    context.font= "20px '游ゴシック'";
    for(var i=0; i < rateOfHeights.length; i++) {
      height = canvasHeight * rateOfHeights[i];
      context.fillRect(0,height,width,1);
      
    }
    for(var j=0; j < semesterNames.length; j++) {
      height = canvasHeight * rateOfTextHeights[j];
      context.fillText(semesterNames[j], 10, height);
    }
  }
}
function graphBtnOnClick () {
  var count = 0;
  var s;
  $(".graphBtn").on("click", function() {
    
    var dataField = $(this).attr("data-field");
    let i = ryouiki.indexOf(dataField);
    var ryouikiGraph = ryouikiGraphs[i];
    // sのインスタンスが既にある場合
    if(count > 0){
      s.graph.clear();
      s.graph.read(ryouikiGraph);
      s.refresh();
    } 
    else { // sのインスタンスを作成
      
     
      s = new sigma({
        graph: ryouikiGraph,
        renderer: {
          container: document.getElementById('physicsGraph'),
          type: 'canvas'
        },
        settings: {
          doubleClickEnabled: false,
          minEdgeSize: 0.03,
          maxEdgeSize: 1.2,
          enableEdgeHovering: false,
          enableCamera: false,
          edgeHoverColor: 'edge',
          defaultEdgeHoverColor: '#ffd700',
          edgeHoverSizeRatio: 1,
          edgeHoverExtremities: true,
          labelSize: "fixed",
          labelColor: "node"
        }
      });
      
      var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
      
      draw();
      
      s.bind('doubleClickNode', function(e) {
        
        var nodeName = e.data.node.label,
            color  = '#' + (
                Math.floor(Math.random() * 16777215).toString(16) + '000000'
              ).substr(0, 6);
        // ダブルクリックしたノードのカラーを変える
        s.graph.nodes(nodeName).color = color;
        
        // クリックしたノードの名前からそのノードと関係するエッジを見てカラーリング
        for(var i=0; i<ryouikiGraph.edges.length; i++) {
          var source = ryouikiGraph.edges[i].source,
              target = ryouikiGraph.edges[i].target,
              edgeId = ryouikiGraph.edges[i].id,
              name;
              
          
          if(source === nodeName) {
            name = target;
            s.graph.nodes(name).color = color;
            s.graph.edges(edgeId).color = color;
            
          }
          if(target === nodeName){
            name = source;
            s.graph.nodes(name).color = color;
            s.graph.edges(edgeId).color = color;
            
          }
        }
        s.refresh();
      });
    }
    // カウントで別の処理(sの設定を変えるだけ)を行うため sのインスタンスを再度呼ばないため
    count++;
    
    
    // クリックファンクションをいったん解除
    s.unbind("doubleClickNode");
    
    // もう���度クリックファンクションをつける
    s.bind('doubleClickNode', function(e) {
        var nodeName = e.data.node.label,
            color  = '#' + (
                Math.floor(Math.random() * 16777215).toString(16) + '000000'
              ).substr(0, 6);
        s.graph.nodes(nodeName).color = color;
        for(var i=0; i<ryouikiGraph.edges.length; i++) {
          var source = ryouikiGraph.edges[i].source,
              target = ryouikiGraph.edges[i].target,
              edgeId = ryouikiGraph.edges[i].id,
              name;
          if(source === nodeName) {
            name = target;
            s.graph.nodes(name).color = color;
            s.graph.edges(edgeId).color = color;
            
          }
          if(target === nodeName){
            name = source;
            s.graph.nodes(name).color = color;
            s.graph.edges(edgeId).color = color;
            
          }
        }
        // 変更したので更新
        s.refresh();
      });
    
  });
}

// --------------- easyExam用の関数 --------------- //
var evals = [0,0,0,0];
var fields = ["応用物理学", "物質理工学", "生命理工学", "環境理工学"];
function switchNavs() {
  $(".home-nav").on("click", function() {
    var id = $(this).attr("data-target");
    var height = $(window).height() - 200 + "px";
    $(this).parent().parent().find("li[class='active']").removeClass("active");
    $("main").css("display", "none");
    $(id).css("display", "block");
    if(id === "#clsDataVisualization"){
      
      $("footer").css("margin-top", height);
    } else if(id === "#easyExam") {
      height = $(window).height() - 600 + "px";
      $("footer").css("margin-top", height);
    } else {
      $("footer").css("margin-top", "10px");
    }
  });
}
function showExamBtns(data) {
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
  // 検査のボタンについての処理
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
  // 数値の処理部分
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
function findMaxIndex() {
  var index,
      value;
  value = evals[0];
  for(var i=1;i<evals.length;i++){
    if(evals[i] > value ) value = evals[i];
  }
  index = evals.indexOf(value);
  return index;
}
function evaluate() {
  // 興味あるワードボタンに付随するデータの総計処理部分
  $("#evaluate").on("click", function() {
    var scrapPhy  = "応用物理学領域：" + evals[0] + "/ 150<br/>",
        scrapChem = "物質理工学領域：" + evals[1] + "/ 150<br/>",
        scrapBio = "生命理工学領域：" + evals[2] + "/ 150<br/>",
        scrapEnv = "環境理工学領域：" + evals[3] + "/ 150<br/>",
        index;
    
    index = findMaxIndex();
   
    $("#modalMsg").html(fields[index]);
    $("#bodyMsg p").html(scrapPhy + scrapChem + scrapBio + scrapEnv);
  });
}

// --------------- fieldLabs用関数(研究者一覧用 --------------- //
function setTd(string, ryouiki, index, subindex, mark){ // index は行、subindexは列を示す
  var fields = ["応用物理学", "物質理工学", "生命理工学", "環境理工学"];
  if(string === ryouiki){
    var i = fields.indexOf(ryouiki) + 2;
    $("#labsRyouikiTable > tr:nth-child(" + index + ") > td:nth-child(" + i + ")").html(mark);
  }
  return false;
}
function showTable() {
  var table = $("#labsRyouikiTable");
  
  for(var i=0; i<profData.length; i++){
    var strings = profData[i].field.split(" "),
        j = i + 1;
    table.append("<tr><td><a href=" + profData[i].link + " > "+ profData[i].prof + "</a></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    
    for(var k=0;k<strings.length;k++){
      var l = k + 2;
      setTd(strings[k], "応用物理学", j, l, "〇");
      setTd(strings[k], "物質理工学", j, l, "〇");
      setTd(strings[k], "生命理工学", j, l, "〇");
      setTd(strings[k], "環境理工学", j, l, "〇");
    }
    strings = profData[i].specialField.split(" ");
    for(var k=0;k<strings.length;k++){
      var l = k + 2;
      setTd(strings[k], "応用物理学", j, l, "◎");
      setTd(strings[k], "物質理工学", j, l, "◎");
      setTd(strings[k], "生命理工学", j, l, "◎");
      setTd(strings[k], "環境理工学", j, l, "◎");
    }
    $("#labsRyouikiTable > tr:nth-child(" + j + ") > td:nth-child(6)").html(profData[i].else);
    $("#labsRyouikiTable > tr:nth-child(" + j + ") > td:nth-child(7)").html(profData[i].master);
  }
}
// --------------- データの読み込み --------------- //

$(document).ready(function() {
  var rishuModel = rishuModel || [];
  
});
window.onload = function(){
  // loding 画面を出す
  $("#sokaLogo").html("<img src='./image/soka-logo.png' alt='Soka-logo'>");
  $("#loading").html("<img src='./image/gif-load.gif' alt='loading'>");
  
  // 非同期通信を行う
  $.ajax({
    type: 'GET',
    url: './data/profData.json',
    dataType: 'json'
  })
  .then(
    function(json) {
      profData = json;
      $.ajax({
        type: 'GET',
        url: './data/otherProfData.json',
        dataType: 'json'
      })
      .then(
        function(json) {
          
           otherProfData = json;
           $.ajax({
            type: 'GET',
            url: './data/easyExam.json',
            dataType: 'json'
          })
          .then(
            function(json) {
               eleValues = json;
               showExamBtns(eleValues);
               examBtnOnClick();
               evaluate();
               
               $.ajax({
                type: 'GET',
                url: './data/classData18.json',
                dataType: 'json',
                complete: function(data) {
                  $("#backgroundLoad").animate({opacity: 0}, 1000, function() {
                     $(this).css("display", "none");
                     $("#loading").empty();
                   });
                }
              })
              .then(
                function(json) {
                  
                  
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
                   for(var i = 0; i<ryouiki.length;i++) {
                     setNodeAndEdge(ryouikiGraphs[i], ryouiki[i]);
                   }
                   
                   graphBtnOnClick();
                },
                function() {
                  console.log('読み込みに失敗しました');
                }
              );
            },
            function() {
              console.log('読み込みに失敗しました');
            }
          );
        },
        function() {
          console.log('読み込みに失敗しました');
        }
      );
    },
    function() {
      console.log('読み込みに失敗しました');
    }
  );
 
  
  
};