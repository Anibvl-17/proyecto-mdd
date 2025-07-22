"use strict";

import { EntitySchema, In } from "typeorm";
import { UserEntity } from "./user.entity.js";

export const CertificateEntity = new EntitySchema({
  name: "Certificate",
  tableName: "certificates",
    columns: {
        id: {
        type: "int",
        primary: true,
        generated: true,
        },
        rut: {
        type: String,
        nullable: false,
        },
        direction: {
        type: String,
        nullable: false,
        },
        reason: {
        type: String,
        nullable: false,
        },
        createdAt: {
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        },
        expirationDate: {
        type: "timestamp",
        nullable: false,
        },
    },
   relations: {
      user: {
        type: "many-to-one",
        target: UserEntity,
        joinColumn: true,
        nullable: false,
      },
    },
});

export default CertificateEntity;