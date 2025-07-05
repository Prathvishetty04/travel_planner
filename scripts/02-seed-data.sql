-- Seed data for Travel Planner

-- Insert sample destinations
INSERT INTO destinations (name, country, city, description, category, latitude, longitude, image_url, average_rating) VALUES
('Eiffel Tower', 'France', 'Paris', 'Iconic iron lattice tower and symbol of Paris', 'HISTORY', 48.8584, 2.2945, '/placeholder.svg?height=200&width=300', 4.5),
('Santorini Beaches', 'Greece', 'Santorini', 'Beautiful volcanic beaches with crystal clear waters', 'BEACH', 36.3932, 25.4615, '/placeholder.svg?height=200&width=300', 4.7),
('Machu Picchu', 'Peru', 'Cusco', 'Ancient Incan citadel set high in the Andes Mountains', 'ADVENTURE', -13.1631, -72.5450, '/placeholder.svg?height=200&width=300', 4.8),
('Tokyo Shibuya', 'Japan', 'Tokyo', 'Bustling urban district known for its crossing and nightlife', 'URBAN', 35.6598, 139.7006, '/placeholder.svg?height=200&width=300', 4.3),
('Yellowstone National Park', 'USA', 'Wyoming', 'Americas first national park with geysers and wildlife', 'NATURE', 44.4280, -110.5885, '/placeholder.svg?height=200&width=300', 4.6),
('Colosseum', 'Italy', 'Rome', 'Ancient amphitheater and iconic symbol of Imperial Rome', 'HISTORY', 41.8902, 12.4922, '/placeholder.svg?height=200&width=300', 4.4),
('Bali Rice Terraces', 'Indonesia', 'Bali', 'Stunning terraced rice fields in tropical paradise', 'NATURE', -8.3405, 115.0920, '/placeholder.svg?height=200&width=300', 4.5),
('Great Wall of China', 'China', 'Beijing', 'Ancient fortification stretching across northern China', 'HISTORY', 40.4319, 116.5704, '/placeholder.svg?height=200&width=300', 4.6);

-- Insert sample hotels
INSERT INTO hotels (destination_id, name, address, rating, price_range, amenities, contact_info, image_url) VALUES
(1, 'Hotel Plaza Athénée', '25 Avenue Montaigne, Paris', 4.8, 'LUXURY', '["WiFi", "Spa", "Restaurant", "Concierge"]', '{"phone": "+33-1-53-67-66-65", "email": "info@plaza-athenee-paris.com"}', '/placeholder.svg?height=150&width=200'),
(2, 'Santorini Princess Spa Hotel', 'Imerovigli, Santorini', 4.5, 'LUXURY', '["Pool", "Spa", "Sea View", "WiFi"]', '{"phone": "+30-22860-23101", "email": "info@santoriniprincss.gr"}', '/placeholder.svg?height=150&width=200'),
(3, 'Belmond Hotel Monasterio', 'Plazoleta Nazarenas 337, Cusco', 4.6, 'LUXURY', '["Oxygen", "Restaurant", "Chapel", "WiFi"]', '{"phone": "+51-84-604-000", "email": "reservations.hmo@belmond.com"}', '/placeholder.svg?height=150&width=200');

-- Insert sample restaurants
INSERT INTO restaurants (destination_id, name, cuisine_type, address, rating, price_range, contact_info, image_url) VALUES
(1, 'Le Comptoir du Relais', 'French', '9 Carrefour de lOdéon, Paris', 4.3, 'MID_RANGE', '{"phone": "+33-1-44-27-07-97"}', '/placeholder.svg?height=150&width=200'),
(2, 'Selene Restaurant', 'Mediterranean', 'Pyrgos, Santorini', 4.7, 'FINE_DINING', '{"phone": "+30-22860-22249"}', '/placeholder.svg?height=150&width=200'),
(4, 'Sukiyabashi Jiro', 'Japanese', 'Ginza, Tokyo', 4.9, 'FINE_DINING', '{"phone": "+81-3-3535-3600"}', '/placeholder.svg?height=150&width=200');
