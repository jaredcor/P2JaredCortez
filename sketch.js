let _canvas = {w: 1080, h:720};
let widget_bg = 175;
let curr_temp;
let curr_short_forecast;
let today = new Date();
let month = (today.getMonth()+1)
let day = today.getDate()
let dayOfWeekName = today.toLocaleString('default', {weekday: 'long'});
let time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
let capture;
let articles = [];
let calendar;
let colors=['red','orange', 'yellow','green', 'cyan','blue', 'magenta','white', 'black', 200];
let selectedColorIndex=0;
let palette_cell_size=30;
let x, y;

async function get_temp() {
    const response = await fetch('https://api.weather.gov/gridpoints/LUB/48,32/forecast/hourly');
    const json = await response.json();
    console.log(json);
    curr_temp = json.properties.periods[0].temperature;
    curr_short_forecast = json.properties.periods[0].shortForecast;
}

async function get_news() {
    const response = await fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=tfWnGC8bwzpyOO5TAqpbQUMIYlVc1jEB');
    const json = await response.json();
    console.log(json);
    for (var i = 0; i < 3; i++){
        articles.push(json.results[i].title);
    }
}

function preload() {
    calendar = loadTable('data/calendar.csv', 'csv', 'header');
}

function getMonthName(monthNumber) {
    today.setMonth(monthNumber - 1);
    return today.toLocaleString('en-US', {month: 'long'});
}

function setup() {
    createCanvas(1080, 720);

    capture = createCapture(VIDEO);
    capture.size(1060, 700);
    capture.hide();

    get_temp();
    get_news();
    strokeWeight(5);
    background(200);
}

function draw() {
    // background(colors[selectedColorIndex]);
    scale(-1, 1);
    image(capture, -10, 10, -1060, 700);


    scale(-1, 1)
    noStroke();
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(time, _canvas.w/2, 100);

    text(curr_temp + "°", _canvas.w/2, 140);

    textSize(24);
    text(curr_short_forecast, _canvas.w/2, 170);

    textAlign(LEFT, CENTER);
    text(dayOfWeekName + ",", 20, 170);
    text(getMonthName(month) + " " + day, 20, 200);

    text("Top Stories", 20, 500);
    text("Time in Bed:", 880, 500);

    textSize(16);
    // for (var r = 0; r < calendar.getRowCount(); r++) {
    //     var y_val = 200;
    //     for (var c = 0; c <calendar.getColumnCount(); c++) {
    //         text(calendar.getString(r, c), 20, y_val);
    //         y_val += 50;
    //     }
    // }
    text((calendar.getString(0, 1)) + " - " + calendar.getString(0, 0), 20, 250);
    text((calendar.getString(1, 1)) + " - " + calendar.getString(1, 0), 20, 280);
    text((calendar.getString(2, 1)) + " - " + calendar.getString(2, 0), 20, 310);
    // text((sleep.getString(1, 'Hours asleep') + " h " + sleep.getString(1, 'Minutes asleep') + " m"), 880, 530);
    textWrap(WORD);
    text("7 h 52 m", 880, 530);
    text("Down 58 m from yesterday", 880, 560, 150, 30);
    text("8 m away from your 8 h 0 m goal", 880, 600, 150, 50);
    // for (var i = 0; i < articles.length; i++) {
    //     var j = 530;
    //     text(articles[i], 20, j, 250, 30)
    //     j = j + 80;
    // }
    text(articles[0], 20, 530, 275, 50);
    text(articles[1], 20, 590, 275, 50);
    text(articles[2], 20, 650, 275, 50);


    stroke(175);
    for(let i = 0; i < colors.length; i++){
        fill(colors[i]);
        rect(390+i*palette_cell_size, 675, palette_cell_size, palette_cell_size);
    }
}


function mousePressed() {
    if (mouseX >= 390 && mouseX < 690 && mouseY >= 675 && mouseY < 705) {
        selectedColorIndex = floor((mouseX-390) / palette_cell_size);
        background(colors[selectedColorIndex]);
        // drawing = false;
    // } else {
        x = mouseX;
        y = mouseY;
    //     drawing = true;
    }
}
function mouseDragged(){
    if (drawing) {
        line(x, y, mouseX, mouseY);
        x = mouseX;
        y = mouseY;
    }
}