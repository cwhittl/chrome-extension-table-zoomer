class DatagridZoomer {
    static dataGridSelector = "jbh-data-grid";
    static btnClass = "zoomer-button";
    static zoomInClass = "zoom-in";
    static zoomOutClass = "zoom-out";
    static pageHeaderContainerSelector = ".jbh-page-header-container h1";
    static breadcrumbSelector = ".p-breadcrumb";
    static tableCaptionSelector = ".table-caption h2";
    static tableSelector = "table.p-datatable-table";

    constructor() {
        setInterval(() =>{
                const mainStorageKeyPrefix = this.getMainStorageKeyPrefix();
                if(mainStorageKeyPrefix) {
                    const datagrids = document.querySelectorAll(DatagridZoomer.dataGridSelector);
                    datagrids.forEach((datagrid) => {
                        if(!datagrid.getAttribute("zoomer")) {
                            try {
                                const tableCaption = datagrid.querySelector(DatagridZoomer.tableCaptionSelector);
                                const storageKey = mainStorageKeyPrefix + tableCaption.innerHTML;
    
                                let closestTable = datagrid.querySelector(DatagridZoomer.tableSelector);
                                tableCaption.appendChild(this.createZoomerButton(true, closestTable, storageKey));
                                tableCaption.appendChild(this.createZoomerButton(false, closestTable, storageKey));
                                
                                let storedZoom = localStorage.getItem(storageKey);
                                if(storedZoom) {
                                    closestTable.style.zoom = storedZoom.valueOf();
                                    this.resetButtons(datagrid, storedZoom.valueOf())
                                }    
                            } catch (error) {
                                console.error(error);
                            } finally {
                                //This is to keep the buttons from indefinitely adding on error
                                datagrid.setAttribute("zoomer", "true");
                            }
                        }
                    });
                }
        }, 2000)
    }
    getMainStorageKeyPrefix() {
        const pageHeaderContainer = document.querySelector(DatagridZoomer.pageHeaderContainerSelector);
        if(pageHeaderContainer) {
            const headerText = pageHeaderContainer.innerText;
            const breadCrumbs = document.querySelectorAll(DatagridZoomer.breadcrumbSelector)[0].innerText;
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
                if(zoomNumber == 1 && !isZoomInButton) {
                    zoomerButton.disabled = true;
                } else if(zoomNumber > 1.75 && isZoomInButton) {
                    zoomerButton.disabled = true;
                }
            })
    }
};
new DatagridZoomer();