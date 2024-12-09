import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "../../../../components/map";
import { Modal, Button, Table} from "react-bootstrap";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const IncidentsPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        getIncidents();
        getPoints();
    }, []);

    const getIncidents = () => {
        axios
            .get("http://localhost:3000/incidents")
            .then((response) => {
                setIncidents(response.data);
            })
            .catch((error) => console.error("Error fetching incidents:", error));
    };

    const getPoints = () => {
        axios
            .get("http://localhost:3000/points")
            .then((response) => {
                setPoints(response.data);
            })
            .catch((error) => console.error("Error fetching points:", error));
    };

    const handleMarkerClick = (incident) => {
        setSelectedIncident(incident);
    };

    const closeDetailsModal = () => {
        setSelectedIncident(null);
    };



    return (
        <div>
            <NavMenuAdmin />
            <MapComponent
                municipalities={[]}
                routes={[]}
                displayPoints={incidents.map((incident) => ({
                    lat: incident.point?.lat || 0,
                    lng: incident.point?.lng || 0,
                    incident,
                }))}
                onMarkerClick={(marker) => handleMarkerClick(marker.incident)}
            />

            {selectedIncident && (
                <Modal show={!!selectedIncident} onHide={closeDetailsModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles del Incidente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Descripción:</strong> {selectedIncident.description}</p>
                        <p><strong>Estado:</strong> {selectedIncident.status}</p>
                        <p><strong>Imagen:</strong></p>
                        {selectedIncident.imageUrl ? (
                            <img
                                src={`http://localhost:3000${selectedIncident.imageUrl}`}
                                alt="Incidente"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        ) : (
                            <p>No hay imagen asociada.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeDetailsModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

    

            <div className="mt-4">
                <h3>Lista de Incidentes</h3>
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
                        {incidents.map((incident, index) => (
                            <tr key={incident.id}>
                                <td>{index + 1}</td>
                                <td>{incident.description}</td>
                                <td>{incident.status}</td>
                                <td>{`Lat: ${incident.point?.lat || "N/A"}, Lng: ${incident.point?.lng || "N/A"}`}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedIncident(incident);
                                        }}
                                    >
                                        Detalles
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            axios
                                                .delete(`http://localhost:3000/incidents/${incident.id}`)
                                                .then(() => {
                                                    alert("Incidente eliminado correctamente.");
                                                    getIncidents();
                                                })
                                                .catch((error) => console.error("Error deleting incident:", error));
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

export default IncidentsPage;
