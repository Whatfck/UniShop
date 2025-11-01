// Ensure a minimal crypto API exists in environments (alpine node images) where
// the global Web Crypto may not be available. Some libraries call
// `crypto.randomUUID()` during module initialization.
if (typeof (globalThis as any).crypto === 'undefined') {
  // Use Node's crypto as a fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  (globalThis as any).crypto = require('crypto');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { seedDatabase } from './seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  try {
    // Ensure migrations are applied before seeding so tables exist
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    try {
      await dataSource.runMigrations();
      console.log('✅ Migrations aplicadas (seed.command)');
    }
    catch (mErr) {
      console.warn('⚠️  Error aplicando migrations desde seed.command (continuando):', mErr && mErr.message ? mErr.message : mErr);
    }
    // If migrations didn't create expected tables (some environments may not have
    // migrations registered in TypeOrmModule), run the initial migration file
    // directly as a fallback.
    try {
      const check = await dataSource.query("SELECT to_regclass('public.categories') as tbl");
      const tbl = check && check[0] ? check[0].tbl : null;
      if (!tbl) {
        console.log('⚠️  Tabla categories no encontrada — ejecutando migration inicial manualmente');
        const qr = dataSource.createQueryRunner();
        await qr.connect();
        // Attempt to load all compiled migration JS files under dist/src/migrations
        // and execute their `up` method in sequence.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        const path = require('path');
        const migrationsPath = path.resolve(__dirname, '../migrations');
        if (fs.existsSync(migrationsPath)) {
          const files = fs.readdirSync(migrationsPath).filter((f) => f.endsWith('.js'));
          for (const file of files) {
            try {
              const mod = require(path.join(migrationsPath, file));
              // Find exported migration class and run its `up` if present
              for (const key of Object.keys(mod)) {
                const Candidate = mod[key];
                if (typeof Candidate === 'function') {
                  const inst = new Candidate();
                  if (inst && typeof inst.up === 'function') {
                    console.log(`➡️ Ejecutando migration: ${file} -> ${key}`);
                    await inst.up(qr);
                  }
                }
              }
            }
            catch (e) {
              console.warn('⚠️  Error ejecutando migration desde file', file, e && e.message ? e.message : e);
            }
          }
          console.log('✅ Migrations compiladas ejecutadas manualmente');
        }
        else {
          console.warn('⚠️  No se encontró folder de migrations compiladas en', migrationsPath);
        }
        await qr.release();
      }
    }
    catch (manualErr) {
      console.warn('⚠️  Error ejecutando migration manual:', manualErr && manualErr.message ? manualErr.message : manualErr);
    }
    await seedDatabase(dataSource);
    console.log('✅ Seeding completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();