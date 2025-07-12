"use strict";

import { CertificateEntity } from "../entity/certificate.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createValidation,
} from "../validations/certificate.validation.js";

export async function createCertificate(req, res) {
  try {
    const certificateRepository = AppDataSource.getRepository(CertificateEntity);
    const { direction, reason } = req.body;

    // Validación de los datos de entrada
    const { error } = createValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Obtener datos del usuario autenticado
    const user = req.user; 
    if (!user || !user.rut) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }

    const rut = user.rut;

    // Verificar si existe un certificado asociado al rut del usuario
    const existingCertificate = await certificateRepository.findOne({
      where: { rut},
      order: { expirationDate: "DESC" },
    });

    const today = new Date();

    // Si existe un certificado y este aún no ha expirado
    if(existingCertificate) {
      const createdDate = new Date(existingCertificate.createdAt);
      const expirationDate = new Date(createdDate);
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Un mes de validez

    if (today < expirationDate) {
      // Dar la opción de descargar el certificado, ya que aún no expira
      return res.status(200).json({
        message: "Ya existe un certificado. Puede descargarlo nuevamente.",
        data: existingCertificate,
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
      });
      

    await certificateRepository.save(newCertificate);

    // Generar el documento del certificado de residencia
    const fechaEmision = new Date().toLocaleDateString("es-CL");
    const document = `
      <div style="font-family: Arial, sans-serif; border: 2px solid #333; padding: 24px; max-width: 600px;">
        <h2 style="text-align:center;">Certificado de Residencia</h2>
        <p>La Junta de Vecinos certifica que:</p>
        <p><strong>Nombre completo:</strong> ${user.username}</p>
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
        if(!rut) {
          return res.status(401).json({ message: "Usuario no autenticado." });
        }
        const certificates = await certificateRepository.find({where: { rut } });
        return res.status(200).json({
          message: "Certificado del usuario obtenido exitosamente.",
          data: certificates,
        });
      }
    } catch (error) {
      console.error("Error en certificate.controller.js -> getCertificates(): ", error);
      res.status(500).json({ message: "Error al obtener los certificados." });
    }
  }
