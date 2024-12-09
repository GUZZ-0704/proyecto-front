import { Container, Spinner, Alert, Table, Button, Modal } from 'react-bootstrap';
import NavMenu from './../../components/NavMenu';
import MapComponent from '../../components/map';
import { API_KEY } from '../../../config.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [routes, setRoutes] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedRoute, setHighlightedRoute] = useState(null);
    const [blockingReason, setBlockingReason] = useState(null);
    const [filter, setFilter] = useState("");
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportDetail, setReportDetail] = useState("");
    const [reportPhoto, setReportPhoto] = useState(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);

    useEffect(() => {
        loadRoutes();
        loadMunicipalities();
        loadIncidents();
        setLoading(false);
    }, []);

    const loadRoutes = () => {
        axios.get('http://localhost:3000/routes/')
            .then((res) => {
                setRoutes(res.data);
            })
            .catch(() => {
                setError('Hubo un problema al cargar las rutas.');
            });
    };

    const loadMunicipalities = () => {
        axios.get('http://localhost:3000/municipalitys/')
            .then((res) => {
                setMunicipalities(res.data);
            })
            .catch(() => {
                setError('Hubo un problema al cargar los municipios.');
            });
    };

    const loadIncidents = () => {
        axios.get('http://localhost:3000/incidents/')
            .then((res) => {
                setIncidents(res.data);
            })
            .catch(() => {
                setError('Hubo un problema al cargar los incidentes.');
            });
    };

    const highlightRoute = (index) => {
        setHighlightedRoute(index);
    };

    const showBlockingReason = (route) => {
        setBlockingReason(route.reason);
    };

    const handleMapClick = (coordinates) => {
        setSelectedPoint(coordinates);
        console.log(selectedPoint);
        setShowReportForm(true);
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("description", reportDetail);
        formData.append("image", reportPhoto);
        formData.append("pointId", selectedPoint.id);

        axios.post("http://localhost:3000/reports", formData)
            .then(() => {
                setShowReportForm(false);
                setSelectedCoordinates(null);
                alert("Reporte enviado con éxito");
            });
    };

    const filteredRoutes = filter
        ? routes.filter((route) => route.reason && route.reason.type === filter)
        : routes;

    return (
        <>
            <NavMenu />

            <Container fluid className="my-5">
                {loading && (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="my-4">
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <>
                        <MapComponent
                            apiKey={API_KEY}
                            routes={filteredRoutes}
                            municipalities={municipalities}
                            incidents={incidents}
                            highlightedRoute={highlightedRoute}
                            onMapClick={handleMapClick}
                        />

                        <div className="my-5">
                            <h4>Listado de Carreteras</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Carretera</th>
                                        <th>Municipio de Origen</th>
                                        <th>Municipio de Destino</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRoutes.map((route, index) => (
                                        <tr key={index}>
                                            <td>{route.name}</td>
                                            <td>{route.startMunicipality.name}</td>
                                            <td>{route.endMunicipality.name}</td>
                                            <td>{route.status === "blocked" ? "Bloqueada" : "Libre"}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => highlightRoute(index)}
                                                >
                                                    Ver Carretera
                                                </Button>
                                                {route.status === "blocked" && (
                                                    <Button
                                                        variant="danger"
                                                        className="ms-2"
                                                        onClick={() => showBlockingReason(route)}
                                                    >
                                                        Ver Motivo
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <div className="mb-4">
                            <h5>Filtrar por Incidencias</h5>
                            <select
                                className="form-select"
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="Transitable con desvíos y/o horarios de circulación">
                                    Transitable con desvíos y/o horarios
                                </option>
                                <option value="No transitable por conflictos sociales">
                                    No transitable por conflictos sociales
                                </option>
                                <option value="Restricción vehicular">Restricción vehicular</option>
                                <option value="No transitable tráfico cerrado">
                                    No transitable tráfico cerrado
                                </option>
                                <option value="Restricción vehicular, especial">
                                    Restricción vehicular, especial
                                </option>
                            </select>
                        </div>

                        {blockingReason && (
                            <Modal show onHide={() => setBlockingReason(null)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Motivo del Bloqueo</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>{blockingReason.description}</p>
                                    {blockingReason.imageUrl && (
                                        <img
                                            src={blockingReason.imageUrl}
                                            alt="Motivo del bloqueo"
                                            className="img-fluid"
                                        />
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setBlockingReason(null)}>
                                        Cerrar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )}

                        {showReportForm && (
                            <Modal show onHide={() => setShowReportForm(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Reportar Incidente</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={handleReportSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Detalle</label>
                                            <textarea
                                                className="form-control"
                                                required
                                                onChange={(e) => setReportDetail(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Foto</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => setReportPhoto(e.target.files[0])}
                                            />
                                        </div>
                                        <Button type="submit" variant="primary">
                                            Enviar
                                        </Button>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default HomePage;
