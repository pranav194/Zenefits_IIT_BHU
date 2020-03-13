const express = require('express');
const router  = express.Router();
const fetch = require('node-fetch');

const Queue =  require('../utils/Queue');
const Auth_Token = "elZxQlHDSUallvL3OnnH";
const startlink = " https://api.zenefits.com/core/people";
let loclink = "https://api.zenefits.com/core/locations/";
let departmentlink = "https://api.zenefits.com/core/departments/";


router.get('/',async (req,res)=>{
    try{
        let link = startlink;    
        let root = {};
        let members = await getusers(link);
        let que = new Queue();

        let totemp = [];
        let loc = await getMap(loclink);
        let dep = await getMap(departmentlink);

        members.forEach(async (member)=>{
            let status = member.status;
            if(status == "active")
            {
                let manager_url = member.manager.url;
                let id = member.id;
                let fname = member.first_name;
                let lname = member.last_name;
                
                let phone  = member.work_phone;
                let locationurl = member.location.url;
                
                let departmenturl = member.department.url;
                let is_admin = member.is_admin;
                
                let locid = getId(locationurl);
                let departmentid = getId(departmenturl);
                let department = dep[departmentid];                
                let location = loc[locid];
                totemp.push( {"id":id,"Name" :`${fname} ${lname}`, tags: [location, department],"Phone":phone,"department":department,"location":location,"is_admin":is_admin});
                let manager = getId(manager_url);
                if(manager)
                {
                    totemp[totemp.length-1].pid = getId(manager_url);
                }
                
            }
                
        });    
        
        res.render('orgchart.ejs',{totemp});
    }
    catch(e)
    {
        console.log(e);
        res.send({error :'Some error occured'});
    }
});

async function getMap(link)
{
    while(link)
    {
        let data = (await fetch(link,{
            method : 'GET',
        headers: {
            'Authorization': `Bearer ${Auth_Token}`,
        }})
        .then(res => res.json())).data;
        let da = data.data;
        let dict={};
        da.forEach(d=>{
            let name = d.name;
            let id = d.id;
            dict[id] = name;
        });        
        link = data.next_url;
        return dict;
    }
    
}
function getId(link)
{
    if(link){
    let s = link.lastIndexOf('/')+1;
    return link.substr(s);
    }
    return null;
}


async function processUsers(member)
{
    
}
async function getusers(link)
{
    let emp=[];
    while(link)
    {
        let data = await fetch(link,{
            method : 'GET',
        headers: {
            'Authorization': `Bearer ${Auth_Token}`,
        }})
        .then(res => res.json());
        let d =data.data;
        emp.push(...d.data);
        link = d.next_url;
    }
    return emp;
}
module.exports = router;