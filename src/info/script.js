const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];

let day=get_day().toString();

function clamp(n,min,max)
{
	return Math.min(Math.max(n,min),max);
}

function random(min,max)
{
	return Math.random()*(max-min+1)+min;
}

function format(n) //formats a number of seconds into #hr #min
{
	let hr=Math.floor(n/3600);
	let min=n%3600/60;
	if (hr>0) return hr+"h "+Math.floor(min)+"m";
	if (min===0) return ""; //?
	if (min<1) return "<1m"; //we can assume h<1 bc of prev conditional

	return Math.floor(min)+"m";
}

function get_day() //returns days since epoch+1 (current day value)
{
	let date=new Date();
	return Math.floor(date.getTime()/86400000+(1-date.getTimezoneOffset()/1440));
}

async function upd()
{
	//temp log stuff
	/*
	let str="empty";

	const log=document.getElementById("log");
	const temp_data=await chrome.storage.local.get();
	const day_data=temp_data[day];
	if (day_data!==undefined)
	{
		for (const [i,v] of Object.entries(day_data))
		{
			if (str==="empty") str="";
			str+=i+": "+v[0]+", "+v[1]+"\n";
		}
	}
	log.innerText=str;
	log.style.fontSize="14px";
	*/

	
	const data=await chrome.storage.local.get(); //grabs all data
	const date=new Date(parseInt(day)*86400000);
	
	let max=9; //should be 3?
	let week_total=0;
	let count=0;
	const totals=[];
	for (let i=0;i<7;i++)
	{
		let total=0;
		let dval=parseInt(day)-(date.getDay()-i);
		const cdata=data[dval.toString()];
		if (cdata!==undefined)
		{
			for (const [i,v] of Object.entries(cdata))
			{
				total+=v[0];
			}
		}

		while (total/3600>max) max+=3;
		totals.push(total);

		week_total+=total;
		if (total>0) count++; //hmmm
	}
	for (let i=0;i<7;i++) //two loops is wild
	{
		let elem=document.getElementById("wbar"+i).children[0]; //should work?
		elem.style.height=((totals[i]/3600)/max)*100+"%";
		elem.style.setProperty("--time","\""+format(totals[i])+"\"");
		
		if (i==date.getDay().toString()) elem.style.backgroundColor="rgb(20,173,255)";
		else elem.style.backgroundColor="var(--gray)";
	}

	document.getElementById("avg-line").style.top=((1-(week_total/count/3600)/max)*100)+"%";
	document.getElementById("avg-line").style.setProperty("--time","\""+format(week_total/count)+"\"");
	document.getElementById("weekly-top-hr").innerText=max+"h";

	const day_label=document.getElementById("day");
	if (day===get_day().toString()) day_label.innerText="Today";
	else day_label.innerText=days[date.getDay()];
	day_label.innerText+=", "+months[date.getMonth()]+" "+date.getDate();

	const container=document.getElementById("data_container");
	const total_p=document.getElementById("total");
	while (container.firstChild)
	{
		container.removeChild(container.firstChild);
	}

	let total=0;
	
	const info=[];
	const cdata=data[day];
	if (cdata!==undefined)
	{
		for (const [i,v] of Object.entries(cdata))
		{
			info.push([i,v[0]]);
			total+=v[0];
		}
	}
	info.sort((a,b)=>{
		return b[1]-a[1];
	});

	total_p.innerText="Total: "+format(total);
	for (let i=0;i<info.length;i++)
	{
		if (info[i][1]===0) continue; //cant believe this has to be here...

		const div=document.createElement("div");
		div.className="data";
		div.style.animationDelay=(i*.1)+"s";
		container.appendChild(div);
		
		const p=document.createElement("p");
		p.innerText=info[i][0]+": "+format(info[i][1]);
		div.appendChild(p);

		const bar=document.createElement("div");
		bar.className="timebar";
		bar.style.width=clamp(info[i][1]/total*100,1,100)+"%";
		div.appendChild(bar);
	}

	const upd_date=new Date();
	let secs=upd_date.getSeconds();
	let mins=upd_date.getMinutes();
	let hours=upd_date.getHours();
	let am=true;
	if (secs<10) secs="0"+secs;
	if (mins<10) mins="0"+mins;
	if (hours>=12)
	{
		am=false;
		if (hours>12) hours-=12;
	}
	if (hours<10) hours="0"+hours;
	document.getElementById("last-upd").innerText="Last Updated: "+hours+":"+mins+":"+secs+(am?" AM":" PM")+", "+months[upd_date.getMonth()]+" "+upd_date.getDate();

	//day_label.innerText+=", "+months[date.getMonth()]+" "+date.getDate();
	
	//upd arrows
	let prev_week_exists=false;
	let next_week_exists=false;
	for (let i=1+date.getDay();i<=1+date.getDay()+7;i++)
	{
		if (data[(parseInt(day)-i).toString()]!==undefined) prev_week_exists=true;
	}
	for (let i=7-date.getDay();i<=7-date.getDay()+7;i++)
	{
		if (data[(parseInt(day)+i).toString()]!==undefined) next_week_exists=true;
	}

	//i mean... the vars are defined in this context...
	prev_week.style.opacity=prev_week_exists?"1":"0";
	next_week.style.opacity=next_week_exists?"1":"0";
}

window.onload=function()
{
	const prev_week=document.getElementById("prev_week");
	const next_week=document.getElementById("next_week");

	const weekly_data=document.getElementById("weekly_data");
	
	const gradient_container=document.querySelector(".gradient-container");
	for (let v of gradient_container.children)
	{
		v.style.setProperty("--radius",random(50,80)+"%");
		v.style.setProperty("--deviate-x",random(-50,50)+"%");
		v.style.setProperty("--deviate-y",random(-50,50)+"%");
		v.style.setProperty("--color",random(0,175)+","+random(0,175)+","+random(200,255));

		v.style.transform="translate("+random(-50,50)+"%,"+random(-50,50)+"%)";
	}

	function change_day(d)
	{
		let temp=(parseInt(day)+d).toString(); //ew
		chrome.storage.local.get((data)=>{
			if (data[temp]!==undefined||temp===get_day().toString()) //nice little work around ig
			{
				day=temp;
				upd();
			}
		});
	}
	prev_week.onclick=function()
	{
		let date=new Date(parseInt(day)*86400000);
		change_day(-date.getDay()-1);
	}
	next_week.onclick=function()
	{
		let date=new Date(parseInt(day)*86400000);
		change_day(7-date.getDay());
	}

	//a little nasty but ok for now ig
	for (let i=0;i<weekly_data.children.length;i++)
	{
		let v=weekly_data.children[i];
		if (v.id.substring(0,4)=="wbar")
		{
			let ind=parseInt(v.id.substring(4,5));
			v.onclick=function()
			{
				const date=new Date(parseInt(day)*86400000);

				let ind=parseInt(this.id.substring(4,5));
				let week=Math.floor(parseInt(day)/7);
				if (date.getDay()<3) week++;
				
				if (parseInt(day)===week*7-3+ind) return;
				
				day=(week*7-3+ind).toString();
				upd();
			}
		}
	}

	change_day(0); //automatically calls upd func so no need to
	
	window.setInterval(()=>{	
		for (let v of gradient_container.children)
		{
			//log positition --> but how to get?
			v.style.transform="translate("+random(-50,50)+"%,"+random(-50,50)+"%)";
		}
	},15000);

	window.setInterval(()=>{
		if (day!==get_day().toString()) return;
		upd();
	},30000); //make configurable? (currently .5 min)
}
