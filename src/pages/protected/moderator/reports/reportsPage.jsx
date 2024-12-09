import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "../../../../components/map";
import { Modal, Button, Table, Form } from "react-bootstrap";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
    const [newIncident, setNewIncident] = useState({
        description: "",
        pointId: null,
        status: "active",
        acceptedById: JSON.parse(localStorage.getItem("userId")),
        lastModifiedById: JSON.parse(localStorage.getItem("userId")),
        imageUrl: "",
    });
    const [incidentTypes, setIncidentTypes] = useState([]);

    useEffect(() => {
        getIncidentTypes();
        getReports();
    }, []);

    const getReports = () => {
        axios
            .get("http://localhost:3000/reports")
            .then((response) => {
                setReports(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error("Error fetching reports:", error));
    };

    const getIncidentTypes = () => {
        axios
            .get("http://localhost:3000/incidentTypes")
            .then((response) => {
                setIncidentTypes(response.data);
            })
            .catch((error) => console.error("Error fetching incident types:", error));
    };


    const handleMarkerClick = (report) => {
        setSelectedReport(report);
        console.log(report);
    };

    const closeDetailsModal = () => {
        setSelectedReport(null);
    };

    const openIncidentModal = (pointId, imageUrl) => {
        setNewIncident((prev) => ({
            ...prev,
            pointId,
            imageUrl,
        }));
        console.log(newIncident);
        setIncidentModalIsOpen(true);
    };

    const closeIncidentModal = () => {
        setIncidentModalIsOpen(false);
        setNewIncident({
            description: "",
            pointId: null,
            status: "active",
            acceptedById: JSON.parse(localStorage.getItem("userId")),
            lastModifiedById: JSON.parse(localStorage.getItem("userId")),
            imageUrl: "",
        });
    };

    const handleCreateIncident = () => {
        if (!newIncident.description || !newIncident.pointId) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        newIncident.incidentTypeId = parseInt(newIncident.incidentTypeId);

        axios
            .post("http://localhost:3000/incidents", newIncident)
            .then((response) => {
                alert("Incidente creado correctamente.");
                closeIncidentModal();
            })
            .catch((error) => console.error("Error creating incident:", error));
    };

    return (
        <div>
            <NavMenuAdmin />
            <MapComponent
                municipalities={[]}
                routes={[]}
                displayPoints={reports.map((report) => ({
                    lat: report.point?.lat || 0,
                    lng: report.point?.lng || 0,
                    report,
                }))}
                onMarkerClick={(marker) => handleMarkerClick(marker.report)}
            />

            {selectedReport && (
                <Modal show={!!selectedReport} onHide={closeDetailsModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles del Reporte</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Descripción:</strong> {selectedReport.description}</p>
                        <p><strong>Estado:</strong> {selectedReport.status}</p>
                        <p><strong>Imagen:</strong></p>
                        {selectedReport.imageUrl ? (
                            <img
                                src={`http://localhost:3000/people/${selectedReport.imageUrl}`}
                                alt="Reporte"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        ) : (
                            <p>No hay imagen asociada.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={() => {
                                openIncidentModal(selectedReport.pointId);
                                closeDetailsModal();
                            }}
                        >
                            Crear Incidente
                        </Button>
                        <Button variant="secondary" onClick={closeDetailsModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Modal show={incidentModalIsOpen} onHide={closeIncidentModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                        <img
                                src={`http://localhost:3000${newIncident.imageUrl}`}
                                alt="Reporte"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                            <Form.Label>Nombre del Incidente</Form.Label>
                            <Form.Control
                                type="text"
                                value={newIncident.description}
                                onChange={(e) =>
                                    setNewIncident((prev) => ({ ...prev, description: e.target.value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Incidente</Form.Label>
                            <Form.Select
                                onChange={(e) =>
                                    setNewIncident((prev) => ({ ...prev, incidentTypeId: e.target.value }))
                                }
                            >
                                <option value="">Selecciona un tipo de incidente</option>
                                {incidentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreateIncident}>
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={closeIncidentModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="mt-4">
                <h3>Lista de Reportes</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Punto Asociado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={report.id}>
                                <td>{index + 1}</td>
                                <td>{report.description}</td>
                                <td>{report.status}</td>
                                <td>{`Lat: ${report.point?.lat || "N/A"}, Lng: ${report.point?.lng || "N/A"}`}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => openIncidentModal(report.pointId, report.imageUrl)}
                                    >
                                        Crear Incidente
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            axios
                                                .delete(`http://localhost:3000/reports/${report.id}`)
                                                .then(() => {
                                                    alert("Reporte eliminado correctamente.");
                                                    getReports();
                                                })
                                                .catch((error) => console.error("Error deleting report:", error));
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default ReportsPage;
