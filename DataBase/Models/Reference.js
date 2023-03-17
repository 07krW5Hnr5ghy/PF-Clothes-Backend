import { DataTypes,sequelize } from "sequelize";

const reference = sequelize.define("references",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey:true,
    },
    size:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    color:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
});

export default reference;