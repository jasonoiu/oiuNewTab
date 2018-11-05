// omnibox 关键字提示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	if(!text) return;
	
	suggest([
		{content: '博客园 ' + text, description: '搜索博客园 ' + text},
		{content: 'stackoverflow ' + text, description: 'stackoverflow搜索 ' + text},
	]);
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
	console.log('inputEntered: ' + text);
	if(!text) return;
	var href = '';
	if(text.startsWith('stackoverflow')) href = 'https://stackoverflow.com/search?q=' + text.replace('stackoverflow ', '');
	else if(text.startsWith('博客园')) href = 'https://www.google.com/search?q=site%3Acnblogs.com%20' + text.replace('博客园 ', '');
	else href = 'https://www.google.com/search?q=' + text;
	openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, {url: url});
	})
}

window.tools = tools;