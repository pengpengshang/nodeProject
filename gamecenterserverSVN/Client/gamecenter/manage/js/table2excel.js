function base64 (content) {
       return window.btoa(unescape(encodeURIComponent(content)));         
}
function table2excel(tableID){
		var type = 'excel';
		var table = document.getElementById(tableID);
		var excelContent = table.innerHTML;

		var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
		excelFile += "<head>";
		excelFile += "<!--[if gte mso 9]>";
		excelFile += "<xml>";
		excelFile += "<x:ExcelWorkbook>";
		excelFile += "<x:ExcelWorksheets>";
		excelFile += "<x:ExcelWorksheet>";
		excelFile += "<x:Name>";
		excelFile += "{worksheet}";
		excelFile += "</x:Name>";
		excelFile += "<x:WorksheetOptions>";
		excelFile += "<x:DisplayGridlines/>";
		excelFile += "</x:WorksheetOptions>";
		excelFile += "</x:ExcelWorksheet>";
		excelFile += "</x:ExcelWorksheets>";
		excelFile += "</x:ExcelWorkbook>";
		excelFile += "</xml>";
		excelFile += "<![endif]-->";
		excelFile += "</head>";
		excelFile += "<body>";
		excelFile += excelContent;
		excelFile += "</body>";
		excelFile += "</html>";
		var base64data = "base64," + base64(excelFile);
		switch(type){
			case 'excel':
				window.location.href = 'data:application/vnd.ms-'+type+';'+base64data;
			break;
			case 'powerpoint':
				window.location.href = 'data:application/vnd.ms-'+type+';'+base64data;
			break;
		}
}