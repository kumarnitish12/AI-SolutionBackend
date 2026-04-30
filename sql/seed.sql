TRUNCATE TABLE placements, courses, colleges RESTART IDENTITY CASCADE;

INSERT INTO colleges (name, location, fees, rating, overview, rank_band, tags) VALUES
('IIT Madras', 'Chennai', 220000, 4.9, 'Top engineering institute known for strong research and startup culture.', 'elite', ARRAY['engineering']),
('IIT Delhi', 'New Delhi', 230000, 4.8, 'Highly selective institute with excellent placements and technical depth.', 'elite', ARRAY['engineering']),
('NIT Trichy', 'Tiruchirappalli', 170000, 4.6, 'Premier NIT with robust alumni network and industry outcomes.', 'strong', ARRAY['engineering']),
('VIT Vellore', 'Vellore', 195000, 4.3, 'Private engineering institution with diverse programs and active placements.', 'moderate', ARRAY['engineering']),
('BITS Pilani', 'Pilani', 540000, 4.8, 'Leading private institute with practice school model and top recruiters.', 'strong', ARRAY['engineering']),
('AIIMS Delhi', 'New Delhi', 65000, 4.9, 'Flagship medical institute for clinical training, research and patient load.', 'elite', ARRAY['medical']),
('CMC Vellore', 'Vellore', 90000, 4.7, 'Renowned medical college with strong academics and service orientation.', 'strong', ARRAY['medical']),
('KGMU Lucknow', 'Lucknow', 75000, 4.4, 'Established state medical university with high patient exposure.', 'moderate', ARRAY['medical']),
('JIPMER Puducherry', 'Puducherry', 68000, 4.6, 'Central institute with quality medical education and infrastructure.', 'strong', ARRAY['medical']),
('MAMC Delhi', 'New Delhi', 82000, 4.5, 'Popular government medical college with strong internship and residency pathways.', 'moderate', ARRAY['medical']),
('Manipal Institute of Technology', 'Manipal', 370000, 4.2, 'Well-known private engineering college with strong campus ecosystem.', 'developing', ARRAY['engineering']),
('SRM Institute of Science and Technology', 'Chennai', 320000, 4.1, 'Large multidisciplinary university with broad engineering programs.', 'developing', ARRAY['engineering']);

INSERT INTO courses (college_id, course_name, duration_years, annual_fees) VALUES
(1, 'B.Tech Computer Science and Engineering', 4, 220000),
(1, 'B.Tech Electrical Engineering', 4, 210000),
(2, 'B.Tech Computer Science and Engineering', 4, 230000),
(2, 'B.Tech Mechanical Engineering', 4, 215000),
(3, 'B.Tech Civil Engineering', 4, 170000),
(3, 'B.Tech Electronics and Communication', 4, 180000),
(4, 'B.Tech Computer Science and Engineering', 4, 195000),
(5, 'B.E. Computer Science', 4, 540000),
(6, 'MBBS', 6, 65000),
(7, 'MBBS', 6, 90000),
(8, 'MBBS', 6, 75000),
(9, 'MBBS', 6, 68000),
(10, 'MBBS', 6, 82000),
(11, 'B.Tech Information Technology', 4, 370000),
(12, 'B.Tech Computer Science and Engineering', 4, 320000);

INSERT INTO placements (college_id, avg_package_lpa, placement_percentage, top_recruiters) VALUES
(1, 22.10, 93.00, ARRAY['Google', 'Microsoft', 'Goldman Sachs']),
(2, 24.70, 95.00, ARRAY['Atlassian', 'Uber', 'Amazon']),
(3, 16.20, 89.00, ARRAY['Oracle', 'Caterpillar', 'Deloitte']),
(4, 9.50, 84.00, ARRAY['Infosys', 'TCS', 'Accenture']),
(5, 20.30, 91.00, ARRAY['Nvidia', 'Adobe', 'Morgan Stanley']),
(6, 12.40, 98.00, ARRAY['AIIMS Network', 'Apollo', 'Fortis']),
(7, 10.30, 95.00, ARRAY['CMC Hospitals', 'Aster', 'Kauvery']),
(8, 8.10, 88.00, ARRAY['SGPGIMS', 'Medanta', 'Max Healthcare']),
(9, 9.60, 92.00, ARRAY['JIPMER Hospital', 'Narayana Health', 'Apollo']),
(10, 7.90, 87.00, ARRAY['LNJP Hospital', 'Fortis', 'Medanta']),
(11, 11.20, 82.00, ARRAY['Cisco', 'Bosch', 'Capgemini']),
(12, 10.40, 80.00, ARRAY['Cognizant', 'Wipro', 'PwC']);
