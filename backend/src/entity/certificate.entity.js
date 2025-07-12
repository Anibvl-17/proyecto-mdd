"use strict";

import { EntitySchema, In } from "typeorm";

export const CertificateEntity = new EntitySchema({
  name: "Certificate",
  tableName: "certificates",
    columns: {
        id: {
        type: Number,
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
    },
});

export default CertificateEntity;