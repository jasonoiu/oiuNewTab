document.addEventListener('DOMContentLoaded', function()
{
	let list = [];
	//加载现有数据
	chrome.storage.sync.get({
		pageRules: []
	}, function (data) {
		list = data.pageRules;
		for (let i = 0; i < list.length; i++) {
			const obj = list[i];
			if(!obj.enabled) continue;
			for (let y = 0; y < obj.rules.length; y++) {
				const rule = obj.rules[y];
				if(!isMatchUrl(rule.match)) continue;
				if(rule.scriptRule!==''){
					loadJsCode(rule.scriptRule);
				}
				if(rule.styleRule!==''){
					loadCssCode(rule.styleRule);
				}
			}
			
		}
	});
});

/**
 * 是否匹配当前页面
 * @param {array} matchArr 页面范围匹配数组
 * @returns {boolean} 匹配则返回true，反之返回false 
 */
function isMatchUrl(matchArr) {
	if(matchArr.length===0) return false;
	let url = document.URL.toLowerCase();
	for (let i = 0; i < matchArr.length; i++) {
		const str = matchArr[i].toLowerCase();
		let reg = new RegExp(str,'ig');
		if(reg.test(url) || url.indexOf(str)>-1) return true;
	}
	return false;
}

/**
 * 动态加载js代码片段
 * @param {string} code js代码片断
 */
function loadJsCode(code){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    //for Chrome Firefox Opera Safari
    script.appendChild(document.createTextNode(code));
    //for IE
    //script.text = code;
    document.body.appendChild(script);
}

/**
 * 动态加载css内容
 * @param {string} code css代码内容
 */
function loadCssCode(code) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.rel = 'stylesheet';
	try {
		//for Chrome Firefox Opera Safari
		style.appendChild(document.createTextNode(code));
	} catch (ex) {
		//for IE
		style.styleSheet.cssText = code;
	}
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(style);
}
