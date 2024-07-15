import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeafletMap from '../../src/app/components/map/LeafletMap';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer"></div>,
  Marker: ({ position }) => <div data-testid="marker" data-position={position}></div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));


global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
};

describe('LeafletMap Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<LeafletMap />);
    });
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('displays user location marker', async () => {
    const mockPosition = {
      coords: { latitude: -29.849622, longitude: 31.022042 },
    };
    global.navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success(mockPosition);
    });

    await act(async () => {
      render(<LeafletMap />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('marker')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toHaveAttribute('data-position', '-29.849622,31.022042');
  });

  it('handles error when user location is not supported', async () => {
    global.navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) => {
      error({ code: 1 });
    });

    await act(async () => {
      render(<LeafletMap />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('displays markers for successfully geocoded addresses', async () => {
    const mockGeocodeResponse = [
      { lat: '37.4224764', lon: '-122.0842499' }, // Googleplex
      { lat: '37.33182', lon: '-122.03118' }, // Apple Park
    ];

    const mockAddresses = [
      '28 Manchester Road, Chiselhurst, East London',
      '655 Cape Road, Hunters Retreat, Port Elizabeth',
      'Invalid Address', // This address will fail geocoding
    ];

    // Mock fetch success for each address
    mockAddresses.forEach((address, index) => {
      if (index < 2) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [mockGeocodeResponse[index]],
        });
      } else {
        mockFetch.mockRejectedValueOnce(new Error('Geocoding failed'));
      }
    });

    await act(async () => {
      render(<LeafletMap addresses={mockAddresses} />);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for fetch and state update
    });

    // Use queryAllByTestId to not throw error if markers are not found
    const markers = screen.queryAllByTestId('marker');

    // Ensure markers for valid addresses are displayed
    expect(markers.length).toBe(2); // Only 2 valid addresses should have markers
  });



  it('displays markers after fetching geocoded addresses', async () => {
    const mockGeocodeResponse = [
      { lat: '37.4224764', lon: '-122.0842499' }, // Googleplex
      { lat: '37.33182', lon: '-122.03118' }, // Apple Park
    ];

    const mockAddresses = [
      '28 Manchester Road, Chiselhurst, East London',
      '655 Cape Road, Hunters Retreat, Port Elizabeth',
    ];

    // Mock fetch success for each address
    mockAddresses.forEach((address, index) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockGeocodeResponse[index]],
      });
    });

    await act(async () => {
      render(<LeafletMap addresses={mockAddresses} />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockFetch).toHaveBeenCalledTimes(mockAddresses.length);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(mockGeocodeResponse.length);
    markers.forEach((marker, index) => {
      expect(marker).toHaveAttribute('data-position', `${mockGeocodeResponse[index].lat},${mockGeocodeResponse[index].lon}`);
    });
  });
});
