///<reference path='../5wansdk.ts' />

module gcglobal {
	export function ShowQuickReg() {
		SDKUTIL.ShowIFrame("quickreg.shtml", false, (ev, divbgpage, iframe) => {
			window.addEventListener("message", function onmsg(ev) {
				switch (ev.data.cmd) {
					case "login":
						SDKUTIL.RemoveIFrame(divbgpage, iframe);
						location.reload();
						break;
					case "cancel":
						SDKUTIL.RemoveIFrame(divbgpage, iframe);
						break;
				}
			});
		});
	}
}