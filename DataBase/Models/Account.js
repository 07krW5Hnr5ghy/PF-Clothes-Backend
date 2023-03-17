import { DataTypes, sequelize } from 'sequelize';

const account = sequelize.define("accounts",{
    id:{
        type:DataTypes.UUID,
        default:DataTypes.UUIDV4,
        primaryKey: true,
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    surname:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    role:{
        type:DataTypes.ENUM("buyer","seller","admin"),
        allowNull:false,
        unique:true,
    }
});

export default account;