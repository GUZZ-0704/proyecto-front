import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "../../../../components/map";
import { Modal, Button, Table, Form } from "react-bootstrap";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const RoutesPage = () => {
    const [routes, setRoutes] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [newRoute, setNewRoute] = useState({
        name: "",
        startMunicipalityId: null,
        endMunicipalityId: null,
        createdById: null,
        lastModifiedById: null,
    });
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [addingPoints, setAddingPoints] = useState(false);
    const [routePoints, setRoutePoints] = useState([]);
    const [displayPoints, setDisplayPoints] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/routes")
            .then((response) => {
                setRoutes(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error("Error fetching routes:", error));

        axios
            .get("http://localhost:3000/municipalitys")
            .then((response) => {
                setMunicipalities(response.data);
            })
            .catch((error) => console.error("Error fetching municipalities:", error));
    }, [routes.length]);

    const openCreateModal = () => {
        setNewRoute({
            name: "",
            startMunicipalityId: null,
            endMunicipalityId: null,
            createdById: JSON.parse(localStorage.getItem("userId")),
            lastModifiedById: JSON.parse(localStorage.getItem("userId")),
        });
        setCreateModalIsOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalIsOpen(false);
    };

    const handleCreateRoute = () => {
        if (!newRoute.name || !newRoute.startMunicipalityId || !newRoute.endMunicipalityId) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        axios
            .post("http://localhost:3000/routes", newRoute)
            .then((response) => {
                setRoutes((prev) => [...prev, response.data]);
                setSelectedRouteId(response.data.id);
                setAddingPoints(true);
                setCreateModalIsOpen(false);
                setRoutePoints([]);
                setDisplayPoints([]);
            })
            .catch((error) => console.error("Error creating route:", error));
    };

    const handleMapClick = async (event) => {
        if (!addingPoints) return;

        const clickedLatLng = event.latLng;

        try {
            const response = await axios.post("http://localhost:3000/points/", {
                lat: clickedLatLng.lat(),
                lng: clickedLatLng.lng(),
            });

            const pointId = response.data.id;

            setRoutePoints((prev) => [...prev, pointId]);

            setDisplayPoints((prev) => [
                ...prev,
                { lat: clickedLatLng.lat(), lng: clickedLatLng.lng() },
            ]);
        } catch (error) {
            console.error("Error creating point:", error);
        }
    };

    const confirmRoutePoints = async () => {
        try {
            for (const pointId of routePoints) {
                await axios.post(`http://localhost:3000/routes/${selectedRouteId}/points`, {
                    pointId,
                    lastModifiedById: JSON.parse(localStorage.getItem("userId")),
                });
            }

            alert("Puntos agregados a la ruta.");
            setAddingPoints(false);
            setRoutePoints([]);
            setDisplayPoints([]);
            window.location.reload();
        } catch (error) {
            console.error("Error confirming route points:", error);
        }
    };

    return (
        <div>
            <NavMenuAdmin />
            <MapComponent
                routes={routes}
                onMapClick={handleMapClick}
                displayPoints={displayPoints}
            />

            <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <Button variant="primary" onClick={openCreateModal}>
                    Crear Ruta
                </Button>
            </div>

            <Modal show={createModalIsOpen} onHide={closeCreateModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Ruta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Ruta</Form.Label>
                            <Form.Control
                                type="text"
                                value={newRoute.name}
                                onChange={(e) =>
                                    setNewRoute((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Municipio de Inicio</Form.Label>
                            <Form.Select
                                onChange={(e) =>
                                    setNewRoute((prev) => ({
                                        ...prev,
                                        startMunicipalityId: parseInt(e.target.value),
                                    }))
                                }
                            >
                                <option value="">Selecciona un municipio</option>
                                {municipalities.map((municipality) => (
                                    <option key={municipality.id} value={municipality.id}>
                                        {municipality.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Municipio Final</Form.Label>
                            <Form.Select
                                onChange={(e) =>
                                    setNewRoute((prev) => ({
                                        ...prev,
                                        endMunicipalityId: parseInt(e.target.value),
                                    }))
                                }
                            >
                                <option value="">Selecciona un municipio</option>
                                {municipalities.map((municipality) => (
                                    <option key={municipality.id} value={municipality.id}>
                                        {municipality.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreateRoute}>
                        Marcar Puntos
                    </Button>
                    <Button variant="secondary" onClick={closeCreateModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {addingPoints && (
                <div style={{ position: "absolute", bottom: "80px", right: "20px" }}>
                    <Button variant="success" onClick={confirmRoutePoints}>
                        Confirmar Ruta
                    </Button>
                </div>
            )}

            <div className="mt-4">
                <h3>Lista de Rutas</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Inicio</th>
                            <th>Final</th>
                            <th>Estado</th>
                            <th>Creado Por</th>
                            <th>Última Modificación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route, index) => (
                            <tr key={route.id}>
                                <td>{index + 1}</td>
                                <td>{route.name}</td>
                                <td>{route.startMunicipality?.name || "N/A"}</td>
                                <td>{route.endMunicipality?.name || "N/A"}</td>
                                <td>{route.status}</td>
                                <td>{route.routeCreator?.name || "N/A"}</td>
                                <td>{route.routeModifier?.name || "N/A"}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedRouteId(route.id);
                                            setAddingPoints(true);
                                        }}
                                    >
                                        Agregar Puntos
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            axios
                                                .delete(`http://localhost:3000/routes/${route.id}`)
                                                .then(() => {
                                                    setRoutes((prev) =>
                                                        prev.filter((r) => r.id !== route.id)
                                                    );
                                                })
                                                .catch((error) =>
                                                    console.error("Error deleting route:", error)
                                                );
                                        }}>
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

export default RoutesPage;
