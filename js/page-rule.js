(function ($, window) {

    let list = [];
    let id = "";
    $(function () {

        $(window).on('resize', adjustStyle);

        id = $.query.get('id');
        if (!id) {
            renderNewPageRuleSection();
        }
        //加载现有数据
        chrome.storage.sync.get({
            pageRules: []
        }, function (data) {
            list = data.pageRules;
            id && renderRules();
        });

        //保存
        $('#btn-save').on('click', function () {
            let ruleName = $('#txt-rulename').trimVal();
            if (ruleName === '') {
                layx.alert(t('tips'), t('ruleNameCannotEmpty'), null, {
                    dialogIcon: 'warn'
                });
                return false;
            }
            let validResult = validPageRuleContents();
            if (!validResult.valid) {
                layx.alert(t('tips'), validResult.message, null, {
                    dialogIcon: 'warn'
                });
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
            layx.msg(t('successfulOperation'), {
                dialogIcon: 'success'
            });
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
                $(`<div>
                        <select class="sel_matchType">
                            <option value="url" i18n-text="weburl"></option>
                            <option value="url-prefix" i18n-text="urlPrefix"></option>
                            <option value="domain" i18n-text="URLOnThisDomain"></option>
                            <option value="regexp" i18n-text="URLMatchesTheRegular"></option>
                        </select>
                        <input type="text" class="input_matchPage" />
                        <button class="btn btn-default btn-sm btn-delMatchPage" i18n-text="del"></button>
                    </div>`).appendTo(parent);
                tDocLoader();
                adjustStyle();
                bindRulesEvent();
            });

        //删除匹配页面方法
        $('.btn-delMatchPage')
            .unbind()
            .on('click', function () {
                if ($(this).firstParent('.matchPageContainer').find('.btn-delMatchPage').length === 1) {
                    layx.alert(t('tips'), t('matchPagesCannotEmpty'), null, {
                        dialogIcon: 'warn'
                    });
                    return false;
                }
                $(this).parent().remove();
            });

        //添加其它部分
        $('.btn-addSection')
            .unbind()
            .on('click', function () {
                renderNewPageRuleSection();
                refreshBtnDelSectionStatus();
            });

        //添加其它部分
        $('.btn-delSection')
            .unbind()
            .on('click', function () {
                if ($('.RuleSection').length === 1) return false;
                $(this).firstParent('.RuleSection').remove();
                refreshBtnDelSectionStatus();
            });

    };

    /**
     * 刷新删除此部分按钮的可视状态
     */
    function refreshBtnDelSectionStatus() {
        if ($('.RuleSection').length > 1) {
            $('.btn-delSection').show();
        } else {
            $('.btn-delSection').hide();
        }
    }


    /**
     * 调整页面样式
     */
    function adjustStyle() {
        //调整匹配页面规则的输入框长度
        let $con = $('.matchRuleContainer .col-lg-11');
        $('.input_matchPage').css('width', ($con.cssVal('width') - $con.cssVal('paddingLeft') - $con.cssVal('paddingRight')) * 0.93 - 61 * 2 - $('.sel_matchType').cssVal('width'));

    }

    /**
     * 渲染新页面规则
     */
    function renderNewPageRuleSection() {
        let html = getRuleSectionHtml('', '', getMatchPageHtml('', '', true));
        $('.ruleContainer').append(html);

        bindRulesEvent();
        tDocLoader();
        adjustStyle();
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
                    match.push({
                        val,
                        type: $(this).siblings('.sel_matchType').val()
                    });
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
     * 获取页面规则Section Html
     * @param {string} styleRule css样式内容
     * @param {string} scriptRule js脚本内容
     * @param {string} matchPage 匹配页面html
     */
    function getRuleSectionHtml(styleRule, scriptRule, matchPage) {
        return `<div class="RuleSection">
                    <div class="styleRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="cssValue"></div>
                            <div class="col-lg-11">
                                <textarea class="input_styleRule">${styleRule}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="scriptRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="scriptValue"></div>
                            <div class="col-lg-11">
                                <textarea class="input_scriptRule">${scriptRule}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="matchRuleContainer">
                        <div class="row">
                            <div class="col-lg-1" i18n-text="matchPages"></div>
                            <div class="col-lg-11 matchPageContainer">
                                ${matchPage}
                            </div>
                        </div>
                    </div>
                    <div class="sectionBtnContainer">
                        <button class="btn btn-default btn-sm btn-delSection" i18n-text="delThisSection"> </button>
                        <button class="btn btn-default btn-sm btn-addSection" i18n-text="addOtherSection"> </button>
                    </div>
                </div>`;
    }

    /**
     * 获取匹配页面的html
     * @param {string} defaultType 默认匹配类型
     * @param {string} val 匹配页面的值
     * @param {boolean} isFirst 是否为第一个
     */
    function getMatchPageHtml(defaultType, val, isFirst) {
        return `<div>
                    <select class="sel_matchType" ${defaultType ? 'data-type="{0}"'.format(defaultType) : ''}>
                        <option value="url" i18n-text="weburl"></option>
                        <option value="url-prefix" i18n-text="urlPrefix"></option>
                        <option value="domain" i18n-text="URLOnThisDomain"></option>
                        <option value="regexp" i18n-text="URLMatchesTheRegular"></option>
                    </select>
                    <input type="text" class="input_matchPage" value="${val}" />
                    <button class="btn btn-default btn-sm btn-delMatchPage" i18n-text="del"></button>
                    ${isFirst ? '<button class="btn btn-default btn-sm btn-addMatchPage" i18n-text="add"></button>' : ''}
                </div>`;
    }

    /**
     * 渲染页面规则视图
     */
    function renderRules() {
        var obj = list.find(m => m.id == id);
        $('#txt-rulename').val(obj.ruleName);
        let html = '';
        for (let i = 0; i < obj.rules.length; i++) {
            const d = obj.rules[i];
            html += getRuleSectionHtml(
                d.styleRule,
                d.scriptRule,
                d.match.map(function (obj, i) {
                    return getMatchPageHtml(obj.type, obj.val, i === 0);
                }).join('')
            );
        }
        $('.ruleContainer').html(html);

        bindRulesEvent();
        tDocLoader();
        setSelMatchTypeValue();
        adjustStyle();
    };

    /**
     * 设置匹配页面类型当前选中值
     */
    function setSelMatchTypeValue() {
        $('.sel_matchType').each(function () {
            $(this).find("option[value='" + $(this).data('type') + "']").attr("selected", true);
        })
    }



})(jQuery, window);
