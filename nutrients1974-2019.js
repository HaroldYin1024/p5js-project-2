

function NutrientsTimeSeries() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Nutrients: 1974-2019';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'nutrients-timeseries';

  // Title to display above the plot.
  this.title = 'UK Nutrients: Average Intake by Categories.';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';
    
  //colors for nutrients
  this.colors = [];
  
  //set the size of margin
  var marginSize = 35;
  //initialize the selection 
  this.selected="All";

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 9,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/nutrients.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);
      
    

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length-1]);
      
      
    //push random colors
    for(var i=0;i<this.data.getRowCount();i++){
        this.colors.push(color(random(0,255),random(0,255),random(0,255)));
    }


      
     // Create a select DOM element.
    this.select = createSelect();
    this.select.position(350, 560);
    //set the default option "All"
    this.select.option("All");

    // Fill the options with all nutrient names.
    var nutrients = this.data.getColumn(0);
    for (let i = 0; i < nutrients.length; i++) {
      this.select.option(nutrients[i]);
    }
      
    // Find min and max pay gap for mapping to canvas height.
    this.minPercentage = 91;         // Pay equality (zero pay gap).
    this.maxPercentage = 325;
      
      
      
    // Create sliders to control start and end years. Default to
    // visualise full range.
    this.startSlider = createSlider(this.startYear,
                                    this.endYear - 1,
                                    this.startYear,
                                    1);
    this.startSlider.position(675, 560);

    this.endSlider = createSlider(this.startYear + 1,
                                  this.endYear,
                                  this.endYear,
                                  1);
    this.endSlider.position(875, 560);
  };

  this.destroy = function() {
    this.startSlider.remove();
    this.endSlider.remove();
    this.select.remove();
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    //get the startYear and endYear choosed by user 
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

  
    //get the seletected nutrient
    this.selected=this.select.value();
    
    
    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPercentage,
                        this.maxPercentage,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    
    var numYears = this.endYear - this.startYear;
    console.log(numYears);

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      //check whether it is the default all selection
      if(this.selected!="All"){
          //if selected is not all, then check whether the nutrient name is the selected one, if not, skip this loop
          if(this.data.getColumn(0)[i]!=this.selected){
              continue;
          }
      }
      
      
      //get the specific nutrients data
      var row=this.data.getRow(i);
      var previous = null;
      //set the updated min and max value
      if(this.selected!="All"){
            this.minPercentage=this.findMin(row.arr);

            this.maxPercentage=this.findMax(row.arr);

      }else{
           this.minPercentage=91;

           this.maxPercentage=325;
      }

      //get the name of nutrients
      var l= row.getString(0);
      for(var j=1;j<=numYears+1;j++){
               // Create an object to store data for the current year.
        var current = {
            // Convert strings to numbers.
            'year': this.startYear+j-1,
            'percentage': row.getNum(j)
        }; 
          
        
        if (previous != null) {
            // Draw line segment connecting previous year to current
            // year pay gap.
       
            stroke(this.colors[i]);
            line(this.mapYearToWidth(previous.year),
                 this.mapPayGapToHeight(previous.percentage),
                 this.mapYearToWidth(current.year),
                 this.mapPayGapToHeight(current.percentage));

            // The number of x-axis labels to skip so that only
            // numXTickLabels are drawn.

            var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

            // Draw the tick label marking the start of the previous year.
            if ((j-2) % xLabelSkip == 0) {
              drawXAxisTickLabel(previous.year, this.layout,
                                 this.mapYearToWidth.bind(this));
            }
            
            if ((numYears <= 6)) {
              drawXAxisTickLabel(current.year, this.layout,
                                 this.mapYearToWidth.bind(this));
            }
        }
          

  
        //print the nutrient name on the position of last year
        if(j==numYears+1){
            noStroke();
            fill(this.colors[i]);
            text(l,900,this.mapPayGapToHeight(current.percentage))
            

        }
          
          // Assign current year to previous year so that it is available
          // during the next iteration of this loop to give us the start
          // position of the next line segment.
          previous = current;
      }
        





    }
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function(value) {
    return map(value,
               this.minPercentage,
               this.maxPercentage,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
    
  this.findMin=function(row){
      var min=Number(row[1]);
      for(var i=1;i<row.length;i++){
          if(min>Number(row[i])){
              min=Number(row[i]);
          }
      }
      
      return min;
  }
    
    
    
  this.findMax=function(row){
      var max=Number(row[1]);
      for(var i=1;i<row.length;i++){
          if(max<Number(row[i])){
              max=Number(row[i]);
          }
      }
      
      return max;
  }
}
