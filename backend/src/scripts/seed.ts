/**
 * Database Seed Script
 * Populates the database with demo data for development
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/environment';
import { User, UserRole } from '../models/user.model';
import { Scenario, EventType, ScenarioStatus } from '../models/scenario.model';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(config.database.uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Scenario.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create demo users
    console.log('👤 Creating demo users...');

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = await User.create({
      email: 'admin@fintwin.ai',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      preferences: {
        theme: 'dark',
        notifications: true,
        defaultCurrency: 'USD',
      },
    });

    const demoUser = await User.create({
      email: 'demo@fintwin.ai',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.ANALYST,
      preferences: {
        theme: 'light',
        notifications: true,
        defaultCurrency: 'USD',
      },
    });

    console.log('✅ Demo users created:');
    console.log('   - admin@fintwin.ai / Admin@123 (Admin)');
    console.log('   - demo@fintwin.ai / Admin@123 (Analyst)');

    // Create demo scenarios
    console.log('📊 Creating demo scenarios...');

    const scenario1 = await Scenario.create({
      name: 'Interest Rate Hike Scenario',
      description: 'Simulates a 2% interest rate increase by central banks',
      eventType: EventType.INTEREST_RATE_CHANGE,
      targetDate: new Date('2024-12-31'),
      createdBy: adminUser._id,
      status: ScenarioStatus.DRAFT,
      parameters: {
        changePercent: 2.0,
        duration: '12 months',
        affectedRegions: ['US', 'EU', 'UK'],
        severity: 'moderate',
      },
    });

    const scenario2 = await Scenario.create({
      name: 'Tech Sector Crash',
      description: 'Simulates a 30% decline in technology sector stocks',
      eventType: EventType.SECTOR_CRASH,
      targetDate: new Date('2024-06-30'),
      createdBy: adminUser._id,
      status: ScenarioStatus.ACTIVE,
      parameters: {
        changePercent: -30.0,
        duration: '6 months',
        affectedRegions: ['Global'],
        severity: 'high',
        customParams: {
          sector: 'Technology',
          triggerEvent: 'Regulatory changes',
        },
      },
    });

    const scenario3 = await Scenario.create({
      name: 'Oil Price Surge',
      description: 'Simulates a 50% increase in crude oil prices',
      eventType: EventType.OIL_PRICE_CHANGE,
      targetDate: new Date('2024-09-30'),
      createdBy: demoUser._id,
      status: ScenarioStatus.DRAFT,
      parameters: {
        changePercent: 50.0,
        duration: '9 months',
        affectedRegions: ['Global'],
        severity: 'high',
        customParams: {
          trigger: 'Supply disruption',
          impactSectors: ['Energy', 'Transportation', 'Manufacturing'],
        },
      },
    });

    const scenario4 = await Scenario.create({
      name: 'Currency Devaluation',
      description: 'Simulates a 15% devaluation of emerging market currencies',
      eventType: EventType.CURRENCY_FLUCTUATION,
      targetDate: new Date('2024-08-31'),
      createdBy: demoUser._id,
      status: ScenarioStatus.DRAFT,
      parameters: {
        changePercent: -15.0,
        duration: '8 months',
        affectedRegions: ['Emerging Markets', 'Asia', 'Latin America'],
        severity: 'moderate',
      },
    });

    console.log('✅ Demo scenarios created:');
    console.log(`   - ${scenario1.name}`);
    console.log(`   - ${scenario2.name}`);
    console.log(`   - ${scenario3.name}`);
    console.log(`   - ${scenario4.name}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@fintwin.ai / Admin@123');
    console.log('   User:  demo@fintwin.ai / Admin@123');
    console.log('\n🚀 You can now login to the application!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export default seed;

// Made with Bob
