//finding local date and time
var d = new Date();
var hour = d.getHours();
var watchTime = d.toLocaleTimeString();

//setting greeting based on time of day received
var greeting;
var heyHoney = function() {
  if (hour < 12 && hour >= 0) {
    greeting = 'Good morning' ;
  }
  
  else if (hour <= 18) {
    greeting = 'Good afternoon';
  }
  
  else {
    greeting = 'Good evening';
  }
  
return greeting + ', honey! The time is ' + watchTime + '.';
};

//setting a countdown to Friday to keep the spirits of the basic bitches up
var dayOfWeek = d.getDay();
var TGIFMessage;
if (dayOfWeek === 0 || dayOfWeek === 6) {
  TGIFMessage = 'What the hell are you doing OUT OF BED on the weekend?!';
}

else if (dayOfWeek >= 1 && dayOfWeek <= 3) {
  TGIFMessage = 'Only ' + (5 - dayOfWeek) + ' more days until Friday... ' + 
  'Your hair looks great today, by the way!';
}
else if (dayOfWeek === 4) {
  TGIFMessage = 'Tomorrow is Friday! You\'re almost there...';
}

else {
  TGIFMessage = 'TGIF, BITCHES. You deserve a drank.';
}

//writing output to html page
function totalGreeting(salutation, body) {
  document.write(salutation + '  ' + body);
}

totalGreeting(heyHoney(), TGIFMessage);
