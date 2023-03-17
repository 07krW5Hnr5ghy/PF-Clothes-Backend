import { DataTypes,sequelize } from "sequelize";

const location = sequelize.define("locations",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey:true,
    },
    country:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Region:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    State:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    cityOrTown:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    neighborhood:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

export default location;