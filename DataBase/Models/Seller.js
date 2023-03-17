import { DataTypes,sequelize } from "sequelize";

const seller = sequelize.define("sellers",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey:true,
    },
    enterprise:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

export default seller;