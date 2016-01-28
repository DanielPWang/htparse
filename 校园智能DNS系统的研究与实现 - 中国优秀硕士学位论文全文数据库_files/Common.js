
String.prototype.format = function()
{
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,               
        function(m,i){
            return args[i];
        });
}
String.prototype.setCharAt = function(index, chr) {
    if (index > this.length - 1) return str;
    return this.substr(0, index) + chr + this.substr(index + 1);
}

function getOuterLink(type, page) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var link = getOuterBaseLink(type)+page;
    window.open(link);
}

function getOuterLinkLogin(type, page, lid) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    window.open(url);   
}

function getOuterBaseLink(type) {
    var baseurl = "";
    type = type.toUpperCase();
    switch (type) {
        case "NAVI": if (typeof (BaseLink_NAVI) != 'undefined') baseurl = BaseLink_NAVI ? BaseLink_NAVI : ""; break;
        case 'COVER': if (typeof (BaseLink_COVER) != 'undefined') baseurl = BaseLink_COVER ? BaseLink_COVER : ""; break;
        case 'LIB': if (typeof(BaseLink_LIB)!='undefined') baseurl = BaseLink_LIB; break;
        case 'AD': if (typeof (BaseLink_AD) != 'undefined') baseurl = BaseLink_AD ? BaseLink_AD : ""; break;
    };
    return baseurl;
}

function getKns55NaviLink(lid,code,table,pykm) { 
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=BaseLink&DBCode={0}&TableName={1}&Field=BaseID&Value={2}';
    code = code.toLowerCase();
    if (code == "cjsf") {
        table = "cjfdbaseinfo";
    }
    var page = pageFormat.format(code, table, pykm);
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    //alert(url);
    window.open(url);
}

function getKns55NaviLinkIssue(lid, code, table, pykm, year, issue) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=IssueLink&DBCode={0}&TableName={1}&ShowField=cname&Field=BaseID*year*issue&Value={2}*{3}*{4}';
    var pageFormat_ccjd =  'Navi/Bridge.aspx?LinkType=IssueLink&DBCode={0}&TableName={1}&ShowField=cname&Field=thname&Value={2}{3}{4}'
    code = code.toLowerCase();
    if (code == "cjsf") {
        table = "cjfdyearinfo";
    }
    if(code=="ccjd" || code=="cjfv" || code=="cjfu" || code=="cjfz" || code=="cjfy" || code=="cjfx" || code=="cjft"  || code=="fcjd"){
        table="";
        pageFormat = pageFormat_ccjd;
    }    
    var page = pageFormat.format(code, table, pykm,year,issue);
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    //alert(url);
    window.open(url);
}

function getKns55UnitNaviLink(lid, code, unitcode) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?DBCode={0}&UnitCode={1}';
    code = code.toLowerCase();
    if (code == "cmbf" || code == "cmbf2010" || code == "cmsf" || code=="cmzd") {
        code = "cmfd";
    }
    else if (code == "cdbf" || code == "cdbf2010" || code == "cdsf" || code == "cdmd") {
        code = "cdfd";
    }
    var page = pageFormat.format(code, unitcode);
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    
    window.open(url);
}

function getKns55YearNaviLink(lid,code,table, pykm, year) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=YearLink&DBCode={0}&TableName={1}&ShowField={4}&Field={5}*year&Value={2}*{3}';
    var page = pageFormat.format(code, table, pykm, year, encodeURIComponent("年鉴中文名"), "BaseID");
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    //alert(url);
    window.open(url);
}


function getKns55CYFDNaviLink(lid, code, table, pykm) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=BaseLink&DBCode={0}&TableName={1}&Field={3}&Value={2}';
    code = code.toLowerCase();  
    var page = pageFormat.format(code, table, pykm, encodeURIComponent("种编码"));
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    //alert(url);
    window.open(url);
}


function OpenCRLDENG(param) {
    window.open(BaseLink_CRLDENG + encodeURIComponent(param));
}

function GetRefBookLink(kw) {
    if (typeof(BaseLink_REFBOOK) == 'undefined' || BaseLink_REFBOOK == null || BaseLink_REFBOOK=="")
        return "";
    var linkformat = "{0}BasicSearch.aspx?kw={1}";
    return linkformat.format(BaseLink_REFBOOK,kw);
 }
    
//function changeLang(src,target){
//	var url = window.location.href;
//	alert(url);
//	if(target=="chs" || target=="")
//	    target="..";
//	else if(target=="en")
//	    target="en";
//	else if(target=="cht")
//	    target="cht";
//	var regExp = /([^\/^.]*.aspx?[\S]*)/ig;
//	if(regExp.test(url))
//	{
//	    alert(RegExp.$1);
//	    url = target+"/"+RegExp.$1;
//     }
//	alert(url);
//	window.location = url;
//}

function login(){
    var url = window.location.href;
    var target = "../login.aspx?url="+encodeURIComponent(url);
    window.location  =target;
}

function logout(){
    var url = window.location.href;
    var target = "../logout.aspx?url="+encodeURIComponent(url);
    window.location  =target;
}

function MM_swapImage(image, url) {
    image.src = url;
}


function OnDownloadMore(url, sTitle, sTable, sFn, sCode) { 　
    var sUrl = url + "?ti=" + encodeURIComponent(sTitle) + "&tb=" + sTable + "&fn="+ sFn +"&code=" + sCode;
    window.open(sUrl, 'download', 'height=200, width=400, top=100,left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
　　
}


function OpenDLMore(sFn, sTable, sPlus) {
    var url = "../../download.aspx?filename=" + sFn + "&tablename=" + sTable+"&pubstr="+sPlus;
    window.open(url, '_blank');
}

function ChangeReferType(reftype) {
    var el = document.getElementById("rl" + reftype);
    var arrReferLink = document.getElementsByName(el.name);
    for (var i = 0; i < arrReferLink.length; i++) {
        arrReferLink[i].className = "";
    }
    el.className = "ReferLinkOn";
}



function ShowChar(id) {
    var oValue = document.getElementById(id).innerHTML;
    var result = "";
    for (var i = 0; i < oValue.length; i++) {
        var c = oValue.charCodeAt(i);
        result += c + ":"+oValue[i]+";";
    }
    alert(result);
}

function RemoveUnknownChar(oValue) {
    //var oValue = String(document.getElementById(id).innerHTML);
    for (var i = 0; i < oValue.length; i++) {
        var c = oValue.charCodeAt(i);
        if (c == 57361 || c == 57355 || c == 57347 || c == 57348) {
            //alert(c);
            oValue = oValue.setCharAt(i, ' ');
        }
        if (c == 58426) {
            oValue = oValue.setCharAt(i, 'ö');
        }
    }
   return oValue;
}


function KeywordFilter(text) {
    text = text.replace(/:[\d]+/g, "");
    return text;
}
var g_Summary = new Object();
var g_SummaryLength = 500;
function AbstractFilter(id, idMoer, idReset) {
    var oAb = document.getElementById(id);
    var text = oAb.innerHTML;
    g_Summary[id] = text;
    ResetSummary(id, idMoer, idReset);
}
function MoerSummary(id, idMoer, idReset) {
    var oAb = document.getElementById(id);
    var text = g_Summary[id];
    text = RemoveUnknownChar(text);
    //text = ReplaceSub(text);
    oAb.innerHTML = text + "&nbsp;";
    document.getElementById(idMoer).style.display = "none";
    document.getElementById(idReset).style.display = "";
}

function ResetSummary(id, idMoer, idReset) {
    var oAb = document.getElementById(id);
    var text = g_Summary[id];
    if (text.length > g_SummaryLength) {
        text = text.substring(0, g_SummaryLength)+'...';
        document.getElementById(idMoer).style.display = "";
        document.getElementById(idReset).style.display = "none";
    }
    text = RemoveUnknownChar(text);
    //text = ReplaceSub(text);
    oAb.innerHTML = text+"&nbsp;";
}
function GetCookie(sName) {
    var sRE = "[;]*[\s]*" + sName + "=([^;]*)";
    var oRE = new RegExp(sRE);
    //alert(document.cookie);
    if (oRE.test(document.cookie)) {
        return RegExp["$1"];
    } else {
        return "";
    }
}
function GetLib(text) {
    link = getOuterBaseLink("LIB");
    var co = document.getElementById("lib");
    if (link != "" && co) {
        var html = "<a target='_blank' href='{0}' >{1}</a> | ";
        var uid = GetCookie("LID");
        if (uid) { link = link + "&uid=" + uid; }
        html = html.format(encodeURI(link), text);
        co.innerHTML = html;
    }  
}

function MetaFilter(text, dc) {
    var linkRegExp = /\[A\]([^\[]+)\[\/A]/ig;
    var brRegExp=/\[BR\]/ig;
    var link = '<a href="meta.aspx?key={0}&dbcode={2}" >{1}</a>';   
    function replaceLink(match,$1) { return link.format(encodeURIComponent($1), $1, dc); }
    text = text.replace(linkRegExp, replaceLink);
    text = text.replace(brRegExp, '</p><p>')
    document.write(text);
}
function OpenMeta(key, code) {
    //if(key.indexOf('%'))
    //alert(key);
    //alert(key);
    url = "meta.aspx?key={0}&dbcode={1}";
    window.open(url.format(encodeURIComponent(key), code));
}


function Translate(value, lang, id) {
    //alert(value);
    google.language.translate(value, 'zh-CN', lang, function(result) {  if (result.translation) { document.getElementById(id).innerHTML = result.translation; } });
}
