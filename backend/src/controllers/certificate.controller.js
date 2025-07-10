"use stricrt";

import { CertificateEntity } from "../entity/certificate.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createValidation,
} from "../validations/certificate.validation.js";
export async function createCertificate(req, res) {
  try {
    const certificateRepository = AppDataSource.getRepository(CertificateEntity);
    const { direction, type, reason } = req.body;

    // Validación de los datos de entrada
    const { error } = createValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verificar si ya existe un certificado con la misma dirección y tipo
    const existingCertificate = await certificateRepository.findOne({
      where: { direction, type },
    });

    if (existingCertificate) {
      return res.status(409).json({
        message: "Ya existe un certificado con la misma dirección y tipo.",
      });
    }

    // Crear el nuevo certificado
    const newCertificate = certificateRepository.create({
      direction,
      type,
      reason,
    });

    await certificateRepository.save(newCertificate);

    res.status(201).json({
      message: "Certificado creado exitosamente.",
      data: newCertificate,
    });
  } catch (error) {
    console.error("Error en certificate.controller.js -> createCertificate(): ", error);
    res.status(500).json({ message: "Error al crear el certificado." });
  }
}

export async function getCertificates(req, res) {
    try {
        const certificateRepository = AppDataSource.getRepository(CertificateEntity);
        const certificates = await certificateRepository.find();
    
        res.status(200).json({
        message: "Certificados obtenidos exitosamente.",
        data: certificates,
        });
    } catch (error) {
        console.error("Error en certificate.controller.js -> getCertificates(): ", error);
        res.status(500).json({ message: "Error al obtener los certificados." });
    }
    }

