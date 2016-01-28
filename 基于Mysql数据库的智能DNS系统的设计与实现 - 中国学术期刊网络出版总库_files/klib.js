var g_pagesize=10;
var g_NextPage = PAGE_NEXT;
var g_PrevPage = PAGE_PREV;
var g_FirstPage = PAGE_FIRST;
var g_LastPage = PAGE_LAST;

var TitleFormat="<a target='_blank' href='detail.aspx?filename={0}&dbcode={1}&dbname={2}'>{3}</a>";
var NaviFormat="<a target='_blank' href='{0}'>{1}</a>";

function Search(op,dbcode,key,code){
    window.open(getSearchLink(op,dbcode,key,code));
}
function ShowText(text){
    var o=document.getElementById("poptext");
    var ob=document.getElementById("pop");
    if(o && ob){o.innerHTML=text;ob.style.top="200px"; ob.style.display="block";}
}
function CloseText(){
    var o=document.getElementById("poptext");
    var ob=document.getElementById("pop");
    if(o && ob){ob.style.display="none";o.innerHTML="";}
}
function getSearchLink(op,dbcode,key,code){
    var format='search.aspx?sfield={0}&dbcode={1}&skey={2}&code={3}';
    return format.format(op,dbcode,encodeURI(key),encodeURI(code));
}
function JournalNavi(code,pykm){
    var lid=getCookie("LID");
    window.open(getNaviLink(lid,code,pykm));
}
function getNaviLink(code,pykm) { 
    var lid=getCookie("LID");
    var table=code+"baseinfo";
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=BaseLink&DBCode={0}&TableName={1}&Field=BaseID&Value={2}';
    code = code.toLowerCase();
    if (code == "cjsf") {
        table = "cjfdbaseinfo";
    }
    var page = pageFormat.format(code, table, pykm);
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    //alert(url);
   return url;
}

function getNaviIssueLink(code, pykm, year, issue){
    var lid=getCookie("LID");
    var table=code+"yearinfo";
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageFormat = 'Navi/Bridge.aspx?LinkType=IssueLink&DBCode={0}&TableName={1}&ShowField=cname&Field=BaseID*year*issue&Value={2}*{3}*{4}';
    var pageFormat_ccjd =  'Navi/Bridge.aspx?LinkType=IssueLink&DBCode={0}&TableName={1}&ShowField=cname&Field=thname&Value={2}{3}{4}'
    code = code.toLowerCase();
    if (code == "cjsf") {
        table = "cjfdyearinfo";
    }
    if (code == "ccjd" || code == "cjfv" || code == "cjfu" || code == "cjfr" || code == "cjft" || code == "cjfx" || code == "cjfy" || code == "cjfz") {
        table="";
        pageFormat = pageFormat_ccjd;
    }    
    var page = pageFormat.format(code, table, pykm,year,issue);
    var url = urlFormat.format(getOuterBaseLink('NAVI'), encodeURIComponent(lid), encodeURIComponent(page));
    return url
}

function getHYJNaviUrl(code, lid) {
    var urlFormat = '{0}loginid.aspx?uid={1}&p={2}';
    var pageformat = 'navi/Bridge.aspx?NaviID=1004&CatalogName=cpfdnavi2&Field=navi178&Value={0}&HYJiDaiMa={0}';
    return urlFormat.format(getOuterBaseLink('NAVI'),encodeURIComponent(lid),encodeURIComponent(pageformat.format(code)));
}

function getPagerHtml(type,cur,len,count){
    var countHtml='<span class="pagetotal">'+TOTAL_COUNT+'</span>';
    var pageHtml='<span class="pagenumber">{0}</span>';
    var strTagFormat = "<a  onclick=\"TurnToPage('{0}','{1}')\" >{2}</a>";
    var strSkipFormat = "<input value=\"{0}\" class='inputnumer' id='pageskip_{2}' onkeydown=\"PageLisner({2},'pageskip_{2}',{1},event)\">/{1}<input type='button' class='numerbtn' onclick=\"SkipPage('{2}','pageskip_{2}',{1})\" value=''/>";
    
    var html=countHtml.format(count);
    count=Number(count);
    len=Number(len);
    cur=Number(cur);
    var pageCount=Math.ceil(count / len);
    if(count>len)
    {        
        var strFirst = "";
        var strPrev = "";
        var strNext = "";
        var strLast = "";
        if (cur > 1) {
            strFirst = strTagFormat.format(type, 1, g_FirstPage);
            strPrev = strTagFormat.format(type, cur - 1, g_PrevPage);
        }      
        if (cur < pageCount) {
            strNext = strTagFormat.format(type, cur + 1, g_NextPage);
            strLast = strTagFormat.format(type, pageCount, g_LastPage);
        }
        var h = strFirst + strPrev + strNext + strLast + strSkipFormat.format(cur, pageCount, type);
        html+=pageHtml.format(h);
    }    
    return html;
}

function TurnToPage(type,page){
    kBlock.turnPage(type,page);
}
function SkipPage(type,id,count){
    var oi = document.getElementById(id);
    if(oi!=null){
        if(oi.value>count)
            oi.value=count;
        kBlock.turnPage(type,oi.value);
    }
}
function PageLisner(type,id,count,event){
    if(event.keyCode==13){
        SkipPage(type,id,count);
    }
}

function getListItem(o){
    //alert(o.Rows);
    if(o.Rows=="")
        o.Rows=NULL_DATA;
    return o.Rows;
}


function getDLUrl(dc,tp,dn,fn){
   var url = "../detail/frame/droplist.aspx?dbcode={0}&reftype={1}&dbname={2}&filename={3}";
    url = url.format(dc,tp,dn,fn);
    return url;
}

function getDropListHtml(o,cc,tp){
    if(o==null)
        return;
    var ops ="";
    var selformat='<select onchange="kBlock.changeDb(\'{0}\',this.value)">{1}</select>';
    var format="<option value='{0}' {1} >{2}</option>";
    var cur="";
    for(var i=0;i<o.length;i++){    
        if(o[i].code==cc)
            cur="selected='true'";
        else
            cur="";
        ops+=format.format(o[i].code,cur,o[i].name);
    }
    var oSel = document.getElementById("sel"+tp);    
    if(oSel==null)
        return;
    oSel.innerHTML = selformat.format(tp,ops);
    //oSel.selectIndex = nc;
    
    //oSel.attachEvent("onchange",function(){alert(tp); return kBlock.changeDb(tp)});
    //oSel.OnChange= function(){alert(tp); return kBlock.changeDb(tp)};
    //oSel.onChanged = function(){alert(tp); return kBlock.changeDb(tp);}
      
}

function getError(){ }



var BLOCK = new Object();
function kBlock(){};
kBlock.add = function(fn, dc, dn, cc, type, l, callurl, callback, error, cid, bid, wait) {
    if (!bid)
        bid = type;
    BLOCK[bid] = new Object();
    BLOCK[bid].first = true;
    BLOCK[bid].cc = cc;
    BLOCK[bid].callback = function(oRecv) {
        callback(oRecv, bid, cid);
    };
    BLOCK[bid].error = function(oRecv) {
        error(oRecv, bid, cid);
    };
    BLOCK[bid].turn = function(page) {
        if(wait)
            wait(bid);
        kSendRequset(callurl(fn, dc, dn, BLOCK[bid].cc, type, page, l), BLOCK[bid].callback, BLOCK[bid].error);
    };
    BLOCK[bid].changeDb = function(sc) {
        BLOCK[bid].cc = sc;
        if (wait)
            wait(bid);
        kSendRequset(callurl(fn, dc, dn, sc, type, 1, l), BLOCK[bid].callback, BLOCK[bid].error);
    };
    kSendRequset(callurl(fn, dc, dn, cc, type, 1, l), BLOCK[bid].callback, BLOCK[bid].error);

};
kBlock.addDL = function(fn, dc, dn, cc, type, l, dlurl, dataurl, cbdl, cbdata, error, wait) {
    BLOCK[type] = new Object();
    BLOCK[type].first = true;
    BLOCK[type].cc = cc;
    BLOCK[type].dl = new Object();
    BLOCK[type].dl.cur = 0;
    BLOCK[type].dl.callback = function(oRecv) {
        if (oRecv.responseText == null)
            return;
        BLOCK[type].dl.data = getJsonObj(oRecv);       
        if(cc=="" && BLOCK[type].dl.data){
            cc=BLOCK[type].dl.data[0].code;
            //alert(cc);
            BLOCK[type].cc=cc;
        }
        kSendRequset(dataurl(fn, dc, dn, cc, type, 1, l), BLOCK[type].callback, BLOCK[type].error);
    }
    BLOCK[type].callback = function(oRecv) {
        if (oRecv.responseText == "") {
            BLOCK[type].dl.cur++;
            if (BLOCK[type].dl.cur < BLOCK[type].dl.data.length - 1)
                kSendRequset(dataurl(fn, dc, dn, BLOCK[type].dl.data[BLOCK[type].dl.cur].code, type, 1, l), BLOCK[type].callback, BLOCK[type].error);
        }
        else {
            if (BLOCK[type].first) {
                var oData = getJsonObj(oRecv);
                cbdl(BLOCK[type].dl.data, oData.SC, type);
            }
            cbdata(oRecv, type);
            BLOCK[type].first = false;
        }
    };
    BLOCK[type].error = function(oRecv) {
        error(oRecv, type);
    };
    BLOCK[type].turn = function(page) {
        if (wait)
            wait(type);
        kSendRequset(dataurl(fn, dc, dn, BLOCK[type].cc, type, page, l), BLOCK[type].callback, BLOCK[type].error);
    };
    BLOCK[type].changeDb = function(sc) {
        BLOCK[type].cc = sc;
        if (wait)
            wait(type);
        kSendRequset(dataurl(fn, dc, dn, sc, type, 1, l), BLOCK[type].callback, BLOCK[type].error);
    };
    kSendRequset(dlurl(dc,type,dn,fn), BLOCK[type].dl.callback, BLOCK[type].error);
};


kBlock.changeDb = function(bid,dc){
    BLOCK[bid].changeDb(dc);
}
kBlock.turnPage=function(bid,page){
     BLOCK[bid].turn(page);
}
kBlock.IsFirstLoad = function(bid){
    return BLOCK[bid].first;
}
kBlock.Loaded = function(bid){
    return BLOCK[bid].first=false;
}

function ImageLoader(url,cid,errurl){
    var img=new Image();
    img.onload=function(){
        var container= document.getElementById(cid);
        if(container)
            container.appendChild(img);
    };
    img.onerror=function(){
        img.src=errurl;
    }
    img.src=url;
}

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

function getJsonObj(oReq){
     if(oReq==null)
            return null;
        var d=oReq.responseText;
        if(d==null||d=="")
            return null;
    //alert(d);       
    return eval("("+d+")");
}
function getCookie(sName){
    var sRE = "[;]*[\s]*"+sName+"=([^;]*)";
    var oRE = new RegExp(sRE);
    //alert(document.cookie);
    
    if(oRE.test(document.cookie)){
        return RegExp["$1"];
    }else{
        return "";
    }
}
function kSendRequset(sUrl, OnDataReceive,OnError) {
    var oReq = zXmlHttp.createRequest();
    if (oReq != null) {        
        oReq.open("get", sUrl, true);
        oReq.onreadystatechange = function() {
            if (oReq.readyState == 4) {
                if (oReq.status == 200) {
                    OnDataReceive(oReq);
                }
                else {
                    OnError(oReq);
                }
            }
        }
        oReq.send(null);
    }
};
var zXml = {
    useActiveX: (typeof ActiveXObject != "undefined"),
    useDom: document.implementation && document.implementation.createDocument,
    useXmlHttp: (typeof XMLHttpRequest != "undefined")
};
zXml.ARR_XMLHTTP_VERS = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0"];
zXml.ARR_DOM_VERS = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
function zXmlHttp() {}
zXmlHttp.createRequest = function() {
    if (zXml.useXmlHttp) {
        return new XMLHttpRequest();
    } else if (zXml.useActiveX) {
        if (!zXml.XMLHTTP_VER) {
            for (var i = 0; i < zXml.ARR_XMLHTTP_VERS.length; i++) {
                try {
                    new ActiveXObject(zXml.ARR_XMLHTTP_VERS[i]);
                    zXml.XMLHTTP_VER = zXml.ARR_XMLHTTP_VERS[i];
                    break;
                } catch(oError) {;
                }
            }
        }
        if (zXml.XMLHTTP_VER) {
            return new ActiveXObject(zXml.XMLHTTP_VER);
        } else {
            throw new Error("Could not create XML HTTP Request.");
        }
    } else {
        throw new Error("Your browser doesn't support an XML HTTP Request.");
    }
};
zXmlHttp.isSupported = function() {
    return zXml.useXmlHttp || zXml.useActiveX;
};
function zXmlDom() {}
zXmlDom.createDocument = function() {
    if (zXml.useDom) {
        var oXmlDom = document.implementation.createDocument("", "", null);
        oXmlDom.parseError = {
            valueOf: function() {
                return this.errorCode;
            },
            toString: function() {
                return this.errorCode.toString()
            }
        };
        oXmlDom.__initError__();
        oXmlDom.addEventListener("load",
        function() {
            this.__checkForErrors__();
            this.__changeReadyState__(4);
        },
        false);
        return oXmlDom;;
    } else if (zXml.useActiveX) {
        if (!zXml.DOM_VER) {
            for (var i = 0; i < zXml.ARR_DOM_VERS.length; i++) {
                try {
                    new ActiveXObject(zXml.ARR_DOM_VERS[i]);
                    zXml.DOM_VER = zXml.ARR_DOM_VERS[i];
                    break;
                } catch(oError) {;
                }
            }
        }
        if (zXml.DOM_VER) {
            return new ActiveXObject(zXml.DOM_VER);
        } else {
            throw new Error("Could not create XML DOM document.");
        }
    } else {
        throw new Error("Your browser doesn't support an XML DOM document.");
    }
};
zXmlDom.isSupported = function() {
    return zXml.useDom || zXml.useActiveX;
};
var oMozDocument = null;
if (typeof XMLDocument != "undefined") {
    oMozDocument = XMLDocument;
} else if (typeof Document != "undefined") {
    oMozDocument = Document;
}
if (oMozDocument && !window.opera && !zXml.useActiveX) {
    oMozDocument.readyState = 0;
    oMozDocument.prototype.onreadystatechange = null;
    oMozDocument.prototype.__changeReadyState__ = function(iReadyState) {
        this.readyState = iReadyState;
        if (typeof this.onreadystatechange == "function") {
            this.onreadystatechange();
        }
    };
    oMozDocument.prototype.__initError__ = function() {
        this.parseError.errorCode = 0;
        this.parseError.filepos = -1;
        this.parseError.line = -1;
        this.parseError.linepos = -1;
        this.parseError.reason = null;
        this.parseError.srcText = null;
        this.parseError.url = null;
    };
    oMozDocument.prototype.__checkForErrors__ = function() {
        if (this.documentElement.tagName == "parsererror") {
            var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number(\d+),Column(\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;
            reError.test(this.xml);
            this.parseError.errorCode = -999999;
            this.parseError.reason = RegExp.$1;
            this.parseError.url = RegExp.$2;
            this.parseError.line = parseInt(RegExp.$3);
            this.parseError.linepos = parseInt(RegExp.$4);
            this.parseError.srcText = RegExp.$5;
        }
    };
    oMozDocument.prototype.loadXML = function(sXml) {
        this.__initError__();
        this.__changeReadyState__(1);
        var oParser = new DOMParser();
        var oXmlDom = oParser.parseFromString(sXml, "text/xml");
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        for (var i = 0; i < oXmlDom.childNodes.length; i++) {
            var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
            this.appendChild(oNewNode);
        }
        this.__checkForErrors__();
        this.__changeReadyState__(4);
    };
    oMozDocument.prototype.__load__ = oMozDocument.prototype.load;
    oMozDocument.prototype.load = function(sURL) {
        this.__initError__();
        this.__changeReadyState__(1);
        this.__load__(sURL);
    };
    Node.prototype.__defineGetter__("xml",
    function() {
        var oSerializer = new XMLSerializer();
        return oSerializer.serializeToString(this, "text/xml");
    });
    Node.prototype.__defineGetter__("text",
    function() {
        var sText = "";
        for (var i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i].hasChildNodes()) {
                sText += this.childNodes[i].text;
            } else {
                sText += this.childNodes[i].nodeValue;
            }
        }
        return sText;
    });
}
function zXslt() {}
zXslt.transformToText = function(oXml, oXslt) {
    if (typeof XSLTProcessor != "undefined") {
        var oProcessor = new XSLTProcessor();
        oProcessor.importStylesheet(oXslt);
        var oResultDom = oProcessor.transformToDocument(oXml);
        var sResult = oResultDom.xml;
        if (sResult.indexOf("<transformiix:result") > -1) {
            sResult = sResult.substring(sResult.indexOf(">") + 1, sResult.lastIndexOf("<"));
        }
        return sResult;;
    } else if (zXml.useActiveX) {
        return oXml.transformNode(oXslt);
    } else {
        throw new Error("No XSLT engine found.");
    }
};
function zXPath() {}
zXPath.selectNodes = function(oRefNode, sXPath, oXmlNs) {
    if (typeof XPathEvaluator != "undefined") {
        oXmlNs = oXmlNs || {};
        var nsResolver = function(sPrefix) {
            return oXmlNs[sPrefix];
        };
        var oEvaluator = new XPathEvaluator();
        var oResult = oEvaluator.evaluate(sXPath, oRefNode, nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var aNodes = new Array;
        if (oResult != null) {
            var oElement = oResult.iterateNext();
            while (oElement) {
                aNodes.push(oElement);
                oElement = oResult.iterateNext();
            }
        }
        return aNodes;
    } else if (zXml.useActiveX) {
        if (oXmlNs) {
            var sXmlNs = "";
            for (var sProp in oXmlNs) {
                sXmlNs += "xmlns:" + sProp + "=\'" + oXmlNs[sProp] + "\' ";
            }
            oRefNode.ownerDocument.setProperty("SelectionNamespaces", sXmlNs);
        };
        return oRefNode.selectNodes(sXPath);
    } else {
        throw new Error("No XPath engine found.");
    }
};
zXPath.selectSingleNode = function(oRefNode, sXPath, oXmlNs) {
    if (typeof XPathEvaluator != "undefined") {;
        oXmlNs = oXmlNs || {};
        var nsResolver = function(sPrefix) {
            return oXmlNs[sPrefix];
        };
        var oEvaluator = new XPathEvaluator();
        var oResult = oEvaluator.evaluate(sXPath, oRefNode, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (oResult != null) {
            return oResult.singleNodeValue;
        } else {
            return null;
        };
    } else if (zXml.useActiveX) {
        if (oXmlNs) {
            var sXmlNs = "";
            for (var sProp in oXmlNs) {
                sXmlNs += "xmlns:\'" + sProp + "=" + oXmlNs[sProp] + "\' ";
            }
            oRefNode.ownerDocument.setProperty("SelectionNamespaces", sXmlNs);
        };
        return oRefNode.selectSingleNode(sXPath);
    } else {
        throw new Error("No XPath engine found.");
    }
};
function zXMLSerializer() {}
zXMLSerializer.prototype.serializeToString = function(oNode) {
    var sXml = "";
    switch (oNode.nodeType) {
    case 1:
        sXml = "<" + oNode.tagName;
        for (var i = 0; i < oNode.attributes.length; i++) {
            sXml += " " + oNode.attributes[i].name + "=\"" + oNode.attributes[i].value + "\"";
        }
        sXml += ">";
        for (var i = 0; i < oNode.childNodes.length; i++) {
            sXml += this.serializeToString(oNode.childNodes[i]);
        }
        sXml += "</" + oNode.tagName + ">";
        break;
    case 3:
        sXml = oNode.nodeValue;
        break;
    case 4:
        sXml = "<![CDATA[" + oNode.nodeValue + "]]>";
        break;
    case 7:
        sXml = "<?" + oNode.nodevalue + "?>";
        break;
    case 8:
        sXml = "<!--" + oNode.nodevalue + "-->";
        break;
    case 9:
        for (var i = 0; i < oNode.childNodes.length; i++) {
            sXml += this.serializeToString(oNode.childNodes[i]);
        }
        break;
    };
    return sXml;
};