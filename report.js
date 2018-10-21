var area=2;      //the area size for detecting one event
var firecnt=0;

//each userreport's info
function User(id,la,lo,ang,t,desc="none"){    // t represent time, using Date class

    this.delat = function() {return (area/111);}
    this.delong= function() {
        var tmp=area/(111*Math.cos(Math.PI/180*this._lat))
        return (tmp>180?180:tmp);
    }
    this.lat =function(){return this._lat;}
    this.long=function(){return this._long;}
    this.angle=function(){return this._angle;}
    this.cnt=-1;
    this.rated=1;
    this.id=id;
    this.t=t;
    this.description=desc;



//private data(?)
    this._lat=la;
    this._long=lo;
    this._angle=ang;    //direction - North
}

//each fireevent's info
function Fireevent(lo,la,possi,time){

    this.lat=la;
    this.long=lo;
    this.possiblility=possi;     // the number of user reports
    this.time=time;
}

var userlist = [];

//build a json file 
var dataheaders=["event_id","radius","latlong","start_time","status","info_list"];
var jsondata=[];

for (var i = 0; i < firecnt; i++) {

    var alldata={};
    var tmplatlong=[-1,-1];
    var tmpinfohead=["report_time","user_id","latitute","longitude","angle","description"];
    var tmpinfo=[]//
    for (var j = 0; j < userl[i].length; j++) {
        var alltmp={};
        alltmp[tmpinfohead[0]]=userl[i][j].t;
        alltmp[tmpinfohead[1]]=userl[i][j].id;
        alltmp[tmpinfohead[2]]=userl[i][j].lat();
        alltmp[tmpinfohead[3]]=userl[i][j].long();
        alltmp[tmpinfohead[4]]=userl[i][j].angle();
        alltmp[tmpinfohead[5]]=userl[i][j].description;
        tmpinfo.push(alltmp);
    }

    alldata[dataheaders[0]]=i.toString();
    alldata[dataheaders[1]]="nan";
    alldata[dataheaders[2]]=tmplatlong;
    alldata[dataheaders[3]]="nan";
    alldata[dataheaders[4]]="undetermined";
    alldata[dataheaders[5]]=tmpinfo;
    jsondata.push(alldata);
}
// console.log(jsondata);

function adduser(newuser){
    
    if(userlist.length!=0){
        for (var i = 0; i < userlist.length; i++) {

            if(newuser.lat()<(userlist[i].lat()+userlist[i].delat())&&newuser.lat()>(userlist[i].lat()-userlist[i].delat())){
                if(newuser.long()<(userlist[i].long()+userlist[i].delong())&&newuser.long()>(userlist[i].long()-userlist[i].delong())){
                    newuser.cnt=userlist[i].cnt;
                    // console.log("here");
                }
            }
        }
    }
    userlist.push(newuser);

    if(newuser.cnt==-1){
        newuser.cnt=firecnt;
        firecnt++;
        // console.log("gggg");
        var alldata={};
        var tmplatlong=[-1,-1];
        var tmpinfohead=["report_time","user_id","latitute","longitude","angle","description"];
        var tmpinfo=[];
        var alltmp={};
        alltmp[tmpinfohead[0]]=newuser.t;
        alltmp[tmpinfohead[1]]=newuser.id;
        alltmp[tmpinfohead[2]]=newuser.lat();
        alltmp[tmpinfohead[3]]=newuser.long();
        alltmp[tmpinfohead[4]]=newuser.angle();
        alltmp[tmpinfohead[5]]=newuser.description;
        tmpinfo.push(alltmp);

        alldata[dataheaders[0]]=newuser.cnt.toString();
        alldata[dataheaders[1]]="nan";
        alldata[dataheaders[2]]=tmplatlong;
        alldata[dataheaders[3]]="nan";
        alldata[dataheaders[4]]="undetermined";
        alldata[dataheaders[5]]=tmpinfo;
        jsondata.push(alldata);

    }
    else{
        for (var i = 0; i < jsondata.length; i++) {
            if(jsondata[i]["event_id"]==newuser.cnt){
                //insert in to jsondata
                var tmpinfohead=["report_time","user_id","latitute","longitude","angle","description"];
                var alltmp={};
                alltmp[tmpinfohead[0]]=newuser.t;
                alltmp[tmpinfohead[1]]=newuser.id;
                alltmp[tmpinfohead[2]]=newuser.lat();
                alltmp[tmpinfohead[3]]=newuser.long();
                alltmp[tmpinfohead[4]]=newuser.angle();
                alltmp[tmpinfohead[5]]=newuser.description;
                jsondata[i]["info_list"].push(alltmp);
                break;
            }
        }
    }
}

function calculate(json){
    for (var k = 0; k < json.length; k++) {
        
        var oneuser = json[k]["info_list"];
        // console.log(oneuser);
        var ilat=[];
        var ilong=[];
        var angle=[];
        var start_time="0";
        for (var i = 0; i < oneuser.length; i++) {
            ilat.push(oneuser[i]["latitute"]);
            ilong.push(oneuser[i]["longitude"]);
            angle.push(oneuser[i]["angle"]);
            if(start_time=="0"){start_time=oneuser[i]["report_time"];}
            else{start_time=((Date.parse(oneuser[i]["report_time"])).valueOf()< (Date.parse(start_time)).valueOf()?oneuser[i]["report_time"]:start_time);}
        }
        // console.log(oneuser[0]["report_time"]);
        var lat=[];
        var long=[];

        for (var i = 1; i < ilat.length; i++) {
            for (var j = i-1; j >= 0; j--) {

                var a1=angle[i];
                var x1=ilong[i];
                var y1=ilat[i];
                var a2=angle[j];
                var x2=ilong[j];
                var y2=ilat[j];

                // var xtmp=(y2-y1+(Math.tan(Math.PI/180*a2)*x2-Math.tan(Math.PI/180*a1)*x1))/(Math.tan(Math.PI/180*a2)-Math.tan(Math.PI/180*a1));
                var ytmp=((x2-x1)+(Math.tan(Math.PI/180*a1)*y1-Math.tan(Math.PI/180*a2)*y2))/(Math.tan(Math.PI/180*a1)-Math.tan(Math.PI/180*a2));
                var xtmp=(Math.tan(Math.PI/180*a1)*Math.tan(Math.PI/180*a2)*(y2-y1)+(Math.tan(Math.PI/180*a2)*x1-Math.tan(Math.PI/180*a1)*x2))/(Math.tan(Math.PI/180*a2)-Math.tan(Math.PI/180*a1));
                if(xtmp!=Infinity&&xtmp!=-Infinity&&ytmp!=Infinity&&ytmp!=-Infinity){
                    long.push(xtmp);
                    lat.push(ytmp);
                }
            }
        }
        // console.log(lat)

        var lat_mid=lat[Math.floor(lat.length/2)];
        var long_mid=long[Math.floor(long.length/2)];
        // console.log(long_mid);

        var lasigma=0;
        var losigma=0;
        for (var i = 0; i < lat.length; i++) {
            lasigma+=Math.pow((lat[i]-lat_mid),2);
        }
        lasigma/=lat.length;
        lasigma=Math.sqrt(lasigma);
        for (var i = 0; i < long.length; i++) {
            losigma+=Math.pow(Math.cos(Math.PI/180*lat[i])*(long[i]-long_mid),2);
        }
        losigma/=long.length;
        losigma=Math.sqrt(losigma);

        // console.log(start_time);
        json[k]["radius"]=losigma*110.54;
        json[k]["latlong"][0]=lat_mid;
        json[k]["latlong"][1]=long_mid;
        json[k]["start_time"]=start_time;
        // console.log(json[k]["info_list"])

    }

    // console.log(json);
    return json;
}












//////////////////////////////////////////*
//
//       QqQQQQQq     Q
//     QQ        Q  Q
//    Q   o        Q
//     QQ        Q  Q
//       QQQQQQQQ     Q
//
//
//
//////////////////////////







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
map.setView(current_location,12)



lngE = map.getBounds().getEast();
lngW = map.getBounds().getWest();
latN = map.getBounds().getNorth();
latS = map.getBounds().getSouth();


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

function normalize_lng(lng){
    return lng;
}

map.on('click',function(e){
    latlng = e.latlng;
    lat = latlng['lat'];
    lng = latlng['lng'];
    current_location = [latlng['lat'], latlng['lng']];
    // console.log(latlng)
    myLayerGroup.clearLayers();
    marker = L.marker(latlng);
    marker.addTo(myLayerGroup);
    document.getElementById('input-lat').value=lat.toFixed(5);
    document.getElementById('input-lng').value=normalize_lng(lng).toFixed(5);
});
function init(){
    document.getElementById('input-lat').value=''
    document.getElementById('input-lng').value=''
    document.getElementById('input-azimuth').value=''
    document.getElementById('input-description').value=''
}

function input_submit(){
    user_id = 'admin'
    console.log('submit!')
    angle = document.getElementById('input-azimuth').value
    console.log('azi:',angle)
    time = new Date()
    // console.log(time)
    yr = time.getFullYear()
    month = time.getMonth()+1
    date = time.getDate()
    hour = time.getHours()
    min = time.getMinutes()
    sec = time.getSeconds()
    time_string = yr+'/'+month+'/'+date+' '+hour+':'+min+':'+sec
    description = document.getElementById('input-description').value
    // console.log(time_string, description)
    var tmp_user=new User(user_id,lat,lng,angle,time_string,description);
    adduser(tmp_user)
    var dataa= calculate(jsondata);
    console.log('hello',dataa)

    init()
    myLayerGroup.clearLayers()

    for (var j = 0; j < dataa.length; j++) {
        tmp_mark = L.marker([ dataa[j]["latlong"][0], dataa[j]["latlong"][1] ])
        tmp_mark.addTo(myLayerGroup)
        console.log(`add ${j}'th data's marker to map`)
    }

}




