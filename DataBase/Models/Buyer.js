import { DataTypes,sequelize } from "sequelize";

const buyer = sequelize.define("buyers",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey:true,
    },
    login:{
        type:DataTypes.ENUM("password","google"),
        allowNull:false,
    }
});

export default buyer;