require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const { Sequelize, Op } = require("sequelize");
const modelProduct = require("./Models/Producto");
const modelCalification = require("./Models/Calification");
const modelMarketedProduct = require("./Models/MarketedProduct");
const modelProfile = require("./Models/Profile");
const modelVariant = require("./Models/Variant");

//Seeders
const users = require("./Seeders/users");
const products = require("./Seeders/products");
const reviews = require("./Seeders/reviews");
const createVariant = require("./Seeders/variant");

let conn =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: "postgres",
        logging: true, // set to console.log to see the raw SQL queries
        native: false, // lets Sequelize know we can use pg-native for ~30% more speed
      });

/*
const conn = new Sequelize("pf_cloth", DB_USER, DB_PASSWORD, {
    host:DB_HOST,
    dialect:"postgres",
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
})
*/
/*
const conn = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pf-cloth`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
*/

modelProduct(conn);
modelCalification(conn);
modelMarketedProduct(conn);
modelProfile(conn);
modelVariant(conn);
//console.log(conn.models)
//Asociaciones
const { product, qualification, marketedProduct, profile, variant } =
  conn.models;

//Perfil
profile.hasMany(product);
profile.hasMany(marketedProduct);
profile.hasMany(qualification);
//producto
product.hasMany(qualification);
product.hasMany(variant);
//marketedProduct
marketedProduct.hasOne(product);

///Seeder

const profilesCreator = async () => {
  const modelsProduct = products.map(async (pro) => {
    const model = await product.create(pro);
    await model.createVariant(createVariant());
    await model.createVariant(createVariant());
    return model;
  });
  var e = 0;

  for (i = 0; i < users.length; i++) {
    const profileC = await profile.create(users[i]);
    //console.log(profileC.__proto__)
    if (e <= modelsProduct.length) {
      await profileC.addProduct(await modelsProduct[e]);
      if (modelsProduct[e + 1])
        await profileC.addProduct(await modelsProduct[e + 1]);
      e += 2;
    }

    if (reviews[i]) {
      await profileC.createQualification(reviews[i]);
    }
  }
};

module.exports = {
  conn,
  profilesCreator,
  ...conn.models,
  Op,
};
