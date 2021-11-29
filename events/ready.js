const client = require("../index.js")
const config = require('../config.json')
const prefix = config.prefix


client.on('ready', () => {
    
    console.log(`${client.user.username} ✅`)


    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesplay_list.length - 1) + 1);
        client.user.setActivity(activitiesplay_list[index], { type: 'PLAYING' }); 
        }, 10001);
       
        setInterval(() => {
        const index = Math.floor(Math.random() * (activitieswatch_list.length - 1) + 1);
        client.user.setActivity(activitieswatch_list[index], { type: 'WATCHING' }); 
        }, 10003);  
       
        setInterval(() => {
         const index = Math.floor(Math.random() * (activitieslisten_list.length - 1) + 1);
        client.user.setActivity(activitieslisten_list[index], { type: 'LISTENING' }); 
         }, 10002);  
       
        setInterval(() => {
         const index = Math.floor(Math.random() * (activitiesfix_list.length - 1) + 1);
        client.user.setActivity(activitiesfix_list[index], { type: 'LISTENING' }); 
         }, 10000);  
       
       
       
       
       
         const activitieswatch_list = [
           "Nikan", 
           "Modarators",
           "everything go wrong", 
           "Sound's Utilities"
           ];
       
         const activitiesplay_list = [
           "with my dog", 
           "Minecraft",
           ">help", 
           "with Nikan"
           ];
       
           const activitieslisten_list = [
           "endermen noises", 
           "Creeper, aww man",
           "Mr. PrøTøn", 
           "nikan's class"
           ]; 
       
           const activitiesfix_list = [
           "endermen noises", 
           "Creeper, aww man",
           "Mr. PrøTøn", 
           "nikan's class"
           ];  

})