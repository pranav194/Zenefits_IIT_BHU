const express = require('express');
const router  = express.Router();
const fetch = require('node-fetch');


let departmentlink = "https://api.zenefits.com/core/departments/";
const Auth_Token = "elZxQlHDSUallvL3OnnH";

router.get('/',async (req,res)=>{
    try{
        let deps = await  getDep(departmentlink);
        let depsdata = await Promise.all(deps.map(async dep=>{
            let name = dep.name;
            let id = dep.id;
            let people_url = dep.people.url;
            let peoples = await getDep(people_url);
            let emps = peoples.map(people=>{
                let fname = people.first_name;
                let lname = people.last_name;
                let id = people.id;
                return {name:`${fname} ${lname}`,id};
            });
            return {name , id , emps};
        }));
        res.render('lisDep.ejs',{depsdata});
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});

async function getDep(link)
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