function clamp(n,min,max)
{
	return Math.min(Math.max(n,min),max);
}

function format(n) //formats a number of seconds into #hr #min
{
	let hr=Math.floor(n/3600);
	let min=Math.floor(n%3600/60);
	if (hr>0) return hr+"h "+min+"m";
	if (min<1) return "<1m"; //we can assume h<1 bc of prev conditional

	return min+"m";
}

function get_day() //returns days since epoch+1 (current day value)
{
	return Math.floor(Date.now()/86400000);
}

async function upd()
{
	const container=document.getElementById("data_container");
	const total_p=document.getElementById("total");
	while (container.firstChild)
	{
		container.removeChild(container.lastChild);
	}

	let total=0;

	const info=[];
	const data=await chrome.storage.local.get(); //grabs all data
	for (const [i,v] of Object.entries(data))
	{
		info.push([i,v]);
		total+=v[0];
	}
	info.sort((a,b)=>{
		return b[1][0]-a[1][0];
	});
	if (info.length>5) info.splice(5,info.length-5);

	total_p.innerText="Total: "+format(total);
	for (let i=0;i<info.length;i++)
	{
		const div=document.createElement("div");
		div.className="data";
		container.appendChild(div);
		
		const p=document.createElement("p");
		p.innerText=info[i][0]+": "+format(info[i][1][0]);
		div.appendChild(p);

		const bar=document.createElement("div");
		bar.className="timebar";
		bar.style.width=clamp(info[i][1][0]/total*100,1,100)+"%";
		div.appendChild(bar);
	}
}

window.onload=function()
{
	let title=document.getElementById("title");
	let clear=document.getElementById("clear");
	let settings=document.getElementById("settings");
	let power=document.getElementById("power");
	let detailed=document.getElementById("detailed");

	let content=document.getElementById("content");
	let settings_t=document.getElementById("settings_t");
	
	let settings_state=false;
	let power_state=true;
	
	//experimental
	const date=new Date();
	const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
	title.innerText=days[date.getDay()]+", "+months[date.getMonth()]+" "+date.getDate();

	clear.onclick=function()
	{
		chrome.storage.local.clear();
		chrome.runtime.sendMessage({"msg": "clear"});

		upd();
	}
	settings.onclick=function()
	{
		settings_state=!settings_state;
		content.style.display=(settings_state===true)?"none":"block";
		settings_t.style.display=(settings_state===true)?"block":"none"; //inline or block?
	}
	power.onclick=function() //make this update a user preference by sending a message to the background js
	{
		power_state=!power_state;
		power.style.filter=(power_state===true)?"contrast(100%)":"contrast(40%)";
	}
	detailed.onclick=function()
	{
		chrome.runtime.sendMessage({"msg": "open_detailed"});
	}
	
	window.setInterval(()=>{
		upd();
	},30000); //make configurable? (currently .5 min)

	upd();
}
