import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "../../../../components/map";
import { Modal, Button, Table } from "react-bootstrap";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const MunicipalitiesPage = () => {
    const [municipalities, setMunicipalities] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [newMunicipality, setNewMunicipality] = useState({
        name: "",
        pointId: null,
        radius: 0,
        createdById: null,
        lastModifiedById: null,
    });
    const [showCreateButton, setShowCreateButton] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3000/municipalitys/")
            .then((response) => {
                setMunicipalities(response.data);
                console.log("Municipalities loaded:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching municipalities:", error);
            });
    }, [municipalities.length]);

    const handleMarkerClick = (municipality) => {
        setSelectedMunicipality(municipality);
        setModalIsOpen(true);
    };

    const createPoint = async (lat, lng) => {
        try {
            const response = await axios.post("http://localhost:3000/points/", { lat, lng });
            console.log("Point created:", response.data);
            return response.data.id;
        } catch (error) {
            console.error("Error creating point:", error);
            throw error;
        }
    };

    const handleMapClick = async (event) => {
        const clickedLatLng = event.latLng;
        console.log("Map clicked at:", clickedLatLng.lat(), clickedLatLng.lng());
        console.log("User ID:", JSON.parse(localStorage.getItem("userId")));

        try {
            const createdPointId = await createPoint(clickedLatLng.lat(), clickedLatLng.lng());
            console.log("Point ID:", createdPointId);

            setNewMunicipality((prev) => ({
                ...prev,
                pointId: createdPointId,
                createdById: JSON.parse(localStorage.getItem("userId")),
                lastModifiedById: JSON.parse(localStorage.getItem("userId")),
            }));
            setShowCreateButton(true);
        } catch (error) {
            console.error("Error handling map click:", error);
        }
    };

    const openCreateModal = () => {
        setCreateModalIsOpen(true);
        setShowCreateButton(false);
    };

    const handleCreateMunicipality = () => {
        if (!newMunicipality.name || !newMunicipality.radius) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        axios
            .post("http://localhost:3000/municipalitys/", newMunicipality)
            .then((response) => {
                setMunicipalities((prev) => [...prev, response.data]);
                setCreateModalIsOpen(false);
                setNewMunicipality({
                    name: "",
                    pointId: null,
                    radius: 0,
                    createdById: null,
                    lastModifiedById: null,
                });
            })
            .catch((error) => {
                console.error("Error creating municipality:", error);
            });
    };

    const handleDeleteMunicipality = (municipalityId) => {
        axios
            .delete(`http://localhost:3000/municipalitys/${municipalityId}`)
            .then(() => {
                setMunicipalities((prev) => prev.filter((m) => m.id !== municipalityId));
                setModalIsOpen(false);
                setSelectedMunicipality(null);
            })
            .catch((error) => {
                console.error("Error deleting municipality:", error);
            });
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedMunicipality(null);
    };

    const closeCreateModal = () => {
        setCreateModalIsOpen(false);
        setNewMunicipality({
            name: "",
            pointId: null,
            radius: 0,
            createdById: null,
            lastModifiedById: null,
        });
    };

    return (
        <div>
            <NavMenuAdmin />
            <MapComponent
                municipalities={municipalities}
                onMapClick={handleMapClick}
                onMarkerClick={handleMarkerClick}
            />

            {showCreateButton && (
                <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                    <Button variant="primary" onClick={openCreateModal}>
                        Crear Municipio
                    </Button>
                </div>
            )}

            <Modal show={modalIsOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Municipio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMunicipality && (
                        <>
                            <h5>{selectedMunicipality.name}</h5>
                            <p>
                                <strong>Latitud:</strong> {selectedMunicipality.municipalityPoint.lat}
                            </p>
                            <p>
                                <strong>Longitud:</strong> {selectedMunicipality.municipalityPoint.lng}
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteMunicipality(selectedMunicipality.id)}
                    >
                        Eliminar Municipio
                    </Button>
                    <Button variant="secondary" onClick={closeModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={createModalIsOpen} onHide={closeCreateModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Municipio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newMunicipality.name}
                                onChange={(e) =>
                                    setNewMunicipality((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Radio (km)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newMunicipality.radius}
                                onChange={(e) =>
                                    setNewMunicipality((prev) => ({
                                        ...prev,
                                        radius: parseFloat(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreateMunicipality}>
                        Guardar Municipio
                    </Button>
                    <Button variant="secondary" onClick={closeCreateModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="mt-4">
                <h3>Lista de Municipios</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Radio</th>
                            <th>Creado Por</th>
                            <th>Última Modificación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {municipalities.map((municipality, index) => (
                            <tr key={municipality.id}>
                                <td>{index + 1}</td>
                                <td>{municipality.name || "Cargando"}</td>
                                <td>{municipality.radius}</td>
                                <td>{municipality.municipalityCreator?.name || "N/A"}</td>
                                <td>{municipality.municipalityModifier?.name || "N/A"}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteMunicipality(municipality.id)}
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

export default MunicipalitiesPage;
