-- LABOURCONNECT PRODUCTION DATABASE SCHEMA
-- STACK: PostgreSQL + PostGIS + Supabase Auth

-- Enable PostGIS for location-based searches
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'pending', 'paid', 'failed', 'refunded');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- 2. PROFILES (Base User Table)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL,
    language TEXT DEFAULT 'en',
    push_token TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKERS TABLE
CREATE TABLE workers (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    skills TEXT[] DEFAULT '{}',
    bio TEXT,
    daily_rate DECIMAL(12,2),
    location_name TEXT,
    location_coords GEOGRAPHY(POINT, 4326),
    verification_status verification_status DEFAULT 'unverified',
    aadhaar_number_hash TEXT, -- Hashed for security
    is_available BOOLEAN DEFAULT true,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    live_selfie_url TEXT,
    aadhaar_image_url TEXT,
    metadata JSONB DEFAULT '{}'
);

-- 4. CUSTOMERS TABLE
CREATE TABLE customers (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    favorite_workers UUID[] DEFAULT '{}',
    address_book JSONB DEFAULT '[]'
);

-- 5. BOOKINGS TABLE
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    worker_id UUID REFERENCES workers(id) NOT NULL,
    status booking_status DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    job_location_name TEXT,
    job_location_coords GEOGRAPHY(POINT, 4326),
    job_pin TEXT, -- 4 digit PIN
    total_price DECIMAL(12,2) NOT NULL,
    commission_fee DECIMAL(12,2) NOT NULL,
    worker_earning DECIMAL(12,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'online')),
    payment_status payment_status DEFAULT 'unpaid',
    razorpay_order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WALLETS & TRANSACTIONS
CREATE TABLE wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    description TEXT,
    reference_id UUID, -- Link to booking_id or withdrawal_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) UNIQUE NOT NULL,
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    worker_id UUID REFERENCES workers(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SOS ALERTS
CREATE TABLE sos_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    location_coords GEOGRAPHY(POINT, 4326),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DISPUTES & COMPLAINTS
CREATE TABLE disputes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    raised_by UUID REFERENCES profiles(id) NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_investigation', 'resolved', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for Performance
CREATE INDEX idx_workers_location ON workers USING GIST (location_coords);
CREATE INDEX idx_bookings_customer ON bookings (customer_id);
CREATE INDEX idx_bookings_worker ON bookings (worker_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_profiles_role ON profiles (role);

-- FUNCTIONS & TRIGGERS

-- Automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_wallets_modtime BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to search nearby workers
CREATE OR REPLACE FUNCTION get_nearby_workers(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters INTEGER,
    skill_filter TEXT DEFAULT NULL
)
RETURNS SETOF workers AS $$
BEGIN
    RETURN QUERY
    SELECT w.*
    FROM workers w
    WHERE ST_DWithin(w.location_coords, ST_SetSRID(ST_Point(lng, lat), 4326)::geography, radius_meters)
    AND w.is_available = true
    AND w.verification_status = 'verified'
    AND (skill_filter IS NULL OR skill_filter = ANY(w.skills));
END;
$$ LANGUAGE plpgsql STABLE;

-- RLS POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workers: Viewable by everyone, only updateable by the worker or admin
CREATE POLICY "Workers are viewable by everyone" ON workers FOR SELECT USING (true);
CREATE POLICY "Workers can update own data" ON workers FOR UPDATE USING (auth.uid() = id);

-- Bookings: Only involved parties and admins can see/update
CREATE POLICY "Users can see their own bookings" ON bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = worker_id);
CREATE POLICY "Admins see all bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Wallets: Only owner can see
CREATE POLICY "Users see own wallet" ON wallets FOR SELECT USING (auth.uid() = profile_id);

-- SOS Alerts: Anyone can create, only admin can update/view all
CREATE POLICY "Anyone can create SOS" ON sos_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage SOS" ON sos_alerts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
