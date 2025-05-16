const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { engine } = require("express-handlebars");
const axios = require("axios"); // To fetch data from the API

const app = express();
const PORT = 3000;

const connectorDB = require("./Utils/db");

app.engine(
  "handlebars",
  engine({
    defaultLayout: false,
  })
);



app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/JS", express.static(path.join(__dirname, "public/JS")));
app.use("/video", express.static(path.join(__dirname, "public/video")));

const TimelineData = require("./Router/TimelineData_Router");
const AirQualityData = require("./Router/AirQuality_Router");
const EarthQuakeData = require("./Router/Earthquake_Router");
const GlobalWarming = require("./Router/GlobalWarming_Router");
const Wildfires = require("./Router/Wildfires_Router");
const { Console } = require("console");

app.use("/api/timeline", TimelineData);
app.use("/api/airquality", AirQualityData);
app.use("/api/earthquake", EarthQuakeData);
app.use("/api/globalwarming", GlobalWarming);
app.use("/api/wildfires", Wildfires);

//index page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/timeline/disaster"
    );
    const disasters = response.data;
    res.render("index", { disasters });
    
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.render("index", { disasters: [] });
  }
});

//home page events API
app.get("/home_events", async (req, res) => {
  try {
    // Fetch data from all endpoints concurrently
    const [response1, response2, response3, response4] = await Promise.all([
      axios.get("https://svs.gsfc.nasa.gov/api/12325"),
      axios.get("https://svs.gsfc.nasa.gov/api/3912"),
      axios.get("https://svs.gsfc.nasa.gov/api/40483"),
      axios.get("https://svs.gsfc.nasa.gov/api/2893"),
    ]);

    // Extract and format descriptions
    const formatDescription = (data) =>
      data.description.split(". ").slice(0, 2).join(". ") + ".";

    // Sending the combined data to the frontend
    res.json({
      nasa1: {
        title: response1.data.title,
        description: formatDescription(response1.data),
      },
      nasa2: {
        title: response2.data.title,
        description: formatDescription(response2.data),
      },
      nasa3: {
        title: response3.data.title,
        description: formatDescription(response3.data),
      },
      nasa4: {
        title: response4.data.title,
        description: formatDescription(response4.data),
      },
    });
    
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data from NASA API" });
  }
});

//Event page Fire Quality Event API

app.get('/events', async (req, res) => {
  try {
      // Fetch data from all endpoints concurrently
      const [response1,response2,response3,response4,response5] = await Promise.all([
          // Event1 [Response1]
          axios.get('https://svs.gsfc.nasa.gov/api/12325'),
          
          // Event2 [Response2,3]
          axios.get("https://svs.gsfc.nasa.gov/api/40483"),
          axios.get("https://svs.gsfc.nasa.gov/api/14368"),
          
          // Event3 [Response4]
          axios.get("https://svs.gsfc.nasa.gov/api/3912"),

          // Event4 [Response5]
          axios.get("https://svs.gsfc.nasa.gov/api/2893"),
      ]);

      // Extract and format descriptions
      //const formatDescription = (data) => data.description.split('. ').slice(0, 2).join('. ') + '.';


      // Sending the combined data to the frontend
      res.json({
          event1: {
              title: response1.data.title,
              description: response1.data.description,
              mediagroup: response1.data.media_groups[1].description,
              video1: response1.data.media_groups[3].items[3].instance.url,
              video1_text: response1.data.media_groups[3].items[3].instance.alt_text,
              video2: response1.data.media_groups[4].items[2].instance.url,
              video2_text: response1.data.media_groups[4].items[2].instance.alt_text,

          },
          event2: {
            title: response2.data.title,
            description: response2.data.description,
            video1: response3.data.media_groups[0].items[5].instance.url,
            video1_text: response3.data.media_groups[2].description,
            video2: response3.data.media_groups[4].items[3].instance.url,
            video2_text: response3.data.media_groups[4].items[3].instance.alt_text,

          },
          event3: {
            title: response4.data.title,
            description: response4.data.description,

            video1: response4.data.media_groups[1].items[11].instance.url,
            video1_text: response4.data.media_groups[1].items[11].instance.alt_text,
            
            video2: response4.data.media_groups[9].items[4].instance.url,
            video2_text: response4.data.media_groups[9].items[4].instance.alt_text,

            image1: response4.data.media_groups[4].items[0].instance.url,
            image1_text: response4.data.media_groups[4].items[0].instance.alt_text,

        },
        event4: {
          title: response5.data.title,
          description: response5.data.description,

          video1: response5.data.media_groups[1].items[6].instance.url,
          video1_text: response5.data.media_groups[1].items[6].instance.alt_text,
          
          image1: response5.data.media_groups[3].items[0].instance.url,
          image1_text: response5.data.media_groups[3].items[0].instance.alt_text,

          image2: response5.data.media_groups[4].items[0].instance.url,
          image2_text: response5.data.media_groups[4].items[0].instance.alt_text,

          x: response5.data,
      },
      });

      console.log(res);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Error fetching data from NASA API' });
  }
});


const Timeline = require("./Model/TimelineSchema");
///:year
app.get('/year/:selectedYear', async (req, res) => {
  const year = req.params.selectedYear;
  
  try {
    const yearAsNumber = parseInt(year, 10); // Convert to integer if necessary
    const disasters = await Timeline.find({"Start Year": yearAsNumber}).lean();
    
    console.log(disasters.length+".....")

    res.render('year', { year, disasters });
    
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Error fetching disasters' });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/news", (req, res) => {
  res.render("news");
});

app.get("/airQuality", async (req, res) => {
  res.render("events_Section/airQuality");
});

app.get("/earthquake", async (req, res) => {
  res.render("events_Section/earthquake");
});

app.get("/globalTemperature", async (req, res) => {
  res.render("events_Section/globalTemperature");
});

app.get("/wildfires", async (req, res) => {
  res.render("events_Section/wildfires");
});

app.get("/beforeEarth", (req, res) => {
  res.render("beforeEarth");
});

app.get("/afterEarth", (req, res) => {
  res.render("afterEarth");
});

app.get("/year", (req, res) => {
  res.render("year");
});

app.get("/blacksummer", (req, res) => {
  res.render("interesting_news_Section/blackSummer");
});

app.get("/intersingfactearthquake", (req, res) => {
  res.render("interesting_news_Section/earthquake");
});

app.get("/flood", (req, res) => {
  res.render("interesting_news_Section/flood");
});

app.get("/hurricane", (req, res) => {
  res.render("interesting_news_Section/hurricane");
});


connectorDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("failed to connect...");
  });
