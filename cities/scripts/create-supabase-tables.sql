-- Create transit_projects table
CREATE TABLE IF NOT EXISTS transit_projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  budget_total VARCHAR(50),
  estimated_completion VARCHAR(50),
  project_type VARCHAR(50) NOT NULL,
  length VARCHAR(50),
  stations INTEGER DEFAULT 0,
  description TEXT,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample transit projects with real GeoJSON-style coordinates
INSERT INTO transit_projects (
  name, status, progress_percentage, budget_total, estimated_completion,
  project_type, length, stations, description, coordinates
) VALUES 
(
  'Ontario Line',
  'In Progress',
  35,
  '$19.0B',
  '2031',
  'Subway',
  '15.6 km',
  15,
  'A new 15.6-kilometre subway line that will bring 15 new stations to Toronto, including areas that have never had rapid transit.',
  '[[-79.4194, 43.6362], [-79.4000, 43.6450], [-79.3832, 43.6532], [-79.3700, 43.6600], [-79.3500, 43.6650], [-79.3300, 43.6700], [-79.3100, 43.6750], [-79.2900, 43.6800]]'::jsonb
),
(
  'Eglinton Crosstown LRT',
  'Delayed',
  95,
  '$12.8B',
  '2024',
  'LRT',
  '19 km',
  25,
  'A 19-kilometre light rail transit line that will run along Eglinton Avenue from Mount Dennis to Kennedy Station.',
  '[[-79.5442, 43.7282], [-79.5142, 43.7282], [-79.4842, 43.7282], [-79.4542, 43.7282], [-79.4242, 43.7282], [-79.3942, 43.7282], [-79.3642, 43.7282], [-79.3342, 43.7282], [-79.3042, 43.7282], [-79.2742, 43.7282], [-79.2442, 43.7282], [-79.2142, 43.7282], [-79.1842, 43.7282]]'::jsonb
),
(
  'Finch West LRT',
  'In Progress',
  85,
  '$2.5B',
  '2024',
  'LRT',
  '11 km',
  18,
  'An 11-kilometre light rail transit line running along Finch Avenue West from Finch West Station to Humber College.',
  '[[-79.5000, 43.7600], [-79.4700, 43.7600], [-79.4400, 43.7600], [-79.4100, 43.7600], [-79.3800, 43.7600], [-79.3500, 43.7600]]'::jsonb
),
(
  'Lakeshore West Line',
  'In Progress',
  45,
  '$2.1B',
  '2025',
  'GO Rail',
  '67 km',
  12,
  'Improvements to the Lakeshore West GO line to support more frequent, faster service between Toronto and Hamilton.',
  '[[-79.3832, 43.6426], [-79.4500, 43.6300], [-79.5200, 43.6200], [-79.5900, 43.6100], [-79.6600, 43.6000], [-79.7300, 43.5900], [-79.8000, 43.5800]]'::jsonb
),
(
  'Hazel McCallion LRT',
  'In Progress',
  65,
  '$4.6B',
  '2024',
  'LRT',
  '18 km',
  18,
  'An 18-kilometre light rail transit line running through Mississauga from Port Credit GO to Brampton Gateway Terminal.',
  '[[-79.6400, 43.5500], [-79.6350, 43.5700], [-79.6300, 43.5900], [-79.6250, 43.6100], [-79.6200, 43.6300], [-79.6150, 43.6500], [-79.6100, 43.6700], [-79.6050, 43.6900], [-79.6000, 43.7100]]'::jsonb
),
(
  'Scarborough Subway Extension',
  'In Progress',
  25,
  '$5.5B',
  '2030',
  'Subway',
  '7.8 km',
  3,
  'A 7.8-kilometre extension of Line 2 Bloor-Danforth from Kennedy Station to Scarborough Centre and Sheppard East.',
  '[[-79.2642, 43.7282], [-79.2500, 43.7400], [-79.2300, 43.7500], [-79.2100, 43.7600], [-79.1900, 43.7700]]'::jsonb
),
(
  'Yonge North Subway Extension',
  'Planned',
  5,
  '$5.6B',
  '2030',
  'Subway',
  '7.4 km',
  6,
  'A 7.4-kilometre extension of Line 1 Yonge-University from Finch Station to Richmond Hill Centre.',
  '[[-79.4142, 43.7800], [-79.4142, 43.7900], [-79.4142, 43.8000], [-79.4142, 43.8100], [-79.4142, 43.8200], [-79.4142, 43.8300]]'::jsonb
),
(
  'Hamilton LRT',
  'Planned',
  10,
  '$3.4B',
  '2028',
  'LRT',
  '14 km',
  17,
  'A 14-kilometre light rail transit line running along King Street and Main Street in Hamilton.',
  '[[-79.8700, 43.2500], [-79.8500, 43.2520], [-79.8300, 43.2540], [-79.8100, 43.2560], [-79.7900, 43.2580], [-79.7700, 43.2600]]'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transit_projects_status ON transit_projects(status);
CREATE INDEX IF NOT EXISTS idx_transit_projects_type ON transit_projects(project_type);
CREATE INDEX IF NOT EXISTS idx_transit_projects_updated ON transit_projects(updated_at);

-- Enable Row Level Security (optional)
ALTER TABLE transit_projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to all users
CREATE POLICY "Allow public read access" ON transit_projects
  FOR SELECT USING (true);

-- Create a policy that allows insert/update for authenticated users (optional)
CREATE POLICY "Allow authenticated users to modify" ON transit_projects
  FOR ALL USING (auth.role() = 'authenticated');
