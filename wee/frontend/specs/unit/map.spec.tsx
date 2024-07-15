import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import LeafletMap from '../../src/app/components/map/LeafletMap';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer"></div>,
  Marker: ({ position }) => <div data-testid="marker" data-position={position}></div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

// Mock navigator.geolocation
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
      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure the state updates
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
      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure the state updates
    });

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('handles error when fetching geocoded addresses fails', async () => {
    const mockAddresses = [
      '1600 Amphitheatre Parkway, Mountain View, CA',
      '1 Infinite Loop, Cupertino, CA',
    ];

    // Mock fetch failure for each address
    mockAddresses.forEach(() => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch geocoded addresses'));
    });

    await act(async () => {
      render(<LeafletMap addresses={mockAddresses} />);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for fetch and state update
    });

    expect(mockFetch).toHaveBeenCalledTimes(mockAddresses.length);
    expect(screen.getByText('Failed to fetch geocoded addresses')).toBeInTheDocument();
  });

  it('displays markers after fetching geocoded addresses', async () => {
    const mockGeocodeResponse = [
        { lat: '37.4224764', lon: '-122.0842499' }, // Googleplex
        { lat: '37.33182', lon: '-122.03118' }, // Apple Park
      ];

      const mockAddresses = [
        '1600 Amphitheatre Parkway, Mountain View, CA',
        '1 Infinite Loop, Cupertino, CA',
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
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for fetch and state update
      });

      expect(mockFetch).toHaveBeenCalledTimes(mockAddresses.length);
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(mockGeocodeResponse.length);
      markers.forEach((marker, index) => {
        expect(marker).toHaveAttribute('data-position', `${mockGeocodeResponse[index].lat},${mockGeocodeResponse[index].lon}`);
      });
    });
  });

