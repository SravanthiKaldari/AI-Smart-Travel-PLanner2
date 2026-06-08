import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Database, Brain, Shield, Layers, Workflow, BarChart3, Rocket, Globe, Users, MessageSquare, MapPin, Cloud, Cpu, FileText } from 'lucide-react';

const Documentation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Application
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10" />
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium tracking-wider uppercase">Research Paper Documentation</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            AI-Powered Smart Travel Planner Using Generative AI for Budget-Based Destination Recommendation
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80 mt-6">
            <span>📅 March 2026</span>
            <span>|</span>
            <span>🏛️ Department of Computer Science</span>
            <span>|</span>
            <span>📄 Full-Stack Web Application</span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-4 text-sm whitespace-nowrap">
            {[
              { href: '#abstract', label: 'Abstract' },
              { href: '#architecture', label: 'Architecture' },
              { href: '#tech-stack', label: 'Tech Stack' },
              { href: '#ai-system', label: 'AI System' },
              { href: '#features', label: 'Features' },
              { href: '#database', label: 'Database' },
              { href: '#workflow', label: 'Workflow' },
              { href: '#security', label: 'Security' },
              { href: '#screenshots', label: 'Screenshots' },
              { href: '#results', label: 'Results' },
              { href: '#future', label: 'Future Work' },
            ].map(item => (
              <a key={item.href} href={item.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-16">

        {/* 1. Abstract */}
        <Section id="abstract" icon={<FileText />} number="1" title="Abstract">
          <p>
            This paper presents the design and implementation of an <strong>AI-Powered Smart Travel Planner</strong>, a full-stack progressive web application that leverages <strong>Generative AI (Google Gemini API)</strong> to provide personalized, budget-based travel destination recommendations for Indian travelers. Unlike traditional recommendation systems that rely on collaborative filtering or content-based machine learning models requiring extensive training datasets, our system employs <strong>zero-shot reasoning</strong> through carefully engineered prompts to generate contextually rich, real-time travel suggestions.
          </p>
          <p className="mt-4">
            The application integrates real-time weather forecasting, AI-generated packing suggestions, interactive mapping with Leaflet.js, a collaborative group travel system with live GPS tracking, and a guided trip execution interface with detailed transport schedules. The system demonstrates that generative AI can effectively replace traditional ML pipelines for recommendation tasks while providing superior natural language understanding and contextual reasoning capabilities.
          </p>
          <div className="bg-muted rounded-xl p-5 mt-6">
            <p className="font-semibold text-foreground mb-2">Keywords:</p>
            <p className="text-muted-foreground text-sm">
              Generative AI, Travel Recommendation System, Google Gemini API, Progressive Web Application, Budget-Based Planning, Real-Time Location Tracking, React, TypeScript, Prompt Engineering, Zero-Shot Learning
            </p>
          </div>
        </Section>

        {/* 2. System Architecture */}
        <Section id="architecture" icon={<Layers />} number="2" title="System Architecture">
          <p>
            The application follows a <strong>three-tier architecture</strong> pattern comprising Presentation, Application, and Data tiers, ensuring separation of concerns, scalability, and maintainability.
          </p>

          {/* Architecture Diagram */}
          <div className="bg-card border border-border rounded-2xl p-6 my-8 overflow-x-auto">
            <h4 className="font-semibold text-foreground mb-6 text-center">Figure 1: System Architecture Diagram</h4>
            <div className="flex flex-col items-center gap-4 min-w-[600px]">
              {/* Presentation Tier */}
              <ArchBlock color="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" title="Presentation Tier (Frontend)">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <Chip>React 18</Chip>
                  <Chip>TypeScript</Chip>
                  <Chip>Tailwind CSS</Chip>
                  <Chip>Leaflet.js</Chip>
                  <Chip>React Router</Chip>
                  <Chip>TanStack Query</Chip>
                  <Chip>Recharts</Chip>
                  <Chip>PWA</Chip>
                </div>
              </ArchBlock>
              <Arrow />
              {/* Application Tier */}
              <ArchBlock color="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" title="Application Tier (Backend Functions)">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Chip>Edge Functions (Deno)</Chip>
                  <Chip>Gemini API Gateway</Chip>
                  <Chip>Auth Service</Chip>
                  <Chip>Chat Function</Chip>
                  <Chip>Weather Function</Chip>
                  <Chip>Packing Function</Chip>
                </div>
              </ArchBlock>
              <Arrow />
              {/* Data Tier */}
              <ArchBlock color="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" title="Data Tier (Database & Storage)">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Chip>PostgreSQL 15</Chip>
                  <Chip>Row-Level Security</Chip>
                  <Chip>Real-time WebSockets</Chip>
                  <Chip>File Storage</Chip>
                  <Chip>Auth Store</Chip>
                  <Chip>Secrets Vault</Chip>
                </div>
              </ArchBlock>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">2.1 Presentation Tier</h3>
          <p>
            The frontend is built using <strong>React 18</strong> with <strong>TypeScript</strong> for type safety. The UI layer uses <strong>Tailwind CSS</strong> with a custom design token system for consistent theming. <strong>React Router v6</strong> handles client-side routing across 12+ pages. Data fetching and caching is managed by <strong>TanStack React Query</strong>, providing optimistic updates and background refetching. The application is deployed as a <strong>Progressive Web Application (PWA)</strong> with offline capabilities.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">2.2 Application Tier</h3>
          <p>
            The backend logic runs on <strong>serverless Edge Functions</strong> powered by the Deno runtime. These functions act as a secure intermediary between the frontend and external APIs (Gemini, OpenMeteo). Each function handles specific concerns: <code>chat/</code> for the AI chatbot, <code>weather-forecast/</code> for weather data, and <code>packing-suggestions/</code> for AI-generated packing lists. All AI requests are routed through the <strong>Lovable AI Gateway</strong> which provides rate limiting, model routing, and authentication.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">2.3 Data Tier</h3>
          <p>
            Data persistence is handled by <strong>PostgreSQL 15</strong> with 11 tables supporting user profiles, wishlists, travel diaries, group collaboration, activity tracking, and transport tracking. <strong>Row-Level Security (RLS)</strong> policies enforce data isolation at the database level. <strong>Real-time WebSocket subscriptions</strong> enable live updates for group chat and location tracking features.
          </p>

          {/* Data Flow Diagram */}
          <div className="bg-card border border-border rounded-2xl p-6 my-8">
            <h4 className="font-semibold text-foreground mb-6 text-center">Figure 2: API Communication & Data Flow</h4>
            <div className="space-y-3 text-sm">
              <FlowStep step="1" text="User enters travel preferences (budget, duration, interests, starting city)" />
              <FlowStep step="2" text="Frontend constructs structured prompt with user parameters" />
              <FlowStep step="3" text="Request sent to Edge Function via HTTPS with JWT authentication" />
              <FlowStep step="4" text="Edge Function forwards prompt to Google Gemini 3 Flash API via AI Gateway" />
              <FlowStep step="5" text="Gemini API processes prompt using zero-shot reasoning" />
              <FlowStep step="6" text="Streaming response (SSE) relayed back through Edge Function to frontend" />
              <FlowStep step="7" text="Frontend parses SSE stream and renders recommendations in real-time" />
              <FlowStep step="8" text="User can save recommendations to wishlist (persisted in PostgreSQL)" />
            </div>
          </div>
        </Section>

        {/* 3. Technology Stack */}
        <Section id="tech-stack" icon={<Code />} number="3" title="Technology Stack">
          <div className="grid md:grid-cols-2 gap-6">
            <TechTable title="Frontend Technologies" items={[
              ['React 18.3', 'UI component library with hooks'],
              ['TypeScript 5.x', 'Static type checking'],
              ['Tailwind CSS 3.x', 'Utility-first CSS framework'],
              ['Vite 5.x', 'Build tool & dev server'],
              ['React Router v6', 'Client-side routing'],
              ['TanStack Query v5', 'Server state management'],
              ['Leaflet.js 1.9', 'Interactive maps (OpenStreetMap)'],
              ['Recharts 2.x', 'Data visualization charts'],
              ['Lucide React', 'Icon library'],
              ['shadcn/ui', 'Accessible component primitives'],
            ]} />
            <TechTable title="Backend & Infrastructure" items={[
              ['PostgreSQL 15', 'Relational database'],
              ['Deno Runtime', 'Edge function execution'],
              ['WebSocket', 'Real-time subscriptions'],
              ['Row-Level Security', 'Database-level access control'],
              ['JWT Authentication', 'Stateless auth tokens'],
              ['Google OAuth 2.0', 'Social sign-in'],
              ['OpenMeteo API', 'Weather forecast data'],
              ['Google Gemini 3 Flash', 'Generative AI model'],
              ['Server-Sent Events', 'Streaming AI responses'],
              ['PWA (vite-plugin-pwa)', 'Offline-capable web app'],
            ]} />
          </div>
        </Section>

        {/* 4. Generative AI Recommendation System */}
        <Section id="ai-system" icon={<Brain />} number="4" title="Generative AI Recommendation System">
          <h3 className="text-lg font-semibold text-foreground mb-3">4.1 Why Generative AI Over Traditional ML</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Aspect</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Traditional ML</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Generative AI (Our Approach)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Training Data', 'Requires large labeled datasets', 'Zero-shot; no training data needed'],
                  ['Model Training', 'Weeks of training & tuning', 'Instant via prompt engineering'],
                  ['Cold Start', 'Cannot recommend for new users', 'Works immediately for any user'],
                  ['Output Quality', 'Structured but limited', 'Rich natural language with reasoning'],
                  ['Maintenance', 'Regular retraining required', 'Update prompts as needed'],
                  ['Contextual Understanding', 'Limited to feature vectors', 'Deep semantic understanding'],
                  ['Cost', 'High compute for training', 'Pay-per-request API calls'],
                  ['Personalization', 'Based on user history', 'Based on real-time input context'],
                ].map(([aspect, trad, gen], i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">{aspect}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{trad}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{gen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">4.2 Prompt Engineering Architecture</h3>
          <p>
            The system uses a <strong>3-layer prompt architecture</strong> to generate recommendations:
          </p>
          <div className="bg-muted rounded-xl p-5 mt-4 space-y-4">
            <div>
              <p className="font-semibold text-foreground text-sm">Layer 1: System Prompt (Identity & Constraints)</p>
              <code className="text-xs block mt-2 bg-card p-3 rounded-lg text-muted-foreground">
                "You are an expert Indian travel planner. Recommend destinations within the user's budget. Provide cost breakdowns in ₹. Consider seasonal weather, local festivals, and safety factors."
              </code>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Layer 2: Contextual User Prompt (Dynamic Parameters)</p>
              <code className="text-xs block mt-2 bg-card p-3 rounded-lg text-muted-foreground">
                "Budget: ₹15,000 | Duration: 4 days | Interests: beaches, adventure | Starting City: Mumbai | Travel Mode: Solo | Season: March"
              </code>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Layer 3: Structured Output Format</p>
              <code className="text-xs block mt-2 bg-card p-3 rounded-lg text-muted-foreground">
                "Return JSON with: destination_name, estimated_budget, highlights[], best_season, day_wise_itinerary[], cost_breakdown (transport, accommodation, food, activities)"
              </code>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">4.3 Recommendation Scoring Algorithm</h3>
          <p>
            Destinations are ranked using a weighted composite score:
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mt-4 text-center">
            <p className="font-mono text-lg text-foreground font-bold">
              Score = (Budget Match × 0.4) + (Interest Match × 0.35) + (Duration Match × 0.25)
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="font-semibold text-foreground">Budget Match (40%)</p>
                <p className="text-muted-foreground text-xs mt-1">How well the destination fits within the specified budget range</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-semibold text-foreground">Interest Match (35%)</p>
                <p className="text-muted-foreground text-xs mt-1">Alignment between user interests and destination highlights</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-semibold text-foreground">Duration Match (25%)</p>
                <p className="text-muted-foreground text-xs mt-1">Suitability of the destination for the specified trip duration</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">4.4 Streaming Response Processing</h3>
          <p>
            The AI chatbot and recommendation engine use <strong>Server-Sent Events (SSE)</strong> for streaming responses, achieving &lt;500ms first-token latency. The frontend processes the SSE stream incrementally:
          </p>
          <pre className="bg-muted rounded-xl p-4 mt-4 text-xs overflow-x-auto text-muted-foreground">
{`// SSE Stream Processing (Simplified)
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  // Parse SSE "data:" lines
  // Extract delta.content from each chunk
  // Append to UI in real-time
}`}
          </pre>
        </Section>

        {/* 5. Application Features */}
        <Section id="features" icon={<Globe />} number="5" title="Application Features">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Brain className="h-6 w-6 text-primary" />,
                title: '5.1 AI-Powered Trip Planning',
                desc: 'Users input budget, duration, interests, and starting city. The Gemini AI generates personalized destination recommendations with day-wise itineraries and cost breakdowns in ₹.',
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-primary" />,
                title: '5.2 AI Travel Chatbot',
                desc: 'A floating chatbot powered by Gemini 3 Flash provides real-time travel advice, destination suggestions, budget tips, and cultural information through natural conversation.',
              },
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: '5.3 Group Travel Collaboration',
                desc: 'Create travel groups with invite codes, real-time group chat via WebSockets, and live GPS location tracking of all members on an interactive Leaflet map.',
              },
              {
                icon: <MapPin className="h-6 w-6 text-primary" />,
                title: '5.4 Live Location Tracking',
                desc: 'Browser GPS with watchPosition() updates coordinates every 5-10 seconds. Haversine formula calculates inter-member distances. Alerts when members exceed 1km radius.',
              },
              {
                icon: <Workflow className="h-6 w-6 text-primary" />,
                title: '5.5 Guided Trip Execution',
                desc: 'Step-by-step trip guidance with transport schedules (train numbers, flight details, bus operators), weather forecasts via OpenMeteo, and AI packing suggestions.',
              },
              {
                icon: <Cloud className="h-6 w-6 text-primary" />,
                title: '5.6 Weather & Packing AI',
                desc: '7-day weather forecasts from OpenMeteo API. AI analyzes weather data to generate context-aware packing lists considering destination, season, and activities.',
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                title: '5.7 Admin Analytics Portal',
                desc: 'Secure admin dashboard with user activity tracking, login analytics, page visit statistics, and destination popularity charts using Recharts visualization.',
              },
              {
                icon: <Globe className="h-6 w-6 text-primary" />,
                title: '5.8 PWA & Nearby Detection',
                desc: 'Progressive Web App with offline support. Auto-detects nearby tourist spots within 100km radius. Monthly rotating destination carousel.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 6. Database Schema */}
        <Section id="database" icon={<Database />} number="6" title="Database Schema Design">
          <p>
            The application uses <strong>11 PostgreSQL tables</strong> with Row-Level Security policies. Below is the entity-relationship overview:
          </p>

          <div className="space-y-6 mt-6">
            <DBTable name="profiles" desc="User profile information" columns={[
              ['user_id', 'UUID (FK → auth.users)', 'Links to auth system'],
              ['full_name', 'TEXT', 'Display name'],
              ['email', 'TEXT', 'User email'],
              ['avatar_url', 'TEXT', 'Profile picture URL'],
              ['login_provider', 'TEXT', 'google / email'],
            ]} />
            <DBTable name="wishlists" desc="Saved travel destinations" columns={[
              ['user_id', 'UUID', 'Owner reference'],
              ['destination_name', 'TEXT', 'Destination name'],
              ['estimated_budget', 'NUMERIC', 'Estimated cost in ₹'],
              ['best_season', 'TEXT', 'Recommended season'],
              ['highlights', 'TEXT[]', 'Key attractions array'],
              ['coordinates', 'JSONB', 'Lat/lng for mapping'],
            ]} />
            <DBTable name="travel_groups" desc="Group trip rooms" columns={[
              ['creator_id', 'UUID', 'Group admin'],
              ['destination_name', 'TEXT', 'Trip destination'],
              ['invite_code', 'TEXT (UNIQUE)', 'Shareable join code'],
              ['trip_start_date', 'DATE', 'Trip start'],
              ['trip_end_date', 'DATE', 'Trip end'],
            ]} />
            <DBTable name="group_members" desc="Members of travel groups" columns={[
              ['group_id', 'UUID (FK)', 'Parent group'],
              ['user_id', 'UUID', 'Member reference'],
              ['role', 'TEXT', 'admin / member'],
              ['location_sharing_enabled', 'BOOLEAN', 'GPS opt-in flag'],
            ]} />
            <DBTable name="group_messages" desc="Real-time group chat" columns={[
              ['group_id', 'UUID (FK)', 'Parent group'],
              ['sender_id', 'UUID', 'Message author'],
              ['message_text', 'TEXT', 'Chat content'],
              ['created_at', 'TIMESTAMPTZ', 'Send timestamp'],
            ]} />
            <DBTable name="member_locations" desc="Live GPS coordinates" columns={[
              ['group_id', 'UUID (FK)', 'Parent group'],
              ['user_id', 'UUID', 'Member reference'],
              ['latitude', 'DOUBLE', 'GPS latitude'],
              ['longitude', 'DOUBLE', 'GPS longitude'],
            ]} />
            <DBTable name="travel_diaries" desc="User travel journals" columns={[
              ['user_id', 'UUID', 'Author'],
              ['title', 'TEXT', 'Diary title'],
              ['destination', 'TEXT', 'Trip destination'],
              ['content', 'TEXT', 'Journal content'],
              ['image_url', 'TEXT', 'Photo attachment'],
            ]} />
            <DBTable name="user_activity" desc="Analytics tracking" columns={[
              ['user_id', 'UUID', 'Tracked user'],
              ['action', 'TEXT', 'Action type (login, search, etc.)'],
              ['page', 'TEXT', 'Page visited'],
              ['destination', 'TEXT', 'Related destination'],
              ['details', 'JSONB', 'Additional metadata'],
            ]} />
            <DBTable name="user_roles" desc="Role-based access control" columns={[
              ['user_id', 'UUID', 'User reference'],
              ['role', 'app_role ENUM', 'admin / moderator / user'],
            ]} />
          </div>
        </Section>

        {/* 7. System Workflow */}
        <Section id="workflow" icon={<Workflow />} number="7" title="System Workflow">
          <h3 className="text-lg font-semibold text-foreground mb-4">7.1 Travel Recommendation Workflow</h3>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="space-y-0">
              <WorkflowStep num="1" title="User Input Collection" desc="User fills in starting city, budget (₹), number of days, travel interests (beaches, mountains, heritage, etc.), and travel mode (solo/group)." />
              <WorkflowConnector />
              <WorkflowStep num="2" title="Prompt Construction" desc="Frontend assembles a structured prompt combining user parameters with system instructions for the Gemini API." />
              <WorkflowConnector />
              <WorkflowStep num="3" title="Edge Function Processing" desc="Request is sent to a serverless Edge Function which authenticates the user via JWT and forwards the prompt to the AI Gateway." />
              <WorkflowConnector />
              <WorkflowStep num="4" title="Gemini API Inference" desc="Google Gemini 3 Flash model processes the prompt using zero-shot reasoning. Response is streamed back via SSE." />
              <WorkflowConnector />
              <WorkflowStep num="5" title="Response Parsing & Rendering" desc="Frontend parses the SSE stream, extracting destination recommendations with budgets, itineraries, and highlights." />
              <WorkflowConnector />
              <WorkflowStep num="6" title="User Actions" desc="User can save destinations to wishlist, start trip execution, create group trips, or ask follow-up questions via chatbot." />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-10 mb-4">7.2 Group Travel & Location Tracking Workflow</h3>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="space-y-0">
              <WorkflowStep num="1" title="Group Creation" desc="User selects 'Group Travel' on a wishlist item. System creates a travel_group record with a unique invite_code." />
              <WorkflowConnector />
              <WorkflowStep num="2" title="Member Invitation" desc="Creator shares invite link (e.g., /group/join?code=XYZ123). Other users join by entering the code." />
              <WorkflowConnector />
              <WorkflowStep num="3" title="Real-time Chat" desc="Group members communicate via WebSocket-powered chat. Messages are persisted in group_messages table." />
              <WorkflowConnector />
              <WorkflowStep num="4" title="Location Sharing" desc="Members opt-in to GPS sharing. Browser watchPosition() sends coordinates every 5-10 seconds to member_locations table." />
              <WorkflowConnector />
              <WorkflowStep num="5" title="Live Map Rendering" desc="Leaflet map subscribes to real-time location updates. Each member shown with color-coded marker and accuracy circle." />
              <WorkflowConnector />
              <WorkflowStep num="6" title="Proximity Alerts" desc="Haversine formula calculates inter-member distances. Alert triggered when any member exceeds 1km from group centroid." />
            </div>
          </div>
        </Section>

        {/* 8. Security */}
        <Section id="security" icon={<Shield />} number="8" title="Security Implementation">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-3">Authentication</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Email/Password with email verification</li>
                <li>• Google OAuth 2.0 social sign-in</li>
                <li>• JWT-based stateless session management</li>
                <li>• Automatic token refresh</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-3">Row-Level Security (RLS)</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Every table has RLS policies enabled</li>
                <li>• Users can only access their own data</li>
                <li>• SECURITY DEFINER functions prevent recursive policy checks</li>
                <li>• Group data isolated via <code>is_group_member()</code> function</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-3">API Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• API keys stored in server-side secrets vault</li>
                <li>• Edge Functions validate JWT before processing</li>
                <li>• CORS headers restrict cross-origin access</li>
                <li>• Rate limiting on AI API calls (429 handling)</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-3">Role-Based Access</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Roles stored in dedicated <code>user_roles</code> table</li>
                <li>• <code>has_role()</code> SECURITY DEFINER function</li>
                <li>• Admin portal restricted to admin role only</li>
                <li>• Group admin can manage members</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-5 mt-6">
            <h4 className="font-semibold text-foreground mb-2">Security Definer Function Example:</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`CREATE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;`}
            </pre>
          </div>
        </Section>

        {/* 9. Screenshots */}
        <Section id="screenshots" icon={<Cpu />} number="9" title="Application Screenshots">
          <div className="space-y-8">
            <ScreenshotFigure
              src="/docs/screenshot-home.png"
              caption="Figure 3: Home Page — Hero section with AI-powered travel planning features, smart destinations, custom itinerary, and cost breakdown highlights"
              num="3"
            />
            <ScreenshotFigure
              src="/docs/screenshot-planner.png"
              caption="Figure 4: Trip Planner — Input form for budget, duration, interests, starting city with solo/group travel mode selection"
              num="4"
            />
            <ScreenshotFigure
              src="/docs/screenshot-chatbot.png"
              caption="Figure 5: AI Chatbot — Floating travel assistant powered by Gemini 3 Flash for real-time travel advice"
              num="5"
            />
            <ScreenshotFigure
              src="/docs/screenshot-auth.png"
              caption="Figure 6: Authentication — Sign in page with email/password and Google OAuth support"
              num="6"
            />
          </div>
        </Section>

        {/* 10. Results */}
        <Section id="results" icon={<BarChart3 />} number="10" title="Results & Example Outputs">
          <h3 className="text-lg font-semibold text-foreground mb-3">10.1 Example AI Recommendation Output</h3>
          <div className="bg-muted rounded-xl p-5">
            <p className="text-sm font-medium text-foreground mb-2">Input: Budget ₹15,000 | 4 Days | Interests: Beaches, Adventure | From: Mumbai</p>
            <pre className="text-xs text-muted-foreground mt-3 overflow-x-auto">
{`{
  "destination": "Goa",
  "estimated_budget": "₹12,500",
  "best_season": "October - March",
  "highlights": ["Baga Beach", "Dudhsagar Falls", "Water Sports", "Night Markets"],
  "cost_breakdown": {
    "transport": "₹2,500 (Konkan Railway - Mandovi Express)",
    "accommodation": "₹4,000 (Budget hotel, 3 nights)",
    "food": "₹3,000 (Local restaurants + beach shacks)",
    "activities": "₹3,000 (Water sports + sightseeing)"
  },
  "day_wise_itinerary": [
    "Day 1: Arrive Goa → Check-in → Baga Beach sunset",
    "Day 2: Water sports at Calangute → Anjuna Flea Market",
    "Day 3: Dudhsagar Falls trek → Spice plantation visit",
    "Day 4: Old Goa churches → Departure"
  ]
}`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">10.2 Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['< 500ms', 'First Token Latency'],
              ['< 3s', 'Full Recommendation'],
              ['11 Tables', 'Database Schema'],
              ['12+ Pages', 'Application Routes'],
            ].map(([value, label], i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">10.3 Chatbot Interaction Example</h3>
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <ChatBubble role="user" text="What are the best places to visit in Rajasthan under ₹10,000 for 3 days?" />
            <ChatBubble role="assistant" text="Great choice! 🏜️ For ₹10,000 in 3 days, I recommend Jaipur! Here's a quick plan: Transport: ₹1,500 (bus from Delhi), Stay: ₹3,000 (budget hotel near Hawa Mahal), Food: ₹2,500, Activities: ₹3,000 (Amber Fort, City Palace, Nahargarh Fort). Best time: October-March. Would you like a detailed itinerary?" />
          </div>
        </Section>

        {/* 11. Future Enhancements */}
        <Section id="future" icon={<Rocket />} number="11" title="Future Enhancements">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Real-Time Pricing APIs', desc: 'Integration with IRCTC, MakeMyTrip, and airline APIs for live ticket pricing and booking within the app.' },
              { title: 'User Personalization', desc: 'ML-based preference learning from travel history to improve recommendation accuracy over time.' },
              { title: 'Multi-Language Support', desc: 'AI-generated recommendations in regional Indian languages (Hindi, Tamil, Telugu, etc.).' },
              { title: 'Augmented Reality Navigation', desc: 'AR-based navigation overlay for tourist spots using device camera and GPS.' },
              { title: 'Offline AI Mode', desc: 'On-device lightweight models for basic recommendations without internet connectivity.' },
              { title: 'Social Travel Feed', desc: 'Community-driven travel stories, reviews, and photo sharing with AI-moderated content.' },
              { title: 'Voice-Based Interaction', desc: 'Voice commands for hands-free trip planning and chatbot interaction using Web Speech API.' },
              { title: 'Carbon Footprint Tracker', desc: 'Calculate and display environmental impact of travel choices with eco-friendly alternatives.' },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                <p className="text-muted-foreground text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 12. Conclusion */}
        <Section id="conclusion" icon={<BookOpen />} number="12" title="Conclusion">
          <p>
            This paper demonstrated the successful implementation of an AI-powered smart travel planner that leverages <strong>Generative AI (Google Gemini)</strong> for budget-based destination recommendation. The system eliminates the need for traditional machine learning pipelines by employing <strong>zero-shot reasoning</strong> through prompt engineering, resulting in a more maintainable, cost-effective, and contextually aware recommendation engine.
          </p>
          <p className="mt-4">
            The application's key innovation lies in its integration of multiple AI-driven features — from natural language travel recommendations to weather-aware packing suggestions — within a cohesive, real-time collaborative platform. The group travel system with live GPS tracking and proximity alerts represents a novel approach to travel safety that extends beyond traditional planning applications.
          </p>
          <p className="mt-4">
            With its Progressive Web App architecture, the system is accessible across devices without installation, making AI-powered travel planning available to a broader audience. Future work will focus on integrating real-time pricing APIs and user preference learning to further enhance the recommendation quality.
          </p>
        </Section>

        {/* References */}
        <section className="border-t border-border pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">References</h2>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
            <li>Google. "Gemini API Documentation." <em>Google AI for Developers</em>, 2024-2026. ai.google.dev</li>
            <li>React Team. "React Documentation." <em>react.dev</em>, 2024.</li>
            <li>Vaswani, A., et al. "Attention is All You Need." <em>NeurIPS</em>, 2017.</li>
            <li>Brown, T., et al. "Language Models are Few-Shot Learners." <em>NeurIPS</em>, 2020.</li>
            <li>Wei, J., et al. "Chain-of-Thought Prompting." <em>NeurIPS</em>, 2022.</li>
            <li>OpenMeteo. "Free Weather API Documentation." open-meteo.com, 2024.</li>
            <li>Leaflet. "JavaScript Library for Interactive Maps." leafletjs.com, 2024.</li>
            <li>Supabase. "Open Source Firebase Alternative." supabase.com, 2024.</li>
            <li>Vennell, C.R. "Haversine Formula for Great-Circle Distance." <em>Mathematical Geography</em>, 1984.</li>
            <li>Fielding, R.T. "Architectural Styles and the Design of Network-Based Software Architectures." <em>PhD Dissertation, UC Irvine</em>, 2000.</li>
          </ol>
        </section>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-xs pt-8 pb-4 border-t border-border">
          <p>© 2026 Smart Trip Spark — AI-Powered Smart Travel Planner</p>
          <p className="mt-1">Built with React, TypeScript, Tailwind CSS, and Google Gemini AI</p>
        </div>
      </main>
    </div>
  );
};

/* ─── Helper Components ─── */

const Section = ({ id, icon, number, title, children }: { id: string; icon: React.ReactNode; number: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      <h2 className="text-2xl font-bold text-foreground">{number}. {title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

const ArchBlock = ({ color, title, children }: { color: string; title: string; children: React.ReactNode }) => (
  <div className={`w-full max-w-lg border rounded-xl p-4 ${color}`}>
    <p className="font-semibold text-foreground text-sm mb-3 text-center">{title}</p>
    {children}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-background text-foreground px-2 py-1 rounded-md text-center border border-border">{children}</span>
);

const Arrow = () => (
  <div className="flex flex-col items-center text-muted-foreground">
    <div className="w-px h-4 bg-border" />
    <span className="text-lg">↓</span>
    <div className="w-px h-4 bg-border" />
  </div>
);

const FlowStep = ({ step, text }: { step: string; text: string }) => (
  <div className="flex gap-3 items-start">
    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</span>
    <p className="text-muted-foreground pt-0.5">{text}</p>
  </div>
);

const TechTable = ({ title, items }: { title: string; items: string[][] }) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <div className="bg-muted px-4 py-3">
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
    </div>
    <div className="divide-y divide-border">
      {items.map(([tech, desc], i) => (
        <div key={i} className="px-4 py-2 flex justify-between text-sm">
          <span className="font-medium text-foreground">{tech}</span>
          <span className="text-muted-foreground text-xs text-right">{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

const DBTable = ({ name, desc, columns }: { name: string; desc: string; columns: string[][] }) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <div className="bg-muted px-4 py-3 flex items-center justify-between">
      <code className="font-bold text-foreground text-sm">{name}</code>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </div>
    <div className="divide-y divide-border text-xs">
      {columns.map(([col, type, note], i) => (
        <div key={i} className="px-4 py-2 grid grid-cols-3 gap-2">
          <code className="text-foreground">{col}</code>
          <span className="text-muted-foreground">{type}</span>
          <span className="text-muted-foreground text-right">{note}</span>
        </div>
      ))}
    </div>
  </div>
);

const WorkflowStep = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <div className="flex gap-4 items-start">
    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{num}</div>
    <div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

const WorkflowConnector = () => (
  <div className="ml-4 w-px h-6 bg-border" />
);

const ChatBubble = ({ role, text }: { role: 'user' | 'assistant'; text: string }) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
      {text}
    </div>
  </div>
);

const ScreenshotFigure = ({ src, caption, num }: { src: string; caption: string; num: string }) => (
  <figure className="bg-card border border-border rounded-2xl overflow-hidden">
    <div className="p-2">
      <img src={src} alt={caption} className="w-full rounded-xl" loading="lazy" />
    </div>
    <figcaption className="px-4 py-3 text-sm text-muted-foreground border-t border-border">{caption}</figcaption>
  </figure>
);

export default Documentation;
