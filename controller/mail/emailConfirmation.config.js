exports.confirmSecret = A8KedSV6AUNIbmj06lDUic2P3s7PZJrywGbuu5uzMDgXexdEHwzG1GjJjXXj9BRprq7JSjr1uNBWmUE7keRSuE5FYj6o9UMfijRu7wwX9NAjAY2;

//login credentials for gmail mailer
exports.auth = {
      user: 'workouttracker.dhbw@gmail.com',
      pass: 'lfSu5hEAsa60LCF7Y643'
    };

exports.emailContent = (user) => {
  return(
  "<h1>Thanks for your registration!</h1><br><br>\
  Dear " + user.firstname + " " + user.lastname + ",<br>\
  there is just one more step to do before your registration is finished!<br>\
  Please press the button below: <br><br>\
  <a href='http://localhost:9000/" + user.confirmationToken +  "'>Confirm</a>"
);
}