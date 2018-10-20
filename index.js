var current_location = [25.0202, 121.553]
var lat = current_location[0];
var lng = current_location[1];
var map = L.map('mapid',{doubleClickZoom : false}).setView(current_location, 10);
var myLayerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,minZoom: 1,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);
map.setView(current_location,8)



check_list = [false,false,false, true,false] //high, low, extinguished, undetermined, dangerous region


start_time = new Date()
lngE = map.getBounds().getEast();
lngW = map.getBounds().getWest();
latN = map.getBounds().getNorth();
latS = map.getBounds().getSouth();

// alldata = 
// [{"event_id":"001","latlong":[25.2,121.3],"location":"NTU", "status":"high", "info_list":[
//     {"report_time":new Date(1519617015557), "user_id":"user000", "report_id":"0001", "description":"111there's a hole!!!"},
//     {"report_time":new Date(1519617010007), "user_id":"PK", "report_id":"0002", "description":" 222HOLEEEEEEE hole!!!"},
//     {"report_time":new Date(1519617013337), "user_id":"HELLO", "report_id":"0003", "description":" 333HOLEEEEEEE hole!!!"},
//     {"report_time":new Date(1519617014447), "user_id":"usr2", "report_id":"0004", "description":" 444HOLEEEEEEE hole!!!"},
//     {"report_time":new Date(1519617016757), "user_id":"NASA", "report_id":"0005", "description":" 555如果在這裡打一串很長很長很長很長的中文會怎樣呢到底alalalaajoefi ;jfiojiro ;wjfio;jaio; wejufhawuriu ilawhfiaiuhfla"}]},
// {"event_id":"002","latlong":[25.4,121.1],"location":undefined,"status":"low", "info_list":[
//     {"report_time":new Date(1519617013333),"user_id":"user000","report_id":"0001","description":"I'm not sure if it's on fire..."}]
// }]
// alldata.push()


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            current_location[0] = position.coords.latitude
            current_location[1] = position.coords.longitude
        });
        ;
    } else {
        alert("Geolocation is not supported by this browser.");
        console.log('not supported')
    }
}


// change check_list (T <-> F)
function status_change(i){
    check_list[i] = !check_list[i]
    console.log(check_list)
    show_icon()
}



// change start_time
function set_time(){
    var now = new Date()
    var s = now.getTime()
    var t = document.getElementById("time-selector").value
    console.log(`t is ${t}`)
    s -= t*86400*1000
    start_time = new Date(s)
    console.log(`Show events starting from ${start_time}`)
    show_icon()
}

function set_border(){
    lngE = map.getBounds().getEast();
    lngW = map.getBounds().getWest();
    latN = map.getBounds().getNorth();
    latS = map.getBounds().getSouth();
}

function offline_check(status, check){
    ans = false
    switch(status){
        case 'high': if(check[0] == true){ans = true;console.log('high case');} break;
        case 'low': if(check[1] == true){ans = true;console.log('low case');} break;
        case 'extinguished':if(check[2] == true){ans = true;console.log('ext case');} break;
        case 'undetermined':if(check[3] == true){ans = true;console.log('unde case');} break;
        default: break;
    } 
    return ans
}

//get evnets to show -> put marker -> set popup
function show_icon(){
    myLayerGroup.clearLayers()
    set_border();
    requestURL = `/?start_time=${start_time}
                    &high=${check_list[0]}
                    &low=${check_list[1]}
                    &extinguished=${check_list[2]}
                    &undetermined=${check_list[3]}
                    &lngW=${lngW}&lngE=${lngE}&latS=${latS}&latN=${latN}`
    // var request = new XMLHttpRequest();
    // request.open('GET', requestURL);
    // request.responseType = 'json';
    // request.send();
    // request.onload = function(){
    //     var data_list = request.response
    //     for (var j = 0; j < data_list.length; j++) {
    //         tmp_mark = L.marker([data_list[j]["latlong"][0],data_list[j]["latlong"][1]])
    //         tmp_mark.addTo(map)
    //         tmp_mark.bindPopup(popup_content(data_list[j]),{maxHeight: 300})
    //     }
    // }

    // var data_list = request.response
    var data_list = alldata;
    for (var j = 0; j < data_list.length; j++) {
        console.log(data_list[j]['status'],"-------",!offline_check(data_list[j]['status'],check_list))
        if(!offline_check(data_list[j]['status'],check_list)){continue;}
        else{
        tmp_mark = L.marker([ data_list[j]["latlong"][0], data_list[j]["latlong"][1] ])
        tmp_mark.addTo(myLayerGroup)
        tmp_mark.bindPopup(popup_content(data_list[j]),{maxHeight: 200})
        console.log(`add ${j}'th data's marker to map`)}
    }

    document.getElementById("event-list-content").innerHTML = ""
    update_all_data();
}

// // Unused in this project
// function _show_icon(requestURL){
//     // var request = new XMLHttpRequest();
//     // request.open('GET', requestURL);
//     // request.responseType = 'json';
//     // request.send();
//     // request.onload = function(){
//     //     var data_list = request.response
//     //     for (var j = 0; j < data_list.length; j++) {
//     //         tmp_mark = L.marker([data_list[j]["latlong"][0],data_list[j]["latlong"][1]])
//     //         tmp_mark.addTo(map)
//     //         tmp_mark.bindPopup(popup_content(data_list[j]),{maxHeight: 300})
//     //     }
//     // }

//     // var data_list = request.response
//     var data_list = alldata;
//     for (var j = 0; j < data_list.length; j++) {
//         tmp_mark = L.marker([data_list[j]["latlong"][0],data_list[j]["latlong"][1]])
//         tmp_mark.addTo(map)
//         tmp_mark.bindPopup(popup_content(data_list[j]),{maxHeight: 300})
//     }
// }

function popup_content(_data){
    s0 = '<div style="height:280px">'
    s0 +=
    `<div style="height: 50px ">
        <div style="float: left;">
            ${_data["event_id"]} <br>
            @(${_data["latlong"][0]},${_data["latlong"][1]})
        </div>
        <div style="float: right;">
            <input type="button" id="report-problem-button" value="!!"> 
        </div>
    </div>`
    s0 += `<div><div style="float: left; width: 62%; min-height: 100px; max-height: 200px; border: solid;overflow:scroll">`
    for (var i = 0; i < _data["info_list"].length; i++) {
        s0 += `<div style="border: solid;">
                ${_data["info_list"][i]["user_id"]} <br> ${_data["info_list"][i]["report_time"].getDate()} 
                <div style="border: dashed; padding:2px;overflow-x: scroll">
                    ${_data["info_list"][i]["description"]}
                </div></div><br>`
    }
    s0 += `</div>
            <div style="float: right; width: 30%; min-height: 100px;max-height: 200px; border: solid;">
                (Photo)
            </div>
        </div><br><br></div>`
    return s0;
}

// Ask current location and put current position marker

function update_all_data(){
    for (var i = 0; i < alldata.length; i++) {
        alldata[i]["info_list"].sort(function(a,b) {
            return b["report_time"]-a["report_time"]
        })
    }
    alldata.sort(function(a,b){
        return b["info_list"][0]["report_time"]-a["info_list"][0]["report_time"]
    })
    for (var i = 0; i < alldata.length; i++) {
        document.getElementById("event-list-content").innerHTML += `${alldata[i]["event_id"]}<br>`;
        for (var j = 0; j < alldata[i]["info_list"].length; j++) {
            document.getElementById("event-list-content").innerHTML += `${alldata[i]["info_list"][j]["user_id"]} says <br> ..${alldata[i]["info_list"][j]["description"]} <br>`
        }
    }
}

function all_data_html(data){

}


show_icon()

console.log(alldata)
