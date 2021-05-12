// const express = require("express");
// const Pool = require("pg").Pool;
const dfd = require("danfojs-node");

// const pool = new Pool({
//     user: "ilkrbk",
//     password: "*************",
//     host: "localhost",
//     port: "5432",
//     database: "database"
// });

// const app = express(); 

function FillNanAverage(df) {
    let arr = []
    for (let i = 0; i < df.data.length; i++) {
        for (let j = 0; j < df.data[i].length; j++) {
            if (i == 0 && j != 0) {
                arr.push({sum: 0, countNan: 0})
            }
            if (j != 0 && !isNaN(df.data[i][j])) {
                arr[j - 1].sum += df.data[i][j]
            }else if(j != 0 && isNaN(df.data[i][j])){
                arr[j - 1].countNan += 1
            }
        }
    }
    arr.forEach(el => {
        el.sum = Math.round(el.sum/(df.data.length-el.countNan))
    });
    for (let i = 0; i < df.data.length; i++) {
        for (let j = 0; j < df.data[i].length; j++) {
            if(j != 0 && isNaN(df.data[i][j])){
                df.data[i][j] = arr[j - 1].sum
            }
        }
    }
    // df.print()
}

function WriteFile(df, pathEnd){
    df.to_csv(pathEnd).catch((err) => {
        console.log(err);
    })
}

function CleanData(path, func1, func2, pathEnd) {
    dfd.read_csv(path).then(df => {
        func1(df)
        func2(df, pathEnd)
    }).catch(err=>{
        console.log(err);
    })
}

function CleanDataWeatherDescr(path) {
    dfd.read_csv(path).then(df => {
        df = df.fillna({ values: ["sky is clear"] })
        WriteFile(df, "./dataClean/weather_description.csv")
    }).catch(err=>{
        console.log(err);
    })
}

// CleanData("./data/humidity.csv", FillNanAverage, WriteFile, "./dataClean/humidity.csv")
// CleanData("./data/pressure.csv", FillNanAverage, WriteFile, "./dataClean/pressure.csv")
// CleanData("./data/temperature.csv", FillNanAverage, WriteFile, "./dataClean/temperature.csv")
// CleanData("./data/wind_direction.csv", FillNanAverage, WriteFile, "./dataClean/wind_direction.csv")
// CleanData("./data/wind_speed.csv", FillNanAverage, WriteFile, "./dataClean/wind_speed.csv")
CleanDataWeatherDescr("./data/weather_description.csv")

// app.listen(1987);