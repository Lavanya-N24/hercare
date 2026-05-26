// Global Geography Data for Dropdowns
export const regions = {
  "India": {
    "Karnataka": [
      { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
      { name: "Mysore", lat: 12.2958, lng: 76.6394 }
    ],
    "Delhi": [
      { name: "New Delhi", lat: 28.6139, lng: 77.2090 }
    ],
    "Maharashtra": [
      { name: "Mumbai", lat: 19.0760, lng: 72.8777 }
    ]
  },
  "USA": {
    "New York": [
      { name: "New York City", lat: 40.7128, lng: -74.0060 }
    ],
    "California": [
      { name: "San Francisco", lat: 37.7749, lng: -122.4194 }
    ]
  },
  "UK": {
    "England": [
      { name: "London", lat: 51.5074, lng: -0.1278 }
    ]
  }
};

// Real-world locations (Global)
export const machines = [
  // Bengaluru, India
  { id: 'M001', name: 'Majestic Bus Station - Platform 1', location: 'Kempegowda Bus Station', sector: 'public', stock: 45, lat: 12.9779, lng: 77.5713, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M002', name: 'Nadaprabhu Kempegowda Metro - Gate A', location: 'Majestic Metro Station', sector: 'public', stock: 12, lat: 12.9757, lng: 77.5728, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M003', name: 'MG Road Metro - Boulevard Entrance', location: 'MG Road Metro', sector: 'public', stock: 28, lat: 12.9756, lng: 77.6067, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M004', name: 'Indiranagar Metro - Concourse Level', location: 'Indiranagar Metro', sector: 'public', stock: 35, lat: 12.9784, lng: 77.6387, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M005', name: 'Shantinagar TTMC - Terminal B', location: 'Shantinagar Bus Station', sector: 'public', stock: 50, lat: 12.9567, lng: 77.5950, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M006', name: 'Yeshwanthpur TTMC - Restroom Area', location: 'Yeshwanthpur Bus Station', sector: 'public', stock: 8, lat: 13.0234, lng: 77.5504, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M007', name: 'Orion Mall - 2nd Floor Washroom', location: 'Rajajinagar', sector: 'public', stock: 15, lat: 13.0110, lng: 77.5550, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M008', name: 'Taj MG Road Hotel - Lobby Restroom', location: 'MG Road', sector: 'hotel', stock: 10, lat: 12.9733, lng: 77.6190, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M009', name: 'Lalbagh Botanical Garden - West Gate', location: 'Lalbagh', sector: 'public', stock: 22, lat: 12.9507, lng: 77.5848, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { id: 'M010', name: 'KIA Airport - Terminal 1 Arrivals', location: 'Kempegowda International Airport', sector: 'public', stock: 80, lat: 13.1989, lng: 77.7068, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  
  // Mysuru, India
  { id: 'M004', name: 'Mysore Palace - South Gate', location: 'Mysore Palace', sector: 'public', stock: 35, lat: 12.3051, lng: 76.6551, city: 'Mysuru', state: 'Karnataka', country: 'India' },
  
  // New Delhi, India
  { id: 'M005', name: 'Rajiv Chowk Metro - Gate 3', location: 'Connaught Place', sector: 'public', stock: 50, lat: 28.6328, lng: 77.2197, city: 'New Delhi', state: 'Delhi', country: 'India' },
  { id: 'M006', name: 'ISBT Kashmiri Gate - Waiting Area', location: 'Kashmiri Gate', sector: 'public', stock: 8, lat: 28.6665, lng: 77.2289, city: 'New Delhi', state: 'Delhi', country: 'India' },
  
  // Mumbai, India
  { id: 'M007', name: 'CSMT Railway Station - Platform 1', location: 'Chhatrapati Shivaji Maharaj Terminus', sector: 'public', stock: 15, lat: 18.9400, lng: 72.8353, city: 'Mumbai', state: 'Maharashtra', country: 'India' },

  // New York City, USA
  { id: 'M008', name: 'Times Square Subway - 42nd St', location: 'Times Square', sector: 'public', stock: 42, lat: 40.7580, lng: -73.9855, city: 'New York City', state: 'New York', country: 'USA' },
  { id: 'M009', name: 'Grand Central Terminal - Main Concourse', location: 'Grand Central', sector: 'public', stock: 10, lat: 40.7527, lng: -73.9772, city: 'New York City', state: 'New York', country: 'USA' },

  // San Francisco, USA
  { id: 'M010', name: 'Embarcadero BART - Entrance B', location: 'Embarcadero Station', sector: 'public', stock: 25, lat: 37.7929, lng: -122.3962, city: 'San Francisco', state: 'California', country: 'USA' },

  // London, UK
  { id: 'M011', name: 'Waterloo Station - Jubilee Line', location: 'Waterloo', sector: 'public', stock: 60, lat: 51.5032, lng: -0.1123, city: 'London', state: 'England', country: 'UK' },
  { id: 'M012', name: 'Piccadilly Circus - Exit 1', location: 'Piccadilly Circus', sector: 'public', stock: 5, lat: 51.5101, lng: -0.1340, city: 'London', state: 'England', country: 'UK' }
];
