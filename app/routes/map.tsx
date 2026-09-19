import {useState} from "react";
import type {Coordinate, LatLng, LayerConfig} from "~/types";
import {MapControls} from "~/components/MapControls";
import {Map} from "~/components/Map";

const PRESET_DATASETS: Record<string, Coordinate[]> = {
    landmarks: [
        { id: '1', title: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, color: '#EF4444', active: true },
        { id: '2', title: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, color: '#3B82F6', active: true },
        { id: '3', title: 'Taj Mahal', lat: 27.1751, lng: 78.0421, color: '#F59E0B', active: true },
        { id: '4', title: 'Machu Picchu', lat: -13.1631, lng: -72.545, color: '#10B981', active: true }
    ],
    techHubs: [
        { id: 'th1', title: 'Silicon Valley', lat: 37.3861, lng: -122.0839, color: '#10B981', active: true },
        { id: 'th2', title: 'Seattle Tech Quarter', lat: 47.6062, lng: -122.3321, color: '#3B82F6', active: true },
        { id: 'th3', title: 'London Tech City', lat: 51.5255, lng: -0.0876, color: '#8B5CF6', active: true }
    ],
    capitals: [
        { id: 'c1', title: 'Paris', lat: 48.8566, lng: 2.3522, color: '#EF4444', active: true },
        { id: 'c2', title: 'Berlin', lat: 52.52, lng: 13.405, color: '#F59E0B', active: true },
        { id: 'c3', title: 'Rome', lat: 41.9028, lng: 12.4964, color: '#06B6D4', active: true }
    ]
};

export default function MapPage() {
    const [selectedPreset, setSelectedPreset] = useState<string>('landmarks');
    const [coordinates, setCoordinates] = useState<Coordinate[]>(PRESET_DATASETS.landmarks);
    const [targetFocus, setTargetFocus] = useState<LatLng | null>(null);
    const [fitBoundsTrigger, setFitBoundsTrigger] = useState<number>(0);

    // Single Example Layer Configuration
    const [layerConfig, setLayerConfig] = useState<LayerConfig>({
        id: 'coverage-layer',
        name: 'Spatial Coverage Layer',
        description: 'Demonstrates a dynamic spatial buffer radius around each active coordinate point.',
        enabled: true,
        radiusKm: 150,
        color: '#8B5CF6',
        opacity: 0.25
    });

    const handleSelectPreset = (presetKey: string) => {
        setSelectedPreset(presetKey);
        if (PRESET_DATASETS[presetKey]) {
            setCoordinates(PRESET_DATASETS[presetKey]);
            setFitBoundsTrigger((prev: number) => prev + 1);
        }
    };

    const handleAddCoordinate = (newCoord: Omit<Coordinate, 'id'>) => {
        const created: Coordinate = {
            ...newCoord,
            id: `coord_${Date.now()}`
        };
        setCoordinates((prev) => [...prev, created]);
        setTargetFocus({ lat: created.lat, lng: created.lng });
    };

    const handleToggleCoordinate = (id: string) => {
        setCoordinates((prev) =>
            prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
        );
    };

    const handleDeleteCoordinate = (id: string) => {
        setCoordinates((prev) => prev.filter((c) => c.id !== id));
    };

    const handleFocusCoordinate = (lat: number, lng: number) => {
        setTargetFocus({ lat, lng });
    };

    const handleFitBounds = () => {
        setFitBoundsTrigger((prev) => prev + 1);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar Controls */}
            <MapControls
    coordinates={coordinates}
    onAddCoordinate={handleAddCoordinate}
    onToggleCoordinate={handleToggleCoordinate}
    onDeleteCoordinate={handleDeleteCoordinate}
    onFocusCoordinate={handleFocusCoordinate}
    onFitBounds={handleFitBounds}
    onZoomIn={() => {}}
    onZoomOut={() => {}}
    layerConfig={layerConfig}
    onUpdateLayerConfig={setLayerConfig}
    selectedPreset={selectedPreset}
    onSelectPreset={handleSelectPreset}
    />

    {/* Main Google Map Tile Engine Canvas */}
    <Map
        coordinates={coordinates}
    layerConfig={layerConfig}
    targetFocus={targetFocus}
    fitBoundsTrigger={fitBoundsTrigger}
    />
    </div>
);
}