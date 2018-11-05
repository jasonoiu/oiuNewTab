

(function ($,window) {
    
    $(function () {
        
        //加载现有数据
        chrome.storage.sync.get({
            setting: gd.setting
        }, function (data) {
            gd.setting = data.setting;
            renderRules(gd.setting.module);
        });
        
    });

    /**
     * 渲染模块是否显示内容
     * @param {array} moduleArr 模块是否显示的数组
     */
    function renderRules(moduleArr) {
        let html = '';
        for (let i = 0; i < moduleArr.length; i++) {
            const obj = moduleArr[i];
            html += `<div>
                        <label for="cb-${obj.name}" i18n-text="${obj.name}"></label>
                        <input id="${obj.name}" type="checkbox" ${obj.show ? 'checked' : ''}/>
                    </div>`;
        }
        $('#moudleSetting').html(html);
        tDocLoader();
    }


})(jQuery,window);


