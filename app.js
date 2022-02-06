const express = require('express');
const bodyParser = require('body-parser')
const app =express();
const ejs = require('ejs');
// create object https to get the external api 
const https = require('https');
const e = require('express');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", 'ejs')
app.use(express.static(__dirname+ '/public'))

let zipcode = ""
let lon="";
let lat=""
let city=""
app.get("/", (req, res)=>{
    let data="";
    let location="City: "
    let detail ="click detail to find more"
    
    let countryCod =""
    
    const url1 = "https://api.openweathermap.org/geo/1.0/zip?zip="
    const url2= zipcode + ",US&appid=2d9c5c8a7ac2028955aca59fdb452ea9"
    const url = url1+url2
    console.log(url)
    if(zipcode.length !== 0 || zipcode !== ""){
        
       
        https.get(url, (resp)=>{
            // a chunk of data has been recieved 
            resp.on('data', (chunk)=>{
                data+=chunk;
            })
            // the whole response has been received
            
            resp.on('end', ()=>{
               

               
                
                // console.log(JSON.parse(data)) // parse the raw data to json in 3d
                //JSON.stringify(data)// to parse data to string inline 
                const weather = JSON.parse(data);
                countryCod = weather.country
                console.log(countryCod)
                if(countryCod ==="US"){
                    city=weather.name
                    location+=city
                    lon=weather.lon
                    lat =weather.lat
                    res.render("doc", {location: location, detail: detail})
                    
                }
                else{
                    
                    res.render("doc", {location: location, detail: detail})
                }

                
            })
        
            
        })
    }
    else{
        
        res.render("doc", {location: location, detail:detail})
    }
})


app.get("/forecast", (req, res)=>{
    // working on the date
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   
    
    
    let days = []
    let date = new Date()
    let n=0
    let m=date.getDate()+1
    for(i=date.getDate(); i<=weekday.length+1; i++){
        
        days[n]=weekday[i+1]
        n=n+1

        
    }
    
    for(j=date.getDate(); j>=0; j--){
        days[m]=weekday[j]
        m-=1
        
    }
    
    
    let location=""
    let temp =""
    let conditon=""
    
    let feelLike =""
    let humity=""
    let icon=""
    let data1=""
    const url3 = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat="
    const url4= lat + "&lon="+ lon +"&exclude=minutely,alerts&appid=4f64c0eb8fef84352e981770e4b3ff32"
    const urlf = url3+url4
    console.log(lat)
    console.log(urlf)
    
        
       
        https.get(urlf, (resp)=>{
            // a chunk of data has been recieved 
           
            // the whole response has been received
            
            resp.on('data', (chunk)=>{
                data1+=chunk;
            })
            // the whole response has been received
            
            resp.on('end', ()=>{
       
                const weather = JSON.parse(data1);
               
                
                    temp = weather.hourly[0].temp
                    conditon = weather.current.weather[0].main
                    humity = weather.current.humidity
                    feelLike=weather.current.feels_like
                    location=weather.name
                    icon = weather.current.weather[0].icon
                    let max1=weather.daily[0].temp.max
                    let max2=weather.daily[1].temp.max
                    let max3=weather.daily[2].temp.max
                    let max4=weather.daily[3].temp.max
                    let max5=weather.daily[4].temp.max
                    let max6=weather.daily[5].temp.max
                    let min1=weather.daily[0].temp.min
                    let min2=weather.daily[1].temp.min
                    let min3=weather.daily[2].temp.min   
                    let min4=weather.daily[3].temp.min
                    let min5=weather.daily[4].temp.min
                    let min6=weather.daily[5].temp.min
                    let condition1=weather.daily[0].weather[0].main
                    let condition2=weather.daily[1].weather[0].main
                    let condition3=weather.daily[2].weather[0].main
                    let condition4=weather.daily[3].weather[0].main
                    let condition5=weather.daily[4].weather[0].main
                    let condition6=weather.daily[5].weather[0].main
                    let icon1=weather.daily[0].weather[0].icon
                    let icon2=weather.daily[1].weather[0].icon
                    let icon3=weather.daily[2].weather[0].icon
                    let icon4=weather.daily[3].weather[0].icon
                    let icon5=weather.daily[4].weather[0].icon
                    let icon6=weather.daily[5].weather[0].icon


                    res.render("forecast", {location: city, temp:temp, condition:conditon, high:"feelLike: "+ feelLike, low:"humidity: "+ humity, icon:icon,
                                day0: days[0], day1: days[1],day2: days[2],day3: days[3],day4: days[4], day5: days[5], day6: days[6],
                                max1: max1, max2:max2, max3:max3, max4:max4, max5:max5, max6:max6, min1:min1,min2:min2, min3:min3, min4:min4, min5:min5, min6:min6, 
                                condition1:condition1,condition2:condition2,condition3:condition3,condition4:condition4,condition5:condition5,condition6:condition6,
                                icon1:icon1, icon2:icon2, icon3:icon3, icon4:icon4, icon5:icon5,icon6:icon6,})

            })
 
           
            
        })
    
    
})

app.post("/", (req, res)=>{
    zipcode=req.body.nameSearch;
    
    res.redirect('/');
})
app.post("/detail", (req, res)=>{
    if(city.length !== 0 || city !== ""){
        res.redirect("/forecast")
    }

    
})

let port = process.env.PORT; 
if(port == null || port == ""){
 port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});