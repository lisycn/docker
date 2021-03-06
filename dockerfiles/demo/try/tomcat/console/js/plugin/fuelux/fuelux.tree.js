(function($, c) {
    var b = function(e, d) {
        this.$element = $(e);
        this.options = $.extend({},
        $.fn.tree.defaults, d);
        this.$element.on("click", ".tree-item", $.proxy(function(f) {
            this.selectItem(f.currentTarget,f);
            if (this.options.clickHandler)
            	this.options.clickHandler.call(this, f.currentTarget, "item", f);
        },
        this));
        this.$element.on("click", ".tree-folder-header", $.proxy(function(f) {
            this.selectItem(f.currentTarget,f);
            this.selectFolder(f);
            
            //如果是展开下级菜单，则不触发点击事件
            var d = $(f.target); 
            if ((d.prop("tagName").toLowerCase() == "i" && d.parent().hasClass("tree-folder-header"))) return;
            
            if (this.options.clickHandler)
            	this.options.clickHandler.call(this, f.currentTarget, "folder", f);
        },
        this));
        this.$element.on("dblclick", ".tree-item", $.proxy(function(e) {
    		if (this.options.dblclickHandler)
    			this.options.dblclickHandler.call(this, e.currentTarget, "item");
        },
        this));
        this.$element.on("dblclick", ".tree-folder-header", $.proxy(function(e) {
    		if (this.options.dblclickHandler)
    			this.options.dblclickHandler.call(this, e.currentTarget, "folder");
        },
        this));
        this.render()
    };
    b.prototype = {
        constructor: b,
        render: function() {
            this.populate(this.$element)
        },
        /*
         * f - parentNode
         * j - new node data 
         */
        _addNode: function(f, j) {
            var e = this;
        	var i;
        	
        	//已经添加过的节点，不再添加
        	if (e.$element.find("#"+j.id).length>0) return;
        	
            if (j.type === "folder") {
                i = e.$element.find(".tree-folder:eq(0)").clone().show();
                
                i.attr("obj", "1");
                var node = i.find(".tree-folder-name");
                if (e.options["folder-icon-close"])
                	node.append(" <i class='"+e.options["folder-icon-close"]+" "+e.options["icon-color"]+"'></i> ");
                
                if (j.ex_icon)
                	node.append(" <i class='"+j.ex_icon+"'></i> ");
                
                if (j.icon){
                	node.append(" <i class='"+j.icon+"'></i> "+j.name);
                }else
                	node.append(j.name);
                
                if (j.ext_html)
                	node.append(j.ext_html);
                	
                i.find(".tree-loader").html(e.options.loadingHTML);
                var k = i.find(".tree-folder-header");
                k.data(j);
                if (j.id)
                	k.attr("id", j.id);

                if ("icon-class" in j) {
                    k.find('[class*="icon-"]').addClass(j["icon-class"])
                }
            } else {
                if (j.type === "item") {
                    i = e.$element.find(".tree-item:eq(0)").clone().show();

                    i.attr("obj", "1");
                    var node = i.find(".tree-item-name");
                    if (e.options["item-icon"])
                    	node.append(" <i class='"+e.options["item-icon"]+" "+e.options["icon-color"]+"'></i> ");
                    
                    if (j.icon){
                    	node.append(" <i class='"+j.icon+"'></i> "+j.name);
                    }else
                    	node.append(j.name);

                    if (j.ext_html)
                    	node.append(j.ext_html);

                    i.data(j);
                    if (j.id)
                    	i.attr("id", j.id);

                    if ("additionalParameters" in j && "item-selected" in j.additionalParameters && j.additionalParameters["item-selected"] == true) {
                        i.addClass("tree-selected");
                        i.find("i").removeClass(e.options["unselected-icon"]).addClass(e.options["selected-icon"])
                    }
                }
            }
            if (f.hasClass("tree-folder-header")) {
                f.parent().find(".tree-folder-content:eq(0)").append(i)
            } else {
                f.append(i)
            }
        },
        populate: function(f) {
        	var e = this;
            var d = f.parent().find(".tree-loader:eq(0)");
            d.show();
            this.options.dataSource.data(f.data(),
	            function(g) {
            		if (e.getChildren(f.data("id")).length > 0) return;
	                d.hide();
	                $.each(g.data, function(h,j) {
	                	e._addNode(f, j);
	                });
	                e.$element.trigger("loaded");
	            }
            );
        },
        selectItem: function(e, event) {
            if (this.options.selectable == false) {
                return
            }
            var d = $(e);
            var g = this.$element.find(".tree-selected");
            var f = [];
            if (this.options.multiSelect) {
                $.each(g,
                function(i, j) {
                    var h = $(j);
                    if (h[0] !== d[0]) {
                        f.push($(j).data())
                    }
                })
            } else {
                if (g[0] !== d[0]) {
                	g.removeClass("tree-selected").find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"]);
                    f.push(d.data())
                }
            }
            if (d.hasClass("tree-selected")) {
            	if (this.options.multiSelect) {
	            	d.removeClass("tree-selected");
	                d.find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"]);
            	}
            } else {
                d.addClass("tree-selected");
            	d.find("i").removeClass(this.options["unselected-icon"]).addClass(this.options["selected-icon"]);
                if (this.options.multiSelect) {
                    f.push(d.data())
                }
            }
            if (f.length) {
                this.$element.trigger("selected", {
                    info: f
                })
            }
        },
        selectFolder: function(e) {
            var d = $(e.target);
            if (!(d.prop("tagName").toLowerCase() == "i" && d.parent().hasClass("tree-folder-header"))) return;
            d = d.parent();
            var f = d.parent();
            if (d.find("." + this.options["close-icon"]).length) {
                if (f.find(".tree-folder-content").children().length > 0) {
                    f.find(".tree-folder-content:eq(0)").show()
                } else {
                    this.populate(d)
                }
                f.find("." + this.options["close-icon"] + ":eq(0)").removeClass(this.options["close-icon"]).addClass(this.options["open-icon"]);
                f.find("." + this.options["folder-icon-close"] + ":eq(0)").removeClass(this.options["folder-icon-close"]).addClass(this.options["folder-icon-open"]);
                this.$element.trigger("opened", d.data())
            } else {
                if (this.options.cacheItems) {
                    f.find(".tree-folder-content:eq(0)").hide()
                } else {
                    f.find(".tree-folder-content:eq(0)").empty()
                }
                f.find("." + this.options["open-icon"] + ":eq(0)").removeClass(this.options["open-icon"]).addClass(this.options["close-icon"]);
                f.find("." + this.options["folder-icon-open"] + ":eq(0)").removeClass(this.options["folder-icon-open"]).addClass(this.options["folder-icon-close"]);
                this.$element.trigger("closed", d.data())
            }
        },
        selectedItems: function() {
            var e = this.$element.find(".tree-selected");
            var d = [];
            $.each(e,
            function(f, g) {
                d.push($(g).data())
            });
            return d
        },
        getParentNode: function(id) {
        	var e = this.$element.find("#"+id);
        	if (e.length <= 0) return null;
        	if (e.data("type")=="folder")
        		return e.closest(".tree-folder").parents(".tree-folder").children(".tree-folder-header");
        	else
        		return e.closest(".tree-folder").children(".tree-folder-header");
        },
        getChildren: function(id) {
        	function getData(node) {
        		node.children(".tree-item[obj=1]").each(function() {
        			d.push($(this).data());
	       		});
        		node.children(".tree-folder[obj=1]").children(".tree-folder-header").each(function() {
        			d.push($(this).data());
	       		});
        	}

        	var e = this.$element;
        	if (id != null && id != "")
        		e = this.$element.find("#"+id);
        	if (e.length <= 0) return null;
        	var d = [];
        	if (e.data("type")=="folder") {
        		var p = e.closest(".tree-folder").children(".tree-folder-content");
        		getData(p);
        		return d;
        	} else if (e == this.$element) {
        		getData(e);
	       		return d;
        	} else
        		return null;
        },
        deleteNode: function(id) {
        	var e = this.$element.find("#"+id);
        	if (e.length <= 0) return null;
        	if (e.data("type")=="folder")
        		e.closest(".tree-folder").remove();
        	else
        		e.closest(".tree-item").remove();
        },
        deleteNodes: function(d) {
        	var e = this;
        	$.each(d, function(i, n) {
        		if (typeof e === "object")
        			e.deleteNode(n.id);
        		else
        			e.deleteNode(n);
            });
        },
        getElementById: function(id) {
        	var n = this.$element;
        	if (id != null && id != "")
        		n = this.$element.find("#"+id);
        	if (n.length == 0) return null;
        	else return n; 
        },
        /**
         * 根据父Id添加节点
         */
        addNode: function(o) {
        	var pid = o.pid;
        	var data = o.data;
        	var n = this.getElementById(pid);
        	if (n == null) return;
        	if (n.data("type") != "folder" && n != this.$element) return;
        	var e = this;
        	$.each(data, function(index,j) {
             	e._addNode(n, j);
            });
        },
        
        /**
         * 将id节点移动到pid节点下,如果不存在，则直接添加
         */
        moveNode: function(o) {
        	this.deleteNodes(o.data);
        	this.addNode(o);
        },
        /**
         * 获取id的所有祖先节点
         */
        getClosest: function(id) {
        	var c = [];
        	var _id = id;
        	var node = null;
        	do {
        		node = this.getParentNode(_id);
        		if (node != null && node.length > 0) {
	        		_id = node.data("id");
	        		c.push(node.data());
        		}
        	} while (node != null && node.length != 0);
        	return c;
        },
        
        destroy: function() {
        	this.$element.off();
        	this.$element.html("");
			this.$element.removeData('tree');
		}
    };
    $.fn.tree = function(e, g) {
        var f;
        var d = this.each(function() {
            var j = $(this);
            var i = j.data("tree");
            var h = typeof e === "object" && e;
            if (!i) {
                j.data("tree", (i = new b(this, h)))
            }
            if (typeof e === "string") {
                f = i[e](g)
            }
        });
        return (f === c) ? d: f
    };
    $.fn.tree.defaults = {
        multiSelect: false,
        loadingHTML: "<div>Loading...</div>",
        cacheItems: true
    };
    $.fn.tree.Constructor = b
})(jQuery);