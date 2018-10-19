
//#region BookMark

(function ($, window) {

    /**收藏夹数据 */
    let bmList = [];

    $(function () {
        chrome.bookmarks.getTree(function (bookmarkArray) {
            bmList = bookmarkArray[0].children[0].children;
            appendFavHtml(bmList, $('#bookmarksContainer'));
            $('#bookmarksContainer').parent().show();
        });
    });
    

    /**插入收藏文件夹的HTML 
     * @param {Array} dataList 文件夹数据
     * @param {jQuery} $container 文件夹容器
    */
    function appendFavHtml(dataList, $container) {
        var html = '<ul>';
        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            html += `<li id='{0}' class='fav {1}'>
                        <a href='{2}' title='{3}'>{3}</span>
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
        $('li.folder', $container).each(function () {
            $(this).unbind().on('click', function () {
                var childUl = $(this).children('ul');
                if (childUl.length > 0) {
                    if (childUl.is(":visible")) {
                        childUl.hide();
                    } else {
                        childUl.show();
                    }
                    return false;
                }
                var id = $(this).attr('id');
                var folderData = getFavObjById(id);
                appendFavHtml(folderData.children, $('#' + id));
                return false;
            }.bind(this));
        });

        $('li.web a', $container).click(function (event) {
            event.stopPropagation();
        });
    };

    function getFavObjById(id, parent) {
        if (!parent) parent = bmList.filter(m => m.children);
        let obj = parent.find(m => m.id == id);
        if (obj) return obj;
        for (let i = 0; i < parent.length; i++) {
            const ele = parent[i];
            if (ele.children) {
                obj = getFavObjById(id, ele.children);
                if (obj) return obj;
            }
        }
    }

})(jQuery, window);

    //#endregion


//#region Most Visited

;   (function ($, window) {

    var mv = [];
    


    function renderMV() {
        let html = '';
        for (let i = 0; i < mv.length; i++) {
            let obj = mv[i];
            html += `<div><a href='{0}'>{1}</a></div>`.format(
                obj.url, obj.title
            );
        }
        $('#mostVisitedContainer').html(html)
            .parent().show();
        $.contextMenu({
            selector: '#mostVisitedContainer a',
            items: {
                "edit": {
                    name: "Edit", 
                    icon: "edit",
                    callback: function(itemKey, opt, e) {
                         var obj = getDataByTitle(opt.$trigger.html());
                         $('#txt-mv-title').val(obj.title);
                         $('#txt-mv-url').val(obj.url);
                         showEditLayer(false);
                    }
                },
                "delete": {name: "Delete", icon: "delete",
                    callback: function(itemKey, opt, e) {
                        mv.removeOfComplexObj('title',opt.$trigger.html());
                        chrome.storage.sync.set({ mv: mv });
                        renderMV();
                    }
                }
            }
        });
    };

    /**
     * 根据title获取数据对象
     * @param {string} title title
     */
    function getDataByTitle(title) {
        return mv.find(m=>m.title===title);
    };

    /**
     * 显示编辑窗口
     * @param {boolen} isAdd 是否为新增
     */
    function showEditLayer(isAdd) {
        let title = isAdd ? 'Add' : 'Edit';
        let oriTitle = $.trim($('#txt-mv-title').val());
        layx.html('add-mv-modal', title, document.getElementById('add-mv-modal'), {
            width: 100,
            height: 80,
            cloneElementContent: false,
            statusBar: true,
            minMenu: false,
            maxMenu: false,
            buttons: [
                {
                    label: title,
                    callback: function (id, button, event) {
                        var title = $.trim($('#txt-mv-title').val());
                        var url = $.trim($('#txt-mv-url').val());
                        if (title === '' || url === '') {
                            alert('不能为空！');
                            return;
                        }

                        if(isAdd){
                            mv.push({
                                title: title,
                                url: url
                            });
                        }else{
                            var obj = getDataByTitle(oriTitle);
                            obj.title = title;
                            obj.url = url;
                        }
                        chrome.storage.sync.set({ mv: mv });
                        renderMV();

                        $('#txt-mv-title').val('');
                        $('#txt-mv-url').val('');

                        layx.destroy(id);
                    },
                    style: 'color:#f00;font-size:16px;'
                }
            ]
        });
    }


    $(function () {

        chrome.storage.sync.get({
            mv: []
        }, function (data) {
            mv = data.mv;
            renderMV();
        });

        $('#btnAddMV').on('click', function () {
            showEditLayer(true);
        });


    });

    })(jQuery, window);

//#endregion