const bcrypt = require('bcryptjs');

const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log('Password hash:', hash);
  console.log('\nUse this hash in your data/blogs.json file for the admin.passwordHash field');
});

