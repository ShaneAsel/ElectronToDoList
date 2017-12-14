const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain, dialog, fs} = electron;

let mainWindow;
let addWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow();
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    //adding menu task bar
    const mainToolbar = Menu.buildFromTemplate(menuToolbar);
    Menu.setApplicationMenu(mainToolbar);
    mainWindow.on('closed',  function(){
        app.quit();
    });
});

//Function to display window to add a new task
function createAddWindow(){
    //New window dims
    addWindow = new BrowserWindow({
        width: 300,
        height: 210,
        title:'Add New To-Do Item'
    });
    //reading HTML doc for new window
    addWindow.loadURL(`file://${__dirname}/newItem.html`)
    addWindow.on('close', function(){
        addWindow = null
    });
    addWindow.on('close', function(){
        addWindow = null;
    });
}

//Grab new task
ipcMain.on('newTask:add', function(e, task){
    mainWindow.webContents.send('newTask:add', task)
    addWindow.close();
});

//Page toolbar template
const menuToolbar = [
    {
        label: "File",
        submenu: [
            {
                label: "Open",
                accelerator: process.platform == 'darwin' ? 'Command + O' : 'Ctrl + O',
                click(){
                    openFile();    
                }
            },
            {
                type: 'separator'
            },
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click() {
                app.quit();
                }
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Add Task",
                accelerator: process.platform == 'darwin' ? 'Command + N' : 'Ctrl + N',
                click(){
                    createAddWindow();
                }
            },
            {
                label: "Clear Items",
                accelerator: process.platform == 'darwin' ? 'Command + Z' : 'Ctrl + Z',
                click(){
                    mainWindow.webContents.send('task:clear');
                }
            }
        ]
    },
    {
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle Dev Tools",
                accelerator: process.platform == 'darwin' ? 'Command + I' : 'Ctrl + I',
                click(item, focusedWindow){
                focusedWindow.toggleDevTools();
                }
            },
            {
                label: "Reload",
                accelerator: process.platform == 'darwin' ? 'Command + R' : 'Ctrl + R',
                role: "reload"
            }
        ]
    }
];

//open file
function openFile() {
    dialog.showOpenDialog((filenames) =>{
        if(filenames === undefined){
            alert("Please select a file first.")
            return;
        }
        mainWindow.webContents.send('openFile', filenames[0])
    })
}