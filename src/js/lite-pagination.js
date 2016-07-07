/**
 *
 *  LitePagination is a jQuery plugin to support  Pagination customization, which enables to customize ::
 *
 *  <1> pagination basic attributes including: maxShowItem , firstText, prevText, lastText, nextText, eclipseText
 *  <2> algorithm to decide what pages to display, by override @method getPages(curPage,totalPage,maxShowItem)
 *  <3> rendering Table/List/TreeGrid/Grid is totally by yourself, which means it's separate from datalist/treelist/treegrid ....
 *  <4> one config, one plugin. Once you override a method or property, it 'remembers' it by binding to the container, it became a different one, which means, if you set up a config to it, it changes forever during runtime ( before you update / refresh again).what's more, you can have multiple configs for different initialization, which means in one html page, there can be more than 1 different versions of pagination, based on the base version.
 *  <5> css style, it' made by scss , which it's simple to customize your own style, or choose a existed theme,it can be easy for you!
 *
 *  Some other reasons why your choose it:
 *
 *  <1> multiple browser compatible, IE6+ , FF, Opera, Chrome, Safrai
 *  <2> Lite, which is just less than 300 codes, but involves in multiple extending machanism inside.
 *
 */
;(function (window, $,Promise) {
    'use strict';

    if(typeof $ === 'undefined'){

        throw new Error('jQuery Is Required!')
    }

    if(typeof Promise === 'undefined'){
        throw new Error('Promise Is Required!');
    }

    $.fn.litePagination = function (options,methodoverrides) {

        options = options || {};
        methodoverrides = methodoverrides || {};

        var that = this;

        var methods = {};

        $.fn.litePagination.options = {
            firstText : 'first',
            lastText : 'last',
            prevText : 'prev',
            nextText : 'next',
            maxShowItem:5,
            eclipseText:'...',
            totalPage:10,
            curPage:1,
            pages:[1],
            methods:methods,
            activeMethods:methods
        };

        var getPages = function (curPage, totalPage,maxShowItem) {

            console.log(curPage + ',' + totalPage + ',' + maxShowItem);

            var boundary = curPage;

            var limit = Math.min(maxShowItem,totalPage);

            var pages = [];

            var start = boundary - Math.floor(limit/2);

            var end = boundary + Math.floor(limit/2) - 1;

            var abs;

            if(start <= 0){
                abs = Math.abs(start - 1);
                start = 1;
                end = end + abs > totalPage ? totalPage : end + abs;

            }

            if(end >= totalPage){
                abs= Math.abs(end-totalPage);
                end = totalPage;
                start = start - abs >= 1 ? start-abs:1;
            }

            for(var i = start; i <= end; i++){
                pages.push(i);
            }

            return pages;
        };

        var render = function (options) {

            /**
             * Page Node Class for each page item
             * @properties id -> index number of current page node
             * @properties text -> text to show of current page node
             * @param id
             * @param text
             * @constructor
             */
            function Node(id,text){
                this.id = id;
                this.text = text;
            }

            /**
             * @param node must be instance of Node && @notnull node.id
             * @returns {*}
             */
            var renderPageItem = function (node,isCur,extraClass) {
                if(!(node instanceof Node)) return '';
                if(typeof node.id !== 'number') return '';
                extraClass = extraClass || '';
                if(isCur){
                    return '<li data-page-id="'+node.id+'" class="cur '+extraClass+'"><button>'+node.text+'</button></li>';
                }else{
                    return '<li data-page-id="'+node.id+'" class=" '+extraClass+'"><button>'+node.text+'</button></li>';
                }
            };
            var curPage = options.curPage;
            var first = new Node(1,options.firstText);
            var prev = new Node(curPage<= 1?1:curPage -1,options.prevText);
            var html = '<ul>';
            html += renderPageItem(first,false,'first');
            html += renderPageItem(prev,false,'prev');

            var maxItems = options.maxShowItem;

            var pagesLen = options.pages.length;

            var limit = Math.min(maxItems,pagesLen);

            for(var i = 0;i < limit; i ++ ){
                var node = new Node(options.pages[i],options.pages[i]);
                html += renderPageItem(node,options.pages[i] == curPage,'item');
            }
            var nextId = options.curPage + 1;
            nextId = nextId > options.totalPage ? options.totalPage:nextId;
            var last = new Node(options.totalPage,options.lastText);
            var next = new Node(nextId,options.nextText);
            html += renderPageItem(next,false,'next');
            html += renderPageItem(last,false,'last');
            html += '</ul>';
            return html;
        };

        var init = function (item,options) {
            // onclick
            onclick(item,options, function (pagination) {
                console.log(pagination);
                options.curPage = pagination.page;
                options.maxShowItem = pagination.pageSize;
                options.totalPage = pagination.totalPages;
                var pages = options.activeMethods.getPages(options.curPage,options.totalPage,options.maxShowItem);
                options.pages = pages;
                console.log(pages);
                var html = options.activeMethods.render(options);
                $(item).empty().append(html);
            });
        };

        var onclick = function (item,options,cb) {

            var promise = new Promise(function (resolve,reject) {
                options.activeMethods.renderDataList(options.curPage,resolve,reject);
            });
            promise.then(function (pagination) {
                cb(pagination);
            }, function () {
                throw  new Error('Error Occured');
            });

        };

        $.extend(methods , {

            // durint init
            getPages:getPages,
            init:init,
            render:render,

            // after init
            renderDataList: function (page,cb) {
                console.log('Request Pagination');
                if(!page){
                    page = 1;
                }
                var renderTable = function (list) {
                    var clz = '.lite-pagination-sample-datalist';
                    var html = '';
                    for(var i = 0; i < list.length; i++){
                        var row = list[i];
                        html = html + '<tr><td>'+row.col1+'</td><td>'+row.col2+'</td><td>'+row.col3+'</td></tr>';
                    }
                    $(clz+' tbody').empty().append(html);
                };

                $.getJSON('data/data'+page+'.json',function (pagination) {
                    renderTable(pagination.datas);
                    cb(pagination);
                });
            },
            getOptions: function (item,options) {
                return options;
            },
            setOptions: function (item, options,overrideoptions) {
                var _options  = {};
                $.extend(_options,$.fn.litePagination.options,options,overrideoptions||{});
                _options.activeMethods.init(item,_options);
            },
            setCurPage: function (item,options,curPage) {
                options.curPage = curPage;
                this.setOptions(item,options,options);
            },
            rerender: function (item, options,overrideoptions) {
                setOptions(item,options,overrideoptions);
            }

        });


        $.each(that,function (index, item) {

            // invoke method
            if(typeof options === 'string'){

                if(options === 'getPages' || options === 'init' || options === 'render'){
                    return;
                }

                var _options = $(item).data('lite-options');
                if(_options.methods[options] && typeof _options.methods[options] == 'function'){
                    _options.methods[options](item,_options,methodoverrides);
                }

            // init pagination
            } else if( typeof options === 'object' || options === 'undefined'){
                var _options  = {};
                $.extend(_options,$.fn.litePagination.options,options);
                $.extend(_options.activeMethods,methodoverrides,{});
                $.fn.litePagination.options = _options;
                $.fn.litePagination.options.activeMethods.init(item,_options);
                $(item).delegate('li','click', function () {
                    if($(this).data('page-id') == $(this).parent().find('.cur').data('page-id')){
                        return;
                    }
                    var pageId = $(this).data('page-id');

                    _options.activeMethods.setCurPage(item,_options,pageId);

                });
                $(item).data('lite-options',_options);
            }
        });

    };

}(window, jQuery,Promise));