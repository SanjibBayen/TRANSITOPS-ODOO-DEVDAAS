import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { supabaseAdmin } from './config/supabase';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test Supabase connection
    const { data, error } = await supabaseAdmin.from('vehicles').select('count').single();
    
    if (error) {
      console.warn('⚠️  Supabase connection warning:', error.message);
      console.log('   Make sure your Supabase project is set up correctly');
    } else {
      console.log('✅ Supabase connected successfully');
    }

    app.listen(PORT, () => {
      console.log(`🚀 TransitOps server running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();