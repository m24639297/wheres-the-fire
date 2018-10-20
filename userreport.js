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
/*
var user1=new User("1",0,50,30,30);
var user2=new User("2",0.001,50,330,30);
var user3=new User("3",0.0005,49.9999,0,30);
var user4=new User("4",20,50,20,30);
userlist.push(user1);
userlist.push(user2);
userlist.push(user3);
userlist.push(user4);


//same event has same number
function setcnt(){
	for (var i = 0; i < userlist.length; i++) {
		if(userlist[i].cnt==-1){
			userlist[i].cnt=firecnt;
			firecnt++;
		}
		if(i!=(userlist.length-1)){
			for (var j = i+1; j < userlist.length; j++) {
				if(userlist[j].lat()<(userlist[i].lat()+userlist[i].delat())&&userlist[j].lat()>(userlist[i].lat()-userlist[i].delat())){
					if(userlist[j].long()<(userlist[i].long()+userlist[i].delong())&&userlist[j].long()>(userlist[i].long()-userlist[i].delong())){
						userlist[j].cnt=userlist[i].cnt;
					}
				}
			}
		}
	}
}

setcnt();

userl=[];
for (var i = 0; i < firecnt; i++) {
	tmp=[];
	for (var j = 0; j < userlist.length; j++) {	
		if(userlist[j].cnt==i){tmp.push(userlist[j]);}
	}
	userl.push(tmp);
	
}
*/
// console.log(userl)

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
var user5=new User("5",10,49.9999,20,"2018/2/26 3:30:30");
// console.log(user5.t);
adduser(user5);
// console.log(jsondata[0]["info_list"]);

var user6=new User("6",9.999,50,20,"2018/2/27 3:30:30");
adduser(user6);
// console.log(jsondata);

var user7=new User("7",20,50,20,"2017/12/21 3:30:30");
adduser(user7);
// console.log(jsondata);
var user8=new User("8",10.0001,50.001,1,"2017/10/11 3:30:30");
adduser(user8);
// console.log(jsondata);

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

				var xtmp=(y2-y1+(Math.tan(Math.PI/180*a2)*x2-Math.tan(Math.PI/180*a1)*x1))/(Math.tan(Math.PI/180*a2)-Math.tan(Math.PI/180*a1));
				var ytmp=((x2-x1)+(Math.tan(Math.PI/180*a1)*y1-Math.tan(Math.PI/180*a2)*y2))/(Math.tan(Math.PI/180*a1)-Math.tan(Math.PI/180*a2));

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

var output_json =calculate(jsondata);
// console.log(output_json);

function readdb(infile){
    var fs = require('fs');
    var tmpdata=fs.readFileSync(infile,'utf8')
    var data =JSON.parse(tmpdata);
    // console.log(typeof(data));
    return data;
}

var jsondb = readdb("dbraw/VNP14IMGTDL_NRT_Global_24h.json");

function convertdb(json,outfile){


	var dataheaders=["event_id","radius","latlong","start_time","status","info_list"];
	var jsondata=[];

	for (var i = 0; i < json.length; i++) {

		var alldata={};
		var tmplatlong=[-1,-1];
		var tmpinfohead=["report_time","user_id","latitute","longitude","angle","description"];
		var tmpinfo=[]//
		
		var alltmp={};
		alltmp[tmpinfohead[0]]=undefined;
		alltmp[tmpinfohead[1]]="database";
		alltmp[tmpinfohead[2]]=undefined;
		alltmp[tmpinfohead[3]]=undefined;
		alltmp[tmpinfohead[4]]=undefined;
		alltmp[tmpinfohead[5]]=undefined;
		tmpinfo.push(alltmp);
		

		alldata[dataheaders[0]]="db_"+i.toString();
		alldata[dataheaders[1]]=undefined;
		alldata[dataheaders[2]]=[json[i]["latitude"],json[i]["longitude"]];
		alldata[dataheaders[3]]=json[i]["acq_date"]+" "+json[i]["acq_time"];
		alldata[dataheaders[4]]="undetermined";
		alldata[dataheaders[5]]=tmpinfo;
		jsondata.push(alldata);
	}
	var fs = require('fs');
	var tt =JSON.stringify(jsondata,null,4);
	fs.writeFile(outfile,tt,function (err) {
        if (err)
        console.log(err);
        // else
        // console.log('Write operation complete.');
    })

	
	// console.log(jsondata);
	// return jsondata;
}
// console.log(typeof(jsondb))
convertdb(jsondb,"dbstore/VNP14IMGTDL_NRT_Global_24h.json");











