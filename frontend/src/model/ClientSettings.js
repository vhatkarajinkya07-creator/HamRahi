

//this is to add the places in visted 
export function Addplace(Client,name,date,place,link){
  Client.placesVisted.push({name:name,date:date,memories:link});
}

export function ChangeModeOfView(Client){
  if(Client.modeOfView == "high"){
    Client.modeOfView = "low" ;
  }else{
    Client.modeOfView = "high" ;
  }
}

export function SetModeOfView(Client, mode){
  if(mode == "high" || mode == "low"){
    Client.modeOfView = mode;
  }
}

const Client = {
  name: "Ajinkya",
  email:"vhatkarajinkya07@gmail.com",
  modeOfView:"low",//(graphics)
  placesVisted:[],
  dateChart:[],
};

export default Client;
