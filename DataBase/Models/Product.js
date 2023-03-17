import { DataTypes,sequelize } from "sequelize";

const product = sequelize.define("products",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey:true,
    },
    brand:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    discount:{
        type:DataTypes.FLOAT,
        allowNull:false,
    }
});

export default product;