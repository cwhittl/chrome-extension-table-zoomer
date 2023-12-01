class DatagridZoomer {
    static dataGridSelector = "jbh-data-grid";
    static btnClass = "zoomer-button";
    static zoomInClass = "zoom-in";
    static zoomOutClass = "zoom-out";
    static pageHeaderContainerSelector = ".jbh-page-header-container h1";
    constructor() {
        setInterval(() =>{
                const mainStorageKeyPrefix = this.getMainStorageKeyPrefix();
                if(mainStorageKeyPrefix) {
                    const datagrids = document.querySelectorAll(DatagridZoomer.dataGridSelector);
                    datagrids.forEach((datagrid) => {
                        if(!datagrid.getAttribute("zoomer")) {
                            const tableCaption = datagrid.querySelector('.table-caption h2');
                            const storageKey = mainStorageKeyPrefix + tableCaption.innerHTML;
                            let closestTable = datagrid.querySelector('table.p-datatable-table');
                            tableCaption.appendChild(this.createZoomerButton(true, closestTable, storageKey));
                            tableCaption.appendChild(this.createZoomerButton(false, closestTable, storageKey));
                            let storedZoom = localStorage.getItem(storageKey);
                            if(storedZoom) {
                                closestTable.style.zoom = storedZoom.valueOf();
                                this.resetButtons(datagrid, storedZoom.valueOf())
                            }
                            datagrid.setAttribute("zoomer", "true");
                        }
                    });
                }
        }, 2000)
    }
    getMainStorageKeyPrefix() {
        const pageHeaderContainer = document.querySelector(DatagridZoomer.pageHeaderContainerSelector);
        if(pageHeaderContainer) {
            const headerText = pageHeaderContainer.innerText;
            const breadCrumbs = document.querySelectorAll(".p-breadcrumb")[0].innerText;
            return (headerText + "_" + breadCrumbs + "_").replace(/(\r\n|\n|\r)/gm, "").replace(/ /gm, "");
        }
        return null;
       
    }
    createZoomerButton(zoomIn, closestTable, storageKey){
        let btn = document.createElement("button");
        btn.innerHTML = zoomIn ? "+" :" -";
        btn.disabled = zoomIn ? false : true;
        btn.className = DatagridZoomer.btnClass + " " + (zoomIn ? DatagridZoomer.zoomInClass : DatagridZoomer.zoomOutClass);
        btn.onclick = () => {
            let currentZoom = Number(closestTable.style.zoom ? closestTable.style.zoom : 1);
            let newZoom = zoomIn ? currentZoom+.25 : currentZoom-.25
            this.resetButtons(btn.closest('jbh-data-grid'), newZoom);
            closestTable.style.zoom = newZoom.valueOf();
            localStorage.setItem(storageKey, newZoom.valueOf())
        }
        return btn;
    }
    resetButtons(datagrid, zoomNumber){
            datagrid.querySelectorAll('.' + DatagridZoomer.btnClass).forEach((zoomerButton) => {
                const zoomInButton = zoomerButton.className.indexOf(DatagridZoomer.zoomInClass) > -1;
                zoomerButton.disabled = false;
                if(zoomNumber == 1 && !zoomInButton) {
                    zoomerButton.disabled = true;
                } else if(zoomNumber > 1.75 && zoomInButton) {
                    zoomerButton.disabled = true;
                }
            })
    }
};
new DatagridZoomer();