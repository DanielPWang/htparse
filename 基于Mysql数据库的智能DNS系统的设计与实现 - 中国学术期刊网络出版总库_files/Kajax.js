var request = false;
try {
    request = new XMLHttpRequest();
} catch (trymicrosoft) {
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (othermicrosoft) {
        try {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (failed) {
            request = false;
        }
    }
}
if (!request) alert("Error initializing XMLHttpRequest!");
//获取信息  
function GetInfo(p, y, q, k) {
    var url = "/kcms/detail/block/mlyll.aspx?pykm={0}&year={1}&issue={2}&zwkm={3}";
    url = url.format(p, y, q, encodeURI(k));
    request.open("GET", url, true);
    request.onreadystatechange = updatePageTime;
    request.send(null);
    //if (f == "0") {
    //    request.open("GET", url, true);
    //    request.onreadystatechange = updatePageTime;
    //    request.send(null);
    //}
    //else if (f == "1") {
    //    request.open("GET", url, true);
    //    request.onreadystatechange = updatePageTimeBqsm;
    //    request.send(null);
    //}
    
}
//更新页面  
function updatePageTime() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = request.responseText;
            document.getElementById("mlyll").innerHTML = response;
        } 
//        else if (request.status == 404) {
//            alert("Requested URL is not found.");
//        } else if (request.status == 403) {
//            alert("Access denied.");
//        } else
//            alert("status is " + request.status);
    }
}
//更新页面  版权声明
function updatePageTimeBqsm() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            debugger;
            var response = request.responseText;
            document.getElementById("bqsm").innerHTML = response;
        }
    }
}