const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const User = require('./models/User')

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const phone = '9999999999'

    const existingUser = await User.findOne({ phone })

    if (existingUser) {
      console.log('❌ This phone number is already registered.')
      console.log('Please change the phone number inside createAdmin.js')
      await mongoose.disconnect()
      return
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10)

    await User.create({
      name: 'VillageConnect Admin',
      phone,
      village: 'All Villages',
      password: hashedPassword,
      role: 'admin',
    })

    console.log('')
    console.log('✅ ADMIN ACCOUNT CREATED')
    console.log('Phone: 9999999999')
    console.log('Password: Admin@123')
    console.log('Role: admin')
    console.log('')

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()