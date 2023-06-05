//initialize click point coordinates x and y
var temp_x=0;
var temp_y=0;
//mouse is clicked or not
var isClicked=false;


function UKFoodConsumption(){
  // Name for the visualisation to appear in the menu bar.
  this.name = 'UK Food Consumption ';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'uk-food-consumption';

  // Property to represent whether data has been loaded.
  this.loaded = false;
  var data;
  //years of data
  var years;
  //current name displayed at the bottom of sketch
  var currentName="";
  //list to store bubble
  var bubbles;
  //to check whether mouse is over any of the bubbles
  var isMouseOver=false;
  
  //title name for current year
  var currentYear="in 1974";

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    data = loadTable(
      './data/food/foodData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };
  

    
  this.setup=function(){
    //initialize currentYear to 1974
    currentYear="in 1974";
      
    //create div for year buttons and locate it on the page
    this.divButton=createDiv("");
    this.divButton.parent('app');

    //initialize years and bubbles list
    years=[];
    bubbles=[];
    
    //traverse year columns and create corresponding columns
    for(var i=5;i<data.getColumnCount();i++){     
        
        this.s=data.columns[i];
        years.push(this.s);

        this.b=createButton(this.s);
        this.b.parent(this.divButton);
        //on mouse clicked, change the year in each bubble
        this.b.mousePressed(function(){

            this.yearString=this.elt.innerHTML;

            this.yearIndex=years.indexOf(this.yearString);
            
            for(var i=0;i<bubbles.length;i++){
                bubbles[i].setYear(this.yearIndex);
            }
            
            currentYear="in "+this.yearString
            
        });
    }
    
    //create reset button
    this.b=createButton("Reset");
    this.b.parent(this.divButton);
    //on mouse clicked, initialize the page
    this.b.mousePressed(function(){
        initialize();
        currentYear="in 1974";
    })
    
    initialize();

  }
  
  this.destroy = function() {
    this.divButton.remove();
  };
    
  //initialize the page
  var initialize=function(){
    //get the label for L1
    var tempbubbles=[];
    for(var i=0;i<data.getRowCount();i++){
        var r = data.getRow(i);
        var name=r.getString("L1");
        var level="L1";
        if(name!=""){
            
            
            var d=[];
            
            for(var j=0;j<years.length;j++){
                var v=Number(r.get(years[j]));
                d.push(v);
            }
            
            var b=new Bubble(name,d,level);
            
            
            
            b.setYear(0);
            
            tempbubbles.push(b);
            
        }
        
        
    }
    bubbles=tempbubbles;
  }
  
  
  this.draw=function(){
    //set the background color
    background(100);
    //draw title with year name
    this.drawTitle();
      
    //check whether mouse is clicked
    //if temp_x and temp_y are within the sketch, then mouse is clicked
    if((temp_x>0&&temp_x<width)&&(temp_y>0&&temp_y<height)){
        isClicked=true;
    }else{
        isClicked=false;
    }
    
      
    
    push();
    textAlign(CENTER);
    textSize(12);
    translate(width/2,height/2);
    isMouseOver=false;
    //traverse bubbles and draw each bubble
    for(var i=0;i<bubbles.length;i++){
        bubbles[i].updateDirection(bubbles);
        bubbles[i].draw();
        //check whether the mouse coordinate is over this bubble
        if(bubbles[i].checkMouseOver()){
            isMouseOver=true;
        };
        
        
        //check whether mouse is clicked
        if(isClicked){
            //check if click point is within this bubble and this bubble has a subcategory, if it is, then break for loop
            if(bubbles[i].checkClick()){
                break;
            }           
        }
    }
    pop();  
    //if mouse is not over any of the bubbles, then print nothing on the sketch
    if(isMouseOver==false){
        currentName="";
    }
    
    //reset the click point coordinate 
    temp_x=0;
    temp_y=0;
    
      
  }
  
  //generate a random ID
  var getRandomID=function(){
    var alpha="abcdefghijklmnopqrstuvwxyz0123456789";
    var s="";
    for(var i=0;i<alpha.length;i++){
        s+=alpha[floor(random(0,alpha.length))];
    }

    return s;  
  }
  
  
  
  var Bubble=function(_name,_data,_level){
    this.name = _name;
    this.level=_level;
    this.id=getRandomID();
    this.pos=createVector(0,0);
    this.dir=createVector(0,0);
    
    
    this.color =color(random(0,255),random(0,255),random(0,255));
    this.size=20;
    this.target_size=this.size;
    
    this.data=_data;

    //draw the bubble
    this.draw = function(){
        //scale the size of bubble by different level of category
        var scale=1;
        switch(this.level){
            case "L1":
            scale=1.2;
            break;
            case "L2":
            scale=1.4;
            break;
            case "L3":
            scale=1.6;
            break;
            case "L4":
            scale=1.8;
            break;
        }
        
        
        fill(this.color);
        ellipse(this.pos.x,this.pos.y,this.size);
        
        noStroke();
        fill(0);
        text(this.name,this.pos.x,this.pos.y);
        
        this.pos.add(this.dir);
        
        if(this.size<this.target_size*scale){
            this.size+=1;
        }else if(this.size>this.target_size*scale){
            this.size -=1;
        }

    }
    
    
    //check whether mouse coordinate is within this bubble, if it is, then assign the name to currentName
    this.checkMouseOver=function(){
        if(dist(this.pos.x,this.pos.y,mouseX-width/2,mouseY-height/2)<this.size/2){
            currentName=this.name;
            return true;
            
        }else{
            return false;
        }
    }
    
    
    //check whether click point is within the bubble and it has a subcategory, if yes, return true, if no, return false
    this.checkClick=function(){

        
        if(dist(this.pos.x,this.pos.y,temp_x-width/2,temp_y-height/2)<this.size/2){
            
            //current level
            var oldLevel=this.level;
            //sublevel
            var newLevel;
            //current name
            var oldName=this.name;
            
            //assign sublevel
            switch(this.level){
                case "L1":
                    newLevel="L2";
                    break;
                case "L2":
                    newLevel="L3";
                    break;
                case "L3":
                    newLevel="L4";
                    break;
                case "L4":
                    newLevel="stay";
                    break;
            }
            
            if(newLevel!="stay"){  //if it is not the last level
                //subcategory bubbles list
                var newBubbles=[];
                
                //the start and index of current level category
                var newIndexStart;
                
                var newIndexEnd;
                //flag to control the start and end index
                var flag=false;
               
                //get the start and end index of current level
                for(var i=0;i<data.getRowCount();i++){
                    var r=data.getRow(i);
                    var name=r.getString(oldLevel);
                    
                    

                    if(name==oldName){
                        newIndexStart=i+1;
                        flag=true;
                        continue;
                    }
                    
                    if(flag){
                        if(name!=""){
                            newIndexEnd=i;
                            break;
                        }
                    }
                    
                }

                //get the next level data between start and end index
                for(var i=newIndexStart;i<newIndexEnd&&newIndexEnd-1>newIndexStart;i++){
                    var r=data.getRow(i);
                    var name=r.getString(newLevel);
                    
                    
                    if(name!=""){//if not empty, push the data to a new bubble
                        var d=[];

                        for(var j=0;j<years.length;j++){
                            var v=Number(r.get(years[j]));

                            d.push(v); 


                        }

                        var b=new Bubble(name,d,newLevel);

                        b.setYear(0);
                        //push this bubble to new bubbles list
                        newBubbles.push(b);
                        
                    }


                }
                //if has one or more bubble in the next level,replace bubbles with new Bubbles.
                if(newBubbles.length>0){
                    bubbles=newBubbles;
                    return true;
                }

                

                
            }else{
                return false;
            }
            
            
        }else{
       
            return false;
        }
    }
    
    //set current year to be displayed for the bubble
    this.setYear = function(year_index)
    {
        var v=this.data[year_index];
        this.target_size = map(v,0,3600,5,200);
    }
    
    //check collision and update direction
    this.updateDirection=function(_bubbles){
       this.dir=createVector(0,0);
       
       for(var i=0;i<_bubbles.length;i++){

           if(_bubbles[i].id!=this.id){
               
               var v=p5.Vector.sub(this.pos,_bubbles[i].pos);
               var d=v.mag();
               
               if(d<this.size/2+_bubbles[i].size/2){
                  
                   if(d==0){
                       this.dir.add(p5.Vector.random2D());
                   }else{
                      this.dir.add(v); 
                   }
                   
               }
           }
          
       } 

         this.dir.normalize();
        
        
    }
    

  }
  
  
  //draw title of this data visualizer
  this.drawTitle = function() {
    fill(255);
    noStroke();
    textAlign('center', 'center');
    textSize(20);

    text(this.name+currentYear,width/2,20);
    text(currentName,width/2,height-20);
  };
  
    
    
  
}


//check mouse clicked function and update the coordinate of click point
function mouseClicked(){
      isClicked=true;
      temp_x=mouseX;
      temp_y=mouseY;
}

