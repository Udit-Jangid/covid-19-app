const http = require("http");
const fs = require("fs");
const path = require("path");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const worldFile = fs.readFileSync("worldlive.html", "utf-8");
const indiaFile = fs.readFileSync("indialive.html", "utf-8");

const tireplaceVal = (tempVal, orgVal) => {
  let tindia = tempVal.replace("{%Confirmed%}", orgVal.TT.total.confirmed);
  tindia = tindia.replace(
    "{%Active%}",
    orgVal.TT.total.confirmed -
      orgVal.TT.total.recovered -
      orgVal.TT.total.deceased -
      orgVal.TT.total.other
  );
  tindia = tindia.replace("{%Recovered%}", orgVal.TT.total.recovered);
  tindia = tindia.replace("{%Deaths%}", orgVal.TT.total.deceased);
  return tindia;
};

const replaceVal = (tempVal, orgVal, sizeTable) => {
  let worldlive = tempVal;
  for (let i = 1; i <= sizeTable; i++) {
    worldlive = worldlive.replace(
      `{%Country${i}%}`,
      orgVal.Countries[i - 1].Country
    );
    worldlive = worldlive.replace(
      `{%TotalConfirmed${i}%}`,
      orgVal.Countries[i - 1].TotalConfirmed
    );
    worldlive = worldlive.replace(
      `{%TotalRecovered${i}%}`,
      orgVal.Countries[i - 1].TotalRecovered
    );
    worldlive = worldlive.replace(
      `{%TotalDeaths${i}%}`,
      orgVal.Countries[i - 1].TotalDeaths
    );
    worldlive = worldlive.replace(
      `{%NewConfirmed${i}%}`,
      orgVal.Countries[i - 1].NewConfirmed
    );
    worldlive = worldlive.replace(
      `{%NewRecovered${i}%}`,
      orgVal.Countries[i - 1].NewRecovered
    );
    worldlive = worldlive.replace(
      `{%NewDeaths${i}%}`,
      orgVal.Countries[i - 1].NewDeaths
    );
  }

  return worldlive;
};

const stateData = fs.readFileSync(`${__dirname}/indiastatecode.json`, "utf-8");
const objStateData = JSON.parse(stateData);
const arrStateData = [objStateData];
// console.log(arrStateData[0].statewise[0].statecode); //TT

const ireplaceVal = (tempVal, orgVal, sizeTable) => {
  let indialive = tempVal;

  for (let i = 1; i <= sizeTable; i++) {
    const stateCode = arrStateData[0].statewise[i].statecode;
    indialive = indialive.replace(
      `{%State${i}%}`,
      arrStateData[0].statewise[i].state
    );
    indialive = indialive.replace(
      `{%Confirmed${i}%}`,
      orgVal[stateCode].total.confirmed
    );
    indialive = indialive.replace(
      `{%Active${i}%}`,
      orgVal[stateCode].total.confirmed -
        orgVal[stateCode].total.deceased -
        orgVal[stateCode].total.recovered
    );
    indialive = indialive.replace(
      `{%Recovered${i}%}`,
      orgVal[stateCode].total.recovered
    );
    indialive = indialive.replace(
      `{%Deaths${i}%}`,
      orgVal[stateCode].total.deceased
    );
    indialive = indialive.replace(
      `{%Updated On${i}%}`,
      orgVal[stateCode].meta.last_updated.replace("T", " at ").slice(0, 22)
    );
  }

  return indialive;
};

const server = http.createServer((req, res) => {
  // Serve images folder manually
  if (req.url.startsWith("/images/")) {
    const imagePath = path.join(__dirname, req.url);

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Image not found");
      }

      // Detect file type from extension
      const ext = path.extname(imagePath).toLowerCase();
      const mimeTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
      };

      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
      return res.end(data);
    });
    return; // Stop further execution
  }
  if (req.url == "/") {
    requests(`https://data.covid19india.org/v4/min/data.min.json`)
      .on("data", (chunk) => {
        const tiobjData = JSON.parse(chunk);
        const tiarrData = [tiobjData];
        const tirealTimeData = tiarrData
          .map((val) => {
            return tireplaceVal(homeFile, val);
          })
          .toString();
        // console.log(tirealTimeData);
        res.write(tirealTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  } else if (req.url == "/home.html") {
    requests(`https://data.covid19india.org/v4/min/data.min.json`)
      .on("data", (chunk) => {
        const tiobjData = JSON.parse(chunk);
        const tiarrData = [tiobjData];
        const tirealTimeData = tiarrData
          .map((val) => {
            return tireplaceVal(homeFile, val);
          })
          .toString();
        // console.log(tirealTimeData);
        res.write(tirealTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  } else if (req.url == "/worldlive.html") {
    requests(`https://api.covid19api.com/summary`)
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const totalCountries = arrData[0].Countries.length;
        // const totalCountries = 3;
        console.log(totalCountries);
        // console.log(arrData[0].Countries.length);    //193 countries data
        // console.log(arrData[0].Countries[192]);
        // res.end(chunk);
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => {
            // console.log(val.main);
            return replaceVal(worldFile, val, totalCountries);
          })
          .toString();
        // console.log(realTimeData);
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  } else if (req.url == "/indialive.html") {
    requests(`https://data.covid19india.org/v4/min/data.min.json`)
      .on("data", (chunk) => {
        const iobjData = JSON.parse(chunk);
        const iarrData = [iobjData];
        const totalStates = 36;
        console.log(totalStates);
        // console.log(iarrData[0].statewise.length);    //38
        // res.end(chunk);
        const irealTimeData = iarrData
          .map((val) => {
            return ireplaceVal(indiaFile, val, totalStates);
          })
          .toString();
        // console.log(irealTimeData);
        res.write(irealTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  } else {
    res.end("File Not Found!!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to the port no 8000");
});
