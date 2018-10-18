/**收藏夹数据 */
let bmList = [];

chrome.bookmarks.getTree(function (bookmarkArray) {
    bmList = bookmarkArray[0].children[0].children;
    appendFavHtml(bmList,$('#bookmarksContainer'));
});

/**插入收藏文件夹的HTML 
 * @param {Array} dataList 文件夹数据
 * @param {jQuery} $container 文件夹容器
*/
function appendFavHtml(dataList, $container) {
    var html='<ul>';
    for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        html += `<li id='{0}' class='fav {1}'>
                    <a href='{2}' target='_blank'>{3}</span>
                    </a>
                </li>`.format(
                    data.id,
                    data.children ? 'folder' : 'web',
                    data.children ? 'javascript:void(0);' : data.url,
                    data.title
                );
    }
    html += '</ul>';
    $container.append(html);
    bindFavFolderEvent($container);
}


/**绑定收藏夹的事件 */
function bindFavFolderEvent($container) {
    $('li.folder',$container).each(function(){
        $(this).unbind().on('click',function () { 
            var id = $(this).attr('id');
            var folderData = getFavObjById(id);
            appendFavHtml(folderData.children,$('#'+id));
            return false;
         }.bind(this));
    });

    $('li.web a',$container).click(function(event) {
        event.stopPropagation();
    });
};

function getFavObjById(id,parent) {
    if(!parent) parent = bmList.filter(m=>m.children);
    let obj = parent.find(m=>m.id==id);
    if(obj) return obj;
    for (let i = 0; i < parent.length; i++) {
        const ele = parent[i];
        if(ele.children){
            return getFavObjById(id,ele.children);
        }
    }
}