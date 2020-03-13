// Queue class 
class Queue 
{ 
	// Array is used to implement a Queue 
	constructor() 
	{ 
		this.items = []; 
	} 
				
    enqueue(element) 
    {	  
        this.items.push(element); 
    } 
    // dequeue function 
    dequeue() 
    { 
        
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 
    // front function 
    front() 
    { 
        
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    } 
    // isEmpty function 
    isEmpty() 
    { 
        
        return this.items.length == 0; 
    } 
    length()
    {
        return this.items.length;

    }
} 

module.exports = Queue;