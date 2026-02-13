import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.model.js'

interface FoodAttributes {
  id: number
  donorId: number
  foodType: string
  quantity: string
  freshnessDuration: string
  pickupLocation: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  status: 'available' | 'claimed' | 'completed'
  claimedById?: number
  otp?: string
  createdAt?: Date
  updatedAt?: Date
}

interface FoodCreationAttributes extends Optional<FoodAttributes, 'id' | 'status' | 'claimedById' | 'otp' | 'latitude' | 'longitude' | 'imageUrl'> {}

class Food extends Model<FoodAttributes, FoodCreationAttributes> implements FoodAttributes {
  public id!: number
  public donorId!: number
  public foodType!: string
  public quantity!: string
  public freshnessDuration!: string
  public pickupLocation!: string
  public latitude?: number
  public longitude?: number
  public imageUrl?: string
  public status!: 'available' | 'claimed' | 'completed'
  public claimedById?: number
  public otp?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Food.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    foodType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    freshnessDuration: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pickupLocation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'claimed', 'completed'),
      defaultValue: 'available'
    },
    claimedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'food_posts',
    timestamps: true
  }
)

// Associations
Food.belongsTo(User, { foreignKey: 'donorId', as: 'donor' })
Food.belongsTo(User, { foreignKey: 'claimedById', as: 'claimedBy' })

export default Food
