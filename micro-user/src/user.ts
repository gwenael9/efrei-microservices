import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string;
}

export class InputRegister {
  email: string;
  username: string;
  password: string;
  verificationCode: string;
  isVerified: boolean;
}

export class InputLogin {
  email: string;
  password: string;
}
