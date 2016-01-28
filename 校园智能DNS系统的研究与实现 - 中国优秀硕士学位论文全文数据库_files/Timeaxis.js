
var BaseUrl;
var LinkTarget;
var ReferNumArray_CurYear;
var Level1NumArrayCurrent;
var Level2NumArrayCurrent;

var TimeAxis_DefaultStep = 2;
var TimeAxis_TimeInterval = 10;
var TimeAxis_IncreaseStep = 1;
var bExcludeZeroCount = false;	//是否隐藏数字为零的年份
var ContentDivIDAttribute = "ContentDivID";
var ContentDivIDPostfix = "_ContentDiv";
var TimeAxis_Step = TimeAxis_DefaultStep;

var ArrowLeftEnableClass = "ArrowLeftEnable";
var ArrowLeftDisableClass = "ArrowLeftDisable";
var ArrowRightEnableClass = "ArrowRightEnable";
var ArrowRightDisableClass = "ArrowRightDisable";
var ImgArrowLeftIdPrefix = "ArrowLeft_";
var ImgArrowRightIdPrefix = "ArrowRight_";
var ReferTypeDivPrefix = "NodeValueDiv";

function TimeAxisCell(Year, level1Value, level2Value)
{
    //内置静态属性
    this.YearInterval = 1;
    
    //对外动态属性
    this.CellClass = "cell";   //总 DIV 的 class
    this.NodeDivClass = "number";
    this.YearDivClass = "bottomYear";
    this.ScaleDivClass = this.__ScaleDivClassShort;
    this.Year = Year && new String(Year).toString() || "-1";
    
    this.HasDefinedCurYear = typeof ReferNumArray_CurYear != 'undefined';
    this.CurYear = this.HasDefinedCurYear ? eval("ReferNumArray_CurYear") : 0;   //当前年
   
    this.IsCurrentYear = this.Year == this.CurYear;
    
    level1Value = level1Value?new Number(level1Value):0;
    level2Value = level2Value?new Number(level2Value):0;
    level1Value = !isNaN(level1Value)?level1Value:0;
    level2Value = !isNaN(level2Value)?level2Value:0;
    this.Level1Value = level1Value.toString();
    this.Level2Value = level2Value.toString();
    if(!this.IsCurrentYear)
    {        
        this.NodeValue = (level1Value+level2Value).toString(); 
    }
    else
    {               
        this.NodeValue=(Number(CurYearReferType16Level2)+Number(CurYearReferType1Level1)+Number(CurYearReferType2Level2)+Number(CurYearReferType4Level1)).toString();
        
    }   //节点值
    
    //内置函数
    this.CheckReferType = function(){
        if(this.Year.indexOf("-") != -1){
            var arrYears = this.Year.split("-"), bSmall=false, bBig=false, bEqual=false;
            for(var i=0; i<arrYears.length; i++){
                bSmall = !bSmall?arrYears[i]<this.CurYear:true;
                bBig = !bBig?arrYears[i]>this.CurYear:true;
                bEqual = !bEqual?arrYears[i]==this.CurYear:true;
            }
            this.ReferType = bSmall&&bBig||bEqual?3:bBig?2:bSmall?1:0;
        }
    }
    
    //静态函数
    if(!TimeAxisCell.StaticMember){

        TimeAxisCell.StaticMember = function(){};
        TimeAxisCell.CellArray = new Array();
        TimeAxisCell.CurrentCellID = 0;
        
        TimeAxisCell.GetCell = function(cellID){
            return TimeAxisCell.CellArray[cellID];
        }
        TimeAxisCell.CacheCell = function(cell){
            TimeAxisCell.CellArray[cell.ID] = cell;
        }
        TimeAxisCell.GetEventSrcElement = function(){
            return TimeAxisCell.IsIE?window.event.srcElement:arguments.callee.caller.caller.arguments[0].target;
        }
        TimeAxisCell.AppendElement = function(parent, son){
            if(parent && son){
                parent.appendChild?parent.appendChild(son):parent.applyElement(son);
                if(parent.clientWidth>0){
                    son.style.width = son.clientWidth + "px";
                }
            }
        }
        TimeAxisCell.GetPosition = function (el, dir)
        {
	        var ePos=0;
	        while(el!=null){		
		        ePos+=el["offset"+dir];
		        el=el.offsetParent;
	        }
	        return ePos;
        }
        TimeAxisCell.SetUrlValue = function(urlString, key, value){
            var url=arguments[(len=arguments.length)-3]||window.location.href,sKey=arguments[len-2]||null,sValue=arguments[len-1]||null,len,r;
		    return url?key?(r=url.match(new RegExp(sKey+"\s*?\=[^&\s]*","ig")))?url.replace(r,sKey+"="+(encodeURI?encodeURI(sValue):escape(sValue))):url+"&"+sKey+"="+(encodeURI?encodeURI(sValue):escape(sValue)):url:"";
        }
        TimeAxisCell.NewGuid = function(){
            var guid = "";//"{";
            for (var i = 1; i <= 32; i++){
                guid += Math.floor(Math.random() * 16.0).toString(16)+(i==8||i==12||i==16||i == 20?"-":"");
            }
            return guid; //+ "}";
        }
        TimeAxisCell.IsNumber = function(str){
            for(var c,i=0; i<str.length; i++){
                if((c = str.substr(i, 1)) < '0' || c > '9'){
                    return false;
                }
            }
            return true;
        }
        TimeAxisCell.IsIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1 && document.all;
    }
    
    //内部动态属性
    this.Cell = null;
    this.ID = TimeAxisCell.NewGuid();
    TimeAxisCell.CacheCell(this);
     // 1:参考文献&二级参考文献  2:引证文献&二级引证文献 3:参考文献&二级参考文献&引证文献&二级引证文献
    this.ReferType = TimeAxisCell.IsNumber(this.Year)?(this.Year<this.CurYear)?1:(this.Year>this.CurYear)?2:3:0;
    this.CheckReferType();
    
    
    //内部HTML元素
    var CellDiv = document.createElement("div");
    CellDiv.className = this.CellClass;    
    this.Cell = CellDiv;
    
    var ScaleDiv = document.createElement("div");
    this.ScaleDivClass = "Scale";
    ScaleDiv.className = this.ScaleDivClass;
    
    var YearDiv = document.createElement("div");
    YearDiv.className = this.YearDivClass;
    if(!TimeAxisCell.IsNumber(this.Year) || this.Year % this.YearInterval == 0 || (this.HasDefinedCurYear && this.Year == this.CurYear /*&& this.Year % this.YearInterval == 0*/))
    {
        YearDiv.innerHTML = this.Year;
    }
    
    var NodeDiv = document.createElement("div");
    NodeDiv.className = this.NodeDivClass;
    if(this.NodeValue.length > 0)
    {
        this.NodeValue = this.NodeValue.replace(" ", "&nbsp;");
        if(this.NodeValue != "0")
        {   
            TimeAxisCell.AppendElement(YearDiv, new AddValueLink(this.ID,YearDiv));    
            TimeAxisCell.AppendElement(NodeDiv, new NodeValueLink(this));
        }
        else
        {
            NodeDiv.innerHTML = this.NodeValue;
        }
    }
    else
    {
        NodeDiv.innerHTML = "&nbsp;";
    }
    TimeAxisCell.AppendElement(CellDiv, NodeDiv);
    TimeAxisCell.AppendElement(CellDiv, ScaleDiv);
    TimeAxisCell.AppendElement(CellDiv, YearDiv);
}

 TimeAxisCell.RenderTimeAxis = function(level1Array, level2Array, AxisFrameDivID){
    var AxisFrameDiv = document.getElementById(AxisFrameDivID);
    var numArray = {};
    if(AxisFrameDiv && (level1Array || level2Array)){
        var TimeAxisDivID = AxisFrameDivID + ContentDivIDPostfix;
        var AxisContentDiv = document.createElement("div");
        AxisContentDiv.id = TimeAxisDivID;
        AxisContentDiv.className = "ContentDiv";
        for(var i=0; i<arguments.length; i++)
        {
			if(typeof arguments[i] == "string")
			{
				break;
			}
			numArray = MergeArray(numArray, arguments[i]);
        }
        numArray = SortArrayObject(numArray);
        for(var year in numArray)
        {
			if(year)
			{		       
				var cellObj = new TimeAxisCell(year, level1Array[year], level2Array[year]);
				if(window.bExcludeZeroCount && (cellObj.NodeValue.length == 0 || cellObj.NodeValue == "0"))
				{
					continue;
				}
				TimeAxisCell.AppendElement(AxisContentDiv, cellObj.Cell);
            }
        }
        TimeAxisCell.AppendElement(AxisFrameDiv, AxisContentDiv);
        AxisContentDiv.style.width = "";
        AxisContentDiv.style.left = "-10000px";
        AxisContentDiv.style.width = AxisContentDiv.clientWidth + "px";
        AxisContentDiv.style.left = "0px";
        AxisFrameDiv.style.height = "55px";
        if(AxisContentDiv.clientWidth <= AxisFrameDiv.clientWidth)
        {
            var arrowRight = document.getElementById("ArrowRight_" + AxisFrameDiv.id);
            if(arrowRight) arrowRight.className = "ArrowRightDisable";
        }
        //计算节点文献的刻度距左边界的距离
        var AxisFrameDiv = document.getElementById(AxisFrameDivID);
        window.AxisFrameWidth = (AxisFrameDiv) ? AxisFrameDiv.clientWidth : 0;    //外侧框架Div的宽度
    }
}

function NodeValueLink(cell)
{
    if(TimeAxisCell.IsNumber(cell.Year) && cell.Year > 0)
    {
        var elLink = document.createElement("A");
        elLink.className = "number";
        elLink.setAttribute("CellID", cell.ID);
        if(elLink.addEventListener)
        {
            elLink.addEventListener("mouseover", ShowNodeValueDiv, true);
            elLink.addEventListener("mouseout", HideNodeValueDiv, true);
        }
        else if(elLink.attachEvent)
        {
            elLink.attachEvent("onmouseover", ShowNodeValueDiv);
            elLink.attachEvent("onmouseout", HideNodeValueDiv);
        }
        else
        {
            elLink.onmouseover = ShowNodeValueDiv;
            elLink.onmouseout = HideNodeValueDiv;
        }
//        FF下添加事件的另一种方法，更灵活一些。但如果同时也应用 addEventListener 绑定事件的话，则后者优先。
//        if(!TimeAxisCell.IsIE)
//        {
//            elLink.setAttribute("onmouseover", "ShowNodeValueDiv('" + cell.ID + "');");
//            elLink.setAttribute("onmouseout", "HideNodeValueDiv('" + cell.ID + "');");
//        }
        elLink.innerHTML = cell.NodeValue;
        return elLink;
    }
    else
    {
        var elSpan = document.createElement("span");
        elSpan.innerHTML = cell.NodeValue;
        return elSpan;
    }
}
function AddValueLink(cellID,cellDiv)
{
    var elLink = document.createElement("A");   
    elLink.setAttribute("CellID", cellID);
    if(elLink.addEventListener)
    {
        elLink.addEventListener("mouseover", ShowNodeValueDiv, true);
        elLink.addEventListener("mouseout", HideNodeValueDiv, true);
    }
    else if(elLink.attachEvent)
    {
        elLink.attachEvent("onmouseover", ShowNodeValueDiv);
        elLink.attachEvent("onmouseout", HideNodeValueDiv);
    }
    else
    {
        elLink.onmouseover = ShowNodeValueDiv;
        elLink.onmouseout = HideNodeValueDiv;
    }
    elLink.innerHTML = cellDiv.innerHTML;
    cellDiv.innerHTML = '';
    return elLink;
   
}
function TimeAxisMoveLeft(FrameDivID)
{
    var AxisContentDiv = document.getElementById(FrameDivID + ContentDivIDPostfix);
    if(!AxisContentDiv) return;
    var arrowLeft = document.getElementById(ImgArrowLeftIdPrefix + FrameDivID);
    var arrowRight = document.getElementById(ImgArrowRightIdPrefix + FrameDivID);
   
    if(arrowRight && arrowRight.className == ArrowRightDisableClass)   return;
    if(arrowLeft && arrowLeft.className == ArrowLeftDisableClass)   arrowLeft.className = ArrowLeftEnableClass;
    if(AxisContentDiv && AxisContentDiv.offsetLeft * -1 < AxisContentDiv.clientWidth - AxisFrameWidth)
    {        
        AxisContentDiv.style.left = AxisContentDiv.offsetLeft - TimeAxis_Step + "px";
        window.timeout_Move = window.setTimeout("TimeAxisMoveLeft('" + FrameDivID + "')", TimeAxis_TimeInterval);
    }
    else
    {
        if(arrowRight) arrowRight.className = ArrowRightDisableClass;
    }
}

function TimeAxisMoveRight(FrameDivID)
{
    var AxisContentDiv = document.getElementById(FrameDivID + ContentDivIDPostfix);
    if(!AxisContentDiv) return;
    var arrowLeft = document.getElementById(ImgArrowLeftIdPrefix + FrameDivID);
    var arrowRight = document.getElementById(ImgArrowRightIdPrefix + FrameDivID);
    if(arrowLeft && arrowLeft.className == ArrowLeftDisableClass)   return;
    if(arrowRight && arrowRight.className == ArrowRightDisableClass) arrowRight.className = ArrowRightEnableClass;
    if(AxisContentDiv && AxisContentDiv.offsetLeft < 0)
    {
        AxisContentDiv.style.left = AxisContentDiv.offsetLeft + TimeAxis_Step + "px";
        window.timeout_Move = window.setTimeout("TimeAxisMoveRight('" + FrameDivID + "')", TimeAxis_TimeInterval);
    }
    else
    {
        if(arrowLeft)   arrowLeft.className = ArrowLeftDisableClass;
    }
}

function TimeAxisRestore(FrameDivID)
{
    var AxisContentDiv = document.getElementById(FrameDivID + ContentDivIDPostfix);
    if(AxisContentDiv)
    {
        AxisContentDiv.style.left = "0px";//DefaultPostion + "px";
    }
}

function TimeAxisMoveFaster()
{
    if(TimeAxis_Step < 5 * TimeAxis_DefaultStep)
    {
        TimeAxis_Step += TimeAxis_IncreaseStep;
    }
}

function TimeAxisStop()
{
    window.clearTimeout(window.timeout_Move);
    TimeAxis_Step = TimeAxis_DefaultStep
}

function ShowNodeValueDiv(cellID) {
    var sEvent = TimeAxisCell.IsIE ? window.event : arguments[0] instanceof window.Event ? arguments[0] : (caller = arguments.callee.caller) ? caller.arguments[0] : this, caller;
    var srcElement = window.event ? sEvent.srcElement : sEvent.target;
    var cell = cellID && !(TimeAxisCell.IsIE ? cellID.type && typeof cellID.cancelBubble != 'undefined' : cellID instanceof window.Event) ? TimeAxisCell.GetCell(cellID) : srcElement ? TimeAxisCell.GetCell(srcElement.getAttribute("CellID")) : null;
    if (!cell) return;
    TimeAxisCell.CurrentCellID = cell.ID;
    var NodeValueDiv = document.getElementById(ReferTypeDivPrefix + cell.ReferType);
    var bRebuiltLink = true;
    if (NodeValueDiv && bRebuiltLink) {
        var arrLabels = NodeValueDiv.getElementsByTagName("span");
        for (var i = 0; i < arrLabels.length; i++) {
            if (arrLabels[i].id.length == 0) {
                continue;
            }
            var value = 0;
            if (cell.IsCurrentYear) {
                //alert('xxx')
                var NumArgumentNamePostfix = arrLabels[i].id.replace(NodeValueDiv.id, "");
                value = window["CurYear" + NumArgumentNamePostfix];
            }
            else {
                var level = arrLabels[i].id.substring(arrLabels[i].id.length - 1);
                value = cell["Level" + level + "Value"];
            }
            if (value) {
                arrLabels[i].innerHTML = "(" + value + ")";
            }
        }
        var arrLinks = NodeValueDiv.getElementsByTagName("A");
        for (var i = 0; i < arrLinks.length; i++) {

            var idFlag = arrLinks[i].id.replace(NodeValueDiv.id, "").replace("Link", "");               
            var reftype = idFlag.replace("ReferType", "");
            if (reftype == "4")
                reftype = "3";
            else if (reftype == "16")
                reftype = "4"
            var count = "";
            for (var j = 0; j < arrLabels.length; j++) {                              
                if (arrLabels[j].id.indexOf(idFlag) != -1) {     
                    if(arrLabels[j].id.indexOf(idFlag+"6")!=-1)
                        continue;               
                    count = arrLabels[j].innerText || arrLabels[j].textContent;
                    count = count.replace("(", "").replace(")", "").replace(" ", "");
                    //alert(idFlag+" "+count+" "+arrLabels[j].id);
                }
            }            
            if (Number(count) > 0) {                
                arrLinks[i].target = LinkTarget;
                arrLinks[i].href = TimeAxisCell.SetUrlValue(BaseUrl, "reftype", reftype);
                arrLinks[i].href = TimeAxisCell.SetUrlValue(arrLinks[i].href, "year", cell.Year);
                arrLinks[i].href = TimeAxisCell.SetUrlValue(arrLinks[i].href, "totalCount", count);
                arrLinks[i].title = "查看本文在" + cell.Year + "年的" + arrLinks[i].innerHTML;
            }
            else {                
                arrLinks[i].href = "javascript:void(0);";
                arrLinks[i].title = "";
            }
        }
        NodeValueDiv.style.display = "block";
        //使用 document.body.scrollTop + document.documentElement.scrollTop 是因为如果声明了 DocType 时，body的意义就转变了， 
        //scrollLeft 和 scrollTop 均为 0. 与之同义的是 documentElement，如果未声明 DocType, 情况恰恰相反
        NodeValueDiv.style.left = NodeValueDiv.style.pixelLeft = sEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft + 5 + "px";
        NodeValueDiv.style.top = NodeValueDiv.style.pixelTop = sEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop + "px";
    }
}

function Null()
{ }

function HideNodeValueDiv(cellID)
{
    var cell = cellID&&!(TimeAxisCell.IsIE?cellID.type&&typeof cellID.cancelBubble!='undefined':cellID instanceof window.Event)?TimeAxisCell.GetCell(cellID):TimeAxisCell.GetCell(TimeAxisCell.CurrentCellID);
    if(!cell) return;
    var NodeValueDiv = document.getElementById(ReferTypeDivPrefix + cell.ReferType);
    if(cell && NodeValueDiv)
    {
        window.timeout_NodeValueDiv = setTimeout("document.getElementById('" + NodeValueDiv.id + "').style.display = 'none';", 100);
    }
}

function MergeArray(totalArray, singleArray)
{
	if(singleArray && totalArray)
    {
		for(var year in singleArray)
		{
			if(!year)
			{
				continue;
			}
			if(totalArray[year])
			{
				var totalNum = new Number(totalArray[year]);
				var singleNum = new Number(singleArray[year]);
				if(!isNaN(totalNum) && !isNaN(singleNum))
				{
					totalArray[year] = (totalNum+singleNum).toString();
				}
			}
			else
			{
				totalArray[year] = singleArray[year];
			}
		}
    }
    return totalArray;
}

function SortArrayObject(array)
{
	var arrSortArray = new Array();
	for(var year in array)
	{
		if(year && typeof year == "string")
		{
			arrSortArray.push(year);
		}
	}
	arrSortArray.sort();
	var sortedArrayObject = {};
	for(var i=0; i<arrSortArray.length; i++)
	{
		sortedArrayObject[arrSortArray[i]] = array[arrSortArray[i]];
	}
	return sortedArrayObject;
}

//
var Level1NumArrayLeft = new Object();
var Level1NumArrayRight =  new Object();
var Level2NumArrayLeft = new Object();
var Level2NumArrayRight = new Object();

var CurYearReferType1Level1='0';
var CurYearReferType2Level2='0';
var CurYearReferType4Level1='0';
var CurYearReferType16Level2='0';

function AddToTimeArray(year,count,type){
    switch(type){
        case "REFERENCE":
            Level1NumArrayLeft[year]=count;
            break;
        case "SUB_REFERENCE":
            Level2NumArrayLeft[year]=count;
            break;
        case "CITING":
            Level1NumArrayRight[year]=count;
            break;
        case "SUB_CITING":
            Level2NumArrayRight[year]=count;
            break;      
    }
}


function AddCurTime(count,type){
     switch(type){
        case "REFERENCE":
            CurYearReferType1Level1=Number(count);
            break;
        case "SUB_REFERENCE":
            CurYearReferType2Level2=Number(count);
            break;
        case "CITING":
            CurYearReferType4Level1=Number(count);
            break;
        case "SUB_CITING":
            CurYearReferType16Level2=Number(count);
            break;      
    }

}



function RenderTimeAxis(sYear,sBaseUrl,sTarget) {
    ReferNumArray_CurYear = sYear;
    BaseUrl = sBaseUrl;
    LinkTarget = sTarget;  
    Level1NumArrayCurrent = new Object();
    Level2NumArrayCurrent = new Object();
    Level1NumArrayCurrent[sYear] = 0;
    Level2NumArrayCurrent[sYear] = 0;
     try{    
        TimeAxisCell.RenderTimeAxis(Level1NumArrayCurrent, Level2NumArrayCurrent, 'AxisFrameDivCurrent');
        TimeAxisCell.RenderTimeAxis(Level1NumArrayLeft, Level2NumArrayLeft, 'AxisFrameDivLeft');
        TimeAxisCell.RenderTimeAxis(Level1NumArrayRight, Level2NumArrayRight, 'AxisFrameDivRight');
    }catch(e){}
}