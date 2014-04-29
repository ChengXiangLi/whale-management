/**
 * function to call whale service
 * 
 * @param url
 *            request URL (cannot be null)
 * @param method
 *            request method (e.g: GET or POST, cannot be null)
 * @param params
 *            request parameters as JSON type. Pass null if no parameters.
 * @param successCallBack
 *            callback function when succeed， Pass null if do nothing.
 * @param failCallBack
 *            callback function when failed， Pass null if do nothing.
 * @return
 */
function whaleService(url, method, params, successCallBack, failCallBack) {
	url = pretreatmentUrl(url);
	if ('' == url)
		return;
	$.ajax({
		url : url,
		type : method,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded",
		data : params,
		success : function(data, textStatus) {
			if (null != successCallBack)
				successCallBack(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (null != failCallBack) {
				failCallBack();
			} else {
				alert("Request failed,please contact with administrator!");
			}
		}
	});

}

/**
 * call whale service with "GET" method
 * 
 * @param url
 * @param params
 * @param successCallBack
 * @return
 */
function whaleGet(url, params, successCallBack) {
	url = pretreatmentUrl(url);
	if ('' == url)
		return;
	if(url.indexOf("?")>0)
		url+="&_="+new Date().getTime();
	else
		url+="?_="+new Date().getTime();

	$.ajax({
		url : url,
		type : "get",
		dataType : "json",
		contentType : "application/json",
		data : params,
		success : function(data, textStatus) {
			if (null != successCallBack)
				successCallBack(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Request failed,please contact with administrator!");
		}
	});
}

/**
 * call whale service with "POST" method
 * 
 * @param url
 * @param params
 * @param successCallBack
 * @return
 */
function whalePost(url, params, successCallBack) {
	url = pretreatmentUrl(url);
	if ('' == url)
		return;
	$.ajax({
		url : url,
		type : "post",
		dataType : "json",
		contentType : "application/x-www-form-urlencoded",
		data : params,
		success : function(data, textStatus) {
			if (null != successCallBack)
				successCallBack(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Request failed,please contact with administrator!");
		}
	});
}

/**
 * validate URL.
 * 
 * @param url
 *            original URL
 * @return URL after treated.
 */
function pretreatmentUrl(url) {
	if (null == url || "" == url) {
		alert("URL cannot be null!");
		return "";
	}
	return url;
}
