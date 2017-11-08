(function($, window, undefined) {
    $.fn.extend({
        citySelector: function(options) {
            var mainData = localStore._getMainData();
            var $container = $('<div></div>');
            var dft = {};
            var ops = $.extend({}, dft, options);
            var $btn = $(this);

            $container.addClass('dh-pcas');
            $('body').append($container);

            $btn.off('click').on('click', function() {
                // 清空容器
                $container.empty().show();
                // 设置input
                localStore.setInput($btn);
                // init - 生成省级列表
                localStore._renderProvincial(mainData, $container);
                // 点击省级按钮
                localStore._clickProvincial($container);
                // 点击面包屑导航
                localStore._clickCrumbs($container);
            });
        }
    });

    var localStore = {
        $input: '',
        mainData: [],
        // 通过ajax获取本地json数据
        _ajaxData: function() {
            var data = [];
            $.ajax({
                type: 'GET',
                url: './data/pcas-code.json',
                dataType: 'json',
                async: false, // 同步
                success: function(d) {
                    data = d;
                },
                error: function(e) {
                    console.log(e);
                }
            });
            return data;
        },
        // 设置$input
        setInput: function(btn) {
            this.$input = btn;
        },
        // 获取全部数据
        _getMainData: function() {
            if(this.mainData.length == 0) this.mainData = this._ajaxData();
            return this.mainData;
        },
        // 根据省级code获取相应市级数据
        _getCityData: function(code) {
            var mainData = this._getMainData();
            var data = [];
            $.each(mainData, function(index, item) {
                if(code == item.code) {
                    data = item.childs;
                }
            });
            return data;
        },
        // 根据市级code获取相应区级数据
        _getDistrictData: function(pCode, cCode) {
            var mainData = this._getMainData();
            var cData = [];
            var dData = [];

            $.each(mainData, function(index, item) {
                if(pCode == item.code) {
                    cData = item.childs;
                }
            });

            $.each(cData, function(index, item) {
                if(cCode == item.code) {
                    dData = item.childs;
                }
            });

            return dData;
        },
        // 根据区级code获取相应镇级数据
        _getTownData: function(pCode, cCode, dCode) {
            var mainData = this._getMainData();
            var cData = [];
            var dData = [];
            var tData = [];

            $.each(mainData, function(index, item) {
                if(pCode == item.code) {
                    cData = item.childs;
                }
            });

            $.each(cData, function(index, item) {
                if(cCode == item.code) {
                    dData = item.childs;
                }
            });

            $.each(dData, function(index, item) {
                if(dCode == item.code) {
                    tData = item.childs;
                }
            });

            return tData;
        },
        // 生成省级列表
        _renderProvincial: function(mainData, $container) {
            var $crumbs = $('<ul></ul>');
            var _tpl = '';
            $crumbs.addClass('crumbs');
            $crumbs.html('<li><a href="javascript:;" class="level-1" data-index="0">全国</a></li>');
            $.each(mainData, function(index, item) {
                _tpl += '<li><a class="_p" href="javascript:;" data-code="'+item.code+'">'+item.name+'</a></li>';
            });

            $container.append($crumbs);

            if($container.find('.dh-provincial').length == 0) {
                var $ul = $('<ul></ul>');
                $ul.addClass('dh-provincial');
                $ul.empty().html(_tpl);
                $container.append($ul);
            } else {
                $container.find('.dh-provincial').html(_tpl);
            }
        },
        // 生成市级列表
        _renderCity: function(provincialCode, $container, name) {
            var cityData = this._getCityData(provincialCode);
            var _tpl = '';

            var $crumbs = $container.find('.crumbs');
            if($crumbs.find('.level-2').length > 0) {
                $crumbs.find('.level-2').text(name).show();
            } else {
                var _crumbsLi = $('<li></li>');
                _crumbsLi.html('<a href="javascript:;" class="level-2" data-index="1">'+name+'</a>');
                $crumbs.append(_crumbsLi);
            }

            $.each(cityData, function(index, item) {
                _tpl += '<li><a class="_c" href="javascript:;" data-code="'+item.code+'">'+item.name+'</a></li>';
            });

            if($container.find('.dh-city').length == 0) {
                var $ul = $('<ul></ul>');
                $ul.addClass('dh-city');
                $ul.empty().html(_tpl);
                $container.append($ul);
            } else {
                $container.find('.dh-city').html(_tpl);
            }
        },
        // 生成区级列表
        _renderDistrict: function(pCode, cityCode, $container, name) {
            var districtData = this._getDistrictData(pCode, cityCode);

            var $crumbs = $container.find('.crumbs');
            if($crumbs.find('.level-3').length > 0) {
                $crumbs.find('.level-3').text(name).show();
            } else {
                var _crumbsLi = $('<li></li>');
                _crumbsLi.html('<a href="javascript:;" class="level-3" data-index="2">'+name+'</a>');
                $crumbs.append(_crumbsLi);
            }

            var _tpl = '';
            $.each(districtData, function(index, item) {
                _tpl += '<li><a class="_d" href="javascript:;" data-code="'+item.code+'">'+item.name+'</a></li>';
            });

            if($container.find('.dh-district').length == 0) {
                var $ul = $('<ul></ul>');
                $ul.addClass('dh-district');
                $ul.empty().html(_tpl);
                $container.append($ul);
            } else {
                $container.find('.dh-district').html(_tpl);
            }
        },
        // 生成镇级列表
        _renderTown: function(pCode, cCode, dCode, $container, name) {
            var townData = this._getTownData(pCode, cCode, dCode);
            var _tpl = '';

            var $crumbs = $container.find('.crumbs');
            if($crumbs.find('.level-4').length > 0) {
                $crumbs.find('.level-4').text(name).show();
            } else {
                var _crumbsLi = $('<li></li>');
                _crumbsLi.html('<a href="javascript:;" class="level-4" data-index="3">'+name+'</a>');
                $crumbs.append(_crumbsLi);
            }

            $.each(townData, function(index, item) {
                _tpl += '<li><a class="_t" href="javascript:;" data-code="'+item.code+'">'+item.name+'</a></li>';
            });

            if($container.find('.dh-town').length == 0) {
                var $ul = $('<ul></ul>');
                $ul.addClass('dh-town');
                $ul.empty().html(_tpl);
                $container.append($ul);
            } else {
                $container.find('.dh-town').html(_tpl);
            }
        },
        // 点击省级按钮
        _clickProvincial: function($container) {
            var $pCont = $container.find('.dh-provincial');
            var $p = $pCont.find('li>a._p');
            var _this = this;

            $p.off('click').on('click', function() {
                var code = $(this).data('code');
                var name = $(this).text();
                // 渲染市级
                _this._renderCity(code, $container, name);
                _this._showCity($container);
                // 隐藏省级
                _this._hideProvincial($container);
                // 点击市级
                _this._clickCity(code, $container);
            });
        },
        // 点击市级按钮
        _clickCity: function(pCode, $container) {
            var $cCont = $container.find('.dh-city');
            var $c = $cCont.find('li>a._c');
            var _this = this;

            $c.off('click').on('click', function() {
                var code = $(this).data('code');
                var name = $(this).text();
                // 渲染区级
                _this._renderDistrict(pCode, code, $container, name);
                _this._showDistrict($container);
                // 隐藏省级
                _this._hideProvincial($container);
                // 隐藏市级
                _this._hideCity($container);
                // 点击区级按钮
                _this._clickDistrict(pCode, code, $container);
            });
        },
        // 点击区级按钮
        _clickDistrict: function(pCode, cCode, $container) {
            var $dCont = $container.find('.dh-district');
            var $d = $dCont.find('li>a._d');
            var _this = this;

            $d.off('click').on('click', function() {
                var dCode = $(this).data('code');
                var name = $(this).text();
                // 渲染镇级
                _this._renderTown(pCode, cCode, dCode, $container, name);
                _this._showTown($container);
                _this._clickTown($container);
                // 隐藏省级
                _this._hideProvincial($container);
                // 隐藏市级
                _this._hideCity($container);
                // 隐藏区级
                _this._hideDistrict($container);
            });
        },
        _clickTown: function($container) {
            var $tCont = $container.find('.dh-town');
            var $t = $tCont.find('li>a._t');
            var _this = this;

            $t.off('click').on('click', function() {
                var tCode = $(this).data('code');
                var name = $(this).text();

                _this.$input.val(name);
                _this.$input.attr('data-code', tCode);
                _this.$input.attr('data-name', name);
                _this._hideContainer($container);
            });
        },
        // 点击面包屑导航
        _clickCrumbs: function($container) {
            var $crumbs = $container.find('.crumbs');
            var _this = this;
            $crumbs.off('click').on('click', function(e) {
                var $target = $(e.target);
                var _className = $target.attr('class');
                var _index = $target.data('index');
                $crumbs.find('li>a:gt('+_index+')').hide();
                switch(_className) {
                    case 'level-1':
                        _this._showProvincial($container);
                        _this._hideCity($container);
                        _this._hideDistrict($container);
                        _this._hideTown($container);
                        break;
                    case 'level-2':
                        _this._hideProvincial($container);
                        _this._showCity($container);
                        _this._hideDistrict($container);
                        _this._hideTown($container);
                        break;
                    case 'level-3':
                        _this._hideProvincial($container);
                        _this._hideCity($container);
                        _this._showDistrict($container);
                        _this._hideTown($container);
                        break;
                    case 'level-4':
                        _this._hideProvincial($container);
                        _this._hideCity($container);
                        _this._hideDistrict($container);
                        _this._showTown($container);
                        break;
                    default:
                        _this._showProvincial($container);
                        _this._hideCity($container);
                        _this._hideDistrict($container);
                        _this._hideTown($container);
                        break;
                }
            });
        },
        // 隐藏弹框
        _hideContainer: function($container) {
            $container.empty().hide();
        },
        // 隐藏省级
        _hideProvincial: function($container) {
            var $p = $container.find('.dh-provincial');
            $p.hide();
        },
        // 隐藏市级
        _hideCity: function($container) {
            var $c = $container.find('.dh-city');
            $c.hide();
        },
        // 隐藏区级
        _hideDistrict: function($container) {
            var $d = $container.find('.dh-district');
            $d.hide();
        },
        // 隐藏镇级
        _hideTown: function($container) {
            var $t = $container.find('.dh-town');
            $t.hide();
        },
        // 显示省级
        _showProvincial: function($container) {
            var $p = $container.find('.dh-provincial');
            $p.show();
        },
        // 显示市级
        _showCity: function($container) {
            var $c = $container.find('.dh-city');
            $c.show();
        },
        // 显示区级
        _showDistrict: function($container) {
            var $d = $container.find('.dh-district');
            $d.show();
        },
        // 显示镇级
        _showTown: function($container) {
            var $t = $container.find('.dh-town');
            $t.show();
        }
    };

})(jQuery, window);