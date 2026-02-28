import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.model.js'

interface WasteFoodAttributes {
  id: number
  sellerId: number
  foodType: string
  quantity: string
  price: number
  description?: string
  pickupLocation: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  status: 'available' | 'sold' | 'reserved'
  buyerId?: number
  createdAt?: Date
  updatedAt?: Date
}

interface WasteFoodCreationAttributes extends Optional<WasteFoodAttributes, 'id' | 'status' | 'buyerId' | 'latitude' | 'longitude' | 'imageUrl' | 'description'> {}

class WasteFood extends Model<WasteFoodAttributes, WasteFoodCreationAttributes> implements WasteFoodAttributes {
  public id!: number
  public sellerId!: number
  public foodType!: string
  public quantity!: string
  public price!: number
  public description?: string
  public pickupLocation!: string
  public latitude?: number
  public longitude?: number
  public imageUrl?: string
  public status!: 'available' | 'sold' | 'reserved'
  public buyerId?: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

WasteFood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sellerId: {
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
      type: DataTypes.ENUM('available', 'sold', 'reserved'),
      defaultValue: 'available'
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'waste_food_posts',
    timestamps: true
  }
)

// Associations
WasteFood.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' })
WasteFood.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' })

export default WasteFood
