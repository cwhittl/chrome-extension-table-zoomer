class DatagridZoomer {
    static dataGridSelector = "jbh-data-grid, app-table, shared-data-panel";
    static pageHeaderContainerSelector = ".jbh-page-header-container h1, app-title h1";
    static breadcrumbSelector = ".p-breadcrumb, p-breadcrumb";
    static tableCaptionSelector = ".table-caption h2,.table-caption h3, p-header h2, p-header h3, .p-datatable-header .h2";
    static tableSelector = "table.p-datatable-table, p-table .ui-table .ui-table-scrollable-body table";
 
    static btnClass = "zoomer-button";
    static zoomInClass = "zoom-in";
    static zoomOutClass = "zoom-out";
    static highestZoom = 2;
    static lowestZoom = 1;
    static zoomIncrement = .25;
    
    static zoomerAttribute = "zoomer";

    constructor() {
        setInterval(() =>{
            const datagrids = document.querySelectorAll(DatagridZoomer.dataGridSelector);
            datagrids.forEach((datagrid) => {
                if(!datagrid.getAttribute(DatagridZoomer.zoomerAttribute)) {
                    try {
                        const tableCaption = datagrid.querySelector(DatagridZoomer.tableCaptionSelector);
                        if(tableCaption && tableCaption.innerText != "") {
                            const storageKey = this.getStorageKey(tableCaption.innerText);

                            let closestTable = datagrid.querySelector(DatagridZoomer.tableSelector);
                            if(closestTable) {
                                tableCaption.appendChild(this.createZoomerButton(true, closestTable, storageKey));
                                tableCaption.appendChild(this.createZoomerButton(false, closestTable, storageKey));
                                
                                let storedZoom = localStorage.getItem(storageKey);
                                if(storedZoom) {
                                    closestTable.style.zoom = storedZoom.valueOf();
                                    this.resetButtons(datagrid, storedZoom.valueOf())
                                }
                                datagrid.setAttribute(DatagridZoomer.zoomerAttribute, "true");
                            }    
                        }
                    } catch (error) {
                        console.error(error);
                        //This is to keep the buttons from indefinitely adding on error
                        datagrid.setAttribute(DatagridZoomer.zoomerAttribute, "true");
                    } 
                }
            });
        }, 2000)
    }
    getStorageKey(suffix) {
        let storageKeyPrefix = "zoomerTable_";
        const pageHeaderContainer = document.querySelector(DatagridZoomer.pageHeaderContainerSelector);
        if(pageHeaderContainer) {
            storageKeyPrefix += pageHeaderContainer.innerText + "_";
        }
        const breadCrumbs = document.querySelectorAll(DatagridZoomer.breadcrumbSelector)
        if(breadCrumbs) {
            breadCrumbs[0].innerText;
            storageKeyPrefix += breadCrumbs + "_";
        }
        storageKeyPrefix += suffix;
        return storageKeyPrefix.replace(/(\r\n|\n|\r)/gm, "").replace(/ /gm, "");
       
    }
    createZoomerButton(zoomIn, closestTable, storageKey){
        let btn = document.createElement("button");
        btn.innerHTML = zoomIn ? "+" :" -";
        btn.disabled = zoomIn ? false : true;
        btn.className = DatagridZoomer.btnClass + " " + (zoomIn ? DatagridZoomer.zoomInClass : DatagridZoomer.zoomOutClass);
        btn.onclick = () => {
            let currentZoom = Number(closestTable.style.zoom ? closestTable.style.zoom : DatagridZoomer.lowestZoom);
            let newZoom = zoomIn ? currentZoom+DatagridZoomer.zoomIncrement : currentZoom-DatagridZoomer.zoomIncrement
            this.resetButtons(btn.closest(DatagridZoomer.dataGridSelector), newZoom);
            closestTable.style.zoom = newZoom.valueOf();
            localStorage.setItem(storageKey, newZoom.valueOf())
        }
        return btn;
    }
    resetButtons(datagrid, zoomNumber){
            datagrid.querySelectorAll('.' + DatagridZoomer.btnClass).forEach((zoomerButton) => {
                const isZoomInButton = zoomerButton.className.indexOf(DatagridZoomer.zoomInClass) > -1;
                zoomerButton.disabled = false;
                if(zoomNumber == DatagridZoomer.lowestZoom && !isZoomInButton) {
                    zoomerButton.disabled = true;
                } else if(zoomNumber == DatagridZoomer.highestZoom && isZoomInButton) {
                    zoomerButton.disabled = true;
                }
            })
    }
};
new DatagridZoomer();