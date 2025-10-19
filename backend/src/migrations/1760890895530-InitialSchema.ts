import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1760890895530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla de usuarios
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "profilePictureUrl" character varying,
                "role" character varying NOT NULL DEFAULT 'USER',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Crear índices únicos
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);

        // Crear tabla de categorías
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4e4f221054a91040798e731e357" PRIMARY KEY ("id")
            )
        `);

        // Crear tabla de productos
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "images" text NOT NULL,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "userId" uuid,
                "categoryId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para productos
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8f4" ON "products" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_9a5f6868c96e0069e6991fa68c" ON "products" ("categoryId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8f5" ON "products" ("status")
        `);

        // Crear tabla de métricas
        await queryRunner.query(`
            CREATE TABLE "metrics" (
                "id" SERIAL NOT NULL,
                "productId" integer NOT NULL,
                "views" integer NOT NULL DEFAULT '0',
                "contacts" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f6" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para métricas
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4c88e956195bba85977da21b8f7" ON "metrics" ("productId")
        `);

        // Crear tabla de favoritos
        await queryRunner.query(`
            CREATE TABLE "favorites" (
                "id" SERIAL NOT NULL,
                "userId" uuid NOT NULL,
                "productId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f8" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para favoritos
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8f9" ON "favorites" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8fa" ON "favorites" ("productId")
        `);

        // Crear tabla de contactos
        await queryRunner.query(`
            CREATE TABLE "contacts" (
                "id" SERIAL NOT NULL,
                "userId" uuid NOT NULL,
                "productId" integer NOT NULL,
                "message" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8fb" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para contactos
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8fc" ON "contacts" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8fd" ON "contacts" ("productId")
        `);

        // Crear tabla de moderaciones
        await queryRunner.query(`
            CREATE TABLE "moderations" (
                "id" SERIAL NOT NULL,
                "productId" integer NOT NULL,
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "moderatorId" uuid,
                "reason" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8fe" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para moderaciones
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b8ff" ON "moderations" ("productId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b900" ON "moderations" ("moderatorId")
        `);

        // Crear tabla de verificación de teléfonos
        await queryRunner.query(`
            CREATE TABLE "phone_verifications" (
                "id" SERIAL NOT NULL,
                "userId" uuid NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "verificationCode" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "isVerified" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b901" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para verificación de teléfonos
        await queryRunner.query(`
            CREATE INDEX "IDX_4c88e956195bba85977da21b902" ON "phone_verifications" ("userId")
        `);

        // Crear claves foráneas
        await queryRunner.query(`
            ALTER TABLE "products" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e6991fa68c" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "metrics" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8f6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "favorites" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "favorites" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8f9" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "contacts" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "contacts" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fc" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "moderations" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fe" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "moderations" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8ff" FOREIGN KEY ("moderatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "phone_verifications" ADD CONSTRAINT "FK_4c88e956195bba85977da21b901" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Insertar datos iniciales
        await queryRunner.query(`
            INSERT INTO "categories" ("name", "description") VALUES
            ('Libros', 'Libros de texto, novelas y material académico'),
            ('Tecnología', 'Computadores, celulares, accesorios electrónicos'),
            ('Ropa', 'Ropa, zapatos y accesorios personales'),
            ('Hogar', 'Artículos para el hogar y decoración'),
            ('Deportes', 'Equipos y accesorios deportivos'),
            ('Arte', 'Materiales de arte y suministros creativos'),
            ('Herramientas', 'Herramientas y equipos de trabajo'),
            ('Accesorios', 'Accesorios diversos y complementos')
        `);

        // Crear usuario administrador
        await queryRunner.query(`
            INSERT INTO "users" ("id", "name", "email", "password", "role") VALUES
            ('550e8400-e29b-41d4-a716-446655440000', 'Administrador', 'admin@campusucc.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar claves foráneas
        await queryRunner.query(`ALTER TABLE "phone_verifications" DROP CONSTRAINT "FK_4c88e956195bba85977da21b901"`);
        await queryRunner.query(`ALTER TABLE "moderations" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8ff"`);
        await queryRunner.query(`ALTER TABLE "moderations" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fe"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fc"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fb"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8f9"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8f8"`);
        await queryRunner.query(`ALTER TABLE "metrics" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8f6"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e6991fa68c"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8f4"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE "phone_verifications"`);
        await queryRunner.query(`DROP TABLE "moderations"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "metrics"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
