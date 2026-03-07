p5.disableFriendlyErrors = true; //runs smoother when all testing is done
let weatherData;
//let key = "1875266a412d9f361985a49c9605d437"; //my personal key
let key = "7aa553c6a465f01ce2bf1ea46d98c4b0"; //testing key

//vars for user interaction
let chaos = 0; //random chaos from 0-1
let tourPaused = false;

//sample city - toronto
let lat = 43.6532;
let lon = -79.3832;

//inputs to select lat and lon
let latInput;
let lonInput;

//displays location and time
let displayTime = "--:--";
let displayCity = "---";

//var for weather id code, default = clear
let weatherCondition = "clear";

//for drawing wind
let windLines = [];

//for storing rain/snow.drizzle
let precipitation = [];

//for storing humidity drops
let humidityDroplets = [];

//for bg gradient
let currentTime;
let sunPosition = 0; //default
let bgColor = { r: 0, g: 0, b: 0 };

//var for storing how dim/bright visuals are
let brightness = 1;

//array for star partciles
let stars = [];

// arr for audio
let sounds = {};
let baseVolumes = {}; // stores original volumes

let tourMode = "none"; //choose between cities, timezones, random
let tourInterval = 7000; //ms between api calls
let lastTourTime = 0;
let tourIndex = 0;

// main global city lat/lon
let cities = [
  { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
  { name: "Toronto", lat: 43.6532, lon: -79.3832 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Madrid", lat: 40.4168, lon: -3.7038 },
  { name: "Berlin", lat: 52.52, lon: 13.405 },
  { name: "Moscow", lat: 55.7558, lon: 37.6173 },
  { name: "Rome", lat: 41.9028, lon: 12.4964 },
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
];
//Most populated city per timezone
let timeZones = [
  { name: "Honolulu", lat: 21.3069, lon: -157.8583 }, //-5
  { name: "Anchorage", lat: 61.2181, lon: -149.9003 }, //-4
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 }, //-3
  { name: "Denver", lat: 39.7392, lon: -104.9903 }, //-2
  { name: "Chicago", lat: 41.8781, lon: -87.6298 }, //-1
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 }, //+2
  { name: "London", lat: 51.5074, lon: -0.1278 }, //+5
  { name: "Paris", lat: 48.8566, lon: 2.3522 }, //+6
  { name: "Cairo", lat: 30.0444, lon: 31.2357 }, //+7
  { name: "Moscow", lat: 55.7558, lon: 37.6173 }, //+8
  { name: "Dubai", lat: 25.2048, lon: 55.2708 }, //+9
  { name: "Karachi", lat: 24.8607, lon: 67.0011 }, //+10
  { name: "Delhi", lat: 28.6139, lon: 77.209 }, //+10:30
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 }, //+11
  { name: "Bangkok", lat: 13.7563, lon: 100.5018 }, //+12
  { name: "Beijing", lat: 39.9042, lon: 116.4074 }, //+13
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 }, //+14
  { name: "Sydney", lat: -33.8688, lon: 151.2093 }, //+15
  { name: "Auckland", lat: -36.8509, lon: 174.7645 }, //+17
];

function preload() {
  //weatherData = sampleData; //for testing

  //custom font
  myFont = loadFont("data/Amarante-Regular.ttf");

  //preload waether sounds
  sounds.thunder = loadSound("data/thunder.mp3");
  sounds.thunder.setVolume(0.8);
  baseVolumes.thunder = 0.8;

  sounds.rain = loadSound("data/rain.mp3");
  sounds.rain.setVolume(0.3);
  baseVolumes.rain = 0.3;

  sounds.drizzle = loadSound("data/drizzle.mp3");
  sounds.drizzle.setVolume(0.6);
  baseVolumes.drizzle = 0.6;

  sounds.snow = loadSound("data/snow.mp3");
  sounds.snow.setVolume(0.4);
  baseVolumes.snow = 0.4;

  sounds.clouds = loadSound("data/cloud.mp3");
  sounds.clouds.setVolume(1.2);
  baseVolumes.clouds = 0.4;

  //default sounds if no weather conditions
  sounds.night = loadSound("data/night.mp3");
  sounds.night.setVolume(1.2);
  baseVolumes.night = 1.2;

  sounds.day = loadSound("data/day.mp3");
  sounds.day.setVolume(1.4);
  baseVolumes.day = 1.4;
}

function setup() {
  createCanvas(windowWidth, windowHeight); //size is whole window
  document.body.style.background = "white"; //i added this to stop overlay bleeding
  userStartAudio(); //had to add this so sound auto starts playing

  //default value is toronto
  latInput = createInput("43.6532");
  lonInput = createInput("-79.3832");

  //button to randomize weather data
  let randomBtn = createButton("🎲");

  //button to get call API
  let btn = createButton("Fetch");

  //for modes
  let cityBtn = createButton("City Tour");
  let randomTourBtn = createButton("Random Tour");
  let timeZoneBtn = createButton("Time Zone Tour");

  cityBtn.mousePressed(() => {
    tourMode = "city";
    tourIndex = 0;
    fetchTour();
  });
  randomTourBtn.mousePressed(() => {
    tourMode = "random";
    fetchTour();
  });
  timeZoneBtn.mousePressed(() => {
    tourMode = "timezone";
    tourIndex = 0;
    fetchTour();
  });

  //User interactivity
  // chaos slider and speed slider
  let chaosLabel = createSpan("Chaos Slider: ");
  let chaosSlider = createSlider(0, 1, 0, 0.01);
  chaosSlider.input(() => {
    chaos = chaosSlider.value();
  });

  let speedLabel = createSpan("API Intervals: ");
  let speedSlider = createSlider(5000, 60000, 30000, 1000); //put speed slider here for ordering
  speedSlider.input(() => {
    tourInterval = speedSlider.value();
  });

  // back/next
  let backBtn = createButton("⏮");
  backBtn.style("font-size", "15px");
  backBtn.style("margin-left", "5px");
  backBtn.mousePressed(() => {
    tourIndex = (tourIndex - 2 + cities.length) % cities.length;
    fetchTour();
  });

  // pause/resume
  let pauseBtn = createButton("⏸");
  pauseBtn.style("font-size", "15px");

  pauseBtn.mousePressed(() => {
    tourPaused = !tourPaused;
    pauseBtn.html(tourPaused ? "▶" : "⏸");
  });

  let nextBtn = createButton("⏭");
  nextBtn.style("font-size", "15px");
  nextBtn.mousePressed(() => {
    fetchTour();
  });

  //callback function
  btn.mousePressed(() => {
    //disable current tour
    tourPaused = true;
    tourMode = "none";

    lat = float(latInput.value());
    lon = float(lonInput.value());
    let url =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      key;
    loadJSON(url, (data) => {
      weatherData = data;
      let weatherId = weatherData.weather[0].id;
      if (weatherId >= 200 && weatherId <= 232) {
        weatherCondition = "thunder";
      } else if (weatherId >= 300 && weatherId <= 321) {
        weatherCondition = "drizzle";
      } else if (weatherId >= 500 && weatherId <= 531) {
        weatherCondition = "rain";
      } else if (weatherId >= 600 && weatherId <= 622) {
        weatherCondition = "snow";
      } else if (weatherId >= 700 && weatherId <= 781) {
        weatherCondition = "atmosphere";
      } else if (weatherId > 800 && weatherId <= 804) {
        weatherCondition = "clouds";
      } else if (weatherId == 800) {
        weatherCondition = "clear";
      }

      //play correct sound
      Object.values(sounds).forEach((s) => s.stop());
      if (weatherCondition === "clear") {
        let isDay =
          weatherData.dt >= weatherData.sys.sunrise &&
          weatherData.dt <= weatherData.sys.sunset;
        isDay ? sounds.day.loop() : sounds.night.loop();
      } else if (sounds[weatherCondition]) {
        sounds[weatherCondition].loop();
      }

      resetVisuals();
      //initilaize visualize functions
      initWind();
      initHumidity();
      initPrecipitation();
      //console.log(weatherData); //logs the JSON data
      displayTime = convertLocalTime(weatherData.dt, weatherData.timezone);
      displayCity = weatherData.name;
    });
  });

  //initliaze stars with pos, twinkle, size, twinklespeed
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.3, 1.25),
      twinkle: random(TWO_PI),
      twinkleSpeed: random(0.02, 0.08),
    });
  }

  randomBtn.mousePressed(() => {
    let randomLat = random(-90, 90).toFixed(4);
    let randomLon = random(-180, 180).toFixed(4);
    latInput.value(randomLat);
    lonInput.value(randomLon);
  });
}

function draw() {
  background(0);
  //check if its loaded
  if (weatherData) {
    //gets data form JSON
    currentTime = weatherData.dt;
    let sunrise = weatherData.sys.sunrise;
    let sunset = weatherData.sys.sunset;

    //gets sun position from sunrise,sunset and time
    sunPosition = (currentTime - sunrise) / (sunset - sunrise);

    // brightness based on clouds
    brightness = 1 - (weatherData.clouds.all / 100) * 0.6;

    //scales volume based on chaos level
    Object.entries(sounds).forEach(([key, s]) => {
      if (s.isPlaying() && baseVolumes[key]) {
        s.setVolume(baseVolumes[key] * (1 + chaos * 0.5)); // chaos boosts volume up to 50%
      }
    });

    drawGradient(); //updates bg
    drawWind(); //draws wind lines
    drawPrecipitation(); //draws precipitarion
    drawLightning(); //draws the lightning
    drawFog(); //draws fog based on visilibty
    drawHumidity();
    drawStars(); //draws stars on canvas
    drawThermometer(); //draw thermometer on canvas
    drawLocationDisplay(); //print time and location
    if (weatherData.clouds.all < 80) drawSun(); //draws sun if less than 80% cloud cover
    if (weatherData.clouds.all < 80) drawMoon(); //draws moon
  } else {
    background(0); //default
    drawWelcome(); //welcome page
  }
  //interval is dynamic
  if (
    tourMode !== "none" &&
    !tourPaused &&
    millis() - lastTourTime > tourInterval
  ) {
    fetchTour();
  }
}

// TIME FORMATTING FUNCTIONS
// function to scale and format time
function formatTime(second) {
  let hour = Math.floor(second / 3600);
  let minute = Math.floor((second % 3600) / 60);
  //added this so time is always displayed in 24 hour 00:00 format
  let minuteStr = minute < 10 ? "0" + minute : minute;
  //return hour + minute/100;
  return hour + ":" + minuteStr;
}

// converts to the local time of api call
function convertLocalTime(second, timeZone) {
  second = second + timeZone;
  second = ((second % 86400) + 86400) % 86400;
  return formatTime(second);
}

//draws gradient for bg
function drawGradient() {
  let c = 1 + chaos * 0.5; // chaos color saturation boost of 0.5
  for (let y = 0; y < height; y++) {
    let gradientPosition = y / height; // 0 is top, 1 is bottom
    let top, bottom;
    //midnight
    if (sunPosition < 0 || sunPosition > 1) {
      top = color(5 * brightness * c, 5 * brightness * c, 35 * brightness * c);
      bottom = color(
        15 * brightness * c,
        5 * brightness * c,
        50 * brightness * c
      );
    }

    //early morning
    else if (sunPosition < 0.15) {
      top = color(
        80 * brightness * c,
        20 * brightness * c,
        120 * brightness * c
      );
      bottom = color(
        255 * brightness * c,
        120 * brightness * c,
        60 * brightness * c
      );
    }

    //morning
    else if (sunPosition < 0.35) {
      top = color(
        255 * brightness * c,
        160 * brightness * c,
        50 * brightness * c
      );
      bottom = color(
        255 * brightness * c,
        220 * brightness * c,
        120 * brightness * c
      );
    }

    //afternoon
    else if (sunPosition < 0.65) {
      top = color(
        20 * brightness * c,
        80 * brightness * c,
        200 * brightness * c
      );
      bottom = color(
        100 * brightness * c,
        200 * brightness * c,
        255 * brightness * c
      );
    }

    //evening
    else if (sunPosition < 0.85) {
      top = color(
        255 * brightness * c,
        100 * brightness * c,
        50 * brightness * c
      );
      bottom = color(
        255 * brightness * c,
        180 * brightness * c,
        80 * brightness * c
      );
    }

    //nighttime
    else {
      // dusk - deep magenta into midnight blue
      top = color(
        100 * brightness * c,
        20 * brightness * c,
        80 * brightness * c
      );
      bottom = color(
        20 * brightness * c,
        10 * brightness * c,
        60 * brightness * c
      );
    }

    stroke(lerpColor(top, bottom, gradientPosition));
    line(0, y, width, y);
  }
}

//function for drawing sun in proper position
function drawSun() {
  if (sunPosition < 0 || sunPosition > 1) return; //theres no sun at night

  let sunX = map(sunPosition, 0, 1, width * 0.1, width * 0.9);
  let sunY = map(sin(PI * sunPosition), 0, 1, height * 0.95, height * 0.2); //sin of the pi*Position starts at 0 peaks at max height*0.2 then goes back down to 0

  let pulse = sin(frameCount * 0.01) * (15 + chaos * 60); // 0.03 = slow speed, 15 = pulse range

  // outer glow
  noStroke();
  for (let r = 100 + pulse; r > 0; r -= 20) {
    fill(255, 220 + pulse, 80, (8 + pulse * 0.3) * brightness);
    circle(sunX, sunY, r * 2); //r is radius
  }

  // midde/core
  fill(255, 225 + pulse, 100, 255 * brightness);
  circle(sunX, sunY, 60 + pulse * 0.5);
}

//function for drawing sun in proper position
function drawMoon() {
  if (sunPosition >= 0 && sunPosition <= 1) return; // no moon during the day

  // moon moves opposite to sun
  let moonPosition = sunPosition < 0 ? sunPosition + 1 : sunPosition - 1;
  let moonX = map(moonPosition, 0, 1, width * 0.1, width * 0.9);
  let moonY = map(sin(PI * moonPosition), 0, 1, height * 0.95, height * 0.2); //sin of the pi*moonPosition starts at 0 peaks at max height*0.2 then goes down to 0

  let pulse = sin(frameCount * 0.005) * 10;

  //outer glow glow
  for (let r = 70 + pulse; r > 0; r -= 10) {
    fill(180, 210 + pulse, 255, 5 + pulse * 0.3);
    circle(moonX, moonY, r * 2);
  }

  // center of moon
  fill(245, 250 + pulse * 0.3, 255, 240);
  circle(moonX, moonY, 55 + pulse * 0.5);
}

//draws the stars
function drawStars() {
  if (sunPosition >= 0 && sunPosition <= 1) return; //0 during day
  if (weatherCondition !== "clear" && weatherCondition !== "clouds") return; //must be clear with low clouds
  if (weatherData.main.humidity >= 70) return; //no humidity
  if (weatherData.visibility < 9000) return;
  noStroke();
  for (let s of stars) {
    s.twinkle += s.twinkleSpeed;
    let alpha = map(sin(s.twinkle), -1, 1, 50, 220); //sin waves are good for pulsing -1 to 1 so I map opacity from 50, 200
    fill(255, 255, 255, alpha);
    circle(s.x, s.y, s.size * 2);
  }
}

//helper function to draw wind
function initWind() {
  windLines = [];
  let windSpeed = weatherData.wind.speed; //gets windspeed from JSON
  let count = floor(map(windSpeed, 0, 20, 10, 150) * (1 + chaos * 3)); //scales speed
  //random positions, mapped speed and random opacity
  for (let i = 0; i < count; i++) {
    windLines.push({
      x: random(width),
      y: random(height),
      len:
        map(weatherData.wind.gust || windSpeed, 0, 30, 80, 120) *
        (1 + chaos * 2),
      speed: map(windSpeed, 0, 20, 1, 10),
      alpha: random(20, 60), //transparency range
    });
  }
}

//draws wind scaled on data
function drawWind() {
  let windDeg = weatherData.wind.deg || 0;
  let gust = weatherData.wind.gust || weatherData.wind.speed;
  let radians = (windDeg * PI) / 180; //maps deg to the direction
  let vx = sin(radians); //sin used for horiztanal direction
  let vy = -cos(radians); //cos used for vertical direction

  noFill();
  for (let w of windLines) {
    stroke(255, 255, 255, w.alpha);
    strokeWeight(0.25); //constant thickness
    line(w.x, w.y, w.x + vx * w.len, w.y + vy * w.len); //endpoint is start + direction*length

    w.x += vx * w.speed; //adds speed*direction to position every frame to create movement
    w.y += vy * w.speed; //same but for y axis

    // wraps around screen to other side
    if (w.x > width) w.x = 0;
    if (w.x < 0) w.x = width;
    if (w.y > height) w.y = 0;
    if (w.y < 0) w.y = height;
  }
}

//initializs preciptation particles based on weather condition
function initPrecipitation() {
  precipitation = [];
  //check if theres precipitation
  if (
    weatherCondition !== "rain" &&
    weatherCondition !== "drizzle" &&
    weatherCondition !== "snow" &&
    weatherCondition !== "thunder"
  )
    return;

  //rain has most partciles then snow then drizzle
  let count =
    (weatherCondition === "drizzle"
      ? 100
      : weatherCondition === "snow"
      ? 150
      : 300) *
    (1 + chaos * 3);

  //snow=slow and bigger, drizzle =medium and small, rain = fast and small
  for (let i = 0; i < count; i++) {
    precipitation.push({
      x: random(width),
      y: random(height),
      speed:
        weatherCondition === "snow"
          ? random(1, 3)
          : weatherCondition === "drizzle"
          ? random(4, 7)
          : random(8, 14),
      size:
        weatherCondition === "snow"
          ? random(2, 5)
          : weatherCondition === "drizzle"
          ? 1
          : 1.5,
    });
  }
}

// draw and update the precipitation every frame
function drawPrecipitation() {
  if (precipitation.length === 0) return; //checks for 0 precipitation
  noStroke();
  for (let p of precipitation) {
    if (weatherCondition === "snow") {
      fill(255, 255, 255, 180); //white and slightly transparency
      circle(p.x, p.y, p.size * 2);
    } else {
      fill(200, 200, 255, 120); //blue and half transparent for rain/drizzle
      rect(p.x, p.y, p.size, p.size * 4); //rain streaks
    }
    p.y += p.speed; //partciles fall at framerate
    if (p.y > height) p.y = 0; //wraps around screen
  }
}

function drawFog() {
  let visibility = weatherData.visibility; //gets it from JSON
  //visibility is 0-10000
  let fogOpacity =
    visibility === 0 ? 0.7 : max(0, (10000 - visibility) / 10000) * 0.3; //scales opacity from 0 to 0.95
  if (fogOpacity > 0.1) {
    noStroke();
    fill(160, 160, 160, fogOpacity * 255); //alpha channel is 0-255 not 1
    rect(0, 0, width, height);
  }
}

function drawLightning() {
  if (weatherCondition !== "thunder") return;

  if (random() < 0.015) {
    //each frame has random chance
    let startX = random(width);
    let segments = floor(random(8, 13)); //between 8-12 lines

    stroke(255, 255, 255, 230); //white
    strokeWeight(2);

    let x = startX;
    let y = 0;

    //loop to create lines in the bolts
    for (let i = 0; i < segments; i++) {
      let nextX = x + random(-60, 60); //creates zigzag
      let nextY = y + height / segments;
      line(x, y, nextX, nextY);

      // random branchs
      if (random() < 0.3) {
        line(nextX, nextY, nextX + random(-100, 100), nextY + random(50));
      }
      x = nextX;
      y = nextY;
    }

    //flashes whole screen
    noStroke();
    fill(255, 255, 255, 60);
    rect(0, 0, width, height);
  }
}

function initHumidity() {
  humidityDroplets = [];
  let humidity = weatherData.main.humidity;
  if (humidity < 60) return;
  let count = floor(map(humidity, 60, 100, 0, 70)); //more drops for more humidity
  for (let i = 0; i < count; i++) {
    let edge = floor(random(4)); //randomly draws around the edges
    let x, y;
    //top
    if (edge === 0) {
      x = random(width);
      y = random(30);
    }
    //right
    else if (edge === 1) {
      x = width - random(30);
      y = random(height);
    }
    //bottom
    else if (edge === 2) {
      x = random(width);
      y = height - random(30);
    }
    //left
    else {
      x = random(30);
      y = random(height);
    }
    humidityDroplets.push({ x, y, size: random(3, 7) }); //random size
  }
}
function drawHumidity() {
  noStroke();
  fill(150, 180, 255, 40); //transparent blue drops
  for (let d of humidityDroplets) {
    circle(d.x, d.y, d.size);
  }
}

//function to draw thermometer
function drawThermometer() {
  let temp = weatherData.main.temp; //gets in in K
  // maps and scales realistic range to 0 to 1
  let level = map(temp, 230, 315, 0, 1);
  level = constrain(level, 0, 1);

  // color goes from blue to red based on temp
  let cold = color(0, 100, 255);
  let hot = color(255, 30, 0);
  let thermColor = lerpColor(cold, hot, level);

  let x = width - 30; // top right
  let tubeTop = 30;
  let tubeBottom = 120;
  let tubeH = tubeBottom - tubeTop;

  // checks if mouse hovering over thermometer
  let hovering =
    mouseX > x - 15 &&
    mouseX < x + 15 &&
    mouseY > tubeTop &&
    mouseY < tubeBottom + 20;

  //displays temp
  if (hovering) {
    let celsius = (weatherData.main.temp - 273.15).toFixed(1);
    let fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);

    noStroke();
    fill(0, 0, 0, 150);
   rect(x - 80, mouseY - 35, 110, 50, 8);
    fill(255, 255, 255, 220);
    textSize(18);
    textAlign(CENTER);
    textFont(myFont);
   text(celsius + "°C", x - 25, mouseY - 12); 
text(fahrenheit + "°F", x - 25, mouseY + 10);
  }
  noStroke();

  //tube shape
  fill(255, 255, 255, 20);
  rect(x - 6, tubeTop, 12, tubeH, 6); //round rectangle

  // shiny line on glass
  fill(255, 255, 255, 60);
  rect(x - 6, tubeTop, 3, tubeH, 3);

  //makes teh liquid fill from bottom to top
  fill(thermColor);
  let fillH = tubeH * level;
  rect(x - 5, tubeBottom - fillH, 10, fillH, 4);

  // shiny line  liquid
  fill(255, 255, 255, 80);
  rect(x - 4, tubeBottom - fillH, 3, fillH, 2);

  // circle at bottom of bottle
  fill(thermColor);
  circle(x, tubeBottom + 8, 22);

  // bulb liquid
  fill(thermColor);
  circle(x, tubeBottom + 8, 16);

  // bulb dot highlight
  fill(255, 255, 255, 100);
  circle(x - 3, tubeBottom + 5, 5);
}

//displays the time and location
function drawLocationDisplay() {
  let fontSize = 40;
  let x = width / 2; //centered
  let y = height - 60; //distance from bottom
  let alpha = map(brightness, 0.4, 1, 120, 200); // text opcaity based on visuals
  let lineSpacing = 43; // space between lines

  noStroke();
  textAlign(CENTER);
  textSize(fontSize);
  textFont(myFont); //uses custom font.

  //shadow for 3d look
  fill(0, 0, 0, 40);
  text(displayTime, x + 2, y + 2);
  text(displayCity, x + 2, y + lineSpacing + 2);

  //main text
  fill(255, 255, 255, alpha);
  text(displayTime, x, y);
  text(displayCity, x, y + lineSpacing);
}

//for welcome page
function drawWelcome() {
  let x = width / 2; //centered text
  let y = height / 2;

  noStroke();
  textAlign(CENTER);
  textSize(36);
  textFont(myFont); //uses my custom font
  textStyle(NORMAL);

  //big text
  fill(255, 255, 255, 245); //white but slighlt tranparent
  text("Welcome to the Live Weather Experience", x, y);

  //small text
  textSize(20);
  text("Mannualy Fetch Weather or Select a Preset Tour Mode Above", x, y + 37);
}

//for setting tour mode
function fetchTour() {
  if (tourMode === "city") {
    lat = cities[tourIndex].lat; //sets the lat and lon for major city
    lon = cities[tourIndex].lon;
    tourIndex = (tourIndex + 1) % cities.length;
  }
  //randomizes lat and lon
  else if (tourMode === "random") {
    lat = random(-90, 90);
    lon = random(-180, 180);
  }
  //sets lat and lon for cities from each timezone
  else if (tourMode === "timezone") {
    lat = timeZones[tourIndex].lat;
    lon = timeZones[tourIndex].lon;
    tourIndex = (tourIndex + 1) % timeZones.length;
  }

  //fetches data same logic as fetch btn
  let url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key;
  loadJSON(url, (data) => {
    weatherData = data;
    let weatherId = weatherData.weather[0].id;
    if (weatherId >= 200 && weatherId <= 232) {
      weatherCondition = "thunder";
    } else if (weatherId >= 300 && weatherId <= 321) {
      weatherCondition = "drizzle";
    } else if (weatherId >= 500 && weatherId <= 531) {
      weatherCondition = "rain";
    } else if (weatherId >= 600 && weatherId <= 622) {
      weatherCondition = "snow";
    } else if (weatherId >= 700 && weatherId <= 781) {
      weatherCondition = "atmosphere";
    } else if (weatherId > 800 && weatherId <= 804) {
      weatherCondition = "clouds";
    } else if (weatherId === 800) {
      weatherCondition = "clear";
    }

    Object.values(sounds).forEach((s) => s.stop());
    if (weatherCondition === "clear") {
      let isDay =
        weatherData.dt >= weatherData.sys.sunrise &&
        weatherData.dt <= weatherData.sys.sunset;
      isDay ? sounds.day.loop() : sounds.night.loop();
    } else if (sounds[weatherCondition]) {
      sounds[weatherCondition].loop();
    }
    resetVisuals();
    initWind();
    initHumidity();
    initPrecipitation();
    displayTime = convertLocalTime(weatherData.dt, weatherData.timezone);
    displayCity = weatherData.name;
  });

  lastTourTime = millis();
}

//to clear canvas
function resetVisuals() {
  windLines = [];
  precipitation = [];
  humidityDroplets = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initWind();
  initHumidity();
  initPrecipitation();
}
