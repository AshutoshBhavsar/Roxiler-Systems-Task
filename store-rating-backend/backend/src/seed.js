require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('./models');
const { ROLES } = require('./utils/constants');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();


  const adminEmail = 'admin@storerating.com';
  const adminExists = await User.findOne({ where: { email: adminEmail } });

  let admin;
  if (!adminExists) {
    const hash = await bcrypt.hash('Admin@1234', 10);
    admin = await User.create({
      name: 'System Administrator',       
      email: adminEmail,
      password: hash,
      address: '1 Admin Plaza, Head Office',
      role: ROLES.SYSTEM_ADMIN,
    });
    console.log('✔  Admin created:', adminEmail, '/ Admin@1234');
  } else {
    admin = adminExists;
    console.log('ℹ  Admin already exists, skipping.');
  }


  const ownerEmail = 'owner@storerating.com';
  const ownerExists = await User.findOne({ where: { email: ownerEmail } });

  let owner;
  if (!ownerExists) {
    const hash = await bcrypt.hash('Owner@1234', 10);
    owner = await User.create({
      name: 'The Great Store Owner',       
      email: ownerEmail,
      password: hash,
      address: '42 Commerce Street, Market District',
      role: ROLES.STORE_OWNER,
    });
    console.log('✔  Store Owner created:', ownerEmail, '/ Owner@1234');
  } else {
    owner = ownerExists;
    console.log('ℹ  Store Owner already exists, skipping.');
  }


  const storeExists = await Store.findOne({ where: { ownerId: owner.id } });
  let store;
  if (!storeExists) {
    store = await Store.create({
      name: 'The Great Grocery Store',    
      email: 'store@thegreatgrocery.com',
      address: '42 Commerce Street, Market District',
      ownerId: owner.id,
    });
    console.log('✔  Sample store created.');
  } else {
    store = storeExists;
    console.log('ℹ  Sample store already exists, skipping.');
  }

 
  const userEmail = 'user@storerating.com';
  const userExists = await User.findOne({ where: { email: userEmail } });

  let normalUser;
  if (!userExists) {
    const hash = await bcrypt.hash('User@1234', 10);
    normalUser = await User.create({
      name: 'Regular Platform Customer',   
      email: userEmail,
      password: hash,
      address: '7 Residential Lane, Suburbs',
      role: ROLES.NORMAL_USER,
    });
    console.log('✔  Normal User created:', userEmail, '/ User@1234');
  } else {
    normalUser = userExists;
    console.log('ℹ  Normal User already exists, skipping.');
  }


  const ratingExists = await Rating.findOne({ where: { userId: normalUser.id, storeId: store.id } });
  if (!ratingExists) {
    await Rating.create({ userId: normalUser.id, storeId: store.id, value: 4 });
    console.log('✔  Sample rating created.');
  } else {
    console.log('ℹ  Sample rating already exists, skipping.');
  }

  console.log('\n✅  Database seeded successfully!\n');
  console.log('  Login credentials:');
  console.log('  Admin       → admin@storerating.com   / Admin@1234');
  console.log('  Store Owner → owner@storerating.com   / Owner@1234');
  console.log('  Normal User → user@storerating.com    / User@1234\n');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
