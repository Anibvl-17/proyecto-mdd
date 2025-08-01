"use strict";

import { CertificateEntity } from "../entity/certificate.entity.js";
import { UserEntity } from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createValidation,
} from "../validations/certificate.validation.js";

function generateCertificate({ rut, username, direction, reason, createdAt }) {
  const fechaEmision = new Date(createdAt).toLocaleDateString("es-CL");
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      color: #000;
      width: 100%;
      max-width: 780px;
      padding: 30px 40px;
      margin: 0 auto;
      line-height: 1.8;
      word-break: break-word;
      overflow-wrap: break-word;
      box-sizing: border-box;
    ">
      <h1 style="
        text-align: center;
        font-size: 22px;
        text-transform: uppercase;
        color: #c74483;
        border-bottom: 3px solid #c74483;
        padding-bottom: 10px;
        margin-bottom: 40px;
      ">Certificado de Residencia</h1>

      <p style="text-align: justify;">
        El suscrito certifica que don(ña) <strong>${username}</strong>, cédula de identidad <strong>${rut}</strong>, 
        reside en <strong>${direction}</strong> de la ciudad de Concepción, que pertenece a la circunscripción 
        geográfica de esta Junta de Vecinos.
      </p>

      <p style="text-align: justify; margin-top: 20px;">
        Este certificado es requerido por el(la) interesado(a) para ser presentado con fin <strong>${reason}</strong>.
      </p>

      <div style="margin-top: 100px; text-align: center;">
        <p>Presidente</p>
        <p>Junta de Vecinos</p>
      </div>

      <p style="text-align: right; margin-top: 60px;">Concepción, ${fechaEmision}</p>
    </div>
  `;
}

export async function createCertificate(req, res) {
  try {
    const certificateRepository = AppDataSource.getRepository(CertificateEntity);
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { direction, reason } = req.body;

    // Validación de los datos de entrada
    const { error } = createValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Obtener usuario desde BDD para que sea una entidad válida
    const user = await userRepository.findOneBy({ id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const rut = user.rut;

    // Verificar si existe un certificado asociado al rut del usuario
    const certificates = await certificateRepository.find({
      where: { rut },
      order: { expirationDate: "DESC" },
      take: 1,
    });
    const existingCertificate = certificates[0];

    const today = new Date();

    // Si existe un certificado y este aún no ha expirado
    if (existingCertificate) {
      const createdDate = new Date(existingCertificate.createdAt);
      const expirationDate = new Date(createdDate);
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Un mes de validez

      if (today < expirationDate) {
        // Dar la opción de descargar el certificado, ya que aún no expira
        const document = generateCertificate({ ...existingCertificate, username: user.username });
        return res.status(200).json({
          message: "Ya existe un certificado. Puede descargarlo nuevamente.",
          data: {
            ...existingCertificate,
            document,
          },
        });
      }
    }

    //Crea un certificado nuevo, ya que el anterior expiró
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const newCertificate = certificateRepository.create({
      rut,
      direction,
      reason,
      createdAt: today,
      expirationDate,
      user,
    });


    await certificateRepository.save(newCertificate);

    // Generar el documento del certificado de residencia
    // Actualizado para incluir el nombre de usuario
    const document = generateCertificate({
      rut: newCertificate.rut,
      username: user.username,
      direction: newCertificate.direction,
      reason: newCertificate.reason,
      createdAt: newCertificate.createdAt,
    });

    res.status(201).json({
      message: "Certificado creado exitosamente.",
      data: {
        ...newCertificate,
        document,
      },
    });
  } catch (error) {
    console.error("Error en certificate.controller.js -> createCertificate(): ", error);
    res.status(500).json({ message: "Error al crear el certificado." });
  }
}

export async function getCertificates(req, res) {
  try {
    const certificateRepository = AppDataSource.getRepository(CertificateEntity);

    if (req.user.role === "administrador") {
      const certificates = await certificateRepository.find({
        relations: ["user"],
      });

      // Genera el documento para cada certificado
      const cert = certificates.map(cert => ({
        ...cert,
        document: generateCertificate({
          rut: cert.rut,
          username: cert.user?.username || "",
          direction: cert.direction,
          reason: cert.reason,
          createdAt: cert.createdAt,
        }),
      }));

      return res.status(200).json({
        message: "Certificados obtenidos exitosamente.",
        data: cert,
      });
    } else {
      const rut = req.user.rut;
      const certificates = await certificateRepository.find({
        where: { rut },
        order: { createdAt: "DESC" },
        take: 1,
      });

      const certificate = certificates[0];
      if (!certificate) {
        return res.status(404).json({
          message: "No se encontraron certificados para este usuario."
        });
      }
      // Generar el documento del certificado de residencia
      // Actualizado para incluir el documento
      const document = generateCertificate({
        rut: certificate.rut,
        username: req.user.username,
        direction: certificate.direction,
        reason: certificate.reason,
        createdAt: certificate.createdAt,
      });

      return res.status(200).json({
        message: "Certificado del usuario obtenido exitosamente.",
        data: {
          ...certificate,
          document,
        },
      });
    }
  } catch (error) {
    console.error("Error en certificate.controller.js -> getCertificates(): ", error);
    res.status(500).json({ message: "Error al obtener los certificados." });
  }
}
