const { Menu, BrowserWindow, dialog } = require('electron');
const { windows } = require('../windows/windowController');


let hidroMenu = {    
    playValues(values){
        this.values = values;
    },
    menuTemplate : [
        {            
            label: 'edgePlubing',
            submenu: [
                { label: 'Abrir Projeto', click: () => { windows.createSavedWindow() } },
                { type: 'separator' },
                { label: 'Fechar', click: () => { BrowserWindow.getAllWindows().forEach(window => { window.close() }) } },               
            ]            
        }
        
    ],
    playMenu() {                
        const menu = Menu.buildFromTemplate(this.menuTemplate);
        Menu.setApplicationMenu(menu);        
        return Menu        
    },
    playValor(values){
        return this.valor = values;
    },
    
    closeAllWindows(){
        BrowserWindow.getAllWindows().forEach(window => { window.close() });
    },
    saveAs(){
        console.log('pressionou saveAs');
        values = hidroMenu.playValor();
    }
}





module.exports = { hidroMenu }

