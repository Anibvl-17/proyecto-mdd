import { useState, useEffect } from "react";
import "@styles/certificate.css";
import useCreateCertificate from "@hooks/certificate/useCreateCertificate.jsx";
import useGetCertificate from "@hooks/certificate/useGetCertificate.jsx";
import useGetAllCertificates from "@hooks/certificate/useGetAllCertificates.jsx";
import { openCertificateInNewTab } from "../utils/downloadPdf.js";

const Certificate = () => {
    const [direccion, setDireccion] = useState("");
    const [motivo, setMotivo] = useState("");

    const { createdCertificate, sendCertificate } = useCreateCertificate();
    const { fetchedCertificate, fetchCertificate } = useGetCertificate();
    const { certificates, fetchAllCertificates } = useGetAllCertificates();
    const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
    const role = user.rol;

    useEffect(() => {
        if (role === "administrador") {
            fetchAllCertificates().then(() => {
                console.log("Certificados admin:", certificates);
            });
        } else {
            fetchCertificate(); // para usuarios normales
        }
    }, []);

    const handleSubmit = async () => {
        if (!direccion || !motivo) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        await sendCertificate({ direction: direccion, reason: motivo });
        await fetchCertificate(); // Trae el vigente, por si ya existía uno

        if (nuevoCertificado?.document) {
            openCertificateInNewTab(nuevoCertificado.document);
        }
    };

    // Mostrar el documento (ya sea creado o existente)
    const certificate = createdCertificate || fetchedCertificate;

    console.log("Creado:", createdCertificate);
    console.log("Traído:", fetchedCertificate);

    return (
        <div className="certificate-page">
            <h2>Antecedentes Certificado</h2>
            <div className="form-grid">
                <label htmlFor="periodo">Año / Periodo</label>
                <div id="periodo">2025-1</div>

                <label htmlFor="tipo">Tipo</label>
                <select id="tipo" name="tipo" defaultValue="residencia" disabled>
                    <option value="residencia">Certificado de Residencia</option>
                </select>

                <label htmlFor="direccion">Dirección de residencia</label>
                <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ingrese su dirección"
                />

                <label htmlFor="motivo">Motivo</label>
                <select
                    id="motivo"
                    name="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                >
                    <option value="" disabled>Seleccione….</option>
                    <option value="Legal">Trámite legal</option>
                    <option value="Administrativo">Trámite administrativo</option>
                    <option value="Laboral">Trámite laboral</option>
                    <option value="Otro">Otros trámites</option>
                </select>

                <button className="enviar" onClick={handleSubmit}>Enviar</button>
            </div>
            
            {certificate?.document && (
                <>
                    <button
                        className="ver-pdf"
                        onClick={() => openCertificateInNewTab(certificate.document)}
                    >
                        Descargar
                    </button>
                </>
            )}
            {role === "administrador" && Array.isArray(certificates) && certificates.length > 0 && (
                <div className="admin-certificates">
                    <h3>Certificados de usuarios</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>RUT</th>
                                <th>Dirección</th>
                                <th>Motivo</th>
                                <th>Fecha creación</th>
                                <th>Fecha expiración</th>
                                <th>Ver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map((cert) => (
                                <tr key={cert.id}>
                                    <td>{cert.user?.username || "No asignado"}</td>
                                    <td>{cert.rut}</td>
                                    <td>{cert.direction}</td>
                                    <td>{cert.reason}</td>
                                    <td>{new Date(cert.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(cert.expirationDate).toLocaleDateString()}</td>
                                    <td>
                                        {cert.document ? (
                                            <button
                                                className="ver-pdf"
                                                onClick={() => openCertificateInNewTab(cert.document)}
                                            >
                                                Ver PDF
                                            </button>
                                        ) : (
                                            "No disponible"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Certificate;