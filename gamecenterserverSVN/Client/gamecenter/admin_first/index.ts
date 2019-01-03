///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {
	ADMIN.adminCheckLogin(user => {
		adminindex.LoadData();
	});
});
module adminindex {

    export function LoadData() {
	
	}
}