<%@ page contentType="text/html;charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<%@ include file="../../header/header.jsp"%>
<%
	String title = "角色新增";
	String op = request.getParameter("op");
	if (op == null || op.equals("add")) {
		title = "角色新增";
	}else {
		title = "角色修改";
	}
	String id = request.getParameter("id");
%>
</head>
<body>
	<div class="panel panel-default no-border">
		<div class="panel-heading">
			<h3><%=title%>    <small id="title-name"></small></h3>
			<a class="form-back" href="<%=path%>/admin/role/list.jsp">返回</a>
		</div>
		<div class="panel-body">
			<form id="edit-form" class="row" onSubmit="return false">
				<input id="id" type="hidden">
				<div class="col-xs-6">
					<div class="form-group">
						<label>角色名<span class="red">*</span></label> 
						<div class="form-validate-desc" id="name-desc"></div>
						<input
							type="text" class="form-control" id="name"
							placeholder="输入角色名" data-required="true" 
							data-pattern="^[a-zA-Z][a-zA-Z0-9_]{2,30}$" 
							data-describedby="name-desc" data-description="name">
					</div>
				</div>
				<div class="col-xs-6">
					<div class="form-group">
						<label>中文名<span class="red">*</span></label>
						<div class="form-validate-desc" id="caption-desc"></div> 
						<input
							type="text" class="form-control" id="caption"
							placeholder="输入角色中文名" data-required="true" 
							data-pattern="^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{2,30}$" 
							data-describedby="caption-desc" data-description="caption">
					</div>
				</div>
				<div class="col-xs-12">
					<div class="form-group">
						<label>描述</label> <input
							type="text" class="form-control" id="desc"
							placeholder="输入角色描述">
					</div>
				</div>
				<div class="col-xs-2 pull-right">
					<button id="form-save-btn" class="btn btn-danger btn-block">保存</button>
				</div>
			</form>
			<br>
			<div id="success-hint" class="alert alert-info hidden">
				<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
				<%=title%>成功！
			</div>
			<div id="error-hint" class="alert alert-danger hidden">
				<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			</div>
		</div>
	</div>
</body>
<script src="<%=path%>/js/plugin/jquery-validate.min.js"></script>
<script>

$(document).ready(function() {
	$('form').validate({
		onKeyup : true,
		eachValidField : function() {
			$(this).closest('div').removeClass('has-error').addClass('has-success');
			$("#"+$(this).attr("data-describedby")).html("");
		},
		eachInvalidField : function() {
			$(this).closest('div').removeClass('has-success').addClass('has-error');
		},
		description : {
			name: {
				required: '请输入角色名！',
				pattern: '角色名不合法！请重新输入！'
			},
			caption: {
				required: '请输入角色中文名！',
				pattern: '角色中文名不合法！请重新输入！'
			}
		},
		valid: function(form) {
			var data = formutil.getFields($("#edit-form"));
			  //var url = "/role/insertrole.do";
		       var url = "/role2/saveOrUpdate.do?operType=1";
			if ("<%=op%>" == "update")
				//url = "/role/updaterole.do";
				url = "/role2/saveOrUpdate.do?operType=2";
			util.getServerData(url, data, function() {
				$("#success-hint").removeClass("hidden");
				$("#error-hint").addClass("hidden");
			}, function(err, status) {
				var text = err;
				if (err.rs_code != null)
					text = err.message;
				$("#success-hint").addClass("hidden");
				$("#error-hint").removeClass("hidden");
				$("#error-hint").html(text);
			})
		}
	});
	
	initUpdateModel();
});

function initUpdateModel() {
	if ("<%=op%>" == "update") {
		util.getServerData("/role/getrole.do", {roleId: "<%=id%>"}, function(data) {
			formutil.setFields($("#edit-form"), data);
		})
	}
}
</script>