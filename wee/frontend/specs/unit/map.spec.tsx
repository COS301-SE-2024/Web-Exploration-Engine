import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeafletMap from '../../src/app/components/map/LeafletMap';


// Mock Leaflet components and functions
jest.mock('leaflet', () => {
  const actualLeaflet = jest.requireActual('leaflet');
  return {
    ...actualLeaflet,
    Icon: {
      Default: jest.fn(() => ({
        mergeOptions: jest.fn(),
      })),
    },
    icon: jest.fn(),
  };
});

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer"></div>,
  Marker: ({ position }) => <div data-testid="marker" data-position={position}></div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

// Mock the geolocation API
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
};

// Mock dynamic import
jest.mock('next/dynamic', () => (component) => component);

describe('LeafletMap Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<LeafletMap />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('sets user location when geolocation is supported', async () => {
    const mockPosition = { coords: { latitude: -29.849622, longitude: 31.022042 } };
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
      (success) => success(mockPosition)
    );

    render(<LeafletMap />);

    await waitFor(() => expect(screen.getByTestId('marker')).toBeInTheDocument());
    expect(screen.getByTestId('marker')).toHaveAttribute('data-position', '-29.849622,31.022042');
  });

  test('handles geolocation not supported', async () => {
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
      (_, error) => error({ code: 1 })
    );

    render(<LeafletMap />);

    await waitFor(() => expect(screen.getByTestId('map-container')).toBeInTheDocument());
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('adds markers after fetching geocoded addresses', async () => {
    const mockGeocodeResponse = [
      { lat: '37.4224764', lon: '-122.0842499' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockGeocodeResponse));

    render(<LeafletMap />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(15)); // Assuming 15 addresses

    await waitFor(() => expect(screen.getAllByTestId('marker')).toHaveLength(15));
  });
});
