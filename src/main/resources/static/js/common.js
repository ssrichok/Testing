
function TLIsEnglish(StringCheck) {

    var isEnglish = true;
    var i;
    for (i = 0; i < StringCheck.length; i++) {
	var code_hex = StringCheck.charCodeAt(i);
	if (code_hex > 0x7F) {
	    isEnglish = false;
	}
    }

    return isEnglish;
}

function setFormReadyOnly() {
    var formsCollection = document.getElementsByTagName("form");
    for (var i = 0; i < formsCollection.length; i++) {
	// form#frmEditConfig
	if (formsCollection[i].id != "frmEditConfig")
	    disableAllPage($(formsCollection[i]));
    }
}

var formsCollection = document.getElementsByTagName("form");
for (var i = 0; i < formsCollection.length; i++) {
    // form#frmEditConfig
    if (formsCollection[i].id != "frmEditConfig")
	disableAllPage($(formsCollection[i]));
}
/**
 * Convert the input string to Unicode String. For example. "Ã Â¸ï¿½Ã Â¸â€š" will return 0e010e02
 */
function TLGetUnicodeString(string) {

    var newmsg = string;

    // var hex_msg;
    var uni_code = "";
    var code_hex;

    for (var i = 0; i < newmsg.length; i++) {
	code_hex = newmsg.charCodeAt(i);
	if (code_hex != 0x0d) {
	    if (code_hex <= 0x7F) {
		if (code_hex <= 0x0F) {
		    uni_code = uni_code + "000" + code_hex.toString(16);
		} else {
		    uni_code = uni_code + "00" + code_hex.toString(16);
		}
	    } else {
		// uni_code = uni_code + "0" + code_hex.toString(16);
		if ((code_hex >= 0x0E00) && (code_hex <= 0x0EFF))
		    uni_code = uni_code + "0" + code_hex.toString(16);
		else uni_code = uni_code + code_hex.toString(16);
	    }
	}
    }

    return uni_code;

}
/**
 * Check Unicode string was retrieved from database.
 * 
 * @param strVal
 * @returns {Boolean}
 */
function checkUnicode(strVal) {
    if ((strVal == null) || (strVal == ""))
	return false;

    if ((strVal.length < 4) || (strVal.length % 4 != 0))
	return false;

    var str;
    var testRegEx = /([a-f]|[A-F]|[0-9]){4}/;
    var testThaiUnicodeRegEx = /^(0E)[0-7][0-9A-F]$/;
    var tmpStr;
    var i = 0;

    while (i < strVal.length) {
	str = strVal.substr(i, 4);
	if (!testRegEx.test(str)) {
	    return false;
	}
	// Check if the input string contains Thai Unicode ( 0E00 Ã¢â‚¬â€� 0E7F
	// ) or
	// not.
	tmpStr = str.toUpperCase();
	if (testThaiUnicodeRegEx.test(tmpStr)) {
	    return true; // Found Thai Unicode String pattern.
	}
	i = i + 4;
    }
    return false; // Not contains Thai Unicode.
}
/**
 * Display unicode string.
 * 
 * @param strVal
 * @returns
 */
function checkDisplayUnicode(strVal) {
    if (!checkUnicode(strVal))
	return strVal;

    var str = "";
    var i = 0;
    while (i < strVal.length) {
	str = str + "&#x" + strVal.substr(i, 4);
	i = i + 4;
    }
    return $('<div>' + str + '<div>').text();
}
/**
 * Check and return Unicode string.
 */
function checkConvertUnicode(strVal) {
    if (strVal == null)
	return strVal;

    var result = "";
    if (checkThaiUnicode(strVal)) {
	result = TLGetUnicodeString(strVal);
    } else result = strVal;

    return result;
}
/**
 * Return true if the specified input string is a Unicode string otherwise return false.
 * 
 * @param msg
 * @returns
 */
function checkThaiUnicode(msg) {
    if (msg == null || msg == "")
	return false;

    return !TLIsEnglish(msg);
}
/**
 * Validate English and Thai Unicode String. This function will display popup when user enter invalid message and display character count when user is
 * typing.
 * 
 * @param txtControl
 *                TextAreay input control.
 * @param editCount
 *                Textbox control to display current character counts.
 */
function validateMessage(txtControl, editCount) {
    var strVal = txtControl.val().trim();

    if (editCount != null) {
	editCount.val(strVal.length);

	if (checkThaiUnicode(strVal)) {
	    var unicodeStr = TLGetUnicodeString(strVal);
	    if (unicodeStr != null) {
		if (strVal.length > 160) {
		    var strTmp = strVal.substr(0, 160);
		    if (!checkThaiUnicode(strTmp)) {
			// alert("English String length must between 1-160
			// characters. The exceeded characters will be trimmed
			// to 160 characters.");
			txtControl.val(strTmp);
			editCount.val(strTmp.length);

			modal.alert(txtControl,"English String length must between 1-160 characters. The exceeded characters will be trimmed to 160 characters.");
			return;
		    } else {
			// Show Error message when Unicode String length over
			// limit 70 characters
			// alert("Thai Unicode String length must between 1-70
			// characters. The exceeded characters will be trimmed
			// to 70 characters.");
			strVal = strVal.substr(0, 70);
			txtControl.val(strVal);
			editCount.val(strVal.length);
			modal.alert(txtControl,"Thai Unicode String length must between 1-70 characters. The exceeded characters will be trimmed to 70 characters.");

			return;
		    }
		}
		// Case 1. Thai Unicode at the
		// begin.
		else if (strVal.length > 70) {
		    // Check Case 3. English at
		    // the begin
		    // var strTmp = strVal.substr(
		    // 0,
		    // strVal.length - 1);

		    // TODO: Show Error
		    // message when Unicode
		    // String length over
		    // limit 70 characters
		    // alert("Thai Unicode String length must between 1-70
		    // characters. The exceeded characters will be trimmed to 70
		    // characters.");
		    strVal = strVal.substr(0, 70);
		    txtControl.val(strVal);
		    editCount.val(strVal.length);

		    modal.alert(txtControl,"Thai Unicode String length must between 1-70 characters. The exceeded characters will be trimmed to 70 characters.");
		    return;

		} else {

		    return;
		}
	    }

	} else {
	    // English String Message
	    if ((strVal.length > 160)) {
		// TODO: Show Error message when
		// English String length over
		// limit 160 characters

		// alert("English String length must between 1-160 characters.
		// The exceeded characters will be trimmed to 160 characters.");

		strVal = strVal.substr(0, 160);
		txtControl.val(strVal);
		editCount.val(strVal.length);

		modal.alert(txtControl,"English String length must between 1-160 characters. The exceeded characters will be trimmed to 160 characters.");
		return;
	    } else if (strVal == "") {
		// TODO:Clear Error message when
		// English String length less
		// than limit 160 characters
		editCount.val("0");
	    }
	}
    }
}

/**
 * Validate English only String. This function will display popup when user enter invalid message and display character count when user is typing.
 * 
 * @param txtControl
 *                TextAreay input control.
 * @param editCount
 *                Textbox control to display current character counts.
 */
function validateMessageEnglish(txtControl, editCount) {
    var strVal = txtControl.val().trim();

    if (editCount != null) {
	editCount.val(strVal.length);

	if (checkThaiUnicode(strVal)) {
	    modal.alert(txtControl,"English String length must between 1-160 characters. The exceeded characters will be trimmed to 160 characters.");
	    return;

	} else {
	    // English String Message
	    if ((strVal.length > 160)) {
		// TODO: Show Error message when
		// English String length over
		// limit 160 characters

		// alert("English String length must between 1-160 characters.
		// The exceeded characters will be trimmed to 160 characters.");

		strVal = strVal.substr(0, 160);
		txtControl.val(strVal);
		editCount.val(strVal.length);

		modal.alert(txtControl,"English String length must between 1-160 characters. The exceeded characters will be trimmed to 160 characters.");
		return;
	    } else if (strVal == "") {
		// TODO:Clear Error message when
		// English String length less
		// than limit 160 characters
		editCount.val("0");
	    }
	}
    }
}

function validateMessageThai(txtControl, editCount, showAlert) {
    var strVal = $(txtControl).val().trim();
    console.log("validateMessageThai infile");
    if (editCount != null) {
	editCount.val(strVal.length);

	if (checkThaiUnicode(strVal)) {
	    var unicodeStr = TLGetUnicodeString(strVal);
	    if (unicodeStr != null) {

		// Case 1. Thai Unicode at the
		// begin.
		if (strVal.length > MAX_THAI_UNICODE_LENGTH) {
		    // Check Case 3. English at
		    // the begin
		    // var strTmp = strVal.substr(
		    // 0,
		    // strVal.length - 1);

		    // TODO: Show Error
		    // message when Unicode
		    // String length over
		    // limit 70 characters
		    // alert("Thai Unicode String length must between 1-70
		    // characters. The exceeded characters will be trimmed to 70
		    // characters.");
		    strVal = strVal.substr(0, MAX_THAI_UNICODE_LENGTH);
		    txtControl.val(strVal);
		    editCount.val(strVal.length);
		    if (showAlert) {
			modal
				.alert(
					txtControl,
					"<strong>Validation error!</strong> Required Thai Unicode String only and length must between 1-70 characters. The exceeded characters will be trimmed to 70 characters.");
		    }
		    return false;

		} else {

		    return true;
		}
	    }

	} else {
	    if (strVal.length > MAX_THAI_UNICODE_LENGTH) {
		strVal = strVal.substr(0, MAX_THAI_UNICODE_LENGTH);
		txtControl.val(strVal);
		editCount.val(strVal.length);
		if (showAlert) {
		    modal
			    .alert(
				    txtControl,
				    "<strong>Validation error!</strong> Required Thai Unicode String only and length must between 1-70 characters. The exceeded characters will be trimmed to 70 characters.");
		}
		return false;
	    }
	}
	return true;
    }
    return false;
}

/**
 * Initialize text area and its count char control when page loaded.
 * 
 * @param txtControl
 * @param countControl
 */
function initialMessage(txtControl, countControl) {
    if ((txtControl == null) || (txtControl.length == 0))
	return;

    var strVal = txtControl.val().trim();
    /*
     * <-- Fix issue invalid Thai message count if (countControl != null) countControl.val(strVal.length);
     */
    strVal = checkDisplayUnicode(strVal);
    txtControl.val(strVal);

    if (countControl != null && (countControl.length != 0))
	countControl.val(strVal.length);

}

/**
 * Handle Textarea message keyup event.
 */
function onMessageKeyup(txtControl) {
    var form = $(txtControl).closest("form");
    // ussdservice.disablemsg1
    var id = $(txtControl).attr('id');
    var pos = id.indexOf(".");
    id = id.substr(pos + 1);

    var countControl = form.find("input[name=" + id + "Count]");
    // validateMessage($(txtControl), $(countControl), "Please enter (String : 1
    // - 160 characters for English and 1 - 70 characters for Thai)", true);
    validateMessage($(txtControl), $(countControl));

}
/**
 * Handle Textarea message keyup event.
 */
function onMessageKeyupEnglish(txtControl) {
    var form = $(txtControl).closest("form");
    // ussdservice.disablemsg1
    var id = $(txtControl).attr('id');
    var pos = id.indexOf(".");
    id = id.substr(pos + 1);

    var countControl = form.find("input[name=" + id + "Count]");
    // validateMessage($(txtControl), $(countControl), "Please enter (String : 1
    // - 160 characters for English and 1 - 70 characters for Thai)", true);
    validateMessageEnglish($(txtControl), $(countControl));

}

/**
 * Display message corresponding selected index in select control.
 * 
 * @param selectControl
 */
function onSelectMessageChanged(selectControl) {
    var form = $(selectControl).closest("form");
    // select_disablemsg
    var id = $(selectControl).attr('id');
    var pos = id.indexOf("_");
    id = id.substr(pos + 1);

    var selectedOptVal = $(selectControl).find('option:selected').val();
    var sectionDivName = "";
    // hide all message sections
    for (var i = 1; i <= 5; i++) {
	sectionDivName = "section_" + id + i;
	var divControl = form.find("div#" + sectionDivName + "");
	divControl.hide();
    }
    // show only the selected message
    sectionDivName = "section_" + id + selectedOptVal;
    form.find("div#" + sectionDivName + "").show();

}

/**
 * Dialog Helper class.
 */
var TLGDialog = function(oSettings) {

    this.oSettings = oSettings;

    /**
     * Private members
     */
    var alertMsg = "";
    var srcEventObj = null;
    var that = this;
    var modalType = "alert"; // Type must be in "alert" or "confirm"

    /**
     * Initialize Modal dialog.
     */
    this.initialize = function() {
	$(that.oSettings.selector)
		.dialog(
			{
			    title : that.oSettings.alertTitle,
			    resizeable : false,
			    modal : true,
			    draggable : false,
			    autoOpen : false,
			    width : 400,
			    minWidth : 400,
			    maxWidth : 500,
			    maxHeight : 200,
			    minHeight : 150,
			    open : function(event, ui) {
				event.preventDefault();
				// Set popup content
				var htmlTxt = "<div id='dlgbody' style='border-bottom: 1px solid #EEEEEE;padding-bottom:10px;padding-top:5px;'>"
					+ that.alertMsg + "</div>";

				if (that.modalType == "confirm") {
				    htmlTxt = htmlTxt
					    + "<p/><div id='dlgfooter' style='padding-bottoom:0;padding-top:5px;'><a id='btnOK' name='btnOK' class='btn' style='margin-left:30%; width:50px'>OK</a>";
				    htmlTxt = htmlTxt
					    + "<a id='btnCancel' name='btnCancel' class='btn' style='margin-left:4px; width:50px'>Cancel</a></div>";
				} else {
				    htmlTxt = htmlTxt
					    + "<p/><div id='dlgfooter' style='padding-bottoom:0;padding-top:5px;'><a id='btnOK' name='btnOK' class='btn' style='margin-left:40%; width:50px'>OK</a></div>";
				}
				$(that.oSettings.selector).html(htmlTxt);

				$(that.oSettings.selector).find('#btnOK').on('click', function(event) {
				    event.preventDefault();
				    if (that.modalType == "confirm") {

					$(that.oSettings.selector).dialog("close");
					that.confirmCallback();
				    } else $(that.oSettings.selector).dialog("close");

				});

				if (that.modalType == "confirm") {
				    $(that.oSettings.selector).find('#btnCancel').on('click', function(event) {
					event.preventDefault();
					$(that.oSettings.selector).dialog("close");

				    });
				}

			    },
			    close : function(event, ui) {
				// Clear message in popup
				$(that.oSettings.selector).html("");
				that.srcEventObj.focus();
			    }
			});

    };
    /**
     * Show alert dialog.
     */
    this.alert = function(srcEventObj, msg) {
	that.alertMsg = msg;
	that.srcEventObj = srcEventObj;
	that.modalType = "alert";
	$(that.oSettings.selector).dialog("option", "title", that.oSettings.alertTitle);
	$(that.oSettings.selector).dialog("open");
    };
    /**
     * Show confirm dialog.
     */
    this.confirm = function(srcEventObj, msg, callback) {
	that.alertMsg = msg;
	that.srcEventObj = srcEventObj;
	that.modalType = "confirm";
	that.confirmCallback = callback;
	$(that.oSettings.selector).dialog("option", "title", that.oSettings.confirmTitle);
	$(that.oSettings.selector).dialog("open");
    };

};

/**
 * This function will call in form before submit or validate to clear status message. Also called in datable before submit the editing change to
 * server.
 */
function clearStatusMessage() {
    $("#statusMessage").html("");
    $("#statusMessage").removeClass("alert alert-success");
}

/**
 * Global Intialize.
 */
$(function() {
    // Initialize Modal dialog
    modal = new TLGDialog({
	"selector" : "#myModal",
	"alertTitle" : "Message Dialog",
	"confirmTitle" : "Confirm Dialog"
    });
    modal.initialize();

    // <-- Fixed Apply to checkbox issued
    $("input:checkbox[name='applyTo']").each(
	    function() {
		if ($(this).val() != "all") {

		    $(this).on(
			    'change',
			    function() {
				var srcObj = this;
				var checked = $(srcObj).is(':checked');

				// Try to unselect the 'All' checkbox if some of server unselected.
				if (!checked) {
				    var all = $(srcObj).parent().parent().parent().parent().find(
					    "input:checkbox[name=applyTo]")[0];
				    // console.log(all);
				    if (all)
					$(all).prop('checked', false);
				} else {
				    // Try to set selected to 'All' checkbox
				    var bCheckedAll = true;
				    $(srcObj).parent().parent().parent().parent().find("input:checkbox[name=applyTo]")
					    .each(function() {
						if ($(this).val() != "all") {
						    if (!$(this).is(':checked')) {
							bCheckedAll = false;
						    }
						}

					    });
				    if (bCheckedAll) {
					var all = $(srcObj).parent().parent().parent().parent().find(
						"input:checkbox[name=applyTo]")[0];
					// console.log(all);
					if (all)
					    $(all).prop('checked', true);
				    }
				}

			    });
		}
	    });
    // -->
    // add numberic validation
    $(".dicimal").numeric();
    $(".numeric").numeric(false, function() {
	alert("Integers only");
	this.value = "";
	this.focus();
    });
    $(".unsign-int").numeric({
	negative : false
    }, function() {
	alert("No negative values");
	this.value = "";
	this.focus();
    });

    $('input[type=file]').each(
	    function() {
		var fileUpload = $(this);
		var textBox = $('<input type="text" readonly />');
		textBox.css('width', fileUpload.width() - 10).css('margin-right', 5).prop('disabled',
			fileUpload.prop('disabled'));

		var button = $('<input type="button"  value="Choose file .." />').prop('disabled',
			fileUpload.prop('disabled'));

		fileUpload.change(function(data) {

		    // textBox.val(fileUpload.val());
		    var filename = fileUpload.context.files[0].name;
		    // console.log(filepath);
		    textBox.val(filename);
		});
		try {
		    if (fileUpload[0].defaultValue != "") {
			textBox.val(fileUpload[0].defaultValue);
		    }
		} catch (err) {
		    console.log(err);
		}
		button.click(function() {
		    fileUpload.click();
		});

		fileUpload.after(button).after(textBox);
		fileUpload.hide();
	    });
});

/**
 * Generate HTML table for server list. In each row will contains each platform servers and each row allows to have maximum 3 colums. if platform have
 * more than 3 servers it will divided by 3 columns.
 * 
 * @param sData
 * @param serverGroups
 * @param serverListAll
 * @returns {String} Return HTML Table string.
 */
function createServerListTable(sData, serverGroups, serverListAll) {
    var groupId;
    var servername;
    var shortServername;
    var groupItemCountTotal = {};
    var groupItemCount = {};
    var groupItemColumnCount = {};
    var isNewRowAdded = false;

    // <-- Find Total Server In each group
    for ( var gIdx in serverGroups) {
	groupItemCount[gIdx] = 0;
	groupItemCountTotal[gIdx] = 0;
	groupItemColumnCount[gIdx] = 0;
	groupId = serverGroups[gIdx]["groupid"];

	for ( var sIdx in serverListAll) {
	    if (groupId == serverListAll[sIdx]["groupid"]) {
		groupItemCountTotal[gIdx] = groupItemCountTotal[gIdx] + 1;
	    }
	}
    }
    // -->

    htmlTxt = "<table style='border-left:none;'>";
    for ( var gIdx in serverGroups) {
	groupId = serverGroups[gIdx]["groupid"];
	htmlTxt = htmlTxt + "<tr><td class='exclude'  style='border-left:none;' >";
	// <-- inner table
	htmlTxt = htmlTxt + "<table style='border-left:none; width:100%'>";
	for ( var sIdx in serverListAll) {
	    if (groupId == serverListAll[sIdx]["groupid"]) {

		isNewRowAdded = ((groupItemCount[gIdx] % 3) == 0);
		groupItemCount[gIdx] = groupItemCount[gIdx] + 1;
		groupItemColumnCount[gIdx] = groupItemColumnCount[gIdx] + 1;

		if (isNewRowAdded) {
		    // Add New Row
		    htmlTxt = htmlTxt + "<tr>";
		}
		servername = serverListAll[sIdx]["servername"];

		// <-- Find server short name.
		shortServername = servername;
		var pos = servername.indexOf("-", 0);
		if (pos != -1) {
		    pos = servername.indexOf("-", pos + 1);

		    if (pos != -1) {
			shortServername = servername.substr(pos + 1, servername.length - pos);
		    }
		}

		// -->
		// console.log(servername + "==" + sData);
		if (sData.indexOf(servername) != -1) {
		    // Draw checkbox and checked
		    htmlTxt = htmlTxt
			    + "<td class='exclude' style='padding:0px;  border-left:none;'><div style='padding:0;margin-left:2px;'><input style='margin: 4px  0;' type='checkbox' disabled='' id='checkboxServer"
			    + servername + "' value=" + servername + " name='checkboxServer' checked /> #"
			    + shortServername + "</div></td>";
		} else {
		    // Draw checkbox but not checked
		    htmlTxt = htmlTxt
			    + "<td class='exclude' style='padding:0px; border-left:none;'><div style='padding:0;margin-left:2px;'><input style='margin: 4px  0;' type='checkbox' disabled='' id='checkboxServer"
			    + servername + "' value=" + servername + " name='checkboxServer'/> #" + shortServername
			    + "</div></td>";
		}

		// 3 columns reached or reache end of list found
		if ((groupItemColumnCount[gIdx] > 3) || (groupItemCount[gIdx] >= groupItemCountTotal[gIdx])) {
		    // close Row tag.
		    htmlTxt = htmlTxt + "</tr>";
		    groupItemColumnCount[gIdx] = 0;
		}
	    }

	}
	htmlTxt = htmlTxt + "</table>";
	// End inner table -->

	htmlTxt = htmlTxt + "</td></tr>";

    }
    htmlTxt = htmlTxt + "</table>";

    return htmlTxt;
}
/**
 * Handle selection chnage on 'All' option in Apply to servers box.
 */
function onApplyToAllChange(srcObj, groupIdPrefix) {
    var form = $(srcObj).closest("form");
    var checked = $(srcObj).is(':checked');
    var serverid = form.find('#serverid').val();

    // Check or Uncheck all server in group
    form.find('input[id^=\"' + groupIdPrefix + '\"]').each(function() {
	$(this).prop('checked', checked);
    });
    // Reset to checked current selected server tab.
    form.find('input[id=\"' + groupIdPrefix + serverid + '\"]').prop('checked', true);
}

function datetimesecRange(start, end) {
    var startDateTextBox = $('#' + start);
    var endDateTextBox = $('#' + end);
    $(function() {
	$.timepicker.datetimeRange(startDateTextBox, endDateTextBox, {
	    showOn : "both",
	    buttonImage : '../../img/datepicker.png',
	    buttonImageOnly : true,
	    controlType : 'select',
	    minInterval : (1000 * 60 * 60), // 1hr
	    dateFormat : "dd-mm-yy",
	    timeFormat : 'HH:mm:ss',
	    start : {}, // start picker options
	    end : {}
	// end picker options
	});
    });
}
/*
 * controlType: 'select', showOn: "both", buttonImage: '/ussdpush/img/datepicker.png', buttonImageOnly: true, dateFormat: "dd-mm-yy", timeFormat:
 * 'HH:mm:ss'
 */
function datetimeRange(start, end) {
    var startDateTextBox = $('#' + start);
    var endDateTextBox = $('#' + end);
    $(function() {
	$.timepicker.datetimeRange(startDateTextBox, endDateTextBox, {
	    minInterval : (1000 * 60 * 60), // 1hr
	    dateFormat : "dd/mm/yy",
	    timeFormat : 'HH:mm:ss',
	    start : {}, // start picker options
	    end : {}
	// end picker options
	});
    });
}
/**
 * Handle selection for jquery.
 */
function initMessageStatus(status_messages, success_status) {

    $(".close").click(function(e) {
	$(this).parent("div").hide();
    });

    if (status_messages != "" && success_status != "") {
	$('html, body').animate({
	    scrollTop : $('#statusMessages').offset().top
	}, 'slow');
	$('.alert').show();
	if (!$("#statusMessages").hasClass("alert")) {
	    $("#statusMessages").addClass("alert");
	}
	$('#statusMessages').show();
	if (success_status == "alert-success") {
	    $('#msgDone').show();
	    $('#msgFail').hide();
	} else {
	    $('#msgDone').hide();
	    $('#msgFail').show();
	}
	$('#statusMessages').removeClass("alert-success");
	$('#statusMessages').removeClass("alert-failure");
	$('#statusMessages').addClass(success_status);
	$('#msgStatus').html(status_messages);
    } else {
	$('#statusMessages').hide();
    }

}

function initMessageFieldStatus(status_messages, field_name, success_status) {
    $(".close").click(function(e) {
	$(this).parent("div").hide();
    });

    if (status_messages != "" && success_status != "") {
	$('html, body').animate({
	    scrollTop : $('#statusMessages').offset().top
	}, 'slow');
	$('.alert').show();
	if (!$("#statusMessages").hasClass("alert")) {
	    $("#statusMessages").addClass("alert");
	}
	$('#statusMessages').show();
	if (success_status == "alert-success") {
	    $('#msgDone').show();
	    $('#msgFail').hide();
	    $("input[type='text']").css('border-color', '#ccc');
	} else {
	    $('#msgDone').hide();
	    $('#msgFail').show();
	}
	$('#statusMessages').removeClass("alert-success");
	$('#statusMessages').removeClass("alert-failure");
	$('#statusMessages').addClass(success_status);
	$('#msgStatus').text(status_messages);

	// -- add css(border-color) for input text error --//
	if (success_status == "alert-failure") {
	    $('#' + field_name).css('border-color', 'red');
	} else {
	    $("input[type='text']").css('border-color', '#ccc');
	}
    } else {
	$('#statusMessages').hide();
    }

}

$(function() {
    /**
     * Generate message status >
     */

    /**
     * Generate validate class Ex <input type="text" class="datetime">
     */
    $(".datetime").datetimepicker({
	controlType : 'select',
	showOn : "both",
	buttonImage : '../../img/datepicker.png',
	buttonImageOnly : true,
	dateFormat : "dd-mm-yy",
	timeFormat : 'HH:mm'

    });
    $(".datetimesec").datetimepicker({
	controlType : 'select',
	showOn : "both",
	buttonImage : '../../img/datepicker.png',
	buttonImageOnly : true,
	dateFormat : "dd-mm-yy",
	timeFormat : 'HH:mm:ss'
    });
    $('.time-default').timepicker({
	controlType : 'select',
	timeFormat : 'HH:mm'
    });
    $('.time').timepicker({
	controlType : 'select',
	timeFormat : 'HH:mm'
    });
    $('.timesec').timepicker({
	controlType : 'select',
	timeFormat : 'HH:mm:ss'
    });
    $('.dates').datepicker({
	dateFormat : "dd-mm-yy",
	showOn : "both",
	buttonImage : '../../img/datepicker.png',
	buttonImageOnly : true

    });
    /**
     * Generate validate prefix "regex_" is regular expression and "msg_" is message to show on invalid input.
     */
    var regex_port = /^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/;
    var msg_port = 'Invalid data! Please enter in (Decimal: 0 - 65535).';
    var regex_ip = "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
    var msg_ip = 'Invalid Ip Address! Please enter in (Format: Ipv4 format).';
    var regex_user = /^[a-zA-Z0-9_]{1,30}$/;
    var msg_user = 'Invalid Username! Please enter alphabetical or numeric characters';
    var regex_string = /^[\x20-\x7F]+$/;
    var msg_string = 'Invalid string ! Please enter Ascii characters';
    var regex_string_nocomma = /^[\x20-\x2B\x2D-\x7F]+$/;
    var msg_string_nocomma = 'Invalid string ! Please enter only Ascii characters without comma.';
    var regex_password = /^[\x20-\x7F]+$/;
    var msg_password = 'Invalid password';
    var regex_stringname = /^[a-zA-Z0-9_-]+$/;
    var msg_stringname = 'Invalid name! Please enter alphabetical or numeric characters';
    var regex_shortcode = /^[\*#][0-9\*#]+$/;
    var msg_shortcode = 'Invalid shortcode! Please enter in (Format: Shortcode format).';
    var regex_cos = /(^\*|(^[0-9]+))((\,)(\*|[0-9]+)){0,}$/;
    var msg_cos = 'Invalid cos! Please enter in (Format: cos format).';
    var regex_unix_path = /^\/[^\/]?$|^\/[a-zA-Z0-9._-]{1,}(\/[a-zA-Z0-9._-]{0,})*$/;
    // var regex_unix_path = /^\/[^\/]?$|^\/[a-zA-Z0-9_-]{1,}(\/[a-zA-Z0-9_-]{0,})*$/;
    var msg_path = 'Invalid path! Please enter in (Format: path format).';
    // var regex_unix_filename = /^[\w,\s-]*[.]{0,1}[A-Za-z]{1,4}$/;
    var regex_unix_filename = /^[\w\-]*[.]{0,1}[A-Za-z]{1,4}$/;

    var msg_unix_filename = 'Invalid filename! Please enter in (Format: filename format).';
    var regex_camproname = /^[a-zA-Z0-9\s-_]{1,}$/;
    var msg_camproname = "Invalid CamProName ! Please enter in (Format: CamProName format).";
    var msg_logclose = 'Invalid logclose! Please enter  0, 15, 20, 30, 60';
    var regex_msisdn = /((^[\d]+(-[\d]+)?|(^\*[\d]+)|(^[\d]+\*))(,(([\d]+\*)|(\*[\d]+)|([\d]+(-[\d]+)?))){0,})$/;
    var msg_msisdn = "Invalid MSISDN ! Ex: 6689xxxxxxx *789, 6689aaaaaaa-6689aaaaaac,668989*).";
    var msg_cos = "Invalid COS ! Please enter in (Format: COS format).";
    var msg_excos = "Invalid Exclude COS ! Please enter in (Format: Exclude COS format).";
    var regex_cos = /(^\*|(^[0-9]{1,}))((\,)(\*|[0-9]{1,})){0,}$/;

    var regex_lang_id = /^[0-9]{1,}$/;
    var msg_lang_id = "Invalid Language ID!... Please input Decimal: 0-99 digits only.";
    var regex_lang_name = /^[a-zA-Z0-9]*$/;
    var msg_lang_name = "Invalid Language Name!... Please input Characters: 1-100 characters .";

    var regex_url = /^[a-zA-Z0-9-\.-\:-\_]/;
    var msg_url = "Invalid Format URL!... Please input Characters: 1-100 characters .";
    var regex_msisdn_no_start = /^[66]{2,}[0-9]{9}$/;
    var msg_msisdn_no_start = "Invalid MSISDN ! Ex: 6689xxxxxxx";

    /**
     * Add validation to rule for add to addClassRules
     */
    $.validator.addMethod("regex-msisdn", function(value, element) {
	var re = regex_msisdn;
	return this.optional(element) || re.test(value);
    }, msg_msisdn);
    
    //-- Sarisa Sri 01/09/2017  msisdn no start --//
    $.validator.addMethod("regex-msisdn-no-start", function(value, element) {
	var re = regex_msisdn_no_start;
	return this.optional(element) || re.test(value);
    }, msg_msisdn_no_start);
    
    $.validator.addMethod("regex-cos", function(value, element) {
	var re = regex_cos;
	return this.optional(element) || re.test(value);
    }, msg_cos);
    $.validator.addMethod("regex-excos", function(value, element) {
	var re = regex_cos;
	return this.optional(element) || re.test(value);
    }, msg_excos);
    $.validator.addMethod("regex-camproname", function(value, element) {
	var re = regex_camproname;
	return this.optional(element) || re.test(value);
    }, msg_camproname);
    $.validator.addMethod("regex", function(value, element, regexp) {
	var re = new RegExp(regexp);
	return this.optional(element) || re.test(value);
    }, "Please check your input.");

    $.validator.addMethod("regex-port16bit", function(value, element) {
	var re = regex_port;
	return this.optional(element) || re.test(value);
    }, msg_port);
    $.validator.addMethod("regex-ip", function(value, element) {
	var re = new RegExp(regex_ip);
	return this.optional(element) || re.test(value);
    }, msg_ip);

    $.validator.addMethod("regex-string-nocomma", function(value, element) {
	var re = regex_string_nocomma;
	return this.optional(element) || re.test(value);
    }, msg_string_nocomma);
    $.validator.addMethod("regex-string", function(value, element) {
	var re = regex_string;
	return this.optional(element) || re.test(value);
    }, msg_string);
    $.validator.addMethod("regex-username", function(value, element) {
	var re = regex_user;
	return this.optional(element) || re.test(value);
    }, msg_user);
    $.validator.addMethod("regex-password", function(value, element) {
	var re = regex_password;
	return this.optional(element) || re.test(value);
    }, msg_password);
    $.validator.addMethod("regex-stringname", function(value, element) {
	var re = regex_stringname;
	return this.optional(element) || re.test(value);
    }, msg_stringname);
    $.validator.addMethod("regex-shortcode", function(value, element) {
	var re = regex_shortcode;
	return this.optional(element) || re.test(value);
    }, msg_shortcode);
    $.validator.addMethod("regex-cos", function(value, element) {
	var re = regex_cos;
	return this.optional(element) || re.test(value);
    }, msg_cos);
    $.validator.addMethod("regex-unix-path", function(value, element) {
	var re = regex_unix_path;
	return this.optional(element) || re.test(value);
    }, msg_path);
    $.validator.addMethod("regex-unix-filename", function(value, element) {
	var re = regex_unix_filename;
	return this.optional(element) || re.test(value);
    }, msg_unix_filename);
    $.validator.addMethod("regex-logclose", function(value, element) {
	var list = [ 0, 15, 20, 30, 60 ];
	var check = false;
	for (var i = 0; i < list.length; ++i) {
	    if (list[i] == value) {
		check = true;
		break;
	    }
	}
	return check;
    }, msg_logclose);

    $.validator.addMethod("regex_lang_id", function(value, element) {
	var re = new RegExp(regex_lang_id);
	return this.optional(element) || re.test(value);
    }, msg_lang_id);

    $.validator.addMethod("regex_lang_name", function(value, element) {
	var re = new RegExp(regex_lang_name);
	return this.optional(element) || re.test(value);
    }, msg_lang_name);

    $.validator.addMethod("regex_url", function(value, element) {
	var re = new RegExp(regex_url);
	return this.optional(element) || re.test(value);
    }, msg_url);

    // add validate to class
    $('.counter_valid').val("1");

    jQuery.validator.addClassRules({
	cos__valid : {
	    'required' : false,
	    'regex-cos' : true
	},
	excos_valid : {
	    'required' : false,
	    'regex-excos' : true
	},
	msisdn_valid : {
	    'required' : false,
	    'regex-msisdn' : true
	},
	msisdn_no_start_valid : {
	    'required' : false,
	    'regex-msisdn-no-start' : true
	},
	stringname_valid : {
	    'required' : true,
	    'regex-stringname' : true
	},
	string_no_comma_valid : {
	    'required' : true,
	    'regex-string-nocomma' : true
	},
	string_valid : {
	    'required' : true,
	    'regex-string' : true
	},
	string_valid_norequired : {

	    'regex-string' : true
	},
	camproname_valid : {
	    'required' : true,
	    'regex-camproname' : true
	},
	logclose_valid : {
	    'required' : true,
	    'regex-logclose' : true
	},
	counter_valid : {
	    'required' : true,
	    min : 0,
	    max : 100
	},
	port_valid : {
	    maxlength : 5,
	    'required' : true,
	    'regex-port16bit' : true,
	    minlength : 1
	},
	user_valid : {
	    maxlength : 30,
	    'required' : true,
	    'regex-username' : true,
	    minlength : 1
	},
	password_valid : {
	    maxlength : 30,
	    'required' : true,
	    'regex-password' : true,
	    minlength : 1
	},
	shortcode_valid : {
	    maxlength : 30,
	    'required' : true,
	    'regex-shortcode' : true,
	    minlength : 1
	},
	cos_valid : {
	    maxlength : 100,
	    'required' : true,
	    'regex-cos' : true,
	    minlength : 1
	},
	unix_path_valid : {
	    maxlength : 100,
	    'required' : true,
	    'regex-unix-path' : true,
	    minlength : 1
	},
	unix_filename_valid : {
	    maxlength : 100,
	    'required' : true,
	    'regex-unix-filename' : true,
	    minlength : 1
	},
	ip_valid : {
	    maxlength : 15,
	    'required' : true,
	    'regex-ip' : true,
	    minlength : 1
	},
	language_id_valid : {
	    maxlength : 2,
	    'required' : true,
	    'regex_lang_id' : true,
	    minlength : 1
	},
	language_name_valid : {
	    maxlength : 100,
	    'required' : true,
	    'regex_lang_name' : true,
	    minlength : 1
	},

	umb_name_valid : {
	    maxlength : 30,
	    'required' : true,
	    'regex_lang_name' : true,
	    minlength : 1
	},
	umb_url_valid : {
	    maxlength : 100,
	    'required' : true,
	    'regex_url' : true,
	    minlength : 1
	},
	umb_weight_valid : {
	    maxlength : 10,
	    'required' : true,
	    'regex_lang_id' : true,
	    minlength : 1
	}

    });

});

function disableAllPage(child) {
    disableChild(child);

}

function disableChild(child) {

    if (child.children() != undefined && child.children().length > 0) {
	if (child.children().each(function() {
	    var child = $(this);
	    if (child.is("select")) {
		// $(child).prop('readonly', true);
		$(this).prop("disabled", true);
	    }
	    // if(child[0]!=undefined ){
	    // var type = $(child[0]).attr("type");
	    //       		   
	    // $(child).prop('readonly', true);
	    // 				 
	    // 				 
	    // 				
	    // }
	    // $(child).prop('readonly', true);
	    //			
	    //		 

	    disableChild(child);
	}))
	    ;
    } else {
	if (child.is("input")) {

	    var type = $(child).attr("type");
	    if (type == "text") {
		$(child).unbind('focus');

	    }
	    if (type == "button" || type == "reset" || type == "submit") {
		$(child).prop('disabled', true);
		$(child).prop('readonly', true);

	    }

	} else if (child.is("img")) {

	    var name = $(child).attr("class");
	    if (name == "ui-datepicker-trigger") {
		$(child).css('visibility', 'hidden');

	    }

	} else if (child.is("button")) {
	    $(child).prop('disabled', true);
	    $(child).prop('readonly', true);

	}

	$(child).prop('readonly', true);
	$(child).click(function() {
	    return false;
	});

    }

}

function enableChild(child) {

    if (child.children().length > 0) {
	if (child.children().each(function() {
	    var child = $(this);
	    if (child.is("select")) {
		// $(child).prop('readonly', true);
		$(this).prop("disabled", false);
	    }
	    // if(child[0]!=undefined ){
	    // var type = $(child[0]).attr("type");
	    //       		   
	    // $(child).prop('readonly', true);
	    // 				 
	    // 				 
	    // 				
	    // }
	    // $(child).prop('readonly', true);
	    //			
	    //		 

	    enableChild(child);
	}))
	    ;
    } else {
	if (child.is("input")) {

	    var type = $(child).attr("type");
	    if (type == "text") {
		$(child).unbind('focus');

	    }

	}
	if (child.is("img")) {

	    var name = $(child).attr("class");
	    if (name == "ui-datepicker-trigger") {
		$(child).css('visibility', ' ');

	    }

	}
	$(child).prop('readonly', false);
	$(child).click(function() {
	    return false;
	});

    }

}

function dateRange(start, end) {

    var startTimeTextBox = $('#' + start);
    var endTimeTextBox = $('#' + end);
    $(startTimeTextBox).datepicker({
	showOn : "both",
	buttonImage : '../../img/datepicker.png',
	buttonImageOnly : true,
	dateFormat : "dd-mm-yy",

	onSelect : function() {
	    var date = $(this).datepicker('getDate');
	    if (date) {
		date.setDate(date.getDate());
		var dateObject = new Date(date);
		dateObject.setDate(dateObject.getDate() + 1);
		$(endTimeTextBox).datepicker('setDate', dateObject);
	    }
	    $(endTimeTextBox).datepicker('option', 'minDate', date);
	}
    });
    $(endTimeTextBox).datepicker({
	showOn : "both",
	buttonImage : '../../img/datepicker.png',
	buttonImageOnly : true,
	dateFormat : "dd-mm-yy",
	onSelect : function() {
	    var date = $(this).datepicker('getDate');
	    if (date) {
		date.setDate(date.getDate());
	    }
	    $(startTimeTextBox).datepicker('option', 'maxDate', date);
	}
    });

}
