"use strict";

import { CertificateEntity } from "../entity/certificate.entity.js";
import { UserEntity } from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createValidation,
} from "../validations/certificate.validation.js";

function generateCertificate({ rut, username, direction, reason, createdAt}) {
  const fechaEmision = new Date(createdAt).toLocaleDateString("es-CL");
  return `
      <div style="font-family: Arial, sans-serif; border: 2px solid #333; padding: 24px; max-width: 600px;">
        <h2 style="text-align:center;">Certificado de Residencia</h2>
        <p>La Junta de Vecinos certifica que:</p>
        <p><strong>Nombre completo:</strong> ${username}</p>
        <p><strong>Rut:</strong> ${rut}</p>
        <p><strong>Dirección:</strong> ${direction}</p>
        <p><strong>Fecha de emisión:</strong> ${fechaEmision}</p>
        <p><strong>Finalidad:</strong> ${reason}</p>
        <p><strong>Entidad emisora:</strong> Junta de Vecinos</p>
        <br>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <img src="https://in.pinterest.com/pin/776730267022763436/" alt="Sello" width="80"/>
            <p style="margin:0;">Sello</p>
          </div>
          <div style="text-align:center;">
            <p style="margin:0;">__________________________</p>
            <p style="margin:0;"> Junta de vecinos</p>
            <p style="margin:0;">Firma</p>
          </div>
        </div>
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
    if(existingCertificate) {
      const createdDate = new Date(existingCertificate.createdAt);
      const expirationDate = new Date(createdDate);
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Un mes de validez

    if (today < expirationDate) {
      // Dar la opción de descargar el certificado, ya que aún no expira
      const document = generateCertificate({ ...existingCertificate, username: user.username});
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

    if(req.user.role === "administrador") {
      const certificates = await certificateRepository.find();
      return res.status(200).json({
        message: "Certificados obtenidos exitosamente.",
        data: certificates,
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
