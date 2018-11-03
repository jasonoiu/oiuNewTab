(function ($, window) {

    let list = [];
    let id = "";
    $(function () {

        $(window).on('resize', adjustStyle);

        id = $.query.get('id');
        if (!id) {
            adjustStyle();
            bindRulesEvent();
        }
        //加载现有数据
        chrome.storage.sync.get({
            pageRules: []
        }, function (data) {
            list = data.pageRules;
            renderRules();
        });

        //保存
        $('#btn-save').on('click', function () {
            let ruleName = $('#txt-rulename').trimVal();
            if (ruleName === '') {
                alert(t('ruleNameCannotEmpty'));
                return false;
            }
            let validResult = validPageRuleContents();
            if (!validResult.valid) {
                alert(validResult.message);
                return false;
            }

            var obj;
            if (id) {
                obj = list.find(m => m.id == id);
            } else {
                obj = {};
                obj.id = tools.guid();
            }
            obj.ruleName = ruleName;
            obj.rules = validResult.RuleResult;
            obj.enabled = $('#cb-enbaled').prop('checked');
            if (!id) {
                list.push(obj);
            }
            chrome.storage.sync.set({
                pageRules: list
            });
            layx.msg(t('successfulOperation'),{dialogIcon:'success'});
        });


    });

    /**
     * 绑定所有规则的相关事件
     */
    function bindRulesEvent() {
        //添加要匹配的页面规则
        $('.btn-addMatchPage')
            .unbind()
            .on('click', function () {
                let parent = $(this).firstParent('.matchPageContainer');
                $(`<input type="text" class="input_matchPage" />
                <button class="btn btn-default btn-sm btn-delMatchPage" i18n-text="del"></button>`).appendTo(parent);
                tDocLoader();
                adjustStyle();
                adjustAddMatchPageBtnPosition(parent);
                bindRulesEvent();
            })
    };

    /**
     * 调整添加匹配页面规则按钮的位置，只容许出现在最后一行
     * @param {jQuery} $container 匹配规则的容器
     */
    function adjustAddMatchPageBtnPosition($container) {

    }

    /**
     * 调整页面样式
     */
    function adjustStyle() {
        //调整匹配页面规则的输入框长度
        let $con = $('.matchRuleContainer .col-lg-11');
        $('.input_matchPage').css('width', ($con.cssVal('width') - $con.cssVal('paddingLeft') - $con.cssVal('paddingRight')) * 0.93 - 61 * 2);

    }


    /**
     * 遍历检查所有规则的合法性
     * @returns {object} 检测通过则返回规则结果，反之则返回出错信息
     */
    function validPageRuleContents() {
        let result = {
            valid: true,
            message: '',
            RuleResult: []
        };
        $('.ruleContainer').each(function () {
            let match = [];
            $(this).find('.input_matchPage').each(function () {
                let val = $(this).trimVal();
                if (val !== '') {
                    match.push(val);
                }
            });
            let styleRule = $(this).find('.input_styleRule').trimVal();
            let scriptRule = $(this).find('.input_scriptRule').trimVal();
            if (match.length === 0) {
                result.valid = false;
                result.message = t('matchPagesCannotEmpty');
                return false;
            } else if (styleRule === '' && scriptRule === '') {
                result.valid = false;
                result.message = t('cssValueAndscriptValueCannotEmpty');
                return false;
            } else {
                result.RuleResult.push({
                    match,
                    styleRule,
                    scriptRule
                });
            }
        });
        return result;
    };

    /**
     * 渲染页面规则视图
     */
    function renderRules() {
        var obj = list.find(m => m.id == id);
        $('#txt-rulename').val(obj.ruleName);
        let html = '';
        for (let i = 0; i < obj.rules.length; i++) {
            const d = obj.rules[i];
            html += `<div class="styleRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="cssValue"></div>
                            <div class="col-lg-11">
                                <textarea class="input_styleRule">{0}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="scriptRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="scriptValue"></div>
                            <div class="col-lg-11">
                                <textarea class="input_scriptRule">{1}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="matchRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="matchPages"></div>
                            <div class="col-lg-11 matchPageContainer">
                                {2}
                                
                            </div>
                        </div>
                    </div>`.format(
                d.styleRule,
                d.scriptRule,
                d.match.map(function (val, i) {
                    return `<input type="text" class="input_matchPage" value="{0}" />
                                    <button class="btn btn-default btn-sm btn-delMatchPage" i18n-text="del"></button>{1}`.format(
                        val,
                        i === 0 ? `<button class="btn btn-default btn-sm btn-addMatchPage" i18n-text="add"></button>` : ''
                    );
                }).join('')
            );
        }
        $('.ruleContainer').html(html);
        adjustStyle();
        bindRulesEvent();
        tDocLoader();
    }



})(jQuery, window);
