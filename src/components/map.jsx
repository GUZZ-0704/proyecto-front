import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import PropTypes from "prop-types";

const defaultContainerStyle = {
    width: "100%",
    height: "500px",
};

const MapComponent = ({
    containerStyle = defaultContainerStyle,
    center = { lat: -16.290154, lng: -63.588653 },
    zoom = 6,
    municipalities = [],
    routes = [],
    incidents = [],
    onMapClick = () => { },
    highlightedRoute = null,
    onMarkerClick = () => { },
    displayPoints = [],
}) => {
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onClick={onMapClick}
        >
            {municipalities.map((municipality, index) => (
                <Marker
                    key={`municipality-${index}`}
                    position={{
                        lat: municipality.municipalityPoint?.lat || 0,
                        lng: municipality.municipalityPoint?.lng || 0,
                    }}
                    icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                    title={municipality.name}
                    onClick={() => onMarkerClick(municipality)}
                />
            ))}

            {routes.map((route, index) =>
                (route.routePoints || []).map((routePoint, routePointIndex) => (
                    <Marker
                        key={`route-point-${index}-${routePointIndex}`}
                        position={{
                            lat: routePoint.lat || 0,
                            lng: routePoint.lng || 0,
                        }}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        }}
                        onClick={() => onMapClick(routePoint)}
                        title="Click para reportar incidente"
                    />
                ))
            )}

            {routes.map((route, index) => {
                const path = route.routePoints?.map((point) => ({
                    lat: point.lat,
                    lng: point.lng,
                })) || [];

                return (
                    <Polyline
                        key={`route-${index}`}
                        path={path}
                        options={{
                            strokeColor: highlightedRoute === index ? "#00FF00" : "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                );
            })}


            {displayPoints?.map((point, index) => (
                <Marker
                    key={`point-${index}`}
                    position={{
                        lat: point.lat || 0,
                        lng: point.lng || 0,
                    }}
                    icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                />
            ))}

            {incidents.map((incident, index) => (
                <Marker
                    key={`incident-${index}`}
                    position={{
                        lat: incident.point?.lat || 0,
                        lng: incident.point?.lng || 0,
                    }}
                    icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                    title={incident.description}
                    onClick={() => onMarkerClick(incident)}
                />
            ))}


        </GoogleMap>
    );
};

MapComponent.propTypes = {
    containerStyle: PropTypes.object,
    center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
    zoom: PropTypes.number,
    municipalities: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            municipalityPoint: PropTypes.shape({
                lat: PropTypes.number,
                lng: PropTypes.number,
            }),
        })
    ),
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            routePoints: PropTypes.arrayOf(
                PropTypes.shape({
                    lat: PropTypes.number,
                    lng: PropTypes.number,
                })
            ),
        })
    ),
    displayPoints: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
        })
    ),
    incidents: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
            pointId: PropTypes.number,
            status: PropTypes.string,
            acceptedById: PropTypes.number,
            lastModifiedById: PropTypes.number,
            imageUrl: PropTypes.string,
        })
    ),
    onMapClick: PropTypes.func,
    highlightedRoute: PropTypes.number,
    onMarkerClick: PropTypes.func,
};

export default MapComponent;
