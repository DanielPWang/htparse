

//page start
var nPageLength = 10;
var nCurrentPage;
var nPageCount;
var nShowPageNum = 10;
var textFirstPage = PAGE_FIRST;
var textPrePage = PAGE_PREV;
var textNextPage = PAGE_NEXT;
var textLastPage = PAGE_LAST;
var textCount = PAGE_COUNT;
var nEnable=0;

function ShowPage(num, containerID, curClass) {
    num = Number(num);
    if(nEnable==0)
        return;
    nPageCount = Math.ceil(num/nPageLength);//num%nPageLength==0?num/nPageLength:num/nPageLength+1;
    if(nPageCount<2)return;
    GetCurrentPage();
    var nPageNum = nShowPageNum>nPageCount?nPageCount:nShowPageNum;
    var nEndPage = (nCurrentPage+Math.ceil(nPageNum/2))>nPageCount?nPageCount:nCurrentPage+Math.ceil(nPageNum/2);
    var nStartPage = nEndPage+1-nPageNum;
    if(nStartPage<1){
        nStartPage = 1;
        nEndPage = nPageNum-nStartPage+1;
    }    
    var strTagFormat = "<a href=\"{0}\" class=\"{1}\">{2}</a>"; 
    var array = new Array();
    array.push(textCount.format(nPageCount));
    array.push("&nbsp;&nbsp;&nbsp;&nbsp;");
    var sTemp;
    if(nCurrentPage>1){
         sTemp = strTagFormat.format(_getPageUrl(1),"",textFirstPage);
         array.push(sTemp);
         sTemp = strTagFormat.format(_getPageUrl(nCurrentPage-1),"",textPrePage);
         array.push(sTemp);
    }
    if(nCurrentPage<100){
        for(var i=nStartPage;i<nEndPage+1;i++){ 
            if(i==nCurrentPage){
                sTemp = strTagFormat.format(_getPageUrl(i),curClass,i);
            }else{
                sTemp = strTagFormat.format(_getPageUrl(i),"",i);
            }
            array.push(sTemp);
        }
    }
    if(nCurrentPage<nPageCount){
        sTemp = strTagFormat.format(_getPageUrl(1+Math.floor(nCurrentPage)),"",textNextPage);
        array.push(sTemp);
        sTemp = strTagFormat.format(_getPageUrl(nPageCount),"",textLastPage);
        array.push(sTemp);         
    }
    var el = document.getElementById(containerID);
    
    if(el){
        var str="";
        for(var i=0;i<array.length;i++){
            str+= array[i]+"&nbsp;";
        }
        //alert(str);
        el.innerHTML = str;
    }
    
}
function GetCurrentPage(){
    var url = window.location.href;
    var regExp = /page=([^&\s]*)/ig;
	var rPage = url.match(regExp);
	nCurrentPage = rPage==null?1:RegExp.$1;
	nCurrentPage = Math.ceil(nCurrentPage);
	if(nCurrentPage<1)nCurrentPage=1;	
	return;
}
function _getPageUrl(nPage){
    var url = window.location.href;
    var regExp = /page=[^&\s]*/ig;
    if(regExp.test(url))
		url = url.replace(regExp,"page="+nPage);	
	else
		url = url+"&page="+nPage;   
	return url;
}

function _resetPageUrl(url){
    var regExp = /page=[^&\s]*/ig;
    if(regExp.test(url))
		url = url.replace(regExp,"page="+0);
	return url;
}


//page end

function HideParent(){

    if (parent) {
        //parent.style.heiget = "0px";
		var arrFrames = parent.document.getElementsByTagName("iframe");
		for(var i=0; i<arrFrames.length; i++)
		{
		    if(!CheckFrame(arrFrames[i].src))
		        continue;           
			if(document.all) //ie
		    {
		        if((arrFrames[i].contentWindow.document == document) || (arrFrames[i].contentWindow.document.frames.name == document.frames.name)) {
		            //arrFrames[i].style.display = "none";
		            arrFrames[i].style.height = "0px";						            
		        }
		    }
		    else //firefox
		    {		        
		        if(arrFrames[i].contentWindow.document == document) {		        
		            if(document.body.offsetHeight == 0 && document.body.scrollHeight != 0) {				    
				        //arrFrames[i].style.display = "none";
				        arrFrames[i].style.height = "0px";							    
				    }
				    else {
				       //arrFrames[i].style.display = "none";
				        arrFrames[i].style.height = "0px";
				    }				    
		        }
		    }	
		}
	}

}


function ResezeParent(){
	if(parent){
		var arrFrames = parent.document.getElementsByTagName("iframe");
		for(var i=0; i<arrFrames.length; i++)
		{
		    if(!CheckFrame(arrFrames[i].src))
		        continue;		      
			if(document.all) //ie
		    {		        
		        if((arrFrames[i].contentWindow.document == document) || (arrFrames[i].contentWindow.document.frames.name == document.frames.name) )
		        {
		            //arrFrames[i].style.display = "";
		            arrFrames[i].style.height = document.body.scrollHeight + "px";							            
		        }
		    }
		    else //firefox
		    {
		        if(arrFrames[i].contentWindow.document == document)
		        {
		            if(document.body.offsetHeight == 0 && document.body.scrollHeight != 0)
				    {
				        //arrFrames[i].style.display = "";
				        arrFrames[i].style.height = document.body.scrollHeight  + "px";							    
				    }
				    else {
				        //arrFrames[i].style.display = "";
				        arrFrames[i].style.height = document.body.offsetHeight  + "px";							
				    }
		        }
		    }	
		}
	}
}

function CheckFrame(src){    
    var regExp = /frame\/list.aspx/ig;   
    if(regExp.test(src))
        return true;
    var regExp2 = /frame\/detaillist.aspx/ig;
    if(regExp2.test(src))
        return true;
    return false;
}

function setPageEnable(){
    nEnable=1;
}

function dropDwonListOnChange(el){	
	var value = el.value;
	var url = window.location.href;
	var regExp = /CurDBcode=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"CurDBCode="+value);	
	else
		url = url+"&CurDBCode="+value;
	url = _resetPageUrl(url); 
	window.location = url;
}

function SetSelectedOption(){
    var url = window.location.href;
	var regExp = /CurDBcode=([^&\s]*)/ig;
	var rCurDbCode = url.match(regExp);
	var dbcode = rCurDbCode==null?"":RegExp.$1;
	var select = document.getElementById("selectlist");
	select.value = dbcode.toUpperCase();
	if(select.value!=""){
	    nEnable=1;
	}
}


function _getCatUrl(source,target){
    var url = window.location.href;
    var regExp = /cat=[^&\s]*/ig;
    if(regExp.test(url))
		url = url.replace(regExp,"cat="+nPage);	
	else
		url = url+"&cat="+source+"$"+target;   
	return url;

}

function OnMoreClick(value){
	var url = window.location.href;
	var regExp = /CurDBcode=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"CurDBCode="+value);	
	else
		url = url+"&CurDBCode="+value;
    url = _resetPageUrl(url);
    window.location.href = url;
	//window.open(url,"_blank");
}

function SetCurDb(){
    var url = window.location.href;
	var regExp = /CurDBcode=([^&\s]*)/ig;
	var rCurDbCode = url.match(regExp);
	var dbcode = rCurDbCode==null?"":RegExp.$1;
	if(dbcode!="")
	    nEnable=1;
}

function SetCurAuthor(value){
    var url = window.location.href;
    value = encodeURIComponent(value);
    url = _resetPageUrl(url); 
	var regExp = /author=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"author="+value);	
	else
		url = url+"&author="+value;
	
	window.location = url;
}

function SetCurAuthorMark(value,index){
    value2 = encodeURIComponent(value);
    var url = window.location.href;
    var regExp = /author=([^&\s]*)/ig;
	var rAuthor = url.match(regExp);
	if(rAuthor==null){
	    if(index==1)
	        document.write('<font class="Mark">'+value+'</font>');
	    else
	        document.write(value);
	}
	else{	    
	    var authorName = RegExp.$1;	
	    if(authorName==value2){
	        document.write('<font class="Mark">'+value+'</font>');
	    }
	    else
	        document.write(value);	
	}
}

function SetCurOrg(value){
    var url = window.location.href;
    value = encodeURIComponent(value);
    url = _resetPageUrl(url); 
	var regExp = /org=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"org="+value);	
	else
		url = url+"&org="+value;
	
	window.location = url;
}

function SetCurOrgMark(value,index){
    value2 = encodeURIComponent(value);
    var url = window.location.href;
    var regExp = /org=([^&\s]*)/ig;
	var rAuthor = url.match(regExp);
	if(rAuthor==null){
	    if(index==1)
	        document.write('<font class="Mark">'+value+'</font>');
	    else
	        document.write(value);
	}
	else{	    
	    var authorName = RegExp.$1;	
	    if(authorName==value2){
	        document.write('<font class="Mark">'+value+'</font>');
	    }
	    else
	        document.write(value);	
	}
}

function ReplaceWordTag(text){    
    var prefix = /###/g;
    var postfix=/\$\$\$/g;
    text = text.replace(prefix,"<font class='Mark'>");
    text = text.replace(postfix,"</font>");
    document.write(text);
}

function SetYear(value){
    var url = window.location.href;
    url = _resetPageUrl(url); 
	var regExp = /year=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"year="+value);	
	else
		url = url+"&year="+value;
	
	window.location = url;
}


function SetCurYearMark(year,text) {
    var url = window.location.href;
    var regExp = /year=([^&]*)/ig;
    var linkYear=null;
    if (regExp.test(url))
        curYear = RegExp.$1;
    if (curYear == null || curYear!=year) {
        document.write(text);
    }
    else {
        document.write('<font class="Mark">' + text + '</font>')
    }    
}

function SetCategory(cat)
{
    var url = window.location.href;
    url = _resetPageUrl(url); 
	var regExp = /cat=[^&]*/ig;
	if(regExp.test(url))
		url = url.replace(regExp,"cat="+cat);	
	else
		url = url+"cat="+cat;
	window.location = url;
}

function SetCategoryMrak(cat,value){
    var url = window.location.href;
    var regExp = /cat=([^&]*)/ig;
	rCat = url.match(regExp);
	if(rCat==null){
	     document.write(value);   
    }
    else{
        if(cat==RegExp.$1)
            document.write('<font class="Mark">'+value+'</font>');
	    else
	        document.write(value);   
    }
}

function CYFDRef(ti, fn) {
    var url = "{0}/kcms/detail/search.aspx?dbcode=cyfd&sfield=cite&skey={1}&code={2}";
    url = url.format("http://192.168.21.11", encodeURIComponent(ti), fn);
    window.open(url);
}



//chart

