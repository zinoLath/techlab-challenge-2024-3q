import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/User.js";

export class RootUser1719291159178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(User, {
            email: 'root@root.com',
            username: 'root',
            password: '$2b$10$cECyb0GNoioWdmnMPC0Sy.abmlygLO2UDFIdjBt.sjSm66TSOlo8y',
            profile: 'sudo'
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, {
            email: 'root@root.com',
        })
    }
}
