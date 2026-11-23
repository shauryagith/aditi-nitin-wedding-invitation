import mongoose from 'mongoose';

const users = [
  'shreyash',
  'shreyashsrivastav',
  'shreyashsrivastava',
  'shreyash_srivastav',
  'admin',
  'weddingadmin',
  'aditi',
  'nitin',
  'aditinitin',
  'aditi_nitin',
  'aditi-nitin',
  'wedding',
  'root',
  'dbUser',
  'user',
  'diwedding',
];

const pass = 'fyYrAWJMt8IrhewK';
const cluster = 'cluster0.dybwexj.mongodb.net';

async function probe() {
  for (const u of users) {
    const uri = `mongodb+srv://${u}:${encodeURIComponent(pass)}@${cluster}/aditi-nitin-wedding?retryWrites=true&w=majority`;
    try {
      console.log(`Checking user: "${u}" ...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`🎉 MATCH FOUND! Atlas Database Username is: "${u}"`);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err: any) {
      if (err.message.includes('Authentication failed')) {
        console.log(`❌ "${u}": bad auth`);
      } else {
        console.log(`⚠️ "${u}": ${err.message}`);
      }
    }
  }
  console.log('No matching username found in dictionary.');
  process.exit(1);
}

probe();
