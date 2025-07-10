"use strict";

import { EntitySchema, In } from "typeorm";

export const CertificateEntity = new EntitySchema({
  name: "Certificate",
  tableName: "certificates",
    columns: {
        id: {
        type: "int",
        primary: true,
        generated: true,
        },
        direction: {
        type: String,
        nullable: false,
        },
        type: {
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