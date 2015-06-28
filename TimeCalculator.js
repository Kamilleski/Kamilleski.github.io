/**This file does a number of tasks, the most important being to get the single 
 * number I needed from the BART API (estimated time of departure) and use it 
 * to produce a string telling me both what that etd is and which drinks I have 
 * time to get, if any.  First I define all of the possible sassy string outputs,
 * then I get into the meat of parsing the API data.
 */
  
//object constructor for each drink's nutrients
function DrinkNutrients(calories, fat, sugar, protein) {
  this.calories = calories;
  this.fat = fat;
  this.sugar = sugar;
  this.protein = protein;
}

//putting drink nutrient objects into the drinks object (all large/whole milk)
var drinks = {};
drinks['a coffee (hot or iced)'] = new DrinkNutrients(10, 0, 0, 0);
drinks['a cafe au lait'] = new DrinkNutrients(85, 4, 6, 4);
drinks['a caffe latte'] = new DrinkNutrients(280, 14, 21, 14);
drinks['a pumpkin spice latte'] = new DrinkNutrients(375, 13, 51, 13);


//getting drink key names from object and pushing them into array for later use
for (var key in drinks) {
  var coffeeDranks = [];
  if (drinks.hasOwnProperty(key)) {
    var drinkKeyNames = Object.keys(drinks);
    for(var i in drinkKeyNames) {
      coffeeDranks.push(drinkKeyNames[i]);
    }
  }
}

/**creating a string with the list of what drinks you could get based on the 
 * times they take to create which I know from experience
 */
function drankList(arr, mins) {
  function drankString() {
      var stringy = arr.join(', or ');
      return 'you have time to grab ' + stringy + '!';
  }
  
  if (mins <= 3) {
    return 'Nonono! You barely have time to make it, let alone get a drink! ' + 
      'Run, girl!';
  }
  
  else if (mins >= 7) {
    return 'YES, ' + drankString();
  }
  
  else {
    while ((arr.length + 2) >= mins) {
      arr.pop();
    }
    
    return 'Sadly you don\'t have time for a pumpkin spice latte today, but ' + 
      drankString();
  }
}

//using BART API to find number of minutes until next train
var xhr;
xhr = new XMLHttpRequest();

/**defining array number sorting function to be used later so it won't be 
 * defined inside a loop
 */
function sortNumber(a,b) {
    return a - b;
}

//parses XML to find individual etd times and pushes them into an array
var departTimes = [];
xhr.onreadystatechange = function() {
  var mins;
  xmlDoc=xhr.responseXML;
  if (xhr.readyState==4 && xhr.status==200){
    //creates array of etd objects
    var etd = xmlDoc.getElementsByTagName('etd');
    //looping to use only the train lines that lead to Richmond
    for (var i = 0; i <etd.length; i++) {   
      var abbr = (etd[i].getElementsByTagName('abbreviation')[0].childNodes[0].
        nodeValue);
      if (abbr === 'PITT') {
        mins = etd[i].getElementsByTagName('minutes')[0].childNodes[0].nodeValue;
        mins = parseInt(mins);
        departTimes.push(mins);
      }
      
      else if (abbr === 'RICH') {
        mins = etd[i].getElementsByTagName('minutes')[0].childNodes[0].nodeValue;
        mins = parseInt(mins);
        departTimes.push(mins);
      }

      departTimes.sort(sortNumber);
      mins = departTimes[0];
      
        /**if number of minutes is less than time it takes to even run between 
         * trains, move to next viable estimated time of departure
         */
        if (mins <= 2 || isNaN(mins) === true ) { 
          negativeMessage = ' You couldn\'t make the next train even if you' + 
            ' ran, so take your time!';
          mins = departTimes[1];
          document.getElementById('runTime').innerHTML= drankList(coffeeDranks, 
            mins) + negativeMessage + ' The next viable train is leaving in ' + 
            mins + ' minutes.';
        }
        
        else {
          document.getElementById('runTime').innerHTML= drankList(coffeeDranks, 
            mins) + ' The next train is leaving in ' + mins + ' minutes.';
        }
      } 
    }
    
  return mins;
  
};

xhr.open('GET', 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=embr&key=MW9S-E7SL-26DU-VV8V&dir=n', true);
xhr.send();