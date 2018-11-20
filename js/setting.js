

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
        for (let [index, obj] of gd.setting.module.entries()) {
            switch (obj.name) {
                case 'cnblogs':
                    if(!obj.data) obj.data = {};
                    $('#cb-defaultExpand-cnblogs').prop('checked', obj.data.defaultExpand);
                    break;
            
                default:
                    break;
            }
        }
        
    }


})(jQuery,window);


