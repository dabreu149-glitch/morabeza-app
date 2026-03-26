-- Morabeza AI — Initial Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends Supabase auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  mailing_address text,
  is_admin boolean default false,
  daily_message_count integer default 0,
  last_message_date text,
  lender_consent boolean,
  lender_consent_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- CREDIT REPORTS
create table if not exists public.credit_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_text text,
  parsed_json jsonb,
  credit_score integer,
  utilization numeric,
  debt_to_income numeric,
  savings_documented numeric default 0,
  status text default 'uploaded',
  uploaded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- NEGATIVE ITEMS
create table if not exists public.negative_items (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid not null references public.credit_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  creditor text,
  amount numeric,
  disputable boolean,
  dispute_reason text,
  dispute_status text default 'none',
  created_at timestamptz default now()
);

-- DISPUTE LETTERS
create table if not exists public.dispute_letters (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null references public.negative_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bureau text not null,
  letter_text text not null,
  status text default 'generated',
  generated_at timestamptz default now(),
  sent_at timestamptz
);

-- ACTION PLANS
create table if not exists public.action_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_json jsonb not null,
  pdf_url text,
  created_at timestamptz default now()
);

-- CONVERSATIONS
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'New Conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MESSAGES
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

-- USER PROGRESS
create table if not exists public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step text not null,
  completed_at timestamptz default now(),
  unique(user_id, step)
);

-- EVENTS (analytics)
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  event_name text,
  visitor_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- PAGE VIEWS (analytics)
create table if not exists public.page_views (
  id uuid primary key default uuid_generate_v4(),
  page text,
  visitor_id text,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

-- WAITLIST
create table if not exists public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  language text default '',
  source text default '',
  created_at timestamptz default now()
);

-- RESOURCES
create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  category text not null,
  summary text,
  tags text[],
  embedding text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- HELPER FUNCTION: check if user is admin
create or replace function public.is_admin(_user_id uuid)
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = _user_id),
    false
  );
$$ language sql security definer;

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.credit_reports enable row level security;
alter table public.negative_items enable row level security;
alter table public.dispute_letters enable row level security;
alter table public.action_plans enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_progress enable row level security;
alter table public.events enable row level security;
alter table public.page_views enable row level security;
alter table public.waitlist enable row level security;
alter table public.resources enable row level security;

-- POLICIES: users can only see their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own reports" on public.credit_reports for all using (auth.uid() = user_id);
create policy "Users can view own items" on public.negative_items for all using (auth.uid() = user_id);
create policy "Users can view own letters" on public.dispute_letters for all using (auth.uid() = user_id);
create policy "Users can view own plans" on public.action_plans for all using (auth.uid() = user_id);
create policy "Users can view own conversations" on public.conversations for all using (auth.uid() = user_id);
create policy "Users can view own messages" on public.messages for all using (
  auth.uid() = (select user_id from public.conversations where id = conversation_id)
);
create policy "Users can view own progress" on public.user_progress for all using (auth.uid() = user_id);

-- Analytics: anyone can insert, only admins can read
create policy "Anyone can insert events" on public.events for insert with check (true);
create policy "Anyone can insert page views" on public.page_views for insert with check (true);
create policy "Anyone can join waitlist" on public.waitlist for insert with check (true);

-- Resources: anyone can read published ones
create policy "Anyone can read published resources" on public.resources for select using (published = true);
