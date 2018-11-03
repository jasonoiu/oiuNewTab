

(function ($,window) {
    
    let list = [];

    $(function () {
        
        //加载现有数据
        chrome.storage.sync.get({
            pageRules: []
        }, function (data) {
            list = data.pageRules;
            renderRules();
        });
        
    });

    /**
     * 渲染页面规则视图
     */
    function renderRules() {
        let html = ''; 
        for (let i = 0; i < list.length; i++) {
            const d = list[i];
            html += `<div id="{0}" class="pageStyleRuleContainer">
                        <h3>{1}</h3>
                        <div class="ruleMatchPage">
                            <strong i18n-text="matchPagesSimple"></strong>
                            {2}
                        </div>
                        <div class="pageStyleRuleBtn">
                            <a class="btn btn-default btn-sm edit" i18n-text="edit" href="./editRule.html?id={0}"></a>
                            <button class="btn btn-default btn-sm disable" i18n-text="disable"></button>
                            <button class="btn btn-default btn-sm del" i18n-text="del"></button>
                        </div>
                    </div>`.format(
                        d.id,
                        d.ruleName,
                        d.rules.map(m=> (m.match).map(x=>x.val)).join(',')
                    );
        }
        $('#ruleContainer').html(html);
        tDocLoader();
    }


})(jQuery,window);


