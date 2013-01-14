// author:lichengwu
// created:2013-01-13

/*
  stackoverflow.com review tool
*/
// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

// Test for notification support.
if (window.webkitNotifications) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { fetch_review_info(); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;
    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      fetch_review_info();
      interval = 0;
    }
  }, 60000);
}

// fetch review info
function fetch_review_info() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = xhr.responseText;
        var reg = /class=\"dashboard-num"\s*title=\"[\d|,].*\"/igm;
        var result = data.match(reg);
        var first_post = result[0].substring(result[0].lastIndexOf('=')+2,result[0].lastIndexOf('"'));
        var late_answer = result[1].substring(result[1].lastIndexOf('=')+2,result[1].lastIndexOf('"'));
        var close_vote = result[2].substring(result[2].lastIndexOf('=')+2,result[2].lastIndexOf('"'));
        var low_quality_post = result[3].substring(result[3].lastIndexOf('=')+2,result[3].lastIndexOf('"'));
        var suggested_edit = result[4].substring(result[4].lastIndexOf('=')+2,result[4].lastIndexOf('"'));
        var reopen_vote = result[5].substring(result[5].lastIndexOf('=')+2,result[5].lastIndexOf('"'));
        // show notification

        if(late_answer <= 0){
          return;
        }

        var notification = window.webkitNotifications.createNotification(
          'icon.png',                                     // The image.
          'Stackoverflow Review',                       // The title.
          'First Posts : '+ first_post
          //"\r\nLate Answers : " + late_answer +
          //'\r\nClose Votes : ' + close_vote +
          //'\nLow Quality Posts : ' + low_quality_post +
          //'\nSuggested Edits : '+ suggested_edit+
          //'\nReopen Votes : '+ reopen_vote               // The body.
        );
        notification.show();

      } else {
        console.log('error');
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  var url = 'http://stackoverflow.com/review/';
  xhr.open('GET', url, true);
  xhr.send();
};
