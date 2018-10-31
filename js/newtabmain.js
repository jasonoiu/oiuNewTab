
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



//#region Noted

;   (function ($, window) {

    var mv = [];
    


    function renderMV() {
        let html = '';
        for (let i = 0; i < mv.length; i++) {
            let obj = mv[i];
            html += `<div id='{0}'>{1}</div>`.format(
                obj.id, obj.content
            );
        }
        $('#notedContainer').html(html)
            .parent().show();
        bindNoteClickEvent();
        $.contextMenu({
            selector: '#notedContainer div',
            items: {
                "edit": {
                    name: "Edit", 
                    icon: "edit",
                    callback: function(itemKey, opt, e) {
                         showEditLayer(opt.$trigger.attr('id'));
                    }
                },
                "delete": {name: "Delete", icon: "delete",
                    callback: function(itemKey, opt, e) {
                        mv.removeOfComplexObj('id',opt.$trigger.attr('id'));
                        chrome.storage.sync.set({ note: mv });
                        renderMV();
                    }
                }
            }
        });
    };

    /**
     * 绑定Note的点击事件
     */
    function bindNoteClickEvent() {
        $('#notedContainer div').on('click',function () { 
            showEditLayer($(this).attr('id'));
         })
    };

    
    /**
     * 显示编辑窗口
     */
    function showEditLayer(id) {
        if($('#layx-add-note-modal').length===1){
            layx.destroy('add-note-modal');
            setTimeout(() => {
                _showEditLayer(id);
            }, 10);
        }else{
            _showEditLayer(id);
        }

        
    };

    function _showEditLayer(id) {
        var obj = mv.find(m => m.id == id);
        $('#txt-note').val(obj ? obj.content : '');
        let guid = obj ? obj.id : '';
        let isAdd = guid === '';
        if (isAdd) {
            guid = tools.guid();
        }
        let title = isAdd ? 'Add' : 'Edit';
        layx.html('add-note-modal', title, document.getElementById('add-note-modal'), {
            width: $(window).width() * 0.8,
            height: $(window).height() * 0.96,
            cloneElementContent: false,
            statusBar: true,
            storeStatus: false,
            minMenu: false,
            maxMenu: false,
            buttonKey: false,
            event:{
                onload: {
                    before: function (layxWindow, winform, params, inside, status) { },
                    after: function (layxWindow, winform, status) { 
                        $('#txt-note').height(layxWindow.offsetHeight-105);
                     }
                }
            },
            buttons: [{
                label: title,
                callback: (function (isAdd, guid) {
                    return function (id, button, event) {
                        var content = $.trim($('#txt-note').val());
                        if (content === '') {
                            alert('内容不能为空！');
                            return;
                        }

                        if (isAdd) {
                            mv.push({
                                content: content,
                                id: guid
                            });
                        } else {
                            var obj = mv.find(m => m.id == guid);
                            obj.content = content;
                        }
                        chrome.storage.sync.set({
                            note: mv
                        });
                        renderMV();

                        $('#txt-note').val('');

                        layx.destroy(id);
                    }
                })(isAdd, guid),
                style: 'color:#f00;font-size:16px;'
            }]
        });
    }


    $(function () {

        chrome.storage.sync.get({
            note: []
        }, function (data) {
            mv = data.note;
            renderMV();
        });

        $('#btnAddNote').on('click', function () {
            showEditLayer(true);
        });


    });

    })(jQuery, window);

//#endregion




//#region Cnblogs

(function ($, window) {

    /**
     * 绑定翻页事件
     * @param {boolen} isBlog 是否为博客内容
     */
    function bindPagesEvent(isBlog) {
        $('.pager a', isBlog ? '#tabs-blogs' : '#tabs-news').on('click', function () {
            let e = $(this);
            if (e.hasClass('current')) return false;
            let reg = /\/news\/page\/(?<page>\d+)\//ig;
            if (isBlog) reg = /\/blog\/page\/(?<page>\d+)\//ig;
            let result = reg.exec(e.attr('href'));
            if(isBlog){
                getBlogsByPageIndex(result.groups.page);
            }else{
                getNewsByPageIndex(result.groups.page);
            }
            return false;
        });
    }

    /**
     * 根据页数获取新闻内容
     * @param {number} pageIndex 第几页
     */
    function getNewsByPageIndex(pageIndex) {
        $.get('https://home.cnblogs.com/news/page/'+pageIndex).then(function (data) { 
            let reg = /<div class="news_item" id="news_item\d+">\s+<h2 class="news_entry">\s+<a href="\/\/(?<url>news.cnblogs.com\/n\/\d+\/)" target="_blank">(?<title>.*?)<\/a>/igm;
            let html='<ul>';
            while((result = reg.exec(data))!==null){
                html += `<li><a href='http://{0}' target='_blank' title='{1}'>{1}</a></li>`.format(
                    result.groups.url,
                    result.groups.title
                );
            }
            html += '</ul>';
            //page
            reg = /<div class="pager">.*?<\/div>/ig;
            html += reg.exec(data);

            $('#tabs-news').html(html);
            bindPagesEvent();
         }, function (data) {
            $('#tabs-news').html(data);
         });
    }


    /**
     * 根据页数获取首页精华博客内容
     * @param {number} pageIndex 第几页
     */
    function getBlogsByPageIndex(pageIndex) {
        $.get('https://home.cnblogs.com/blog/page/'+pageIndex).then(function (data) { 
            var reg = /<h2 class="entry_title"><a .*?>(?<author>\[.*?\])<\/a><a href="(?<url>.*?\.html)" target="_blank">(?<title>.*?)<\/a><\/h2>/gim;
            let html='<ul>';
            while((result = reg.exec(data))!==null){
                html += `<li><a href='{0}' target='_blank' title='{1} {2}'>{1} {2}</a></li>`.format(
                    result.groups.url,
                    result.groups.author,
                    result.groups.title
                );
            }
            html += '</ul>';
            //page
            reg = /<div class="pager">.*?<\/div>/ig;
            html += reg.exec(data);

            $('#tabs-blogs').html(html);
            bindPagesEvent(true);
         }, function (data) {
            $('#tabs-blogs').html(data);
         });
    }


    $(function () { 
        $('#cnblogsContainer').tabs();
        //去除点击后的边框效果
        $('#cnblogsContainer>ul>li>a').on('click',function () {
            $(this).blur();
        });
        getBlogsByPageIndex(1);
        getNewsByPageIndex(1);
     })

})(jQuery, window);

//#endregion



//#region clock

(function ($,window) {
    
    let clock;
    $(function () {
        
        clock = $('#clockContainer').FlipClock({
            clockFace: 'TwentyFourHourClock'
        });

    })


})(jQuery,window);

//#endregion




//#region weather

;(function ($,window) {
    
    let dayCount = 0;
    $(function () {
        
        $.get('http://t.weather.sojson.com/api/weather/city/101280601').then(function (data) {
            let html='';
            for (let i = 0; i < data.data.forecast.length; i++) {
                html += getDayWeatherHtml(data.data.forecast[i],data.data,i===0);
            }

            $('#weatherContainer').html(html);
         }, function (data) {
            $('#weatherContainer').html(data);
         });

    });

    /**
     * 获取某一天的天气数据的html
     * @param {object} data 天气数据
     * @param {number} ssData 现在的实时数据
     * @param {boolean} isFirst 是否是第一个数据 
     * @returns {string} 返回天气数据的html字符串 
     */
    function getDayWeatherHtml(data, ssData, isFirst) {
        let dayMatch = /(?<day>\d{1,2})日(?<weekday>星期[\u4e00-\u9fa5]+)/.exec(data.date);
        let day = dayMatch.groups.day.toInt();
        let weekday = dayMatch.groups.weekday;
        let nowDay = new Date().getDate();
        if ( (isFirst && day < nowDay) || dayCount >= 3) return '';
        let isToday = day === nowDay;
        dayCount++;
        return `<div class="weatherMoudle {0}">
                    {1}
                    <div class="weather_icon" style="background-image:url(./plugin/weather/img/{2}.png)"></div>
                    {3}
                    <div class="weather_wendu">{4}</div>
                    <div class="weather_weath">{5}</div>
                    <div class="weather_wind">{6}</div>
                    <div class="weather_quality {7}">{8}</div>
                </div>
                <div class="weather_split"></div>`.format(
                    isToday ? 'today' : '',
                    isToday ? '' : `<div class="weather_week">{0}</div><div class="weather_date">{1}</div>`.format(
                        weekday,
                        (new Date().addDay(day - nowDay)).format('MM月dd日')
                        ),
                    data.type,
                    isToday ? `<div class="weather_shishi">
                                    <span class="weather_shishi_wendu">{0}</span>
                                    <span class="weather_shishi_data">
                                        <i class="weather_shishi_sup">℃</i>
                                        <i class="weather_shishi_sub">{1}</i>
                                    </span>
                                </div>`.format(ssData.wendu,data.type)
                            : '',
                    `{0} - {1} ℃`.format(/\d{1,2}/.exec(data.low)[0], /\d{1,2}/.exec(data.high)[0]),
                    data.type,
                    data.fl === '<3级' ? '微风3级' : data.fl,
                    getAirQualityCss(ssData.quality),
                    getAirQualityHtml(ssData.quality,ssData.pm25)
                );
    }

    /**
     * 获取空气质量的html
     * @param {string} quality 空气质量
     * @param {number} pm pm数值
     * @returns {string} 返回html字符串 
     */
    function getAirQualityHtml(quality, pm) {
        return `<div>
                    <span>{0}</span><span>{1}</span>
                </div>`.format(
                    pm,
                    quality
                );
    }

    /**
     * 获取空气质量样式名称
     * @param {string} quality 空气质量
     * @returns {string} 返回空气质量样式名称
     */
    function getAirQualityCss(quality){
        let level = 0;
        switch (quality) {
            case '优':
                level = 1;
                break;
            case '良':
                level = 2;
                break;
            default:
                break;
        }
        return `weather_quality_level_{0}_bg`.format(level);
    }


})(jQuery,window);

//#endregion





//#region wallpaper

;(function ($,window) {

    /**
     * 重绘窗口样式
     */
    function redrawStyle() {
        $('body').css('height', $(window).height() - (
            $('body').cssVal('marginTop') + $('body').cssVal('marginBottom')
        ));
    }
    
    $(function () {

        redrawStyle();
        let wpHeight = $('body').cssVal('height')+ 203;
        let wpWidth = wpHeight * 1.5;
        $('body')
            //.css('backgroundImage', 'url(http://192.168.0.101:90/api/BlegMM/GetRandomImg)')
            .css('backgroundSize', '100% auto');
            //.css('backgroundSize', wpWidth+'px '+wpHeight+'px');

        $(window).resize(function () {
            redrawStyle();
        });

    });



})(jQuery,window);

//#endregion






















