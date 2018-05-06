<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<link href='<c:url value="/css/main.css"/>' rel="stylesheet">
<script src='<c:url value="/js/jquery-1.9.1.js"/>'></script>
<script src='<c:url value="/js/bootstrap-2.3.2/js/bootstrap.js"/>'></script>

<script type="text/javascript" charset="utf-8">
var indexUrl = '<c:url value="/"/>' ;
var loadEditUrl= '<c:url value="/loadEditData"/>' ;
var uploadUrl = '<c:url value="/multiPartFileSingle"/>' ;
var uploadJsonUrl = '<c:url value="/jsonUpload"/>' ;

$(function() {	
    $(document).ready(function() {
		$("#downloadFile").prop('disabled', true);
	 });
   	
	$('#upload').on('click', function() {
	    var file_data = $('#file').prop('files')[0];   
	    if(file_data==undefined){
			$("#file_name").val("");
			$("#downloadFile").prop('disabled', true);
	    	return false;
	    }
	    var form_data = new FormData();                  
	    form_data.append('file', file_data);
	    $.ajax({
    	 		url:uploadUrl,
                dataType: 'json',  
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                success: function( response ){
	             try {
	                	if (response.error_message != "") {
    				    	var data=response.error_message;
    							alert(data);
    							$('#btnResetUpload').trigger('click');
    					} else {
    						 //window.location = indexUrl;
    						 var data=response.file_name;
    						 $("#file_name").val(data);
    						 $("#downloadFile").prop('disabled', false);
    						 alert("Upload File Name : " +  data + " Success");	
    					}
	    			}
	    			catch(err){
	    				if(response==undefined){
	    					window.location = indexUrl;
	    				}
	    			    alert(response);
		    		}  
                },
    		    error: function(response){
    		    	alert('Error: ' + response.responseText);
    		    }
	     });
	    return false;
	});
	
	$('#jsonupload').on('click', function() {
	    var file_data = $('#jsonfile').prop('files')[0];   
	    if(file_data==undefined){
	    	return false;
	    }
	    var form_data = new FormData();                  
	    form_data.append('jsonfile', file_data);
	    $.ajax({
    	 		url:uploadJsonUrl,
                dataType: 'json',  
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                success: function( response ){
	             try {
    					var data=response;
    					var $table = $('#result');
    					var $a = $('<tr style="color:grey;"><td>No.</td><td>Mobile Number</td><td>Price</td></tr>');
    					$table.append($a );
    					$.each(data, function (i, val) {
    					    var $r = $('<tr>').appendTo($a);
    					    var $c = $('<td>').text(i+1).appendTo($r);
    					    $c = $('<td>').text(val.msisdn).appendTo($r);
    						$c = $('<td>').text(val.price).appendTo($r);
    					    $table.append($r);
    					});
	    			}
	    			catch(err){
	    				if(response==undefined){
	    					window.location = indexUrl;
	    				}
	    			    alert(response);
		    		}  
                },
    		    error: function(response){
    		    	alert('Error: ' + response.responseText);
    		    }
	     });
	    return false;
	});
});

</script>

<title>Calculate Mobile Price</title>
</head>
<body topmargin="0" leftmargin="10">
	<div class="divbody">
		<nav class="navbar navbar-inverse">
			<div class="container">
				<div class="navbar-header">
					<h1>Calculate Mobile Price</h1>
				</div>
			</div>
		</nav>
	
		<div class="section body-box-line" style="width: 98%;">
			<div style="width: 100%">
				<div class="panel-box panel-file">
					<form method="post" action="" autocomplete="off">
						<div class="upload-box" id="uploadPath" style="width: 570px;">
							<strong>Mobile File Upload</strong><br><br>
							<input autocomplete="off" id="file" type="file" name="file" accept="text/plain" />
							<br><br>
							<button id="upload" class="btn btn-primary" style="width: 84px; margin-left: 10px;" autocomplete="off">Upload</button>
							<input id="btnResetUpload" name="btnReset" class="btn btn-default" style="width: 84px; margin-left: 10px"
								type="reset" value="Reset" autocomplete="off" />
						</div>
						<div class="panel-right-comment" style="min-width: 190px !important;">
							<h5>Example Format</h5>
							<b>promotion1.log</b><br /> 22/06/2013|10:21:55|10:40:57|0810660431|P1 <br />
							22/06/2013|11:17:25|12:55:27|0861833155|P1 <br /> 22/06/2013|10:21:55|10:40:57|0810660431|P1 <br />
							22/06/2013|10:07:36|10:51:23|0867308013|P1 <br /> 22/06/2013|10:39:18|11:09:15|0849958685|P1 <br />
						</div>
					</form>

					<form:form modelAttribute="usagelist" method="post" style="margin-left:10px;" autocomplete="off">
						<input id="file_name" name="file_name" type="hidden" />
						<ul style="list-style: none;">
							<li><form:button type="submit" id="downloadFile" name="action" value="downloadFile" class="btn btn-primary"
									onclick="" style="width: 100px; margin-bottom: 10px">Download</form:button></li>
							<span id="adminSubmit"> </span>
						</ul>
					</form:form>
				</div>

				<div style="clear: both;"></div>

			</div>
		</div>

		<div class="section body-box-line" style="width: 98%;">
			<div style="width: 100%">
				<div class="panel-box panel-file">
					<form method="post" action="" autocomplete="off">
						<div class="upload-box" style="width: 570px;">
							<strong>Json File Upload</strong><br><br>
							<input id="jsonfile" name="jsonfile" type="file" autocomplete="off" />
							<br>
							<br>
							<button id="jsonupload" class="btn btn-primary" style="width: 84px; margin-left: 10px;" autocomplete="off">Upload</button>
							<input id="btnResetjsonUpload" name="btnResetjsonUpload" class="btn btn-default"
								style="width: 84px; margin-left: 10px" type="reset" value="Reset" autocomplete="off" />
						</div>
					</form><br>
					<table id="result"></table>
				</div>

				<div style="clear: both;"></div>
			</div>
		</div>
	</div>
	<!-- Popup dialog -->
	<div id="myModal" style="display: none"></div>
	<!-- loading -->
	<div class="modal-loading">
		<!-- Place at bottom of page -->
	</div>
	<!-- confirm upload -->
	<div id="dialog-confirm-upload" style="display: none">This file already exists.</div>

	<!-- confirm delete -->
	<div id="dialog-confirm-delete" style="display: none">Do you want to delete?</div>
	<div id="dialog-message-edit" style="display: none" title="Edit">
		<div>
			<textarea id="EditTextArea"
				style="height: 300px; width: 600px; padding: 5px; font-family: Sans-serif; font-size: 1.2em;"></textarea>
		</div>
	</div>
</body>
</html>