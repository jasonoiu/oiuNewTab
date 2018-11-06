

(function ($,window) {
    
    $(function () {
        
        //加载现有数据
        gd.settingDataDef().done(()=>{
            renderRules();
            renderMoudlePersonal();
        });
        
    });

    /**
     * 渲染模块是否显示内容
     */
    function renderRules() {
        let html = '';
        for (let i = 0; i < gd.setting.module.length; i++) {
            const obj = gd.setting.module[i];
            html += `<div>
                        <label for="cb-${obj.name}" i18n-text="${obj.name}"></label>
                        <input id="${obj.name}" type="checkbox" ${obj.show ? 'checked' : ''}/>
                    </div>`;
        }
        $('#moudleSetting').html(html);
        tDocLoader();
    }

    /**
     *渲染模块个性化tab
     */
    function renderMoudlePersonal() {
        $('#moudlePersonal').tabs();
        //cnblogs
        let cnblogs = gd.setting.module.find(m=>m.name==='cnblogs');
        $('#cb-defaultExpand-cnblogs').prop('checked', cnblogs.data.defaultExpand);
    }


})(jQuery,window);


