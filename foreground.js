class DatagridZoomer {
    static dataGridSelector = "jbh-data-grid, app-table, shared-data-panel, jbh-tree-data-grid, app-list-view, app-data-table";
    static pageHeaderContainerSelector = ".jbh-page-header-container h1, app-title h1";
    static breadcrumbSelector = ".p-breadcrumb, p-breadcrumb";
    static tableCaptionSelector = '.table-caption h2, .table-caption h3, p-header h2, p-header h3, .p-datatable-header .h2, .p-datatable-header .h3, .p-datatable div[jbh-slot="customTitle"], .ui-table-caption h2, .ui-table-caption h3';
    static tableSelector = ".ui-table-scrollable-wrapper, .p-datatable-wrapper"
 
    static btnClass = "zoomer-button";
    static zoomInClass = "zoom-in";
    static zoomOutClass = "zoom-out";
    static highestZoom = 2.5;
    static lowestZoom = 1;
    static zoomIncrement = .25;
    
    static zoomerAttribute = "zoomer";

    constructor() {
        console.debug('Datagrid Zoomer Loaded');
        setInterval(() =>{
            console.debug('DGZ - Looking for DGs');
            const datagrids = document.querySelectorAll(DatagridZoomer.dataGridSelector);
            datagrids.forEach((datagrid) => {
                if(!datagrid.getAttribute(DatagridZoomer.zoomerAttribute)) {
                    try {
                        console.debug("got unprocessed data grid");
                        const tableCaption = datagrid.querySelector(DatagridZoomer.tableCaptionSelector);
                        console.debug(tableCaption);
                        if(tableCaption && tableCaption.innerText != "") {
                            console.debug("got table caption");
                            const storageKey = this.getStorageKey(tableCaption.innerText);
                            console.debug("storage key = " + storageKey);
                            let closestTable = datagrid.querySelector(DatagridZoomer.tableSelector);
                            if(closestTable) {
                                console.debug("got closest table");
                                tableCaption.appendChild(this.createZoomerButton(true, closestTable, storageKey));
                                tableCaption.appendChild(this.createZoomerButton(false, closestTable, storageKey));
                                
                                let storedZoom = localStorage.getItem(storageKey);
                                if(storedZoom) {
                                    console.debug("got stored zoom " + storedZoom);
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
        }, 3000)
    }
    getStorageKey(suffix) {
        let storageKeyPrefix = "zoomerTable_";
        const breadCrumbs = document.querySelector(DatagridZoomer.breadcrumbSelector)
        if(breadCrumbs && breadCrumbs.innerText != "") {
            storageKeyPrefix += breadCrumbs.innerText + "_";
        }
        storageKeyPrefix += suffix;
        let cleanedPrefix = storageKeyPrefix.replace(/(\r\n|\n|\r)/gm, "").replace(/ /gm, "");
        return cleanedPrefix.substring(0, cleanedPrefix.indexOf("("));
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