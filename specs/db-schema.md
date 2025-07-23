-- Monster Cooperative Database Schema (Simplified)
-- Supabase PostgreSQL Database Structure

-- ================================
-- 1. 사용자 관리 (User Management)
-- ================================

-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    occupation TEXT,
    education_level TEXT,
    interests TEXT[], -- 관심사 배열
    learning_goals TEXT,
    marketing_consent BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false, -- 단순한 관리자 플래그
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 2. 교육 프로그램 관리
-- ================================

-- 프로그램 카테고리
CREATE TABLE program_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 교육 프로그램 (스케줄 정보 포함)
CREATE TABLE programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES program_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    -- thumbnail_url removed, using photos table reference instead
    thumbnail UUID REFERENCES photos(id), -- 썸네일 이미지 참조
    notion_page_id TEXT, -- Notion CMS 연동
    instructor_name TEXT,
    instructor_bio TEXT,
    instructor_image_url TEXT,
    
    -- 스케줄 정보 (프로그램 테이블에 통합)
    location TEXT,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    duration_hours INTEGER,
    
    -- 참가자 정보
    max_participants INTEGER DEFAULT 20,
    min_participants INTEGER DEFAULT 5,
    current_participants INTEGER DEFAULT 0,
    
    -- 가격 정보
    base_price DECIMAL(10,2) NOT NULL,
    early_bird_price DECIMAL(10,2),
    early_bird_deadline TIMESTAMP WITH TIME ZONE,
    
    -- 기타 정보
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 3. 프로그램 참가자 관리
-- ================================

-- 프로그램 참가 신청
CREATE TABLE program_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT,
    emergency_contact TEXT,
    dietary_restrictions TEXT,
    special_requests TEXT,
    amount_paid DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'completed', 'no_show')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- UNIQUE 제약조건 제거: 사용자가 같은 프로그램에 여러 번 신청 가능 (예: 취소 후 재신청, 동반자 추가 등)
);

-- ================================
-- 4. 위시리스트
-- ================================

-- 관심 프로그램 위시리스트
CREATE TABLE wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- ================================
-- 5. 구독 서비스 (SQUEEZE LMS)
-- ================================

-- 구독 플랜
CREATE TABLE subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    features TEXT[],
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    trial_days INTEGER DEFAULT 14,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 구독
CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('trial', 'active', 'cancelled', 'expired', 'paused')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 6. 결제 관리
-- ================================

-- 결제 내역
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES program_participants(id) ON DELETE SET NULL, -- 프로그램 결제
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL, -- 구독 결제
    payment_key TEXT UNIQUE, -- TossPayments/NicePay 결제키 (TID)
    order_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KRW',
    payment_method TEXT, -- 카드, 계좌이체, 간편결제 등
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    toss_payment_data JSONB, -- TossPayments API 응답 데이터
    nicepay_data JSONB, -- NicePay API 응답 데이터
    paid_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE, -- 결제 취소 시점 (환불 처리 시 업데이트)
    failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 환불 내역
CREATE TABLE refunds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    processed_by UUID REFERENCES profiles(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    refund_tid TEXT, -- NicePay 취소 거래 키
    toss_refund_data JSONB, -- TossPayments 환불 API 응답
    nicepay_refund_data JSONB, -- NicePay 환불 API 응답 (취소 API 전체 응답 데이터)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 7. 문의 관리
-- ================================

-- 고객 문의 (단순화)
CREATE TABLE inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'program', 'subscription', 'technical', 'refund')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 8. 알림 관리
-- ================================

-- 사용자 알림
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('program', 'payment', 'subscription', 'general')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 9. 시스템 설정
-- ================================

-- 사이트 설정
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    type TEXT DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 10. 사진 관리 (Photos)
-- ================================

-- 사진 저장 및 관리
CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    size_kb INTEGER,
    uploaded_by UUID REFERENCES auth.users(id),
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL, -- 프로그램과 연결
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ================================
-- 11. 인덱스 및 제약조건
-- ================================

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_programs_category ON programs(category_id);
CREATE INDEX idx_programs_dates ON programs(start_date, end_date);
CREATE INDEX idx_participants_user ON program_participants(user_id);
CREATE INDEX idx_participants_program ON program_participants(program_id);
CREATE INDEX idx_participants_status ON program_participants(status);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_photos_program ON photos(program_id);
CREATE INDEX idx_photos_uploaded_by ON photos(uploaded_by);

-- 업데이트 시간 자동 갱신을 위한 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON program_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 11. Row Level Security (RLS) 정책
-- ================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 프로필 접근 정책
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 프로그램 참가자 접근 정책
CREATE POLICY "Users can view own participations" ON program_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own participations" ON program_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all participations" ON program_participants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 위시리스트 접근 정책
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- 구독 접근 정책
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 결제 접근 정책
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 문의 접근 정책
CREATE POLICY "Users can view own inquiries" ON inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can manage all inquiries" ON inquiries FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 알림 접근 정책
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- 사진 접근 정책
CREATE POLICY "Users can view active photos" ON photos FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own photos" ON photos FOR ALL USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage all photos" ON photos FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ================================
-- 12. 트리거 함수 (참가자 수 자동 업데이트)
-- ================================

-- 프로그램 참가자 수 자동 업데이트
CREATE OR REPLACE FUNCTION update_program_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE programs 
        SET current_participants = current_participants + 1
        WHERE id = NEW.program_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE programs 
        SET current_participants = current_participants - 1
        WHERE id = OLD.program_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- 상태가 cancelled로 변경되면 참가자 수 감소
        IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
            UPDATE programs 
            SET current_participants = current_participants - 1
            WHERE id = NEW.program_id;
        -- cancelled에서 다른 상태로 변경되면 참가자 수 증가
        ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
            UPDATE programs 
            SET current_participants = current_participants + 1
            WHERE id = NEW.program_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON program_participants
    FOR EACH ROW EXECUTE FUNCTION update_program_participant_count();

-- ================================
-- 13. 초기 데이터 삽입
-- ================================

-- 프로그램 카테고리 초기 데이터
INSERT INTO program_categories (name, slug, description, sort_order) VALUES
('팀기업가정신 교육', 'team-entrepreneurship', '실제 결과물을 만드는 프로젝트 기반 학습', 1),
('SQUEEZE LRS', 'squeeze-lrs', '과정 중심 평가를 위한 프로젝트 수업 보조 솔루션', 2),
('챌린지 트립', 'challenge-trip', '세상으로 떠나는 학교 맞춤형 수학여행', 3),
('작가가 되는 트립', 'writer-trip', '나만의 여행을 기획하고 책으로 출판하는 경험', 4);

-- 구독 플랜 초기 데이터
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_yearly, features, is_popular, sort_order) VALUES
('Basic', 'basic', '개인 학습자를 위한 기본 플랜', 29000, 290000, 
 ARRAY['기본 LRS 기능', '월 5개 프로젝트', '이메일 지원'], false, 1),
('Pro', 'pro', '교육자를 위한 전문 플랜', 59000, 590000, 
 ARRAY['고급 LRS 기능', '무제한 프로젝트', '우선 지원', '고급 분석'], true, 2),
('Enterprise', 'enterprise', '기관을 위한 엔터프라이즈 플랜', 99000, 990000, 
 ARRAY['모든 기능', '무제한 사용자', '전담 지원', '커스텀 통합'], false, 3);

-- 사이트 기본 설정
INSERT INTO site_settings (key, value, description) VALUES
('site_title', 'Monster Cooperative', '사이트 제목'),
('site_description', '팀프러너를 양성하는 No.1 교육 기관', '사이트 설명'),
('contact_email', 'info@monster-coop.kr', '연락처 이메일'),
('contact_phone', '02-1234-5678', '연락처 전화번호'),
('business_hours', '평일 09:00 - 18:00', '운영시간'),
('refund_policy_days', '7', '환불 가능 일수'),
('max_reservation_per_user', '5', '사용자당 최대 예약 수');