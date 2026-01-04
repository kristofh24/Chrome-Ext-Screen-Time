let c_tab=null;
let monitor=true;

function print(val)
{
	const date=new Date();
	//console.log(date.getMonth()+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" --> "+val);
	console.log(val);
}

function get_t() //in seconds
{
	return Math.floor(Date.now()/1000);
}

function get_day() //returns days since epoch+1 (current day val)
{
	let date=new Date();
	return Math.floor(date.getTime()/86400000+(1-date.getTimezoneOffset()/1440));
}

function get_title(tab)
{
	let title=tab.url;
	title=title.replace("https://","");
	title=title.replace("www.","");
	title=title.replace("chrome://","");
	title=title.replace("chrome-extension:","chrome-extension"); //temp solution?

	let end=title.indexOf("/");
	title=title.substr(0,end>-1?end:title.length);

	return title;
}

async function upd_last_access(str)
{
	if (str===undefined||str==="") return;
	
	const data=await chrome.storage.local.get();
	let cdata=data[get_day().toString()];
	if (cdata===undefined) cdata={};

	if (str===null)
	{
		for (const [i,v] of Object.entries(cdata)) upd_last_access(i); //calls itself
		return;
	}
		
	print("\t\tupd_last_access: "+str);

	if (cdata[str]!==undefined)
	{
		cdata[str][1]=get_t();

		const ndata={};
		ndata[get_day().toString()]=cdata;
		chrome.storage.local.set(ndata);
	}
	else cdata[str]=[0,get_t()];

	/*
	return; //temp

	chrome.storage.local.get(get_day().toString(),(result)=>{ //key looks janky
		let data=[];
		if (Object.keys(result).length>0)
		{
			data=result[0]; //should in theory always return only 1?
		}
		
		//format: [i] = [str,elapsed,last_access_t]
		for (let i=0;i<data.length;i++)
		{
			if (data[i][0]===str)
			{
				//match found?
				break;
			}
		}
	});

	return;


	*/

	return; //temp

	if (str===null)
	{
		chrome.storage.local.getKeys((keys)=>{
			keys.forEach((v,i)=>{
				upd_last_access(v); //calls itself
			});
		});
		return;
	}

	print("\t\tupd_last_access: "+str);

	chrome.storage.local.get(str,(result)=>{
		let data=[0,get_t()];
		if (Object.keys(result).length>0)
		{
			data[0]=result[str][0];
			data[1]=result[str][1];
		}
		
		const n_data={};
		n_data[str]=[data[0],get_t()];
		chrome.storage.local.set(n_data);
	});
}

async function upd_elapsed(str)
{
	if (str===null||str==="") return;
	
	print(get_day()+" upd_elapsed: "+str);
	
	const data=await chrome.storage.local.get();
	let cdata=data[get_day().toString()];
	if (cdata===undefined) cdata={};
	
	let elapsed=0;
	if (cdata[str]!==undefined)
	{
		elapsed=get_t()-cdata[str][1];
		if (elapsed>5)
		{
			print("elapsed greater than 5 --> updating all last_access_t");
			upd_last_access(); //this was commented out before?
			return;
		}

		cdata[str][0]+=elapsed;
		cdata[str][1]=get_t();
	}
	else cdata[str]=[0,get_t()]; //start out at 0 or 5?

	const ndata={};
	ndata[get_day().toString()]=cdata;
	chrome.storage.local.set(ndata);
}

function upd_tab(title)
{	
	upd_elapsed(c_tab);
	upd_last_access(title);
	c_tab=title;
}

chrome.runtime.onInstalled.addListener(()=>{
	//good for one time setups
	
	/*chrome.tabs.create({
		url: "src/info.html"
	});*/
	
	chrome.idle.setDetectionInterval(15);

	print("installed");
});

//add an on startup?

chrome.tabs.onUpdated.addListener((id,info,tab)=>{
	if (tab.status!=="complete") return;

	let title=get_title(tab);
	if (title===c_tab) return;
	
	print("\t\t"+c_tab+" onUpdated upd_elapsed");
	upd_tab(title);
});

chrome.tabs.onActivated.addListener((info)=>{
	chrome.tabs.get(parseInt(info.tabId),(tab)=>{
		let title=get_title(tab);
		if (title==="") return;

		print("\t\t"+c_tab+"-> "+title+" onActivated upd_elapsed");
		upd_tab(title);
	});
});

chrome.idle.onStateChanged.addListener((state)=>{
	print("\t\t\t\t\t\t"+state+" idle.onStateChanged"); //needed?
	
	switch (state) //"idle" not important
	{
		case "active":
			if (monitor===false) //returning from locked state --> all last_access_t should be updated to now
			{
				upd_last_access();
			}
			monitor=true;
			break;
		case "locked":
			monitor=false;
			break;
	}
});

chrome.runtime.onMessage.addListener((event)=>{
	switch (event.msg)
	{
		case "open_detailed":
			print("opening detailed view");
			chrome.tabs.create({"active": true,"url": "/src/info/index.html"});
			break;
	}
});

/*chrome.runtime.onConnect.addListener((c_port)=>{
	switch (c_port.name)
	{
		case "popup":
			popup_focused=true;
			c_port.onDisconnect.addListener((dc_port)=>{
				popup_focused=false;
			});
			break;
	}
});*/

chrome.windows.onFocusChanged.addListener((winId)=>{ //rewrite???
	if (winId===chrome.windows.WINDOW_ID_NONE) return;
	
	print("\t\t"+c_tab+" onFocusChanged upd_elapsed");
	upd_elapsed(c_tab);
	c_tab=null; //just in case ig?
	chrome.tabs.query({"windowId": winId},(tabs)=>{
		for (let i=0;i<tabs.length;i++)
		{
			if (tabs[i].active===true)
			{
				c_tab=get_title(tabs[i]);
				break;
			}
		}
		
		upd_last_access(c_tab);
		print("new c_tab: "+c_tab);
	});
});

setInterval(()=>{
	if (!monitor) return;

	//print("5 sec: "+c_tab);
	
	upd_elapsed(c_tab);

	//check pagevisibility of current window --> if not visible then c_tab=null
		
},5000); //make interval configurable by user
