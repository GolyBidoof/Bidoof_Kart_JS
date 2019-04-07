function printingTextOnScreen() {
    ctx.fillStyle = "black";
    ctx.font = "20px Bungee";
    ctx.fillText(Math.floor(mainGameProperties.currentLapTime/1000 % 60)  + ":" + ("000" + Math.round(mainGameProperties.currentLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.05);
    ctx.fillText("Lap " + mainGameProperties.currentLap, canvas.width*0.92, canvas.height*0.05);
    ctx.fillText("PB: " + Math.floor(mainGameProperties.currentBestLapTime/1000 % 60) + ":" + ("000" + Math.round(mainGameProperties.currentBestLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.97);
    
    if (mainGameProperties.newLapTextFrame>0) {
        ctx.font = 20+mainGameProperties.newLapTextFrame/2 + "px Bungee";
        var toPrint = '';
        if (mainGameProperties.previousLapTime==mainGameProperties.currentBestLapTime)
            toPrint += "PB! "
        toPrint += Math.floor(mainGameProperties.previousLapTime/1000 % 60) + ":" + ("000" + Math.round(mainGameProperties.previousLapTime % 1000)).slice(-3);
        if (!(mainGameProperties.newLapTextFrame%4==0) || !(mainGameProperties.newLapTextFrame%4==1)) {
            ctx.fillText(toPrint, canvas.width*0.40-mainGameProperties.newLapTextFrame, canvas.height*0.45+mainGameProperties.newLapTextFrame/2);
        }

        mainGameProperties.newLapTextFrame++;
        if (mainGameProperties.newLapTextFrame>150) 
            mainGameProperties.newLapTextFrame=0;
    }
    
}

function menuText() {
    ctx.fillStyle = "white";
    ctx.font = "30px Bungee";
    ctx.fillText("Select your favorite character!", canvas.width*0.27, canvas.height*0.2);
    ctx.font = "20px"
    switch (menuThings.selectedId) {
        case 0:
            ctx.fillText("The leader of the bunch, Bidoof!", canvas.width*0.27, canvas.height*0.35);
            break;
        case 1:
            ctx.fillText("WOBBAWOBBAfett, confirmed epic each time.", canvas.width*0.21, canvas.height*0.35);
            break;
        case 2:
            ctx.fillText("Ludicolo instantly accelerates. He's cool.", canvas.width*0.21, canvas.height*0.35);
            break;
        case 3:
            ctx.fillText("The cutest member of Corpish family!", canvas.width*0.24, canvas.height*0.35);
            break;
        case 4:
            ctx.fillText("Probopass is extremely hard to navigate...", canvas.width*0.21, canvas.height*0.35);
            break;
        case 5:
            ctx.fillText("Stunfisk's stuck on a different planet.", canvas.width*0.24, canvas.height*0.35);
            break;
    }
    

    ctx.fillText("OK", canvas.width/2-20, canvas.height-canvas.height/4+54);
}

function countdownClock() {
    ctx.fillStyle = "black";
    ctx.font = 30 + (300-mainGameProperties.countdownClock)/5 + "px Bungee";
    var beforeCountdown = document.getElementById("start-your-engines");
    if (mainGameProperties.countdownClock>200) {
        beforeCountdown.play();
        beforeCountdown.volume = 0.5;
    } else if (mainGameProperties.countdownClock>140 && mainGameProperties.countdownClock<=200) {
        var countdown = document.getElementById("countdown");
        countdown.play();
        countdown.volume = 0.5;
        ctx.fillText("3", canvas.width*0.5, canvas.height*0.55);
    } else if (mainGameProperties.countdownClock>80 && mainGameProperties.countdownClock<=200) {
        ctx.fillText("2", canvas.width*0.5, canvas.height*0.55);
    } else if (mainGameProperties.countdownClock>0 && mainGameProperties.countdownClock<=100) {
        ctx.fillText("1", canvas.width*0.5, canvas.height*0.55);
    } else if (mainGameProperties.countdownClock<=0 && mainGameProperties.goClock>0) {
        ctx.font = 200 + (300-mainGameProperties.countdownClock)/2 + "px Bungee";
        ctx.fillText("GO!", canvas.width*0.25, canvas.height*0.7);
        mainGameProperties.goClock--;
    }
    if (mainGameProperties.goClock<30) {
        var f8 = document.getElementById("f8-circuit");
        f8.play();
        f8.loop = true;
        f8.volume = 0.5;
    }
    if (!beforeCountdown.paused) {
        mainGameProperties.initiated = true;
    }    
    if (mainGameProperties.initiated) {
        mainGameProperties.countdownClock--;
    } else {
        ctx.fillText("Loading...", canvas.width*0.5, canvas.height*0.05);
    }
}