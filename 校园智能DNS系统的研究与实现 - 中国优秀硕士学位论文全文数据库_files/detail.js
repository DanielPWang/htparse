var StartArray = new Array();
var FrameArray = new Array();
var BLOCK = new Object();

function RegisterFrame(id, curcode, src) {
    curcode = curcode.toLowerCase();
    if (curcode == "ccjd" || curcode == "cjsf" || curcode == "fcjd")
        curcode = "cjfq";
    else if (curcode == "cdsf" || curcode.indexOf('cdbf')>-1)
        curcode = "cdfd";
    else if (curcode == "cmsf" || curcode == "cmzd" || curcode.indexOf('cmbf') > -1)
        curcode = "cmfd";      
    src += "&curdbcode=" + curcode;
    var listv = document.getElementById("listv").value;
    src += "&vl="+listv;


    var frameformat = '<iframe id="{0}" name="{0}" width="100%" height="0" frameborder="no" scrolling="no" src=""></iframe> ';
    document.write(frameformat.format(id));
    var frame = new Object();
    frame.id = id;
    frame.src = src;
    FrameArray.push(frame);
}

function getDataUrl(fn,dc,dn,sc,tp,p,l){
    var url = "/kcms/detail/frame/asynlist.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
    url = url.format(dc,dn, encodeURIComponent(fn),sc,p,tp,l);
    return url;
}

function getlDataUrl(fn,dc,dn,sc,tp,p,l){
    var url = "/kcms/detail/frame/listlite.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
    url = url.format(dc,dn,fn,sc,p,tp,l);
    return url;
}

function getJDataUrl(fn,dc,dn,sc,tp,p,l){
    var url = "/kcms/detail/frame/jdata.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
    url = url.format(dc,dn,fn,sc,p,tp,l);
    return url;
}

function getJsonUrl(fn, dc, dn, sc, tp, p, l) {
    var url = "/kcms/detail/frame/json.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
    url = url.format(dc, dn, fn, sc, p, tp, l);
    return url;
}

function getKMCUrl(fn, dc, dn, sc, tp, p, l) {
    var url = "/kcms/detail/frame/kmc.aspx?dbcode={0}&dbname={1}&filename={2}";
    url = url.format(dc, dn, fn);
    return url;
}



function getPicUrl(pykm,year,issue){
    var base=getOuterBaseLink('COVER');
    var url="";
    var url1="cjfd/small/{0}.jpg";
    var url2="cjfd/small/{0}/{0}{1}{2}.jpg";
    if(year&&issue){
        url=url2.format(pykm,year,issue);
    }
    else{
        url=url1.format(pykm);
    }   
    return base+url;
}

function getPicErrUrl(){
    return "/kcms/detail/resource/gb/images/nopic1.gif";
}

function getBaseInfoUrl(dbcode,pykm){
    var url = "/kcms/detail/frame/journalinfo.aspx?pykm={0}&dbcode={1}";
    url=url.format(pykm,dbcode);
    return url;
}
function getHYJCheckUrl(code) {
    var url = "/kcms/detail/frame/hyjinfo.aspx?code={0}";
    url = url.format(code);
    return url;
}
function getFileNameUrl(fn) {
    var url = "/kcms/detail/block/getfilename.aspx?filename={0}";
    url = url.format(fn);
    return url;
}


function RegisterJDLBk(fn,dn,dc,cc,t,cid,did){
     var obj = new Object();
    obj.SendRequest=function(){
    kBlock.addDL(fn, dc, dn, cc, t, 10, getDLUrl, getJDataUrl, getDropListHtml, getListObj, getError, getWait);
    }
    StartArray.push(obj);
}

function RegisterJBk(fn,dn,dc,cc,t,cid,bid,l){
    var obj = new Object();
    obj.SendRequest=function(){
    kBlock.add(fn, dc, dn, cc, t, l, getJDataUrl, getListObj, getError, cid, bid, getWait);
    }
    StartArray.push(obj);
}
function RegCCNDWeb(fn, dn,dc,t,cid) {
    var obj = new Object();
    obj.SendRequest = function() {
        kBlock.add(fn, dc, dn, dc, t, 1, getJsonUrl, function(oReq, t) {
            var o = getJsonObj(oReq);
            if (o == null || o.Count == 0)
                return;
            var web = o.Rows[0].WEB;
            if (web == "") return;
            var htmlFormat = "<a href='{1}' target='_blank'>{0}</a>";
            var html = "";
            var sites = web.split(';');
            for (var i = 0; i < sites.length; i++) {
                if (sites[i] == '') continue;
                if (i > 0) html += ';';
                var links = sites[i].split(',');
                if (links.length != 2)
                    continue
                html += htmlFormat.format(links[0], links[1]);

            }
            if (html == "") return;
            if (document.getElementById("func" + t))
                document.getElementById("func" + t).innerHTML = html;
            if (cid && document.getElementById(cid))
                document.getElementById(cid).style.display = "block";
        }, getError);
    }
    StartArray.push(obj);
}


function getListObj(oReq,t,cid){
    var o = getJsonObj(oReq)
    //alert(o);
    if(o==null || (o.Count==0 && kBlock.IsFirstLoad(t)))
        return;   
    var html="";    
    html+=getListItem(o);  
    if(document.getElementById("func"+t))
        document.getElementById("func"+t).innerHTML= html;
    if(document.getElementById("page"+t))
        document.getElementById("page"+t).innerHTML= getPagerHtml(t,o.Page,o.PL,o.Count); 
    if(document.getElementById("title"+t))
         document.getElementById("title"+t).innerHTML= o.SName; 
    if(document.getElementById("block"+t))
        document.getElementById("block"+t).style.display="block";
    if(cid && document.getElementById(cid))
       document.getElementById(cid).style.display="block";


}

function getWait(t) {
    if (document.getElementById("func" + t))
        document.getElementById("func" + t).innerHTML = "正在查找..."; //WAIT
}

function RegisterSBlock(fn,dn,dc,cc,t,g){
    var obj = new Object();
    obj.SendRequest=function(){
        kBlock.add(fn,dc,dn,cc,t,10,getDataUrl,getListHtml,getError,g);
    }
    StartArray.push(obj);
}

function getListHtml(oReq,t,g){
    var id = "func"+t;
    var con = document.getElementById(id);
    if(con==null)
        return;     
     if(oReq.responseText!=""){        
        con.innerHTML = oReq.responseText;
        con.style.display="block";
        if(g && document.getElementById(g)){
            document.getElementById(g).display="block";
        }
    }
}
function RegImage(pykm,year,issue,cid){
    var obj=new Object();
    obj.SendRequest= function(){        
        ImageLoader(getPicUrl(pykm,year,issue),cid,getPicErrUrl());
    };
    StartArray.push(obj);
}
function RegDujia(dbcode,pykm,year,issue,cid){
    var obj=new Object();
    obj.SendRequest= function(){
        ImageLoader(getPicUrl(pykm,year,issue),cid,getPicErrUrl());
        kSendRequset(getBaseInfoUrl(dbcode,pykm),function(oRecv){
           var obj= getJsonObj(oRecv);
           if(obj!=null){
                if(obj.IsT.toLowerCase()=='true'){
                    document.getElementById("dujiaPic").style.display="block";
                    document.getElementById("dujiaGold").style.display="inline-block";
                }
           }
        },function(oRecv){});
    }
    StartArray.push(obj);
}


function RegCheckJournal(dbcode,pykm,year,issue){
    var obj=new Object();
    var format="<a target='_blank' href='{0}'>{1}</a>";
    obj.SendRequest= function(){        
        kSendRequset(getBaseInfoUrl(dbcode,pykm),function(oRecv){
           var obj= getJsonObj(oRecv);
           if(obj!=null){
                if(obj.pykm.toLowerCase()==pykm.toLowerCase()){
                    var name=document.getElementById("jname");
                    var name_en=document.getElementById("jnameen");
                    var nq = document.getElementById("jnq");
                    if(name)
                        name.innerHTML = format.format(getNaviLink(dbcode,pykm),name.innerHTML);
                    if(name_en)
                        name_en.innerHTML = format.format(getNaviLink(dbcode,pykm),name_en.innerHTML);
                    if(nq)
                        nq.innerHTML = format.format(getNaviIssueLink(dbcode,pykm,year,issue),nq.innerHTML);                    
                }
           }
        },function(oRecv){});
    }
    StartArray.push(obj);
}

function RegCheckHYJ(hyjcode,lid) {
    var obj = new Object();
    var format = "<a target='_blank' href='{0}'>{1}</a>";
    obj.SendRequest = function() {
    kSendRequset(getHYJCheckUrl(hyjcode), function(oRecv) {
            var obj = getJsonObj(oRecv);
            if (obj != null) {
                if (obj.HYJCode.toLowerCase() == hyjcode.toLowerCase()) {
                    var name = document.getElementById("jname");
                    if (name)
                        name.innerHTML = format.format(getHYJNaviUrl(hyjcode,lid), name.innerHTML);                  
                }
            }
        }, function(oRecv) { });
    }
    StartArray.push(obj);
}

function RegFileName(fn,aid,cid) {
    var obj = new Object();
    var url = 'detail.aspx?filename={0}&dbname={1}&dbcode=CJFQ';
    obj.SendRequest = function() {
        kSendRequset(getFileNameUrl(fn), function(oRecv) {
            var obj = getJsonObj(oRecv);
            if (obj != null) {
                if (obj.fn != "" && obj.dn != "") {
                    url = url.format(obj.fn, obj.dn);
                    document.getElementById(aid).href = url;
                    document.getElementById(cid).style.display = "";
                }
            }
        }, function(oRecv) { });
    }
    StartArray.push(obj);
}


function RegisterKMC(fn,dn,dc,cc,t){
    var obj = new Object();
    obj.SendRequest=function(){
        kBlock.add(fn,dc,dn,cc,t,10,getKMCUrl,getKMCHtml,null);
    }
    StartArray.push(obj);
}

function RegAd(id, area, kw, pykm, sc,ti) {
    link = getOuterBaseLink("AD");
    if (link == '')
        return;
    var url = link + "GetADInfo.aspx?area={0}&kw={1}&pykm={2}&sc={3}&title={4}";
    url = url.format(area,encodeURIComponent(kw),pykm,sc,encodeURIComponent(ti))
    var obj = new Object();
    obj.SendRequest=function(){
        var o=document.getElementById(id);        
        if(o){
            var loadfunc=function(){o.style.display="block";};
            if(o.attachEvent){o.attachEvent('onload',loadfunc)}
            else{o.onload=loadfunc;}
            o.src=url;
        }
    };
    StartArray.push(obj);
}
function getKMCHtml(oReq,t){
    //alert(oReq.responseText);
    var o = getJsonObj(oReq);
    var htmlcn = "";
    var htmlen = "";
    var metalist = new Object();
    for (var i = 0; i < o.Rows.length; i++) {
        var oItem = o.Rows[i];
        if (oItem.KMC_CN != "") { if (metalist[oItem.KMC_CN] == undefined) { metalist[oItem.KMC_CN] = 1; htmlcn += getKmLink(o.PC, oItem.KMC_CN,oItem.KMC_CODE); if (i != o.Rows.length - 1) { htmlcn += "；"; } } }
        if (oItem.KMC_EN != "") { if (metalist[oItem.KMC_EN] == undefined) { metalist[oItem.KMC_EN] = 1; htmlen += getKmLink(o.PC, oItem.KMC_EN, oItem.KMC_CODE); if (i != o.Rows.length - 1) { htmlen += "；"; } } }     
    }
    var oCn = document.getElementById("kmccontentcn");
    var oCnBlock = document.getElementById("kmccn");
    var oEn = document.getElementById("kmccontenten");
    var oEnBlock = document.getElementById("kmcen");
    if (oCn && oCnBlock && htmlcn != "") { oCn.innerHTML = htmlcn; oCnBlock.style.display = ""; }
    if (oEn && oEnBlock && htmlen != "") { oEn.innerHTML = htmlen; oEnBlock.style.display = ""; }

}

function RegItem(fn,t,b,c) {
    var obj = new Object();
    obj.SendRequest = function() {
        kBlock.add(fn, "CJFQ", "", "CJFQ",t,1, getJsonUrl, getDataItem, null, c, b);
    }
    StartArray.push(obj);
}

function getDataItem(oReq,b,c) {
    var o = getJsonObj(oReq);
    if (o == null) return;
    //alert(oReq.responseText);
    if (o.Rows.length == 0) return;
    o = o.Rows[0][c];
    document.getElementById(c).innerHTML += o;
    document.getElementById(b).style.display = "block";
}

function RegisterStartLoad(startFunc) {
    StartArray.push(startFunc);
}

function startLoad() {
    for (var i = 0; i < StartArray.length; i++) {
        StartArray[i].SendRequest();
    }
    for (i = 0; i < FrameArray.length; i++) {
        document.getElementById(FrameArray[i].id).src = FrameArray[i].src;
    }
    FrameArray = null;    
}
window.onload = startLoad;


function CallRequest(cb) {
    var obj = new Object();
    obj.SendRequest = function() {
        cb();
    }
    StartArray.push(obj);
}

function _sendRequset(sUrl, OnDataReceive, obj) {
    var oRequest = zXmlHttp.createRequest();
    if (oRequest != null) {
        //alert(sUrl)
        oRequest.open("get", sUrl, true);
        oRequest.onreadystatechange = function() {
            if (oRequest.readyState == 4) {
                if (oRequest.status == 200) {
                    OnDataReceive(oRequest, obj);
                }
            }
        };
        oRequest.send(null);
    }
}

function getNodeValue(oRoot, nodeName) {
    if (oRoot == null)
        return "";
    var oNodes = oRoot.getElementsByTagName(nodeName);
    if (oNodes == null)
        return "";
    if (oNodes.length > 0) {
        return oNodes[0].text;
    }
    return "";
}

function RefCountClass() {
    this.DataUrl = null;
    this.FileName = null;
    this.DbCode = null;
    this.DbName = null;
    this.Year = null;
    this.Link = null;
    this.Target = null;
    this.TargetLink = null;

    //listv
    this.ParamListV =document.getElementById("listv").value;

    this.getRefChartDataUrl = function() {
        var url = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrlBase = function() {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName +"&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrl = function(reftype) {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + reftype + "&vl=" + this.ParamListV;
        return url;
    }
    this.setRefLinkResult = function(reftype, count) {
        // alert(this.Target);
        var nCount = Number(count);
        if (nCount < 1) {
            return;
        }
        var linkid = "rl" + reftype;
        var countid = "rc" + reftype;
        var oA = document.getElementById(linkid);
        var oC = document.getElementById(countid);
        oA.href = this.getRefUrl(reftype);
        oA.target = this.Target;
        var sFunc = "return ChangeReferType('" + reftype + "')";
        oA.onclick = Function(sFunc);
        oC.innerHTML = "(" + count + ")";
        if (this.TargetLink == null) {
            this.TargetLink = oA.href;
            document.getElementById(this.Target).src = this.TargetLink;
            oA.className = "ReferLinkOn";
        }
    }
    this.setTotalCount = function(oRef) {
        this.setRefLinkResult(1, oRef.REFERENCE);
        this.setRefLinkResult(2, oRef.SUB_REFERENCE);
        this.setRefLinkResult(3, oRef.CITING);
        this.setRefLinkResult(4, oRef.SUB_CITING);
        this.setRefLinkResult(5, oRef.CO_CITING);
        this.setRefLinkResult(6, oRef.CO_CITED);
    }
    this.OnRefChartDataReceive = function(oXmlDom, obj) {
        var strJson = oXmlDom.responseText;
        if (strJson == "") {
            return;
        }
        var oRef = eval("(" + strJson + ")");       
        obj.setTotalCount(oRef);

    }
    this.SendRequest = function() {
        _sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this);
    }
};

function RefYearClass() {
    this.DataUrl = null;
    this.FileName = null;
    this.DbCode = null;
    this.DbName = null;
    this.Year = null;
    this.Link = null;
    this.Target = null;
    this.TargetLink = null;

    this.ParamListV =document.getElementById("listv").value;
    this.getRefChartDataUrl = function() {
        var url = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrlBase = function() {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrl = function(reftype) {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + reftype + "&vl=" + this.ParamListV;
        return url;
    }
  
    this.setTimeItem = function(oItem, year, type) {
        var nCount = Number(getNodeValue(oItem, type));
        if (nCount > 0) {
            //alert(type);
            if(this.Year!=year)
                AddToTimeArray(year, nCount, type);//依赖TimeAxis.js
            else
                AddCurTime(nCount,type);
                 
        }
    }
    this.setYearItem = function(oItem) {
        var year = getNodeValue(oItem, "YEAR");
        this.setTimeItem(oItem, year, "REFERENCE");
        this.setTimeItem(oItem, year, "SUB_REFERENCE");
        this.setTimeItem(oItem, year, "CITING");
        this.setTimeItem(oItem, year, "SUB_CITING");
    }
    this.setYearCount = function(oYears) {
        var oItems = oYears.getElementsByTagName("Item");
        for (var i = 0; i < oItems.length; i++) {
            this.setYearItem(oItems[i]);
        }
        if (this.Year != '' && this.Year != null) {
            //alert(this.Year);
            RenderTimeAxis(this.Year, this.getRefUrlBase(), this.Target);
        }
    }
    this.OnRefChartDataReceive = function(oXmlDom, obj) {

        //alert(oXmlDom);
        var oRoot = oXmlDom.responseXML.documentElement;
        if (oRoot == null) return;
        var strRootName = oRoot.nodeName;
        if (strRootName == "Error") {
            alert(strRootName + ":" + oRoot.text);
            return;
        }
        var oYears = oRoot.getElementsByTagName("YEARCOUNT");
        if (oYears == null) return;
        obj.setYearCount(oYears[0]);
    }
    
    this.SendRequest = function() {
        _sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this);
    }
};


function RefChartObj() {
    this.DataUrl = null;
    this.FileName = null;
    this.DbCode = null;
    this.DbName = null;
    this.Year = null;
    this.Link = null;
    this.Target = null;
    this.TargetLink = null;
    this.ParamListV =  document.getElementById("listv").value;
    this.getRefChartDataUrl = function() {
        var url = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrlBase = function() {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
        return url;
    }
    this.getRefUrl = function(reftype) {
        var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + reftype + "&vl=" + this.ParamListV;
        return url;
    }
    this.setRefLinkResult = function(reftype, count) {
        // alert(this.Target);
        var nCount = Number(count);
        if (nCount < 1) {
            return;
        }
        var linkid = "rl" + reftype;
        var countid = "rc" + reftype;
        var oA = document.getElementById(linkid);
        var oC = document.getElementById(countid);
        oA.href = this.getRefUrl(reftype);
        oA.target = this.Target;
        var sFunc = "return ChangeReferType('" + reftype + "')";
        oA.onclick = Function(sFunc);
        oC.innerHTML = "(" + count + ")";
        if (this.TargetLink == null) {
            this.TargetLink = oA.href;
            document.getElementById(this.Target).src = this.TargetLink;
            oA.className = "ReferLinkOn";
        }
    }
    this.setTotalCount = function(oTotal) {
        this.setRefLinkResult(1, getNodeValue(oTotal, "REFERENCE"));
        this.setRefLinkResult(2, getNodeValue(oTotal, "SUB_REFERENCE"));
        this.setRefLinkResult(3, getNodeValue(oTotal, "CITING"));
        this.setRefLinkResult(4, getNodeValue(oTotal, "SUB_CITING"));
        this.setRefLinkResult(5, getNodeValue(oTotal, "CO_CITING"));
        this.setRefLinkResult(6, getNodeValue(oTotal, "CO_CITED"));
    }
    this.setTimeItem = function(oItem, year, type) {
        var nCount = Number(getNodeValue(oItem, type));
        if (nCount > 0) {
            //alert(type);
            AddToTimeArray(year, nCount, type); //依赖TimeAxis.js
        }
    }
    this.setYearItem = function(oItem) {
        var year = getNodeValue(oItem, "YEAR");
        this.setTimeItem(oItem, year, "REFERENCE");
        this.setTimeItem(oItem, year, "SUB_REFERENCE");
        this.setTimeItem(oItem, year, "CITING");
        this.setTimeItem(oItem, year, "SUB_CITING");

    }
    this.setYearCount = function(oYears) {
        var oItems = oYears.getElementsByTagName("Item");
        for (var i = 0; i < oItems.length; i++) {
            this.setYearItem(oItems[i]);
        }
        if (this.Year != '' && this.Year != null) {
            //alert(this.Year);
            RenderTimeAxis(this.Year, this.getRefUrlBase(), this.Target);
        }
    }
    this.OnRefChartDataReceive = function(oXmlDom, obj) {

        //alert(oXmlDom); 
        var oRoot = oXmlDom.responseXML.documentElement;
        if (oRoot == null) return;
        var strRootName = oRoot.nodeName;
        if (strRootName == "Error") {
            alert(strRootName + ":" + oRoot.text);
            return;
        }
        var oTotal = oRoot.getElementsByTagName("TOTAL");
        if (oTotal == null) return;
        obj.setTotalCount(oTotal[0]);

        var oYears = oRoot.getElementsByTagName("YEARCOUNT");
        if (oYears == null) return;
        obj.setYearCount(oYears[0]);
    }
    this.SendRequest = function() {
        _sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this);
    }
}

function SetRefChartData(dbcode, filename, dbname, year) {
    var oRefChart = new RefChartObj();
    oRefChart.DataUrl = "/kcms/detail/block/refchartdata.aspx";
    oRefChart.DbCode = dbcode;
    oRefChart.FileName = filename;
    oRefChart.Link = "/kcms/detail/frame/list.aspx";
    oRefChart.Target = "frame1";
    if (year == null || year == '') {
        //        
    }
    oRefChart.Year = year;
    RegisterStartLoad(oRefChart);
}

function SetRefChartDataEx(dbcode, filename, dbname, year) {
    var oRefCount = new RefCountClass();
    oRefCount.DataUrl = "/kcms/detail/block/refcount.aspx";
    oRefCount.DbCode = dbcode;
    oRefCount.FileName = filename;
    oRefCount.DbName = dbname;
    oRefCount.Link = "/kcms/detail/frame/list.aspx";
    oRefCount.Target = "frame1";
    oRefCount.Year = year;
    RegisterStartLoad(oRefCount);

    var oRefYear = new RefYearClass();
    oRefYear.DataUrl = "/kcms/detail/block/refyear.aspx";
    oRefYear.DbCode = dbcode;
    oRefYear.FileName = filename;
    oRefYear.Link = "/kcms/detail/frame/list.aspx";
    oRefYear.Target = "frame1";
    oRefYear.Year = year;
    RegisterStartLoad(oRefYear);
}

function OpenUrl(url) {
    window.open(url);
}

function HideAd(resizeid, adid) {
    document.getElementById(adid).style.display = "none";
    document.getElementById(resizeid).style.width = "100%";
}



//标红
 function ReplaceRedMark(text) {     
     var prefix = /###/g;
     var postfix = /\$\$\$/g;
     var pair = /###[^#]+\$\$\$/g;
     var title = /title=\"[^\"]*\"/gi;
     text = text.replace(title, function(sMatch) {
         sMatch = sMatch.replace(prefix, "");
         sMatch = sMatch.replace(postfix, "");
         return sMatch;
     });
     text = text.replace(pair, function(sMatch) {
        sMatch = sMatch.replace(prefix, "<font class='Mark'>");
        sMatch = sMatch.replace(postfix, "</font>");
        return sMatch;
     })
     text = text.replace(prefix, "");
     text = text.replace(postfix, "");
     return text;
 }

 //快照
 var g_ssenable = false;
 function EnableSnapShot(obj) {
     obj.value = '';
     g_ssenable = true;
 }

 function StartSnapShotSearch(dbcode, fn, dbname) {
     var urlFormat = "block/snapshotdata.aspx?fn={0}&dn={1}&dc={2}&kw={3}";
     var kw = document.getElementById("SnapshotSearchItem").value;
     if (kw == "" || g_ssenable==false)
         return alert(SNAPSHOT_ALERT); //SNAPSHOT_ALERT
     var url = urlFormat.format(fn, dbname, dbcode, encodeURIComponent(kw));
     kSendRequset(url,
        function(oResult) {
            var text = oResult.responseText
            if (text != "") {
                var el = document.getElementById("divSnapshotSearchText");
                var el2 = document.getElementById("divSnapshotSearchContent");
                el2.style.display = 'block';
                text = ReplaceRedMark(text);
                el.innerHTML = text;
            }
        },
        function(oResult) { });
 }

 function ResetSnapShot() {
     var el2 = document.getElementById("divSnapshotSearchContent");
     el2.style.display = 'none';
     var el = document.getElementById("divSnapshotSearchText");
     el.innerHTML = "";
     check = 0;
     document.getElementById("SnapshotSearchItem").value = "";
 }
 
 //广告
function ShowAd(ad, hide) {
    var target = document.getElementById(ad);
    var source = document.getElementById(hide);
    if(target==null ||source ==null )  
        return;
    var content = source.innerHTML;
    if(content.length<200)
        return;
     target.innerHTML = content;
     target.style.display = "block";     
}


function SearchLink(value, type, dbcode, filename) {
    var linkformat = "search.aspx?dbcode={0}&sfield={1}&skey={2}&filename={3}";
    var htmlformat = '<a href="{0}" target="_blank">{1}</a>';
    var valuelist = value.split(';');
    var html = "";
    for (var i = 0; i < valuelist.length; i++) {
        if (valuelist[i] != "") {
            html += htmlformat.format(linkformat.format(dbcode, type, encodeURIComponent(valuelist[i]), filename), valuelist[i]);
            if (i != valuelist.length - 1) {
                html += "；";
            }
        }
    }
    document.write(html);
}

function kwPop(kw, dc, code, event) {
    g_Keep1++;   
    var cat = 'kmc';
    if (code=="") {
        cat = 'kw';
    }
    var oTargt = event.srcElement ? event.srcElement : event.target;
    var oPop = document.getElementById("kwPop");
    if (!oPop) return;
    var linkformat = "search.aspx?dbcode={0}&sfield={1}&skey={2}&code={3}";
    var htmlformat = '<a href="{0}" target="_blank">{1}</a>';
    var linkMeta = htmlformat.format(linkformat.format(dc, 'meta', encodeURIComponent(kw),""), '• 知识元');
    var linkRefbook = GetRefBookLink(encodeURIComponent(kw));
    if (linkRefbook != "")
        linkRefbook = htmlformat.format(linkRefbook, '• 工具书');
    var linkFile = htmlformat.format(linkformat.format(dc, cat, encodeURIComponent(kw),code), '• 文献检索');
    oPop.innerHTML = linkMeta +linkRefbook+ linkFile;
    oPop.style.left = getElementLeft(oTargt) + "px";
    oPop.style.top = Number(getElementTop(oTargt)) + 13 + "px";
    setTimeout(function() {
        oPop.style.display = "block";
    }, 100);
    
}
var g_Keep1 = 0;
var g_Keep2 = 0;
function kwHide(num,event) {
    if (num == 1)
        g_Keep1--;
    if (num == 2)
        g_Keep2--;    
    var oPop = document.getElementById("kwPop");
    if (!oPop) return;
    var e = event;
    var tg = (document.all) ? e.srcElement : e.target;
    var reltg = (document.all) ? e.toElement : e.relatedTarget;
    setTimeout(function() {
        if ((num == 2 && g_Keep1 < 1)) {                     
            if (tg.nodeName != 'DIV') return;         
            while (reltg != tg && reltg.nodeName!= 'BODY')
                reltg = reltg.parentNode
            if (reltg == tg) return;
            oPop.style.display = "none";
        }
        else if ((num == 1 && g_Keep2 < 1))
            oPop.style.display = "none";
    }, 100);
}
function kwKeep() {
    g_Keep2++;
}


function RegisterKw(dc,id) {
    var obj = new Object();
    obj.SendRequest = function() {
        var oCn = document.getElementById(id);
        if (!oCn) return;        
        var wkList = oCn.innerHTML.split('；');
        var html = "";
        for (var i = 0; i < wkList.length; i++) {
            wkList[i]=wkList[i].replace(/[\s]*/g, '')
            if (wkList[i] != "") {
                //alert(wkList[i]);
                html += getKmLink(dc,wkList[i],"")+'； ';
            }
        }
        //alert(html);
        oCn.innerHTML = html;
    }
    StartArray.push(obj);
}



function getKmLink(dc,kw,code) {
    var lingformat = "<a onmouseover=\"kwPop('{0}','{1}','{2}',event)\" onmouseout='kwHide(1,event)' >{0}<a>";
    return lingformat.format(kw, dc,code);
}

function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
    }    
    if (document.body.scrollTop)
        return {
            x: ev.clientX - document.body.clientLeft + document.body.scrollLeft,
            y: ev.clientY - document.body.clientTop + document.body.scrollTop
        };
    return {
        x: ev.clientX - document.body.clientLeft + document.documentElement.scrollLeft,
        y: ev.clientY - document.body.clientTop + document.documentElement.scrollTop
    };
}
function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}
function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}


function GetRelKw(v, id) {
    CallRequest(function() {
        var html = '';
        var row = '<tr><td align="center">{0}</td><td>{1}</td><td align="center">{2}</td></tr>';
        var link = '<a target="_blank" href="keyword.aspx?v={0}">{1}</a> ';
        var items = v.split(';');
        var top = 10;
        if (items.length < top) top = items.length;
        for (var i = 0; i < top; i++) {
            var value = items[i].split(':');
            if (value.length == 2) {
                var word = value[0];
                var count = value[1];
                html += row.format(i + 1, link.format(encodeURIComponent(word), word), count);
            }
        }
        var head = '<tr><th width="40">序号</th><th>关键词</th><th width="100">共现频次↓</th></tr>';
        document.getElementById(id).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + head + html + '</table>';
    });

}

function RegExplan(v, id) {
    CallRequest(function() {
        kSendRequset(getExplanUrl(v), function(oReq) {
            var oData = getJsonObj(oReq);
            //alert(oData.Rows.length);
            var liformat = '<li>{0}...{1}<a target="_blank" class="readall" href="http://gongjushu.cnki.net/refbook/detail.aspx?recid={2}">阅读全文&gt;&gt;</a></li>';
            var emformat = '<em class="gray">{0}</em>';
            var html = "";
            for (var i = 0; i < oData.Rows.length; i++) {
                var row = oData.Rows[i];
                var em = "";
                if (row.条目字数 != '') { em += '字数:' + row.条目字数; }
                if (row.工具书名称 != '') { em += '  - 来源:' + row.工具书名称; }
                if (em != "") { em = emformat.format(em); }
                html += liformat.format(row.abstract, em, row.条目编码);
            }
            if (html != "") {
                document.getElementById(id).innerHTML = html;
            }
        }, null);
    })
}
function getExplanUrl(v) {
    return 'block/explan.aspx?v=' + encodeURIComponent(v);
}


function RegTranslate(v, l,id) {
    CallRequest(function() {
        kSendRequset(getTranslateUrl(v, l), function(oReq) {
            document.getElementById(id).innerHTML = oReq.responseText;
        }, null);
    })
}

function getTranslateUrl(v,l) {
    return 'block/translate.aspx?v={0}&l={1}'.format(encodeURIComponent(v),l);
}

function RegKwAuthor(v, id) {
    var url = 'block/kwauthor.aspx?v={0}'.format(encodeURIComponent(v));
    CallRequest(function() {
        kSendRequset(url, function(oReq) {
            var oData = getJsonObj(oReq);
            var html = '';
            var row = '<tr><td align="center">{0}</td><td>{1}</td><td align="center">{2}</td></tr>';
            var pos = 0;
            for (var i = 0; i < oData.Rows.length; i++) {
                var item = oData.Rows[i];
                var au = item.AU_CN;
                var code = item.AU_CODE;
                var count = item.c;
                if (au == code)
                    continue;
                html += row.format(i + 1, au, count);
                pos++;
                if (pos == 10)
                    break;
            }
            var head = '<tr><th width="40">序号</th><th>作者</th><th width="100">引词频次↓</th></tr>';
            document.getElementById(id).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + head + html + '</table>';
        }, null);
    })
}
function RegKwSub(v, id) {
    var url = 'block/kwsub.aspx?v={0}'.format(encodeURIComponent(v));
    CallRequest(function() {
        kSendRequset(url, function(oReq) {
            var oData = getJsonObj(oReq);
            var html = '';
            var td = '<td  width="50" align="center"><a href="javascript:void(0)" onclick="RequSubFile(\'{2}\',\'{3}\',\'subfile\',1)">{0}{1}</a></td>'
            var row = '<tr>{0}</tr>';
            var pos = 0;
            var trhtml = '';
            var count = oData.Count;
            var sub = '';
            for (var i = 0; i < 5; i++) {
                if (i < count) { var oRow = oData.Rows[i]; if (sub == '') sub = oRow.ZT_CODE; trhtml += td.format(oRow.专题名,'('+oRow.c+')', v, oRow.ZT_CODE); }
                
            }
            if (trhtml != '') {
                html += row.format(trhtml);
            }
            if (count > 5) {
                trhtml = '';
                for (var i = 5; i < 10; i++) {
                    if (i < count) { var oRow = oData.Rows[i]; trhtml += td.format(oRow.专题名, '(' + oRow.c + ')', v, oRow.ZT_CODE); }
                    else { trhtml += td.format('', '','',''); }
                }
                html += row.format(trhtml);
            }
            document.getElementById(id).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + html + '</table>';
            if (sub != '')
                RequSubFile(v, sub, 'subfile', 1);
        }, null);
    })

}


function RequSubFile(v, s, id, p) {
    var url = 'block/kwsubfile.aspx?v={0}&s={1}&p={2}'.format(encodeURIComponent(v), s, p);
    document.getElementById(id).innerHTML = "正在请求...";
    kSendRequset(url, function(oReq) {
        var oData = getJsonObj(oReq);
        //alert(oData.Rows.length);
        var liformat = '<li>[{7}].{0}.<a target="_blank" href="detail.aspx?dbcode=CJFQ&dbname={2}&filename={3}">{1}</a>. {4}. {5}({6})</li>';
        var html = "";
        for (var i = 0; i < oData.Rows.length; i++) {
            var row = oData.Rows[i];
            html += liformat.format(row.AU_CN, row.TI_CN, row.TABLE, row.FN, row.SRC, row.YEAR, row.ISSUE,i+1);
        }
        if (html != "") {
            document.getElementById(id).innerHTML = html;
        }
    }, null);
}

function RegChart(v, id) {
    CallRequest(function() {
        var iframe = document.getElementById(id);
        iframe.onload = function() {
            //alert("xx");
            //iframe.style.height = iframe.documnet.body.scrollHeight + "px";
        }
        iframe.src = 'frame/ztchart.aspx?kw=' + encodeURIComponent(v);
    })
}
function GetWbTitle() {
    var strt = encodeURIComponent(document.title.substring(0, 76));
    var title = document.title.split('-')[0].toString().replace(/[ ]/g, "");
    var strnewt = document.getElementById("hidtitle").value;
    if (strnewt != "") strt = encodeURIComponent(title + "-" + strnewt);
    strt = strt + "--文献出自中国知网";
    return strt;
}
//分享到新浪微博
function ShareWeibo_xl() {
    var strt = GetWbTitle();
    window.open('http://v.t.sina.com.cn/share/share.php?title=' + strt + '&url=' + encodeURIComponent(location.href) + '&source=bookmark', '_blank', 'width=450,height=400, menubar=no, scrollbars=no,resizable=yes,location=no, status=no');
}
//分享到网易微博
function ShareWeibo_wy() {
    var strt = GetWbTitle();
    var url = 'link=http://news.163.com/&source=' + encodeURIComponent('网易新闻') + '&info=' + strt + ' ' + encodeURIComponent(document.location.href);
window.open('http://t.163.com/article/user/checkLogin.do?' + url + '&' + new Date().getTime(), 'newwindow', 'height=330,width=550,top='+(screen.height-280)/2+',left=' + (screen.width - 550) / 2 + ',toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no');
}

//分享到腾讯微博
function ShareWeibo_tx() {
    var strt = encodeURIComponent(document.title);
    var title = document.title.split('-')[0].toString().replace(/[ ]/g, "");
    var strnewt = document.getElementById("hidtitle").value;
    if (strnewt != "") strt = encodeURIComponent(title + "-" + strnewt);
    var _t = encodeURIComponent(document.title);
    var _url = encodeURIComponent(document.location);
    var _appkey = encodeURI("appkey");  
    var _pic = encodeURI(''); 
    var _site = '';
    var _u = 'http://v.t.qq.com/share/share.php?title=' + strt + '&url=' + _url + '&appkey=' + _appkey + '&site=' + _site + '&pic=' + _pic;
    window.open(_u, '转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}
//分享到人人网
function ShareWeibo_rr() {
    var strt = GetWbTitle();
     window.open('http://share.renren.com/share/buttonshare.do?link=' + encodeURIComponent(document.location.href) + '&title=' + strt, '_blank', 'scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');

}
//分享到开心网
function ShareWeibo_kx() {
    var strt = GetWbTitle();
    window.open('http://www.kaixin001.com/repaste/share.php?rtitle=' + strt + '&rurl=' + encodeURIComponent(location.href) + '&rcontent=', '_blank', 'scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
}
//分享到豆瓣网
function ShareWeibo_db(obj) {
    var strt = GetWbTitle();
    window.open('http://www.douban.com/recommend/?url='+encodeURIComponent(location.href)+'&V=1&title=' + strt,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');
}
//function GetShareWeibosRight(url) {
//    var wbtext = "<div id='common_box' class='shareDiv' onmouseover='showshare()' onmouseout='closeshare()'><div id='cli_on' class='sharehd'>分享到</div><ul class='sharebd' id='sharedet'>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_xl();' class='xl' title='分享到新浪微博'><i></i>新浪微博</a></li>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_tx();' class='tx' title='分享到腾讯微博'><i></i>腾讯微博</a></li>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_rr();' class='rr' title='分享到人人网'><i></i>人人网</a></li>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_kx();' class='kx' title='分享到开心网'><i></i>开心网</a></li>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_db();' class='db' title='分享到豆瓣网'><i></i>豆瓣网</a></li>"
//+ "<li><a href='javascript:void(0);'  onclick='ShareWeibo_wy();' class='wy' title='分享到网易微博'><i></i>网易微博</a></li>"
//+ "</ul></div>";
//    document.write(wbtext);
//}
function GetShareWeibosRight(url) {
    var wbtext = "<div id='common_box' class='shareDiv' onmouseover='showshare()' onmouseout='closeshare()'><div id='cli_on' class='sharehd'>分享到</div><ul class='sharebd' id='sharedet'>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('xl')     class='xl' title='分享到新浪微博'><i></i>新浪微博</a></li>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('tx')     class='tx' title='分享到腾讯微博'><i></i>腾讯微博</a></li>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('rr')     class='rr' title='分享到人人网'><i></i>人人网</a></li>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('kx')     class='kx' title='分享到开心网'><i></i>开心网</a></li>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('db')     class='db' title='分享到豆瓣网'><i></i>豆瓣网</a></li>"
+ "<li><a href='javascript:void(0);'  onclick=ShareAction('wy')     class='wy' title='分享到网易微博'><i></i>网易微博</a></li>"
+ "</ul></div>";
    document.write(wbtext);
}
function ShareAction(t) {
    var dbcode = getQueryString("dbcode");
    var dbname = getQueryString("dbname");
    var filename = getQueryString("filename");
    var sendurlDetail = "http://acad3.cnki.net/CRRS/Services/Share.ashx?dbcode=" + dbcode + "&dbname=" + dbname + "&filename=" + filename + "&target=kns&type=" + t;
    var sendurlDoi = "http://acad3.cnki.net/CRRS/Services/Share.ashx?urlInfo=" + encodeURIComponent(document.URL) + "&content=" + encodeURIComponent(document.title) + "&type=" + t + "&target=custom";
    var sendurl = sendurlDetail;
    if (filename == "")
    {
        sendurl = sendurlDoi;
    }
    window.open(sendurl, "_blank", "width=480,height=430, menubar=no, scrollbars=no,resizable=yes,location=no, status=no");
}
function showshare() {
    document.getElementById("common_box").style.width = '232px';
}
function closeshare() {
    document.getElementById("common_box").style.width = '32px'
}

//浏览历史和下载历史cookie操作
//start
function ge(eID) {
    return document.getElementById(eID);
}
function newsetCookie(name, value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    var cookievalues = "";
    if (newgetCookie(name) != null) {
        cookievalues = newgetCookie(name);
    }
    var title;
    var url;
    if (value == "") {
        title = getTestTitle();
        url = document.URL;
        var strdbcode = getQueryString("dbcode");
        var strdbname = getQueryString("dbname");
        var strfilename = getQueryString("filename");
        value = title + "!" + strdbcode + "!" + strdbname + "!" + strfilename;
    }
    if (!IsIndexOfTheValue(cookievalues, title))
    {
      document.cookie = name + "=" + escape(value + "|" + cookievalues) + ";expires=" + exp.toGMTString() + ";path=/";
    }
}
function getTestTitle() {
    var title = document.title;
    var arrt = title.split('-');
    if (arrt.length > 2) {
        title = "";
        for (var i = 0; i < arrt.length - 1; i++) {
            title += arrt[i].toString();
        }
    }
    else {
        title = document.title.split('-')[0].toString().replace(/[ ]/g, "");
    }
    return title.replace('!','');
}
function IsIndexOfTheValue(name, value) {
    var usercookie = name;
    var flag = false;
    var DicValue = "";
    if (usercookie != null) {
        for (var i = 0; i < usercookie.length; i++) {
            if (usercookie[i] != "|")
                DicValue += usercookie[i];
            else {
                if (DicValue.indexOf(value) > -1) {
                    flag = true;
                    return flag;
                }
                DicValue = "";
            }
        }
    }
    return flag;
}
//读取cookies
function newgetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
//删除cookies
function newdelCookie(name) {

    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = newgetCookie(name);
    if (cval != null) document.cookie = name + "=|;expires=" + exp.toGMTString() + ";path=/";
    if (name == "UserSeesKcms")
        ge("usersee_hiscontent").innerHTML = "";
    else if (name == "UserDownLoadsKcms")
        ge("userdowmn_hiscontent").innerHTML = "";
}
function newhisresult_ll() {
    var userinputHtml;
    var arruserinputs;
    arruserinputs = newgetCookie("UserSeesKcms");
    newsetC("UserSeesKcms", arruserinputs);
    arruserinputs = newgetCookie("UserSeesKcms");
    var inputscount = 0;
    if (arruserinputs != null) {
      
        userinputHtml = "<ul class='listSpan' >";
        var otherHtml = "";
        var DicValue = "";
        var trunUrl = "http://epub.cnki.net/kns/detail/detail.aspx?dbcode={0}&dbname={1}&filename={2}";
        var wordArry = arruserinputs.split("|");
        var c=0
        for (var i = 0; i< wordArry.length; i++) {
            if (!wordArry[i] || wordArry[i] == "") {
                continue;
            }
            else {
                var wai = wordArry[i].split("!");
                var linkstr = "<li><a href='" + trunUrl.format(wai[1], wai[2], wai[3]) + "'>" + wai[0] + "</a></li>";
                userinputHtml += linkstr;
            }
            c++;
        }
        userinputHtml += "</ul>";

        userinputHtml += "<span><a onclick=\"newdelCookie('UserSeesKcms')\"  href='javascript:void(0)' style='margin-left:160px;'>清空</a></span>";


        if (c > 0) {
            ge("usersee_hiscontent").innerHTML = userinputHtml;
            ge("usersee_his").style.display = 'block';
        } else {
            ge("usersee_his").style.display = 'none';
        }

    }
}
function newsetC(cname, arruserinputs) 
{
    var strNewC = "";
    if (arruserinputs != null && arruserinputs != "") {
        var arrClist = arruserinputs.split("|");
        for (var i = 0; i < arrClist.length; i++) {
            if (i < 10) {
                var arrC = arrClist[i].split("!");
                if (strNewC.indexOf(arrC[0]) < 0) {
                    strNewC += arrClist[i] + "|";
                }
            }
        }
        newdelCookie(cname);
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);

        document.cookie = cname + "=" + escape(strNewC) + ";expires=" + exp.toGMTString() + ";path=/";
    }

}
function newhisresult_down() {
    var userinputHtml;
    var arruserinputs;
    arruserinputs = newgetCookie("UserDownLoadsKcms");
    newsetC("UserDownLoadsKcms", arruserinputs);
    arruserinputs = newgetCookie("UserDownLoadsKcms");
    var inputscount = 0;
    if (arruserinputs != null) {
        userinputHtml = "<ul class='listSpan' >";
        var otherHtml = "";
        var DicValue = "";
        var trunUrl = "../detail/detail.aspx?dbcode={0}&dbname={1}&filename={2}";
        var wordArry = arruserinputs.split("|");
        var c = 0;
        for (var i = 0; i < wordArry.length; i++) {
            if (!wordArry[i] || wordArry[i] == "") {
                continue;
            }
            else {
                var wai = wordArry[i].split("!");
                var linkstr = "<li><a href='" + trunUrl.format(wai[1], wai[2], wai[3]) + "'>" + wai[0] + "</a></li>"
                userinputHtml += linkstr;
                c++;
            }
        }
        userinputHtml += "</ul>";
        userinputHtml += "<span><a onclick=\"newdelCookie('UserDownLoadsKcms')\"  href='javascript:void(0)' style='margin-left:160px;'>清空</a></span>";

        if (c > 0) {

            ge("userdowmn_hiscontent").innerHTML = userinputHtml;
            ge("userdown_his").style.display = 'block';
        } else { ge("userdown_his").style.display = 'none'; }
    }else { ge("userdown_his").style.display = 'none'; }
}
function BindOnClick_DownLoad() {

    var aTags = document.getElementsByTagName("a");
    if (aTags && aTags.length > 0) {
        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].href.toString().indexOf("download.aspx?")>-1) {
                var elementA = aTags[i];

                if (window.attachEvent) {
                    elementA.attachEvent("onclick", function () { addTitToCookic(event.srcElement) });
                }
                else {
                    elementA.addEventListener("click", function () { addTitToCookic(this) }, false);
                }
            }
        }
    }
}
function addTitToCookic(obj) {

    newsetCookie("UserDownLoadsKcms", '');
}
//end
//PGB 订阅处理 20120515
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
 }
 function SubScription(subt, subu, subc) {

     var subTurnUrl = "/kcms/detail/frame/SubTurnPage.aspx";
    
    var filen = getQueryString("filename") + ";";
   
    var myForm = document.createElement("form");
    myForm.method = "post";
    myForm.setAttribute("target", "_blank");
    myForm.action = subTurnUrl;

    var myInputT = document.createElement("input");
    myInputT.setAttribute("name", "SubT");
    myInputT.setAttribute("value", subt);
    myForm.appendChild(myInputT);

    var myInputC = document.createElement("input");
    myInputC.setAttribute("name", "SubC");
    myInputC.setAttribute("value", subc + filen);
    myForm.appendChild(myInputC);

    var myInputU = document.createElement("input");
    myInputU.setAttribute("name", "SubU");
    myInputU.setAttribute("value", subu);
    myForm.appendChild(myInputU);

    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
}
//图片
function GetImgPath() {
       var fn="";
       if (getQueryString("filename") != null) fn = getQueryString("filename");
       var ImgSearchFC = "http://image.cnki.net";
       src = ImgSearchFC + "/getimage.ashx?fnbyIdAndName=" + encodeURIComponent(fn);
       try {
           RequestJsonObject(src, function () {
               if (typeof oJson != "undefined") {
                   var html = oJson.IDs;
                   if (html != null && html != "") {
                       RenderImages(html);
                   }
               }
           });
       } catch (err) { };
}
function RenderImages(html) {
    var lid ="";
    if (document.getElementById("loginuserid") != null) lid = document.getElementById("loginuserid").value;
    var fn = getQueryString("filename");
    var imgids = html;
    var imgsrc = "http://image.cnki.net/detail.aspx?ref=kcms&id=";
    var imgFrameSrc = "http://image.cnki.net/picinfo.aspx?id=";
    var imgpath = "http://image.cnki.net/getimage.ashx?id=";
    var imgMore = "http://image.cnki.net/Document/{0}.html";
    var imgMoreNew = "http://image.cnki.net/TurnPage.aspx?ref=kcms&docid={0}&uid={1}";
    var imgdivhtml = "";
    var imgFristId = "";
    if (imgids != null) {
        var arrimgids = imgids.split('||');
        for (i = 0; i < arrimgids.length; i++) {
            if (i < 8) {
                var tempId = arrimgids[i].split('##')[0];
                var tempName = arrimgids[i].split('##')[1];
                if (tempId != "") {
                    var openwurl = imgsrc + tempId + "&uid=" + lid;
                    imgdivhtml += "<a target='_blank' onclick=OpenWindowsUrl('" + openwurl + "') title='点击查看图片信息' style='display:inline-block;width:180px;margin:5px;overflow:hidden;'>"
            + "<img src='" + imgpath + tempId + "' id=" + tempId + " style='width:180px;max-height:200px;border:1px solid #ddd;'><h3 style='width:180px;height:44px;overflow:hidden;font-size:12px;font-weight:normal;text-align:center;line-height:22px;'>" + tempName + "</h3>" + "</a>";
                }
            }
            imgFristId = arrimgids[0].split('##')[0];
        }
        //        var Moreurl = imgMore.replace("{0}", imgFristId);
        var Moreurl = imgMoreNew.replace("{0}", fn).replace("{1}",lid);
        if (arrimgids.length > 8) imgdivhtml += "<div class='zwjdown' style='margin-right:20px;'><a href='" + Moreurl + "' target='_blank'>更多图片...</a><div>";
    }
    var imgObj = document.getElementById("imgdiv");
    var Objimg = document.getElementById("divimg");
    if (imgObj && Objimg) {
        Objimg.style.display = '';
        imgObj.innerHTML = imgdivhtml;
    }
}
function OpenWindowsUrl(url) {
    //海外版本用
    window.open(url, 'newwindow'); 
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var strsearch = window.location.search.substr(1).toLowerCase();
    var r = strsearch.match(reg);
    if (r != null) return unescape(r[2]); return "";
}
var C;
//添加监听事件
function O(G, U, C) {
    var ISIE = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;
    if (ISIE) {
        if (U == "load") {
            G.onreadystatechange = function () { 
                if (this.readyState == "loaded") {
                     C();
                }
            }
          
        }
        else
            G.attachEvent("on" + U, (function (V) { return function () { C.call(V) } })(G))

    }
    else {
        G.addEventListener(U, C, false)
    }
}
//做跨域脚本支持
function RequestJsonObject(src, onJsonLoaded) {
    if (C) {
        document.body.removeChild(C)
    }
    C = J("SCRIPT");
    C.src = src + "&td=" + (new Date()).getTime();
    C.charset = "utf-8";
        document.body.appendChild(C);
        O(C, "load", onJsonLoaded);

}
function J(C) {
    return document.createElement(C)
}

//原版预览
function RenderYbylHtml() {
//    var dbCodeList = "SCDB,CPFD,IPFD,CIPD,CJFQ,CJFD,CSYD,CYFD,CDMD,CDFD,CMFD,CDSF,CMSF,CDBF2011,CMBF2011,CCND";
    var dbCodeList = "";
    var subTurnUrl = "../Detail/ReadRedirectPage.aspx?filename={0}&dbcode={1}&tablename={2}";
    var pfn = getQueryString("filename");
    var pdb = getQueryString("dbname");
    var pdc = getQueryString("dbcode");
    if (pfn){
     pfn = pfn.toUpperCase();
     pdb = pdb.toUpperCase();
     pdc = pdc.toUpperCase();
    }
    subTurnUrl = subTurnUrl.format(pfn, pdc, pdb);
    var objli = document.getElementById("ybyl");
    if (pdc!=""&&dbCodeList.indexOf(pdc) > -1) {
        if (objli) {
            objli.style.display = '';
            objli.setAttribute("class", "mlyll");
            objli.innerHTML = "<a href='" + subTurnUrl + "' target='_blank'>原版预览</a>";
        }
    }
    else {
        if (objli) {
            objli.style.display = 'none';
        }
    }
}
//下载图标
function SetDownLoadFlag(dflag) {
        var lid = "";
        if (document.getElementById("loginuserid") != null) {
            lid = document.getElementById("loginuserid").value;
        }
        if (lid != "") {
            if (dflag != "1") {

                var strClass = "page|chapter|whole|readol|caj|pdf|cajNew";
                var arrClass = strClass.split('|');
                var obj = document.getElementsByTagName("li");
                for (var i = 0; i < obj.length; i++) {
                    var strClassName = obj[i].className.replace("/n", "");
                    strClassName = strClassName.replace(/[ ]/g, "");
                    strClassName = strClassName.replace(/(^\s*)|(\s*$)/g, "");
                    if (strClass.indexOf(strClassName) > -1) {
                        obj[i].className = "pdfN";
                    }
                }
                ////去掉A连接
                //var obja = document.getElementsByTagName("a");
                //for (var i = 0; i < obja.length; i++) {
                //    var strHref = obja[i].href;
                //    if (strHref.indexOf("download.aspx?") > 0) {
                //        obja[i].href = "javascript:alert('此帐号无权限下载');close();";
                //        obja[i].title = "此帐号无权限下载";

                //    }
                //}
            }
            else {return;}
        }
        else {
            return;
        }
    }
//二维码下载
function GetEwmImage() {
    var sFN=getQueryString("filename");
    var ewmImage="<img alt='' width='150px' height='150px'style='position:fixed;top:317px;right:0;' src='http://app.cnki.net/Parts/QRCode/Get?source=KCMS&amp;text=http://i.cnki.net/Mobile/HD/Detail?instanceID=journals:"+sFN+"'/>";

    document.write(ewmImage);
}
function showBqsm(bqsmurl)
{
    if (!bqsmurl) return;
    var bqsmdiv = document.getElementById("bkbqsm");
    if (!bqsmdiv) return;
    bqsmdiv.innerHTML = getBqsmHtml(bqsmurl);
    bqsmdiv.style.display = 'block';
    
}
function getBqsmHtml(bqsmurl)
{
    var closeHtml = "<a class='close' href='javascript:closeBqsm()'>X</a>";
    var IMGhtml = "<div><img src='" + bqsmurl + "'/></div>";

    return closeHtml + IMGhtml;
}
function closeBqsm()
{
    document.getElementById("bkbqsm").style.display = 'none';
}