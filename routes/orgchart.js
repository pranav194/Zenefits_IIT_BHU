const express = require('express');
const router  = express.Router();
const fetch = require('node-fetch');

const Queue = require('../utils/Queue');


const Auth_Token = "elZxQlHDSUallvL3OnnH";
const startlink = " https://api.zenefits.com/core/people";
let loclink = "https://api.zenefits.com/core/locations/";
let departmentlink = "https://api.zenefits.com/core/departments/";

router.get('/',async (req,res)=>{
    try{
        
        res.render('orgchart.ejs');
    }
    catch(e)
    {
        console.log(e);
        res.send({error :'Some error occured'});
    }
});

router.get('/all',async (req,res)=>{
    try{
        console.log("coming here");

        
        let link = startlink;    
        let root = {};
        let members = await getusers(link);
        let que = new Queue();
        let totemp = [];
        let loc = await getMap(loclink);
        let dep = await getMap(departmentlink);

        members.forEach(async (member)=>{
            let status = member.status;
            let manager_url = member.manager.url;
            if(status == "active"&& manager_url == null)
            {
                let id = member.id;
                let fname = member.first_name;
                let lname = member.last_name;
                let subordinates_url = member.subordinates.url;
                let phone  = member.work_phone;
                let city = member.city;
                let locationurl = member.location.url;
                console.log(locationurl);
                let departmenturl = member.department.url;
                let is_admin = member.is_admin;
                let mem = {id,fname,lname,manager_url,subordinates_url,phone,city,departmenturl,is_admin};
                let locid = getId(locationurl);
                let departmentid = getId(departmenturl);
                mem["department"] = dep[departmentid];                
                mem["location"] = loc[locid];
                root = mem;
                que.enqueue(root);
            }
        });    
        while(!que.isEmpty())
        {
            let emp = que.dequeue();
            let sub = emp.subordinates_url;
            let subords = await getusers(sub);
            let subordinates_emp = [];
            subords.forEach(async subord=>{
                let id = subord.id;
                let fname = subord.first_name;
                let lname = subord.last_name;
                let status = subord.status;
                let manager_url = subord.manager.url;
                let subordinates_url = subord.subordinates.url;
                let phone = subord.work_phone;
                let city = subord.city;
                let locationurl = subord.location.url;
                let departmenturl = subord.department.url;
                let is_admin = subord.is_admin;
                let mem = {id,fname,lname,manager_url,subordinates_url,phone,city};
                let locid = getId(locationurl);
                let departmentid = getId(departmenturl);
                
                mem["department"] = dep[departmentid];                
                mem["location"] = loc[locid];
                
                if(status == "active")
                {
                    subordinates_emp.push(id);
                    que.enqueue(mem);
                }
            });
            let manager = getId(emp.manager_url);
            if(manager)
            {
                totemp.push( {"id":emp.id,"Name" :`${emp.fname} ${emp.lname}`, "pid":getId(emp.manager_url),"Phone":emp.phone,"department":emp.department, "location":emp.location,"is_admin":emp.is_admin});
            }
            else
            {
                totemp.push( {"id":emp.id,"Name" :`${emp.fname} ${emp.lname}`,"Phone":emp.phone,"department":emp.department,"location":emp.location,"is_admin":emp.is_admin});
            }
            
        }
        console.log(totemp);
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