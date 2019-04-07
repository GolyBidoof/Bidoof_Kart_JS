var menuThings;
var menuButtons;

class MenuThings {
    constructor() {
        this.selectedId = 0;
        this.clickedButton = 0;
        this.menuFrame = 0;
        this.currentlyClicked = false;
        this.touchableAreas = [];
        this.music = null;
    }
}

class MenuButton {
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

function initMenu() {
    menuButtons = new Array();
    for (let i=0; i<players.length; i++) {
        var tempClickableArea = new MenuButton(canvas.width/7+140*i, canvas.width/7+140*i+128, canvas.height/2, canvas.height/2+128);
        menuButtons.push(tempClickableArea);
    }

    var okButtonArea = new MenuButton(canvas.width/2-128, canvas.width/2+128, canvas.height-canvas.height/4, canvas.height-canvas.height/4+92);
    menuButtons.push(okButtonArea);
    menuThings = new MenuThings();
    document.onmousedown = menuClick;
    document.onmouseup = menuUnclick;

}

function drawMenu() {
    var menu = document.getElementById("menu-theme");
    menu.play();
    menu.loop = true;
    menu.volume = 0.5;
    if (menu.paused) {
        return;
    } else {
        menuThings.music = menu;
    }
    //ctx.drawImage(imagesToLoad[7].image, canvas.width/2, canvas.height/2, 64, 64);
    //ctx.drawImage(imagesToLoad[8].image, canvas.width/2, canvas.height/2, 64, 64);
    menuThings.menuFrame += 0.5;
    menuThings.menuFrame %= 65535;

    ctx.save();
    ctx.translate(-menuThings.menuFrame, -menuThings.menuFrame);
    ctx.fillStyle = ctx.createPattern(imagesToLoad[14].image, "repeat");
    ctx.fillRect(0, 0, canvas.width+65535, canvas.height+65535);
    ctx.restore();

    menuText();

    for (let i=0; i<players.length; i++) {
        if (i==menuThings.clickedButton && menuThings.currentlyClicked == true) {
            ctx.drawImage(imagesToLoad[7].image, canvas.width/7+140*i, canvas.height/2, 128, 128);
        } else if (i==menuThings.selectedId) {
            ctx.drawImage(imagesToLoad[8].image, canvas.width/7+140*i, canvas.height/2, 128, 128);
        } else {
            ctx.drawImage(imagesToLoad[6].image, canvas.width/7+140*i, canvas.height/2, 128, 128);
        }
        ctx.drawImage(players[i].image, canvas.width/7+140*i, canvas.height/2, 128, 128);
    }
    if (menuThings.clickedButton==players.length && menuThings.currentlyClicked == true) {
        ctx.drawImage(imagesToLoad[16].image, canvas.width/2-128, canvas.height-canvas.height/4, 256, 92);
    } else if (players.length==menuThings.selectedId) {
        ctx.drawImage(imagesToLoad[17].image, canvas.width/2-128, canvas.height-canvas.height/4, 256, 92);
    } else {
        ctx.drawImage(imagesToLoad[15].image, canvas.width/2-128, canvas.height-canvas.height/4, 256, 92);
    }
    
}

function menuClick(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    for (let i=0; i<menuButtons.length; i++) {
        if (x>menuButtons[i].x1 && x<menuButtons[i].x2 && y>menuButtons[i].y1 && y<menuButtons[i].y2) {
            if (menuThings.currentlyClicked==false && i!=menuButtons.length-1) {
                var sfx = document.getElementById("selecting-character");
                sfx.volume = 0.5;
                if (sfx.paused) {
                    sfx.play();
                } else {
                    sfx.currentTime = 0;
                }
            }
            menuThings.currentlyClicked = true;
            if (i<menuButtons.length-1) menuThings.selectedId = i;
            menuThings.clickedButton = i;
            break;
        } else {
            menuThings.currentlyClicked = false;
        }
    }
}

function menuUnclick() {
    menuThings.currentlyClicked = false;
    if (menuThings.clickedButton == menuButtons.length-1) {
        document.onmousedown = null;
        document.onmouseup = null;
        if (menuThings.currentlyClicked==false) {
            var sfx = document.getElementById("go-to-race");
            sfx.play();
            sfx.volume = 0.5;
            menuThings.music.pause();
        }
        mainGameProperties.currentScreen++;
    }
    mainGameProperties.currentPlayer = menuThings.selectedId;
}